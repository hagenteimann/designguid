# Deliverables: Typography & Scales

This guide defines typography guidelines, font pairing rules, and technical font-loading specifications.

---

## 1. Typography Pairings & Personality
Avoid generic font pairings. Select combinations that reflect the brand's concept:
- **Elegant & Editorial:** Playfair Display + Source Serif 4
- **Warm & Personal:** Fraunces + Lato
- **Modern-Classic:** DM Serif Display + DM Sans
- **Tech & Creative:** Syne + Inter
- **Contemporary:** Clash Display + Cabinet Grotesk
- **Bold Impact:** Bebas Neue + Open Sans
- **Luxury & Premium:** Cormorant Garamond + Jost

---

## 2. Fluid Scale (Desktop & Mobile)
Always use responsive scales via `clamp()` to interpolate sizes smoothly between viewport boundaries:

```css
:root {
  --font-base: 'Inter', system-ui, sans-serif;
  
  --text-xs:   clamp(0.688rem, 1vw,   0.75rem);   /* 11px → 12px */
  --text-sm:   clamp(0.813rem, 1.2vw, 0.875rem);  /* 13px → 14px */
  --text-md:   clamp(0.938rem, 1.5vw, 1rem);      /* 15px → 16px */
  --text-lg:   clamp(1.063rem, 1.8vw, 1.25rem);   /* 17px → 20px */
  --text-xl:   clamp(1.188rem, 2.5vw, 1.5rem);    /* 19px → 24px */
  --text-2xl:  clamp(1.375rem, 3.5vw, 2rem);      /* 22px → 32px */
  --text-3xl:  clamp(1.625rem, 5vw,   2.5rem);    /* 26px → 40px */
  --text-4xl:  clamp(2rem,     7vw,   3.5rem);    /* 32px → 56px */
}
```

---

## 3. Element Mappings & Line-Heights
- **h1:** `font-size: var(--text-4xl); line-height: var(--leading-tight); font-weight: var(--weight-bold);`
- **h2:** `font-size: var(--text-3xl); line-height: var(--leading-tight); font-weight: var(--weight-bold);`
- **h3:** `font-size: var(--text-2xl); line-height: var(--leading-tight); font-weight: var(--weight-bold);`
- **h4:** `font-size: var(--text-xl); line-height: var(--leading-snug); font-weight: var(--weight-medium);`
- **h5:** `font-size: var(--text-lg); line-height: var(--leading-relaxed); font-weight: var(--weight-medium);`
- **h6:** `font-size: var(--text-md); line-height: var(--leading-relaxed); font-weight: var(--weight-bold); text-transform: uppercase;`
- **body_l (Lead):** `font-size: var(--text-lg); line-height: var(--leading-body);`
- **body_m (Standard):** `font-size: var(--text-md); line-height: var(--leading-body);`
- **body_s (Cards/UI):** `font-size: var(--text-sm); line-height: var(--leading-body);`
- **body_xs (Meta/Tags):** `font-size: var(--text-xs); line-height: var(--leading-tight);`

---

## 4. Technical Rules (Self-Hosting)
* **Hard rule – no external fonts, any host:** Loading fonts from *any* external source is **strictly forbidden** — not just Google Fonts, but every provider (Typekit, Bunny, cdnfonts …) and any `@font-face` whose `src` points to an absolute/protocol-relative URL. It leaks user IPs (GDPR) and is enforced by `./check.sh` (blocks deploy).
* **Implementation:** Always download `.woff2` files and define them locally with a relative path:

```css
@font-face {
  font-family: 'Space Grotesk';
  src: url('/fonts/space-grotesk-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

---

## 5. Typography as a Distinctive Brand Asset (DBA)
The pairing of display and body fonts serves as a primary visual signature of the brand:
- **Consistent Hierarchy:** Do not let agents substitute custom display fonts with generic system fallbacks or default web fonts. If the brand has a bold, charakterstarker display font, protect it across all titles.
- **Font Availability:** Preload the main variable font files (e.g., in `.woff2` format) to ensure zero visual layout shift (CLS) during page loading.

---

## 6. State of the Art 2026 (Rhythm & Modern Type)
Separate professional typesetting from amateur sizing:
- **Variable fonts:** ship one self-hosted `.woff2` with weight and optical-size (`opsz`) axes instead of many static cuts — lighter payload, finer control. Never faux-bold/italic; use real axes/cuts.
- **Measure 45–75 characters** per line for body copy (`max-width: 65ch`); readability drops sharply beyond that.
- **Modular scale:** derive sizes from one ratio (e.g. 1.25) rather than arbitrary values (aligns with the golden-ratio rule in `layouting.md`).
- **`text-wrap: balance`** for headlines (even line lengths), **`text-wrap: pretty`** for body (no orphans/runts).
- **Logical properties & `lang`** awareness (`margin-inline`, `padding-block`) so type holds up for longer languages and RTL.

```css
.body-copy { max-width: 65ch; text-wrap: pretty; }
h1, h2     { text-wrap: balance; }
```
