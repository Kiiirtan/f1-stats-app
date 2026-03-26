# Goal Description
The user wants to replace the current frontend of the F1 Precision React application with the high-fidelity HTML/CSS designs exported from Stitch MCP located in `stitch_f1_insights_app`. The objective is to convert these static HTML files into modular React components, preserving their styling while decoupling data and logic to fit the existing React setup.

## Proposed Changes

### Global Configuration and Styles
- **`tailwind.config.js`**: Extract the Material Design color palette and typography settings from the HTML `<head>` of the Stitch designs and merge them into the global Tailwind configuration, replacing or adding to the existing colors.
- **`src/index.css`**: Append the custom CSS blocks found in the design files (such as scrollbar styling, `.text-glow`, `.bg-glass`, etc.).

### Navigation and Layout Components
- Extract the common `TopNavBar`, `SideNavBar`, and `Footer` elements from the HTML structures and create reusable React components for them in `src/components/`.
- Ensure components use standard `React-Router` link elements for navigation instead of static `href="#"`.

### Pages to Convert
The following HTML exports will be transformed into their respective React `src/pages/` components, separating mock data into `src/data/mockData.ts` as per the `react:components` skill:
- **Dashboard (`src/pages/Dashboard.tsx`)**: Convert from `f1_precision_immersive_dashboard`.
- **Drivers (`src/pages/Drivers.tsx`)**: Convert from `f1_precision_all_drivers_standings`.
- **DriverProfile (`src/pages/DriverProfile.tsx`)**: Convert from `hamilton_velocity_ferrari_edition` (or similar driver page).
- **Races (`src/pages/Races.tsx`)**: Convert from `f1_precision_immersive_race_calendar`.
- **Results (`src/pages/Results.tsx`)**: Convert from `f1_race_results_pro_broadcast_edition`.
- **Constructors (`src/pages/Constructors.tsx`)**: Convert from `2026_constructor_standings_official_grid`.
- **Not Found (`src/pages/NotFound.tsx`)**: Convert from `f1_precision_off_track_404`.

## Verification Plan
### Automated testing
- Run `npm run build` and `npm run lint` (if configured) to ensure no syntax errors and that TypeScript compiles successfully.

### Manual Verification
- Start the Vite development server using `npm run dev`.
- Navigate through all paths (`/`, `/drivers`, `/races`, `/results`, `/constructors`) in the web browser to verify that the newly integrated UI displays currently.
- Check hover effects, responsive layout, and scrollbars as defined in the static designs.
