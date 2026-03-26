# Design System Strategy: High-Performance Telemetry

## 1. Overview & Creative North Star: "The Monolithic Engine"
This design system is engineered for the high-stakes, split-second environment of Formula 1 telemetry. Our Creative North Star is **The Monolithic Engine**: a visual language that feels milled from a single block of dark chrome, punctuated by the heat of raw performance.

We break the "template" look by rejecting the soft, rounded web of today. By utilizing **0px sharp edges**, intentional asymmetry, and extreme typographic contrast, we create a UI that feels like a technical instrument rather than a website. This is an environment of "Aggressive Precision," where every pixel serves a data-driven purpose.

---

## 2. Colors & Surface Logic
The palette is rooted in the depth of the track at night, using tonal shifts to imply hierarchy rather than artificial decoration.

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** Structural separation is achieved through background color shifts. To separate a telemetry stream from a global nav, place a `surface-container-low` (#1b1b23) section directly against the `surface` (#13131b) background. 

### Surface Hierarchy & Nesting
Treat the UI as a physical assembly of parts. Use the Material tiers to "mill" the interface:
- **Base Layer:** `surface` (#13131b) for the primary application canvas.
- **Primary Modules:** `surface-container` (#1f1f27) for main data cards.
- **Nested Controls:** `surface-container-high` (#292932) for inner toggles or nested data tables within a card.
- **Deep Recess:** `surface-container-lowest` (#0d0d15) for input fields to suggest they are "carved into" the interface.

### The "Glass & Glow" Rule
To prevent the dark theme from feeling "flat," use semi-transparent `primary_container` (#e10600) with a 20-40px backdrop blur for floating alerts or active state overlays. This mimics the ambient glow of a cockpit dashboard.

---

## 3. Typography: Technical Editorial
The type system balances the raw speed of **Space Grotesk** with the surgical clarity of **Inter**.

- **Display & Headlines (Space Grotesk):** These are your "Speedometers." Use `display-lg` (3.5rem) for critical lap times. The wide, geometric stance of Space Grotesk should feel like it was stenciled onto a chassis.
- **Body & Labels (Inter):** Use for high-density data. `label-sm` (0.6875rem) in uppercase is the standard for telemetry legends (e.g., "BRAKE TEMP", "ERS DEPLOY").
- **Hierarchy through Scale:** Create "Editorial Tension" by pairing a massive `display-md` value next to a tiny, high-contrast `label-md` tag. This mimics the technical readouts found in engineering blueprints.

---

## 4. Elevation & Depth: Tonal Layering
In a monolithic system, traditional drop shadows are too "soft." We use light and tone to define height.

- **The Layering Principle:** Depth is "stacked." A `surface-container-highest` element sitting on a `surface` background provides enough contrast to imply a 5mm lift without a single shadow.
- **Ambient Glows:** For "Active" or "Critical" states (e.g., a DRS zone activation), replace shadows with a `primary` (#ffb4a8) outer glow. Set the blur to 12px at 15% opacity.
- **The "Ghost Border" Fallback:** If a boundary is strictly required for data density, use `outline-variant` (#5e3f3a) at **10% opacity**. It should be felt, not seen.

---

## 5. Components: Engineering Primitives

### Buttons
- **Primary:** Background `primary_container` (#e10600), Text `on_primary_container` (#fff2f0). **0px Border Radius.**
- **Secondary:** `surface-container-highest` background with a `primary` (#ffb4a8) text color.
- **States:** On hover, use a `primary_fixed_dim` inner glow to simulate "heat."

### Data Cards & Lists
- **No Dividers:** Forbid the use of line dividers between telemetry rows. Use a 0.2rem (`spacing-1`) vertical gap to let the `surface` color peek through, creating a natural "cut" line.
- **The "Data Strip":** Use a 2px vertical accent of `primary` on the far left of a card to indicate the "Active Driver" or "Live Feed."

### Telemetry Inputs
- **Input Fields:** `surface-container-lowest` (#0d0d15) background. 0px border. Use `outline` (#af8781) only for the focused state to create a sharp, high-contrast box.

### F1 Specific Components
- **Sector Flags:** Sharp, rectangular blocks using `tertiary` (Blue) and `primary_container` (Red) to indicate track status.
- **G-Force Matrix:** A nested grid using `surface-container-high` cells that illuminate with `primary` intensity based on data values.

---

## 6. Do’s and Don’ts

### Do
- **DO** use asymmetry. A dashboard with a large left-aligned column and two smaller right-aligned stacks feels more technical than a centered grid.
- **DO** use `surface-bright` (#393841) for "Ghost" text or inactive telemetry values to maintain a clear visual path.
- **DO** embrace the "0px" philosophy—even for tooltips and icons.

### Don’t
- **DON'T** use 100% white (#FFFFFF). It will "bloom" painfully against the Dark Chrome. Always use `on_surface` (#e4e1ed).
- **DON'T** use standard "Material Design" shadows. They are too organic. If you need separation, use a color step (e.g., Container Low to Container High).
- **DON'T** round any corners. Not even by 1px. The system must remain uncompromisingly sharp.