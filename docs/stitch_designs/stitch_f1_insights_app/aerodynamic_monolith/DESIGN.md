# Design System Strategy: High-Velocity Technicality

## 1. Overview & Creative North Star: "The Kinetic Monolith"
This design system is built for elite performance, inspired by the uncompromising engineering of Formula 1. Our Creative North Star is **The Kinetic Monolith**. This is not a "soft" or "friendly" interface; it is a high-precision instrument that feels carved from a single block of dark chrome and powered by internal combustion.

To move beyond generic dark-mode templates, we utilize **high-velocity minimalism**. This means we strip away all decorative "fluff" (rounded corners, borders, standard shadows) and replace them with aggressive typography scales, intentional asymmetry, and tonal layering. The interface should feel like a telemetry dashboard: dense, authoritative, and moving at 300km/h even when static.

---

## 2. Color & Tonal Architecture
The palette is rooted in the deep, metallic depth of `dark-chrome`. We do not use color for decoration; we use it for data priority and mechanical feedback.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts. To separate a sidebar from a main feed, transition from `surface` (#13131b) to `surface-container-low` (#1b1b23). This creates a seamless, "milled" look rather than a "pasted" look.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical, stacked layers.
- **Base Layer:** `surface` (#13131b) for the overall application backdrop.
- **Primary Content:** `surface-container` (#1f1f27) for main dashboard modules.
- **Elevated Interaction:** `surface-container-highest` (#34343d) for active or focused states.
- **The "Glass & Gradient" Rule:** For high-impact areas (Hero sections, critical CTAs), use a subtle linear gradient from `primary_container` (#E10600) to `primary` (#FFB4A8) at a 45-degree angle to simulate the shimmer of heat or high-speed light trails.

---

## 3. Typography: Editorial Authority
Typography is the primary driver of the system's "aggressive" personality.

*   **Display & Headlines (Space Grotesk):** Must always be **BOLD, ITALIC, and UPPERCASE**. Set tracking (letter-spacing) to `-0.05rem` to create a dense, pressurized feel. This is the voice of the machine.
*   **Body (Inter):** Clean, neutral, and highly legible. This is the voice of the data.

**Hierarchy as Identity:**
- **Display-LG (3.5rem):** Reserved for hero stats and speed metrics.
- **Headline-MD (1.75rem):** Section titles that demand immediate focus.
- **Label-SM (0.6875rem):** Used for technical metadata, always in Space Grotesk Bold Italic to keep the technical flavor consistent even at small scales.

---

## 4. Elevation & Depth
In a world of 0px border-radii, depth is achieved through **Tonal Layering** rather than structural geometry.

*   **The Layering Principle:** Avoid shadows for standard cards. Instead, "stack" by placing a `surface-container-lowest` card inside a `surface-container` section. The subtle contrast creates a natural "in-set" or "milled" appearance.
*   **Ambient Shadows:** For floating elements (Modals, Dropdowns), use a wide-diffusion ambient shadow. 
    *   *Spec:* `0px 20px 50px rgba(0, 0, 0, 0.5)`. The shadow must feel like an atmospheric occlusion, not a hard drop-shadow.
*   **Ghost Border Fallback:** If a container requires a boundary (e.g., a card on a background of the same color), use the `outline-variant` token at **15% opacity**. Never use 100% opaque borders.
*   **Kinetic Glass:** For overlay menus, use `surface_container` at 80% opacity with a `20px backdrop-blur`. This maintains the "Aerodynamic" feel by allowing the high-velocity data underneath to bleed through the surface.

---

## 5. Precision Components

### Buttons (The "Actuator")
*   **Primary:** `primary_container` (#E10600) background, `on_primary_container` (#FFF2F0) text. 0px radius. On hover: Shift to `primary` (#FFB4A8) with a kinetic 100ms transition.
*   **Secondary:** Ghost style. `outline` color text with a 1px "Ghost Border" (20% opacity). 
*   **Tertiary:** Text-only, Space Grotesk Bold Italic Uppercase with a `primary` underline that expands from the center on hover.

### Inputs & Data Entry
*   **Fields:** No 4-sided boxes. Use a bottom-border only (2px `outline-variant`) on a `surface-container-low` background. 
*   **Focus State:** The bottom border transforms to `primary` (#E10600) and the background shifts to `surface-bright`.

### Cards & Lists
*   **Rule:** Forbid the use of divider lines. 
*   **Implementation:** Use the Spacing Scale `spacing-8` (1.75rem) to separate list items. If a visual break is required, use a 4px wide vertical "accent bar" of `primary` color on the left edge of the active item only.

### Technical Chips
*   **Style:** Small, rectangular, `surface-container-highest` background. Text in `label-sm` (Space Grotesk). These should look like serial number plates on an engine block.

---

## 6. Do’s and Don’ts

### Do:
*   **Embrace Asymmetry:** Align high-level stats to the far right while labels stay on the left. Break the "centered" grid.
*   **Use Mono-spacing:** For numerical data, ensure `font-variant-numeric: tabular-nums` is used to maintain the technical alignment of telemetry.
*   **Kinetic Motion:** All transitions should be "Linear" or "In-Quint" to mimic mechanical speed. Avoid "bouncy" or "organic" easing.

### Don't:
*   **Never use a Border Radius:** Even 1px of rounding destroys the "Monolith" aesthetic.
*   **Avoid "Soft" Colors:** Do not use pastels or rounded shadows. If it looks "friendly," it’s wrong for this system.
*   **No Standard Box Shadows:** If a component looks like it's "floating" with a traditional shadow, it loses its integrated, mechanical feel. Stick to tonal shifts.