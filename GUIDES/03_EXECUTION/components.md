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
  - Allowed: Lucide, Heroicons, Phosphor Icons, Tabler Icons, Bootstrap Icons.
  - Strictly Forbidden: CDNs (FontAwesome CDN, Google Material Icons CDN) due to DSGVO IP-leaks.
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
