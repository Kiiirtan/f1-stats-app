# F1 PRECISION — Software Requirements Specification (SRS)

| Field | Detail |
|---|---|
| **Document Version** | 2.0 |
| **Date** | March 25, 2026 |
| **Project** | F1 PRECISION |
| **Prepared By** | Development Team |

---

## 1. Introduction

### 1.1 Purpose
This document defines the functional and non-functional requirements for F1 PRECISION, a real-time Formula 1 dashboard web application with premium interactive effects.

### 1.2 Scope
The system is a client-side Single Page Application (SPA) that fetches and displays live F1 data through an immersive, animation-rich interface. It has no custom backend — all data comes from the Jolpica F1 public API. Authentication is handled on the client via localStorage.

### 1.3 Definitions

| Term | Definition |
|---|---|
| SPA | Single Page Application |
| API | Application Programming Interface |
| WDC | World Drivers' Championship |
| WCC | World Constructors' Championship |

---

## 2. System Overview

```
┌─────────────┐       HTTPS/JSON        ┌──────────────────┐
│   Browser   │  ◄──────────────────►   │  Jolpica F1 API  │
│  (React SPA)│                         │  api.jolpi.ca    │
└──────┬──────┘                         └──────────────────┘
       │
       │  localStorage
       ▼
┌─────────────┐
│  Auth Store │
│  (client)   │
└─────────────┘
```

---

## 3. Functional Requirements

### 3.1 Dashboard (FR-01)
| ID | Requirement |
|---|---|
| FR-01.1 | Display current season label and animated LIVE badge with glow pulse |
| FR-01.2 | Show top 6 drivers as 3D TiltCard components with scroll-triggered reveals |
| FR-01.3 | Parallax hero with 3-layer depth (grid, glow orbs, floating F1 car) |
| FR-01.4 | Speed line animation in hero background |
| FR-01.5 | Text-reveal animation on hero headings |
| FR-01.6 | Show last 3 completed race results with hover effects |
| FR-01.7 | Display quick stats with hover-lift: driver count, team count, races, leader points |

### 3.2 Driver Standings (FR-02)
| ID | Requirement |
|---|---|
| FR-02.1 | List all drivers in a responsive card grid with staggered scroll reveals |
| FR-02.2 | Each card wrapped in TiltCard with shimmer overlay and team-color glow bar |
| FR-02.3 | Cards show: position, name, team, points, nationality flag, win count |
| FR-02.4 | Cards link to individual driver profiles |

### 3.3 Driver Profile (FR-03)
| ID | Requirement |
|---|---|
| FR-03.1 | Display driver name with text-reveal animation and team-color accent |
| FR-03.2 | Parallax glow orbs in background using team color |
| FR-03.3 | Show 6 stat cards wrapped in TiltCard with staggered scroll reveals |
| FR-03.4 | List race wins with hover-lift and hover-glow effects |
| FR-03.5 | Breadcrumb navigation (Home / Drivers / {name}) |

### 3.4 Race Calendar (FR-04)
| ID | Requirement |
|---|---|
| FR-04.1 | Separate completed and upcoming races with scroll-reveal sections |
| FR-04.2 | Completed cards with hover-lift, glow, flag scale animation |
| FR-04.3 | Sprint badges on applicable races |
| FR-04.4 | Expanding accent bar on hover |

### 3.5 Race Results (FR-05)
| ID | Requirement |
|---|---|
| FR-05.1 | Race selector tabs with btn-ripple effect and active tab glow |
| FR-05.2 | Results table with position scale on hover |
| FR-05.3 | Color-coded positions (gold P1, silver P2, bronze P3) |
| FR-05.4 | Shimmer skeleton loading states |
| FR-05.5 | Support `?race=<circuitId>` URL parameter |

### 3.6 Constructor Standings (FR-06)
| ID | Requirement |
|---|---|
| FR-06.1 | Slide-from-left scroll reveals per team |
| FR-06.2 | Team-colored glowing progress bars proportional to leader |
| FR-06.3 | Position and points scale on hover |

### 3.7 Global Interactive Effects (FR-10)
| ID | Requirement |
|---|---|
| FR-10.1 | CursorGlow — cyan radial gradient following mouse (hidden on mobile) |
| FR-10.2 | SmoothLoader — F1-themed splash screen with progress bar on first load |
| FR-10.3 | ScrollReveal — fade+slide entrance on viewport intersection |
| FR-10.4 | TiltCard — 3D perspective rotation + specular shine on hover |

### 3.8 Search (FR-07)
| ID | Requirement |
|---|---|
| FR-07.1 | Modal search overlay triggered from header |
| FR-07.2 | Real-time filtering across drivers and races |
| FR-07.3 | Results navigate to relevant page |

### 3.9 Authentication (FR-08)
| ID | Requirement |
|---|---|
| FR-08.1 | Login/Register modal from header |
| FR-08.2 | Client-side credential storage via localStorage |
| FR-08.3 | Session persistence across page reloads |
| FR-08.4 | Logout button clears session |

### 3.10 Error Handling (FR-09)
| ID | Requirement |
|---|---|
| FR-09.1 | 404 catch-all route with themed "OFF TRACK" page |
| FR-09.2 | Error boundary catches render-time errors |
| FR-09.3 | API errors show inline warning banners |

---

## 4. Non-Functional Requirements

### 4.1 Performance
| ID | Requirement |
|---|---|
| NFR-01 | Production bundle < 100 kB |
| NFR-02 | API responses cached for 5 minutes |
| NFR-03 | Failed API calls retry 3 times with exponential backoff |
| NFR-04 | Initial page render < 2 seconds on 4G |
| NFR-05 | Animations use `will-change` and `transform` for GPU acceleration |

### 4.2 Usability
| ID | Requirement |
|---|---|
| NFR-06 | Responsive design: mobile (320px) → desktop (1920px) |
| NFR-07 | Smooth page transitions between routes |
| NFR-08 | Staggered card entrance animations |
| NFR-09 | Keyboard-accessible (Escape closes modals) |
| NFR-10 | Cursor glow gracefully hidden on touch devices |

### 4.3 Reliability
| ID | Requirement |
|---|---|
| NFR-11 | App remains functional with stale cache if API is down |
| NFR-12 | ErrorBoundary prevents blank screen on component errors |

### 4.4 SEO
| ID | Requirement |
|---|---|
| NFR-13 | Unique `<title>` and `<meta description>` per page |
| NFR-14 | Open Graph and Twitter Card meta tags |
| NFR-15 | Semantic HTML5 structure |

---

## 5. Data Requirements

### 5.1 External API
- **Base URL 1 (Telemetry)**: `https://api.jolpi.ca/ergast/f1`
- **Base URL 2 (News Proxy)**: `https://api.allorigins.win/get?url=`

| Endpoint | Purpose |
|---|---|
| `/current/driverStandings.json` | Driver standings |
| `/current/constructorStandings.json` | Constructor standings |
| `/current.json` | Race calendar |
| `/current/results.json?limit=600` | Race results |
| `/*/constructors/:id/constructorStandings.json` | Historical Constructor performance |
| `motorsport.com/rss/f1/news` | Live News XML Feed |

### 5.2 Local Storage Keys
| Key | Purpose |
|---|---|
| `f1app_users` | Registered user credentials |
| `f1app_session` | Current session |

---

## 6. Constraints

- No custom backend — fully client-side
- API rate limits governed by Jolpica's fair-use policy
- Auth is demo-quality (plaintext localStorage)
- No server-side rendering

---

## 7. Acceptance Criteria

| Criteria | Status |
|---|---|
| All 7 routes render without errors | ✅ |
| TypeScript compiles with zero errors | ✅ |
| All 8 API tests pass | ✅ |
| All interactive effects functional | ✅ |
| Responsive on mobile and desktop | ✅ |
| API retry logic handles failures | ✅ |
