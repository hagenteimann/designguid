# Deliverables: Components & Assets

This guide defines coding standards for reusable components, performance limits for assets, licensing constraints, and state management (skeleton/empty states).

---

## 1. Component Rules & Reuse
* **Component-Zwang:** Code must never be redundant. Extract common patterns (buttons, cards, banners) into modular components.
* **No Magic Numbers:** All margins, paddings, border-radii, and colors must reference HSL/Space tokens.
* **BEM-Lite CSS Class Structure:** 
  - Block: `.card`
  - Element: `.card__title`
  - Modifier: `.card--featured`

---

## 2. Asset Performance Budgets
* **Images:** Must be WebP format. Desktop images < 200KB, mobile images < 100KB. No PNGs or JPGs allowed in production.
* **Videos:** Must be MP4 (H.264). Max 2MB on desktop, 1MB on mobile.
* **Lazy Loading:** Add `loading="lazy"` on all offscreen images (keep it off for LCP hero images).
* **Responsive Images:** Use `<picture>` with `srcset` to match device width.

---

## 3. Allowed Asset Sources
* **Icons:** Must be **Inline SVGs** under open-source licenses (MIT, Apache, ISC).
  - Allowed: Lucide, Heroicons, Phosphor Icons, Tabler Icons, Bootstrap Icons — copied in as inline SVG markup.
  - **Hard rule – no external icons, any host:** loading icons from *any* external source is strictly forbidden — icon CDNs (FontAwesome, Material Icons, Iconify, Boxicons, Remixicon …) and icon-fonts alike, due to GDPR IP-leaks. Enforced by `./check.sh` (blocks deploy).
* **Images:** Must have checked licensing.
  - Allowed: Unsplash, Pexels, Pixabay, Undraw.
  - Forbidden: Adobe Stock, Shutterstock, Getty without active licenses.

---

## 4. UI States (Empty & Loading)
Every dynamic or list component must implement 4 states:
1. **First-Use:** Onboarding guiding text + CTA.
2. **No Results:** Search/Filter empty screen + Reset CTA.
3. **Error:** Load errors + Try Again button.
4. **Cleared:** Content cleared by user + Next Step CTA.

### Skeleton Shimmer Pattern
Always show skeleton screens during loading rather than white flashes. Example skeleton implementation:

```css
.skeleton {
  background: var(--color-neutral-200);
  border-radius: var(--radius-md);
}
@media (prefers-reduced-motion: no-preference) {
  .skeleton {
    background: linear-gradient(
      90deg,
      var(--color-neutral-200) 25%,
      var(--color-neutral-100) 50%,
      var(--color-neutral-200) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s infinite;
  }
}
@keyframes skeleton-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 5. Squircles & Continuous Curvature (G2 Continuity)
Traditional CSS `border-radius` creates a G1-continuous curve (a circular arc meeting a straight line). This causes a sudden jump in curvature, which looks visually sharp and cheap. To match premium aesthetics (Apple's hardware/software design language), implement **G2-continuous curvature (Squircles or Superellipses)**, where the transition is completely organic and smooth.

### Implementation Methods:
1. **Figma Export (Recommended for Icons & Custom Badges):**
   - Design components in Figma using **Corner Smoothing** (set to 60%–100% for iOS-like squircle curves).
   - Export the shapes directly as SVGs to preserve the exact bezier curvature.
2. **CSS Percentage Approximation (For Standard Containers & Cards):**
   - For fluid containers, use percentage-based radii instead of absolute pixels to approximate the superellipse curve:
     ```css
     .card {
       border-radius: var(--radius-squircle); /* 28% */
     }
     .badge {
       border-radius: var(--radius-squircle-sm); /* 20% */
     }
     ```
3. **SVG Clip-Path (For Exact Lamé/Superellipse Curves):**
   - Use inline SVG clip-paths to mask HTML containers mathematically:
     ```css
     .premium-wrapper {
       clip-path: url(#squircle-mask);
     }
     ```

---

## 6. Interaction State Matrix
Every interactive element must design its **full** state set — never leave states to the browser default:
`default` · `hover` · `focus-visible` · `active` · `disabled` · `loading` · `error` · (`selected`).
- **`:focus-visible`** for keyboard focus (visible ring, ≥ 2px, contrast ≥ 3:1); never `outline: none` without a replacement.
- **`@media (hover: hover)`** — only apply hover effects on devices that actually hover (don't confuse touch).
- **`:has()`** enables parent-level state without JS.
- Drive states via data attributes/tokens (`[data-state="loading"]`) for consistency across buttons, inputs, cards.

## 7. Depth & Elevation System
- **One consistent light source** (usually top) — all shadows follow it.
- **Elevation tokens** (`--elevation-1…5`): higher = closer, defined by a **layered, slightly tinted** shadow (not a single neutral drop-shadow) *and* surface contrast.
- **Dark-mode elevation via surface lightness** (higher layers get lighter), not heavier shadows.
- **Glass/blur** (`backdrop-filter`) only as a deliberate layer, sparingly, with a fallback. `z-index` is a documented system, not random `9999`.
