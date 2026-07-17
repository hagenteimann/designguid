# Deliverables: Colors & Design Tokens

This guide defines the color system, token structure, and HSL scale distribution rules.

---

## 1. HSL-Based Scaling Rules
Color scales are defined quantitatively using HSL values, ensuring that steps are mathematically proportional. 

### Primary Scale (300 = Base)
The base brand color is assigned to token `300`. Light and dark steps are scaled by modifying the HSL lightness (L) value in steps of roughly 10%–15%:
* `--color-primary-100`: `hsl(var(--hue), var(--sat), 95%)`  - Light background
* `--color-primary-200`: `hsl(var(--hue), var(--sat), 85%)`  - Borders, soft highlights
* **`--color-primary-300` (Base):** `hsl(var(--hue), var(--sat), 60%)` - Brand primary color
* `--color-primary-400`: `hsl(var(--hue), var(--sat), 45%)`  - Primary hover states, text
* `--color-primary-500`: `hsl(var(--hue), var(--sat), 30%)`  - Dark container backgrounds
* `--color-primary-600`: `hsl(var(--hue), var(--sat), 20%)`  - Dark accents
* `--color-primary-700`: `hsl(var(--hue), var(--sat), 10%)`  - Deep shadows, dark text

### Neutral Scale (Grayscale)
Neutrals use H=0 and S=0% for pure contrast distribution:
* `--color-neutral-100`: `hsl(0, 0%, 97%)` - Pure light background
* `--color-neutral-200`: `hsl(0, 0%, 90%)` - Light UI borders
* `--color-neutral-300`: `hsl(0, 0%, 70%)` - Muted text / borders
* `--color-neutral-400`: `hsl(0, 0%, 50%)` - Muted utility text
* `--color-neutral-500`: `hsl(0, 0%, 30%)` - Dark borders / elements
* `--color-neutral-600`: `hsl(0, 0%, 15%)` - Dark card background
* `--color-neutral-700`: `hsl(0, 0%, 5%)`  - Dark mode page background

---

## 2. Color Harmonies
Use calculated HSL offsets to maintain harmony across secondary and accent colors:
- **Analogous (Harmonious):** Offset base hue by $+30^\circ$ and $-30^\circ$.
- **Split-Complementary (Tension):** Base color + complementary color offset by $+30^\circ$ and $-30^\circ$ (e.g., Hue 220 + 35 + 5).

---

## 3. Contrast Requirements (WCAG)
* **Minimum contrast ratio:** **4.5:1** (WCAG AA) for standard text.
* Check contrast programmatically for all background/foreground combinations using tools like Lighthouse or Axe prior to deployment.
