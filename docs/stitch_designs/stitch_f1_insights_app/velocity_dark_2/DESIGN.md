# Design System Strategy: Precision Kineticism

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Monolith."** 

This is not a "friendly" or "soft" interface; it is a high-performance instrument. It captures the essence of high-velocity data, aerospace instrumentation, and premium dark-chrome aesthetics. We break the standard "web template" look by leaning into **Aggressive Minimalism**: a layout philosophy that favors extreme structural tension, sharp 0px radii, and expansive negative space. 

By utilizing intentional asymmetry—such as bleeding edge-to-edge typography or offset grid alignments—we create a sense of forward motion. This system treats the screen not as a page, but as a HUD (Heads-Up Display) for a user who demands speed and precision.

---

## 2. Colors & Tonal Depth
The palette is rooted in `surface` (#0d0d16), a deep, obsidian chrome. We do not use "gray"; we use varying densities of light and shadow.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Traditional "boxed" layouts look cheap and dated. 
- Boundaries must be defined solely through background shifts. 
- Use `surface_container_low` for background sections and `surface_container` for the main content area. 
- This creates an editorial "block" feel rather than a "table" feel.

### Surface Hierarchy & Nesting
To create depth without structural clutter, treat the UI as stacked sheets of dark glass.
- **Base Level:** `surface` (#0d0d16)
- **Deep Inset:** `surface_container_lowest` (#000000) – Use this for recessed areas like code blocks or data input zones.
- **Elevated Content:** `surface_container_high` (#1e1f2a) – Use this for cards or modals that need to sit "above" the main flow.

### The "Glass & Gradient" Rule
Standard flat colors lack "soul." To achieve a premium finish:
- **Neon Accents:** Main CTAs should use a linear gradient from `primary` (#81ecff) to `primary_container` (#00e3fd) at a 135-degree angle.
- **Glassmorphism:** Floating elements (modals, navigation bars) must use `surface_bright` at 60% opacity with a `backdrop-filter: blur(20px)`. This allows the "Neon Blue" accents to bleed through the UI as the user scrolls, creating a sense of environmental light.

---

## 3. Typography
The typography is the architecture of the system. We use **Space Grotesk** for technical authority and **Inter** for high-readability data.

*   **Display & Headlines (Space Grotesk):** These are your "hooks." Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) to create a high-impact, editorial look. Headlines should be `on_surface` (Pure White) and feel "heavy" against the dark background.
*   **Body (Inter):** All long-form reading uses `body-md`. It provides a neutral, functional balance to the expressive headlines.
*   **Labels (Space Grotesk):** Use `label-md` in All Caps with +0.1em letter spacing for metadata and small UI triggers. This mimics cockpit instrumentation.

---

## 4. Elevation & Depth: Tonal Layering
In this design system, shadows are not "dark spots"; they are "ambient occlusions."

*   **The Layering Principle:** Avoid "Drop Shadow" presets. Instead, lift an element by moving from `surface_container` to `surface_container_highest`. 
*   **Ambient Shadows:** For floating components, use a shadow with a 40px to 60px blur, set to 8% opacity. The shadow color must be `surface_tint` (#81ecff) rather than black. This creates a "glow" effect, suggesting the element is powered by the neon energy of the primary color.
*   **The Ghost Border:** If accessibility requires a stroke, use `outline_variant` at 15% opacity. It should be barely perceptible—a "whisper" of an edge that only appears when the user focuses.
*   **Hard Edges:** All containers must maintain a `0px` radius. Sharp corners imply precision and speed; rounded corners are too soft for this North Star.

---

## 5. Components

### Buttons
*   **Primary:** Sharp edges (0px). Gradient fill (`primary` to `primary_dim`). Text is `on_primary` (Dark Teal) for maximum contrast.
*   **Secondary:** Ghost style. Transparent background, `outline` stroke at 20% opacity. On hover, the stroke becomes 100% `primary`.
*   **Tertiary:** No box. `label-md` text with a 2px underline using the `spacing-1` token.

### Input Fields
*   **Style:** Minimalist underline or "Full Block." 
*   **States:** Default state uses `surface_container_high`. On focus, the bottom edge transitions to a 2px `primary` (Neon Blue) line with a subtle outer glow. Forbid standard 4-sided boxes.

### Cards & Lists
*   **Rule:** Zero Dividers. 
*   **Separation:** Use the Spacing Scale. Use `spacing-8` (1.75rem) to separate list items. Use `surface_container_low` for the list background and `surface_container_highest` for the individual item on hover.

### Progress Bars & Data Viz
*   **Velocity Lines:** Use ultra-thin (2px) lines for progress. Use `secondary` (#10d5ff) for the track and `primary` (#81ecff) for the fill. Add a small "glow" shadow to the leading edge of the progress bar to simulate light speed.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** embrace extreme asymmetry. Align a headline to the far left and the body text to a custom 60% grid column.
*   **Do** use the `spacing-24` (5.5rem) token for section breathing room. Luxury is defined by wasted space.
*   **Do** use "Pure White" (#FFFFFF) only for primary headers; use `on_surface_variant` (#acaab6) for everything else to reduce eye strain.

### Don't:
*   **Don't** use a border-radius. Ever. 0px is the law.
*   **Don't** use standard "Grey" shadows. They look muddy on Dark Chrome backgrounds.
*   **Don't** use icons with rounded terminals. Use sharp, linear icon sets (e.g., Phosphor Bold or custom SVG paths) that match the `Space Grotesk` geometry.
*   **Don't** use dividers or lines to separate content. If the hierarchy is weak, fix the background tonal shift, don't add a line.