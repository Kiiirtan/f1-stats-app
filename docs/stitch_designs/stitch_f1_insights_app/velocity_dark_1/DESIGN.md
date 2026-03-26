# Design System Specification: Kinetic Precision

## 1. Overview & Creative North Star: "The Aerodynamic Monolith"
This design system is a study in high-velocity minimalism. Inspired by the engineering rigor of Formula 1, the "Aerodynamic Monolith" philosophy rejects the soft, rounded "friendly" UI of the past decade in favor of aggressive, sharp-edged precision and high-contrast editorial layouts.

The goal is to evoke the feeling of a premium telemetry dashboard: high-density information presented with absolute clarity. We break the "template" look by using intentional asymmetry—heavy left-aligned display type balanced by expansive negative space—and by treating the UI not as a flat screen, but as a series of machined, technical layers.

---

## 2. Colors: The High-Contrast Chrome
Our palette is anchored by `surface` (#13131b), a deep "Dark Chrome" that provides the foundation for our "Vibrant Red" (#E10600) accents.

### Surface Hierarchy & Nesting
To achieve premium depth without looking "cheap," we use a strict nesting logic based on the Material Surface tiers. 
- **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Use `surface-container-low` (#1b1b24) against a `surface` (#13131b) background to define areas.
- **Layering Logic:** 
    *   **Level 0 (Background):** `surface`
    *   **Level 1 (Sections/Large Containers):** `surface-container-low`
    *   **Level 2 (Cards/Interactive Elements):** `surface-container`
    *   **Level 3 (Pop-overs/Modals):** `surface-container-highest`

### The Glass & Gradient Rule
For primary CTAs and hero elements, use a "Linear Velocity" gradient: transitioning from `primary` (#ffb4a8) to `primary_container` (#e10600) at a 135-degree angle. Floating panels must use `surface_container_highest` at 70% opacity with a `20px` backdrop-blur to simulate the "Pit Wall" telemetry screens.

---

## 3. Typography: Technical Authority
We pair **Space Grotesk** (Display/Headlines) with **Inter** (Body/UI) to create a "Technical Editorial" aesthetic. Space Grotesk’s tabular qualities feel engineered, while Inter provides the legibility required for high-density data.

- **Display-LG (3.5rem / Space Grotesk):** Reserved for hero headers. Use `on_surface` (#e4e1ee) with -0.04em letter spacing for a compressed, aggressive look.
- **Headline-MD (1.75rem / Space Grotesk):** All-caps for section headers to mimic racing liveries.
- **Body-MD (0.875rem / Inter):** The workhorse. Use `secondary` (#c7c6ca) for high-density descriptions to maintain a clear visual hierarchy against white primary text.
- **Label-SM (0.6875rem / Space Grotesk):** Monospaced-style labels for technical data points, always in Uppercase with +0.1em tracking.

---

## 4. Elevation & Depth: Tonal Layering
In the "Aerodynamic Monolith," we do not use "drop shadows" to make things look pretty; we use them to simulate physical distance.

- **The Layering Principle:** Instead of a shadow, place a `surface_container_lowest` card inside a `surface_container_high` section. This "inverted depth" creates a recessed, machined-out look common in automotive interiors.
- **Ambient Shadows:** For floating elements (Modals/Dropdowns), use a wide-diffusion shadow: `0px 24px 48px rgba(0, 0, 0, 0.5)`. The shadow must feel like an absence of light, not a fuzzy grey border.
- **The Ghost Border Fallback:** If high-contrast separation is required for accessibility, use `outline_variant` (#5e3f3a) at **15% opacity**. It should be felt, not seen.
- **Sharp Edges:** All `roundedness` tokens are set to `0px`. No exceptions. Soft corners dilute the aggressive, technical precision of the F1 inspiration.

---

## 5. Components: Machined Primitives

### Buttons
- **Primary:** `primary_container` (#E10600) background, `on_primary_container` text. Sharp edges. On hover, shift to a 135° gradient.
- **Secondary:** `ghost_border` (outline_variant at 20%) with `on_surface` text. 
- **Tertiary:** Pure text in `label-md` style with a 2px `primary` underline that animates from 0% to 100% width on hover.

### Cards & Lists
- **The Grid Rule:** Forbid dividers. Use `spacing.8` (1.75rem) of vertical white space to separate list items.
- **Interactive State:** On hover, a card should shift from `surface_container` to `surface_container_high`. No border-color change.

### Input Fields
- **Machined Input:** A bottom-only border (2px) using `outline`. When focused, the border transforms to `primary` (#E10600) and the background shifts to `surface_container_low`.

### Technical Chips
- Small, rectangular blocks with `surface_container_highest` background and `label-sm` typography. Used for telemetry tags or status indicators (e.g., "LIVE", "DRS ACTIVE").

---

## 6. Do’s and Don’ts

### Do:
- **Use Asymmetry:** Place a massive `display-lg` headline on the left and leave the right 40% of the screen empty to create "High-Speed" tension.
- **Embrace the Dark:** Use `surface_container_lowest` (#0d0d16) for background textures to create "Deep Black" voids.
- **High Contrast:** Ensure all primary actions use the F1 Red (#E10600) against the Dark Chrome to draw immediate attention.

### Don't:
- **No Border Radii:** Never use `border-radius`. Ever. Even 2px ruins the "Aerodynamic Monolith" aesthetic.
- **No Pastel Colors:** Avoid the "Material You" soft palette. If a color isn't Red, Chrome, or White, it should be a tonal variant of those three.
- **No Standard Shadows:** Never use the default browser `box-shadow: 0 2px 4px`. It makes the interface look like a generic SaaS template.