# Deliverables: Layouting & Grids

This guide defines layout patterns, full-width design principles, responsive mobile-first setups, and Bento ratios.

---

## 1. Grid Systems (3-Column & Bento-Grid)
* **3-Column Grid:** Standard desktop layout utilizes a flexible 3-column layout (ideal for grid/card layouts).
* **Full-Width Layout:** Always design edge-to-edge. Avoid rigid, narrow fixed-width content containers.
* **Bento Ratios:** Elements inside a Bento Grid must use standard aspect ratios:
  - **Square (`1:1`):** Ideal for icons, avatars, profile photos, or small detail metrics.
  - **Widescreen (`16:9`):** Ideal for videos, hero backdrops, or wide features.
  - **Portrait (`4:5`):** Ideal for mobile-hero cards or vertical social/content.
  - **Landscape (`3:2`):** Ideal for blog post cards or project thumbnails.

```css
/* Bento aspect-ratios */
.bento-square   { aspect-ratio: 1 / 1; }
.bento-wide     { aspect-ratio: 16 / 9; }
.bento-portrait { aspect-ratio: 4 / 5; }
.bento-card     { aspect-ratio: 3 / 2; }
```

---

## 2. Mobile-First Approach
* Design layouts starting at **375px viewport width** (single column vertical stack).
* Use responsive properties (like flexbox, grid, and CSS variables) to scale smoothly into tablet and desktop formats (3-column layout) without abrupt layout jumps.

```css
/* Mobile-first base */
.grid-3col {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-400);
}

/* Desktop expansion */
@media (min-width: 768px) {
  .grid-3col {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 3. Lesefluss & Visuelle Hierarchie (Reading Flow)
Structure content using proven cognitive and mathematical patterns to guide the eye naturally:
- **Z- & F-Lesemuster:** 
  - **Z-Muster:** Use for visual landing pages. The eye travels: Left-to-Right (Header/Nav) $\rightarrow$ Diagonal Down-Left $\rightarrow$ Right (CTA/Hero Action). Place the primary CTA at the terminals of the Z.
  - **F-Muster:** Use for text-heavy pages (documentation, blogs). Place the most critical information in the first two paragraphs and along the left margin.
- **Der Goldene Schnitt (Golden Ratio):**
  - **Spalten-Proportionen (Asymmetrie):** For split-screen layouts or content-sidebar grids, use the golden ratio approximation of **$62\% \mathbin{/} 38\%$** (CSS `grid-template-columns: 1.618fr 1fr;`) instead of symmetric $50\% \mathbin{/} 50\%$ splits. This creates organic balance and tension.
  - **Text- & Raum-Proportionen:** Apply the golden multiplier ($1.618$) to determine font size steps or spatial relationships to guarantee mathematical harmony.
- **Weißraum (Negative Space):** White space is a functional layout element, not empty space. Use large section padding (e.g., `padding: var(--space-section) 0;`) to prevent cognitive overload and clearly isolate distinct thoughts.
- **Visual Anchor Points:** Guide the eye from large display titles (`h1`/`h2`) down to small details. Never place two adjacent elements of the same visual weight unless they are peers in a grid.

---

## 4. Episodische Touchpoints & Retention-Elemente
To support recurring customer engagement (the episodic lifecycle), structure layout modules that highlight dynamic, timed, or routine content:
- **Seasonal Touchpoint Slots:** Dedicated visual blocks for annual reports, seasonal trade fair/event calendars, or dynamic campaigns.
- **Actionable Routines:** Layout structures for recurring seminar schedules, advisory workshops, or customer newsletter signups.
- **Dynamic Content Modules:** Use flexible grid modules (e.g., Bento boxes) that can be easily updated to show current notices or regulatory changes without breaking the page's structural hierarchy.

---

## 5. State of the Art 2026 (Intrinsic & Fluid Layout)
Move beyond fixed viewport breakpoints toward context-aware, fluid layouts:
- **Container Queries (`@container`):** components respond to *their own container's* width, not the global viewport — true, reusable components that work in any slot.
- **Subgrid:** nested grids align cleanly to the parent track lines (`grid-template-columns: subgrid`) for consistent rhythm across cards/rows.
- **Fluid sizing:** `min()` / `max()` / `clamp()` for widths, gaps and type; `aspect-ratio` instead of padding hacks.
- **Logical properties by default** (`margin-inline`, `padding-block`, `inset`) for i18n/RTL robustness.
- **`:has()`** enables content-driven layout decisions (e.g. a card with a media child lays out differently) without JS.

```css
.card-host { container-type: inline-size; }
@container (min-width: 30rem) {
  .card { grid-template-columns: 1fr 2fr; }
}
```
