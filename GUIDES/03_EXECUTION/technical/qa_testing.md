# Technical: QA & Testing Checklist

This guide defines the Quality Assurance (QA) workflow and testing criteria before going live.

---

## 1. Performance Testing (Lighthouse)
* **Target:** Minimum performance score of **80** (target 90+).
* **Checks:**
  - Asset optimization: Verify WebP compression, lazy loading, and dimension definitions.
  - Render Blocking: Check that CSS is optimized and critical, and JS is deferred.
  - Layout Shifts: Minimize Cumulative Layout Shift (CLS) during load.

---

## 2. Accessibility Testing (WCAG 2.2 AA)
* **Contrast:** Ensure text-to-background contrast ratio is at least 4.5:1.
* **Keyboard Navigation:** Verify that all interactive elements can be focused and triggered using only the keyboard. Focus styles must be visible.
* **Semantic Structure:** Verify screen-reader compatibility (appropriate ARIA attributes, semantic landmarks like `<header>`, `<main>`, `<footer>`).

---

## 3. Compatibility & Responsiveness
* **Cross-Browser:** Validate page layouts in Google Chrome, Safari, and Firefox.
* **Cross-Device:** Test layouts on desktop viewports down to 320px mobile screens. Verify there is no horizontal scroll overflow.

---

## 4. Launch QA Checklist
- [ ] No debugger or `console.log` statements in production files.
- [ ] All images have descriptive `alt` tags.
- [ ] Every form input is associated with a semantic `<label>`.
- [ ] OpenGraph image and metadata verified.
- [ ] Broken link audit complete.
