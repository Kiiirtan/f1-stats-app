```markdown
# Design System Document: Kinetic Precision

## 1. Overview & Creative North Star
**Creative North Star: The Mach-Speed Monolith**

This design system is a digital translation of high-performance engineering. It moves away from the "soft and friendly" web of the last decade, opting instead for a brutalist, aerodynamic aesthetic inspired by F1 telemetry and aerospace cockpits. We are not building "pages"; we are building "dashboards of intent."

The system is defined by **Kinetic Precision**: an aggressive, technical posture that prioritizes speed, data-density, and sharp-edged authority. By utilizing intentional asymmetry, monolithic blocks, and a high-contrast "Dark Chrome" environment, we create an experience that feels engineered rather than merely designed.

---

## 2. Colors & Surface Architecture

The palette is rooted in `background: #13131b` (Dark Chrome), providing a deep, non-neutral void that allows the `primary: F1 Red (#E10600)` to vibrate with energy.

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for sectioning. Structural definition must be achieved through **Tonal Stepping**. 
- Use `surface-container` (#1f1f27) against the `background` to define primary modules. 
- Use `surface-container-low` (#1b1b23) for recessed areas or secondary data feeds.
- Boundaries are felt through the shift in hex value, creating a "machined" look where parts fit together like engine components.

### Surface Hierarchy & Nesting
Treat the UI as a physical assembly. 
- **Level 0 (Base):** `surface` (#13131b). Use for global gutters and negative space.
- **Level 1 (The Block):** `surface-container` (#1f1f27). The standard unit for cards and main content areas.
- **Level 2 (The Inset):** `surface-container-lowest` (#0d0d15). Use for code blocks, input fields, or "read-only" telemetry data to create a sense of depth without physical shadows.

### The "Glass & Glow" Rule
While the system is monolithic, we use "Digital Exhaust"—subtle `tertiary: #b4c5ff` (Cyan) glows—on hover states to indicate active sensors. CTAs should utilize a gradient transition from `primary_container` (#e10600) to `primary` (#ffb4a8) to simulate the heat of a braking rotor.

---

## 3. Typography: The Telemetry Scale

Typography is our primary vehicle for brand voice. It is divided into "Command" (Headlines) and "Data" (Body).

- **Headlines (Space Grotesk):** Must be **Bold, Italic, and Uppercase**. This conveys forward motion and technical urgency. The wide apertures of Space Grotesk at `display-lg` (3.5rem) should feel like signage on a hangar wall.
- **Body (Inter):** This is your precision instrument. Used for high-density information, it provides a neutral, highly legible counterbalance to the aggressive headlines.

**Hierarchy Note:** 
Use `label-sm` (Space Grotesk, 0.6875rem) for metadata. Tracking should be increased (+5% to +10%) for all uppercase labels to ensure technical clarity at small scales.

---

## 4. Elevation & Depth

In a 0px-radius system, traditional shadows often look misplaced. We use **Tonal Layering** and **Ambient Luminescence**.

- **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-high` card placed on a `surface-container` background creates a natural lift.
- **Ambient Glows:** For floating elements (Modals/Popovers), use an extra-diffused shadow with a tint of the `on-surface` color. Specifically, use a `cyan-glow` (#b4c5ff) at 4% opacity with a 40px blur to simulate the electronic hum of a screen.
- **Ghost Borders:** If a separator is required for accessibility, use `outline-variant` (#5e3f3a) at 15% opacity. It should be barely perceptible—a "whisper" of a line.
- **Glassmorphism:** For overlays, use `surface_container` at 80% opacity with a `20px backdrop-blur`. This maintains the "Aerodynamic" feel by showing the "chassis" (content) beneath the "fairing" (overlay).

---

## 5. Components

### Buttons: The Ignition Switches
- **Primary:** Sharp 0px edges. Background: `primary_container` (#E10600). Text: `on_primary_container` (#fff2f0). On hover, add a `primary` (#ffb4a8) 2px bottom-heavy inner glow.
- **Secondary:** Outlined using the Ghost Border rule. On hover, the background shifts to `surface-bright` (#393841).
- **Tertiary:** All caps `label-md` text with a 0px underline that appears only on hover.

### Cards & Modules
- **Rule:** No dividers. 
- **Layout:** Use the Spacing Scale (specifically `spacing.8` or `spacing.12`) to create "technical voids." 
- **Interaction:** On hover, a card should transition its background color from `surface-container` to `surface-container-high` and trigger the `cyan glow` ambient shadow.

### Input Fields
- **Architecture:** Fields are always "recessed." Use `surface-container-lowest` (#0d0d15). 
- **Active State:** The bottom edge (only) glows `secondary` (#ffb4a8).
- **Error State:** Use `error` (#ffb4ab) for the label and a subtle 2% red wash over the field background.

### Telemetry Chips
- Small, rectangular blocks. Background: `surface-variant`. Text: `label-sm`. These should look like serial numbers on a part.

---

## 6. Do’s and Don’ts

### Do:
- **Embrace the Sharp Edge:** Every corner must be 0px. No exceptions.
- **Use Intentional Asymmetry:** If a grid has four columns, try making one 1.5x wider to break the "template" feel.
- **Think in "Blocks":** Treat the UI as an assembly of machined parts.
- **Prioritize Data Density:** This system thrives on information. Don't be afraid of "busy" technical layouts as long as the hierarchy is clear.

### Don’t:
- **Don’t use Rounded Corners:** It breaks the "Monolith" metaphor instantly.
- **Don’t use Pure White:** Use `on_surface` (#e4e1ed). Pure white is too high-contrast for a "Dark Chrome" environment and causes visual fatigue.
- **Don’t use Standard Dividers:** Avoid horizontal rules (`<hr>`). Use spacing or tonal shifts instead.
- **Don’t center-align everything:** Keep text left-aligned to maintain the "Technical Ledger" look. Center-alignment is too "soft" for this system.

---
*Director's Final Note: Remember, we are not designing for the average user; we are designing for the specialist. Every pixel should feel like it was measured by a micrometer.*```