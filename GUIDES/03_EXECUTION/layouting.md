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

## 3. Information Flow Optimization
* **Logical Reading Order:** Design in vertical zones (Z-pattern or F-pattern reading) matching the user funnel.
* **Navigation Anchoring:** Tag every page section with an ID and sync it with the page's navigation links.
* **Visual Hierarchy:** Guide the eye from larger titles (`h1`/`h2`) down to small details. Never make two adjacent elements have the same size and weight unless they are peers in a grid.

---

## 4. Episodische Touchpoints & Retention-Elemente
To support recurring customer engagement (the episodic lifecycle), structure layout modules that highlight dynamic, timed, or routine content:
- **Seasonal Touchpoint Slots:** Dedicated visual blocks for annual reports, seasonal trade fair/event calendars, or dynamic campaigns.
- **Actionable Routines:** Layout structures for recurring seminar schedules, advisory workshops, or customer newsletter signups.
- **Dynamic Content Modules:** Use flexible grid modules (e.g., Bento boxes) that can be easily updated to show current notices or regulatory changes without breaking the page's structural hierarchy.
