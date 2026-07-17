# Deliverables: Motion & Interaction

This guide defines motion principles, scroll-reveal mechanics, interactive hover states, and performance constraints.

---

## 1. Motion Principles
* **Purpose-Driven:** Movement must guide the eye or provide visual feedback. Never animate purely for decoration.
* **Organic Easing:** Standard transitions use a custom cubic-bezier curves mimicking physical momentum rather than linear mechanical speed:
  - Default curve: `cubic-bezier(0.22, 1, 0.36, 1)` (organisch / out-quint)
  - Spring curve: `cubic-bezier(0.34, 1.56, 0.64, 1)` (für Button clicks)

---

## 2. Scroll-Reveal Pattern
All major content elements (headings, cards, grids) should slide or scale smoothly into view as the user scrolls.

### CSS Reveal States
```css
/* Base hidden state */
[data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Revealed state */
[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered load delays for lists */
[data-reveal]:nth-child(1) { transition-delay: 0ms; }
[data-reveal]:nth-child(2) { transition-delay: 80ms; }
[data-reveal]:nth-child(3) { transition-delay: 160ms; }
```

### JavaScript Observer (High Performance)
Do not use standard scroll listeners for animations. Use `IntersectionObserver`:

```js
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target); // Animates once
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  }
);

document.querySelectorAll('[data-reveal]').forEach((el) => {
  revealObserver.observe(el);
});
```

---

## 3. Parallax Hero Background
* Backgrounds move at a slower speed than the page content.
* Always enforce GPU-rendering using `will-change: transform`.
* Ensure a dark/gradient overlay is placed on top of the image to ensure clear contrast for hero text.

---

## 4. UX Verification Checklist
- [ ] Motion is completely disabled if the user prefers reduced motion.
  ```css
  @media (prefers-reduced-motion: reduce) {
    [data-reveal] {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
  ```
- [ ] No animations trigger layout shifts (CLS) that hurt performance scores.
- [ ] Interactive elements (buttons, links) have active press-scaling states (`transform: scale(0.96)`) for immediate physical feedback.
