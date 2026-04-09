# F1 Stats — Cybersecurity Threat Model & Defense Report

> **Classification:** Internal Engineering Reference
> **Date:** 2026-04-04
> **Scope:** Threat analysis for a Vite/React SPA with Supabase backend, deployed on Render/Vercel
> **Author:** Security Audit — Dual Red/Blue Team Analysis

---

## Phase 1: Anatomy of the Attack (Red Team Perspective)

Understanding how attacks work is the foundation of building defensible systems.

---

### 1A. DDoS Attack Mechanics — Layer 7 vs. Volumetric

#### DNS Amplification (Layer 3/4 — Volumetric)

**Goal:** Saturate the target's bandwidth so legitimate traffic can't reach the server.

**How it works conceptually:**

1. **Reconnaissance** — Attacker identifies the target's public IP (e.g., your Render deployment's origin IP). Tools like DNS lookups, certificate transparency logs, and header analysis can reveal origin IPs even behind CDNs if misconfigured.

2. **Amplification Abuse** — The attacker sends small DNS queries to thousands of open DNS resolvers, but **spoofs the source IP** to be your server's IP. Each 60-byte query generates a ~4,000-byte response directed at your server. This is a **~65x amplification factor**.

3. **Flood** — Your server's network interface receives gigabits/sec of unsolicited DNS response traffic. The hosting provider's upstream links saturate. Legitimate HTTP requests can't reach your app — they time out or get dropped at the network layer.

**Key characteristics:**
- Doesn't need to understand your app at all
- Targets raw bandwidth
- Source IPs are spoofed, so blocking individual IPs is useless
- Requires the attacker to control a botnet or leverage misconfigured resolvers

```
┌──────────┐    60-byte query     ┌────────────────┐
│ Attacker │ ──(spoofed src IP)──▶│ Open DNS       │
│          │                      │ Resolvers (1000s)│
└──────────┘                      └───────┬────────┘
                                          │ 4,000-byte responses
                                          │ (×1000s resolvers)
                                          ▼
                                  ┌──────────────┐
                                  │ YOUR SERVER  │ ← Drowning in
                                  │ (Render/Vercel)│   unsolicited traffic
                                  └──────────────┘
```

#### Layer 7 (Application-Layer) DDoS

**Goal:** Exhaust your server's CPU/memory/connections by making expensive but seemingly legitimate requests.

**How it works conceptually:**

1. **App Profiling** — Attacker studies your application to find expensive endpoints. For your F1 Stats app, this would be:
   - `/driver/:id` — triggers 15+ parallel API calls to Jolpica
   - `/constructor/:id` — triggers 20+ API calls including season history
   - `/circuits` — renders 77 iframes (OpenStreetMap embeds)

2. **Slowloris / Slow POST Variants** — Open thousands of connections to your server but send data extremely slowly (1 byte per second). Each connection holds a server thread/socket open. Your server's connection pool exhausts while the attacker uses minimal bandwidth.

3. **HTTP Flood** — Send thousands of valid-looking `GET /driver/verstappen` requests per second from distributed IPs. Each request is indistinguishable from a real user. Your app spins up API calls to Jolpica for each one, exhausting both your server resources AND getting your IP rate-limited by Jolpica.

4. **Cache-Busting** — Add random query parameters (`?cachebust=abc123`) to bypass CDN caches, forcing requests to hit your origin server every time.

**Key characteristics:**
- Low bandwidth, high CPU impact
- Each request looks legitimate
- Hard to distinguish from real traffic
- Targets application logic, not just bandwidth

**Why your app is especially vulnerable:**
- No request rate limiting
- No concurrency control on API calls
- Each page load fires 15-20 downstream API requests (amplification against Jolpica)
- No CDN caching configured for API responses

---

### 1B. Malicious Payload Mechanics — Modern Malware Lifecycle

#### Attack Vector Analysis (Relevant to Your Stack)

Your app is a **static SPA** — no server-side code execution, no file uploads, no user auth. This significantly reduces the attack surface. But threats still exist:

**Supply Chain Attack (Most Realistic Threat):**

1. **Dependency Compromise** — Your `package.json` has ~30 dependencies. An attacker compromises a popular npm package (or its subdependency). When you run `npm install`, malicious code executes in a `postinstall` script.

2. **What happens:**
   - The script reads environment variables (your Supabase keys are in `.env`)
   - Exfiltrates them to an external server
   - May inject a backdoor into your `node_modules` that modifies your build output
   - Your production bundle now contains code that runs in every visitor's browser

3. **Persistence:**
   - The compromised package stays in your `package-lock.json`
   - Every CI/CD rebuild reinfects
   - The injected client-side code can: steal cookies, redirect users, mine crypto, or serve as a watering hole for further attacks

**Supabase Credential Abuse (Your Specific Vulnerability):**

1. **Attacker finds your `.env` on GitHub** (which currently has your keys committed)
2. Uses the anon key to query your Supabase:
   ```
   GET https://rjgrvwqrebdzdeduikpj.supabase.co/rest/v1/api_cache
   Authorization: Bearer <your_anon_key>
   ```
3. Can now:
   - **Read** all cached API data
   - **Overwrite** cache entries with poisoned data (if no RLS)
   - Replace legitimate F1 standings data with fake data
   - Inject XSS payloads into cached JSON that your React app renders
4. Your app fetches this poisoned cache → serves manipulated data to all users

**Client-Side Injection (XSS via Cached Data):**

If the Supabase cache is poisoned, the attacker could insert HTML/JS into cached JSON fields. Although React escapes JSX by default, there are bypass vectors:
- `dangerouslySetInnerHTML` (you don't use this — good)
- URLs in `href` or `src` attributes (`javascript:` protocol)
- CSS injection via `style` props
- The `News.tsx` image `onError` handler could be a vector if the image URL is user-controlled

---

### Threat Matrix Summary

| Attack Vector | Likelihood | Impact | Your Current Exposure |
|---|---|---|---|
| Volumetric DDoS | Low (Render/Vercel absorb this) | Medium | LOW — hosting provider handles L3/4 |
| Layer 7 DDoS | Medium | High | **HIGH — no rate limiting, no CDN** |
| Supply chain (npm) | Low-Medium | Critical | MEDIUM — standard npm, no lockfile audit |
| Supabase key exposure | **HIGH** | Critical | **CRITICAL — keys in .env, committed to git** |
| Cache poisoning via Supabase | Medium (depends on RLS) | High | **HIGH — no RLS enabled** |
| XSS via injected data | Low | High | LOW — React escapes by default |
| CSRF | N/A | N/A | N/A — no auth, no state mutations |

---

## Phase 2: Architecture of Defense (Blue Team Perspective)

### 2A. DDoS Mitigation Architecture

#### How Your Hosting Provider Already Helps

```
                                    ┌─────────────────┐
                                    │ Cloudflare /     │
          Internet Traffic          │ Vercel Edge      │
  ──────────────────────────────▶   │                  │
  (Volumetric + L7 mixed)          │  ① L3/4 Scrubbing│ ← Drops spoofed/amplified packets
                                    │  ② Rate Limiting │ ← Per-IP request throttling
                                    │  ③ WAF Rules     │ ← Blocks known attack patterns
                                    │  ④ Edge Cache    │ ← Serves static assets without hitting origin
                                    └────────┬────────┘
                                             │ Only clean, legitimate traffic
                                             ▼
                                    ┌─────────────────┐
                                    │ YOUR ORIGIN     │
                                    │ (Render)        │
                                    │                 │
                                    │ Vite static     │
                                    │ bundle served   │
                                    └─────────────────┘
```

**What you should add:**

1. **Put Cloudflare in front of your domain** — Free tier includes L3/L4 DDoS protection, basic WAF, and edge caching. This is the single highest-ROI security action you can take.

2. **Configure CDN caching headers** — Your SPA's `index.html`, JS bundles, and CSS are static. Set `Cache-Control: public, max-age=31536000, immutable` on hashed assets. Attacks hitting cached assets never reach your origin.

3. **Rate limiting at the application level** — Even with Cloudflare, add a rate limit middleware. Since you're a static SPA hitting external APIs (Jolpica), the main concern is protecting Jolpica from amplified traffic:
   - Cap concurrent Jolpica requests at 5 globally
   - Implement a request queue in your `fetchWithCache()`

---

### 2B. Zero-Trust Defense Against Payload Attacks

#### Supabase Hardening (Immediate)

```sql
-- Enable RLS on api_cache
ALTER TABLE api_cache ENABLE ROW LEVEL SECURITY;

-- Allow anyone to READ cache (needed for fallback)
CREATE POLICY "Allow public read" ON api_cache
  FOR SELECT USING (true);

-- Only allow writes from the service role (your backend/CI, not the browser)
CREATE POLICY "Deny anon writes" ON api_cache
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Deny anon updates" ON api_cache
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Deny anon deletes" ON api_cache
  FOR DELETE USING (auth.role() = 'service_role');
```

**Problem:** Your SPA uses the anon key to WRITE to Supabase (the `syncToSupabase` function). With the above RLS, the sync from the browser will be blocked.

**Solution Options:**
- **Option A:** Accept read-only cache from browser. Pre-populate cache via a cron job or Supabase Edge Function that uses the service role key.
- **Option B:** Create a Supabase Edge Function that validates and writes cache entries. The browser calls the function (which uses the service role internally). This way the anon key never has direct table write access.

#### Supply Chain Defense

```jsonc
// package.json — add these scripts
{
  "scripts": {
    "preinstall": "npx npm-audit-signatures",  // Verify package signatures
    "audit": "npm audit --audit-level=high"     // Block high-severity vulns
  }
}
```

**Additional measures:**
- [ ] Run `npm audit` before every deploy
- [ ] Pin exact dependency versions (no `^` or `~` prefixes) in `package.json`
- [ ] Use `npm ci` instead of `npm install` in CI/CD (respects lockfile exactly)
- [ ] Consider using Socket.dev or Snyk for real-time dependency monitoring

#### Input Sanitization (Defense-in-Depth)

Even though React auto-escapes JSX, add a sanitization layer for data flowing from Supabase cache into the app:

```typescript
// Sanitize any cached data before rendering
function sanitizeCacheData<T>(data: T): T {
  const json = JSON.stringify(data);
  // Strip any HTML tags, script injections, javascript: URLs
  const cleaned = json
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
  return JSON.parse(cleaned);
}
```

---

## Phase 3: Tabletop Simulation

> **Scenario:** Multi-vector attack on your F1 Stats deployment
> **Status:** ⏳ Ready to begin when Phase 1 & 2 are reviewed

The simulation will present:
- Simulated server logs and Cloudflare telemetry
- Anomalous traffic patterns you must identify
- Decision points where you choose defensive actions
- A DDoS smokescreen masking a cache poisoning attempt via your exposed Supabase keys

**Begin when ready — reply "START SIMULATION" to proceed.**

---

## Appendix: Immediate Action Items

### Before Next Git Push (Priority Order)

| # | Action | Time | Risk Mitigated |
|---|--------|------|----------------|
| 1 | `echo ".env" >> .gitignore && git rm --cached .env` | 2 min | Credential exposure |
| 2 | Rotate Supabase anon key in dashboard | 5 min | Compromised keys |
| 3 | Enable RLS + create policies on `api_cache` | 10 min | Cache poisoning |
| 4 | Run `npm audit --audit-level=high` | 2 min | Supply chain |
| 5 | Delete temp files from root | 2 min | Info disclosure |
| 6 | Add Cloudflare DNS proxy | 15 min | L3/4 DDoS + origin IP exposure |

### Security Headers to Add (via `vercel.json` or Render)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data:; connect-src 'self' https://api.jolpi.ca https://*.supabase.co https://api.rss2json.com; frame-src https://www.openstreetmap.org"
        }
      ]
    }
  ]
}
```

---

*This report is a living document. Update as mitigations are applied.*
