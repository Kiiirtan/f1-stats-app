# Debugging F1 Insights App

## Plan
- [x] Check Homepage (`localhost:3000/`)
    - [x] Console logs: No major errors.
    - [x] Screenshot: George Russell image is incorrect.
    - [x] Identify issues: Driver images may be placeholders or incorrect.
- [x] Check Results Page (`/results`)
    - [x] Console logs: No errors.
    - [x] Screenshot: "RACE BATTLES" text overlap.
    - [x] Identify issues: Persistent "LOADING TELEMETRY" overlay.
- [x] Check Drivers Page (`/drivers`)
    - [x] Status: Incorrect images (cars instead of drivers).
- [x] Check Standings Page / Constructors Page (`/constructors`)
    - [x] Drivers Standing (Checked via /drivers)
    - [x] Constructors Standing: Severe text overlap ("F1 PRECISION" over "CONSTRUCTOR CHAMPIONSHIP").
- [x] Check Schedule Page (`/races`)
    - [x] Status: Severe text overlap ("F1 PRECISION" over "THE CIRCUIT").
- [x] Check 404 Page (http://localhost:3000/non-existent-page)
    - [x] Status: Working 404 page, but has text overlap ("F1 PRECISION" over "OFF TRACK").

## Findings
1.  **Homepage:** George Russell's image is a photo of someone else (looks like Toto Wolff or a team official).
2.  **Drivers Page:** Most driver images are placeholders of cars or unrelated graphics (e.g., Kimi Antonelli is a graph).
3.  **Constructors Page:** Major text overlap issue where "F1 PRECISION" (likely from a background or absolute element) overlaps the page title.
4.  **Results Page:** "RACE BATTLES" text uses a style where letters overlap awkwardly.
5.  **Schedule Page:** Title "THE CIRCUIT" is overlapped by "F1 PRECISION" text.
6.  **404 Page:** "OFF TRACK" text is overlapped by "F1 PRECISION".
7.  **Global Issue:** "LOADING TELEMETRY..." message and spinner appear to persist even after content is loaded and sometimes block interaction or overlap UI.
8.  **Navigation:** Basic navigation works, but visual polish is missing on most pages due to layering/z-index issues.
