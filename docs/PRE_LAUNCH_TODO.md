# PRE-LAUNCH DATA AUTHENTICITY CHECKS

> **Last Updated:** April 11, 2026
> **Status:** v2.0.1.0 is LIVE — Partial verification completed

As per the "100% Rule", this application has transitioned from a development environment to a **production-deployed product** on Render.

**ACTION REQUIRED:** A Lead QA Architect or content manager MUST manually verify the following UI files to ensure all hard-coded text, names, biographies, and historical statistics are 100% authentic and factual.

### ✅ Verified
- `src/data/api.ts` → `CONSTRUCTOR_META` — All-time stats sourced from official FIA records, correct as of end-of-2025.
- `src/data/api.ts` → `TEAM_COLORS` — Official team hex codes for 2026 grid (including Cadillac and Audi entries).

### 📝 Files Still Requiring Manual Verification
- `src/pages/Dashboard.tsx` - Verify the default hardcoded statistics (if any) before the API loads.
- Archives page (if present) - Verify the `HISTORICAL_SEASONS` array (Ensure Hamilton, Verstappen, Schumacher years/points are fully accurate).
- `src/pages/News.tsx` - If RSS feed falls back to placeholder news content, ensure placeholders do not contain dummy text (Lorem Ipsum).

### ⚠️ Known Staleness Risk
- `CONSTRUCTOR_META` in `api.ts` has hardcoded championship counts, podium totals, and team principals **frozen at end-of-2025**. These will become stale when the 2026 season completes. A seasonal update checklist is documented in `MUST_CHANGES.md` (Item #6).

> Delete this file once full verification is complete.
