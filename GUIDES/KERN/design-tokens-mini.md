# Design Tokens – Kurzreferenz

> Nur Token-Werte. Keine Erklärungen. Für Details → GUIDES/03_EXECUTION/

---

## Spacing (8pt Grid)

```css
--space-100:  4px;
--space-200:  8px;
--space-300: 16px;
--space-400: 24px;
--space-500: 32px;
--space-600: 48px;
--space-700: 64px;
--space-800: 96px;
```

### Section-Spacing (fluid – vertikaler Rhythmus zwischen Sektionen)

```css
--space-section-sm: clamp(2.5rem,  6vw,  4rem);   /* 40 → 64px  – enge Sektionen  */
--space-section:    clamp(4rem,    9vw,  7.5rem); /* 64 → 120px – Standard        */
--space-section-lg: clamp(6rem,   12vw, 11rem);   /* 96 → 176px – Hero/großzügig  */
```

### Content-Rahmen (Whitespace an den Seiten)

```css
--content-max:   72rem;                     /* ~1152px Inhaltsbreite        */
--measure:       65ch;                      /* Textspalte: 45–75 Zeichen    */
--gutter-inline: clamp(1rem, 4vw, 2.5rem);  /* Seiten-Padding mobil→desktop */
```

> Rhythmus-Regel: Abstand **zwischen** Sektionen ≈ **2×** der größte Abstand **innerhalb** (Gestalt-Nähe). Innen `--space-500/600`, außen `--space-section`.

## Farbskala (300 = Base)

```css
--color-primary-100: hsl(H, S%, 95%);
--color-primary-200: hsl(H, S%, 85%);
--color-primary-300: hsl(H, S%, 60%);  /* BASE – aus PROJEKT_BRIEF */
--color-primary-400: hsl(H, S%, 45%);
--color-primary-500: hsl(H, S%, 30%);
--color-primary-600: hsl(H, S%, 20%);
--color-primary-700: hsl(H, S%, 10%);

--color-neutral-100: hsl(0, 0%, 97%);
--color-neutral-200: hsl(0, 0%, 90%);
--color-neutral-300: hsl(0, 0%, 70%);
--color-neutral-400: hsl(0, 0%, 50%);
--color-neutral-500: hsl(0, 0%, 30%);
--color-neutral-600: hsl(0, 0%, 15%);
--color-neutral-700: hsl(0, 0%,  5%);
```

## Radien

```css
--radius-squircle:    28%;   /* quintic superellipse approx */
--radius-squircle-sm: 20%;
--radius-pill:       999px;
--radius-sm:           4px;
--radius-md:           8px;
--radius-lg:          16px;
```

## Typografie

```css
--font-base: 'Inter', system-ui, sans-serif;
--text-xs:   0.75rem;   /*  12px */
--text-sm:   0.875rem;  /*  14px */
--text-md:   1rem;      /*  16px */
--text-lg:   1.25rem;   /*  20px */
--text-xl:   1.5rem;    /*  24px */
--text-2xl:  2rem;      /*  32px */
--text-3xl:  2.5rem;    /*  40px */
--text-4xl:  3.5rem;    /*  56px */

--leading-tight:  1.2;
--leading-body:   1.6;
--weight-regular: 400;
--weight-medium:  500;
--weight-bold:    700;
```

## Breakpoints

```css
--bp-mobile:  768px;
--bp-tablet:  1024px;
--bp-desktop: 1280px;
```

## Bento-Ratios

```css
.bento-square   { aspect-ratio: 1 / 1; }
.bento-wide     { aspect-ratio: 16 / 9; }
.bento-portrait { aspect-ratio: 4 / 5; }
.bento-card     { aspect-ratio: 3 / 2; }
```

## Kern-Regeln (nicht verhandelbar)

- Kein Magic Number – immer Token verwenden
- Spacing: `gap` für Rhythmus, Margins nur als Ausnahme (einseitig, `margin-block-start`)
- Section-Abstand ≈ 2× größter Innen-Abstand (Gestalt-Gruppierung ohne Trennlinien)
- Textspalte max `65ch`; Sektionen fluid via `--space-section`
- Mobile-First: Single Column → 3-Column Grid
- Kontrast min 4.5:1 (WCAG AA)
- Touch-Targets min 48×48px
- Inline SVG für Icons – nie CDN
- Fonts lokal hosten – nie Google Fonts CDN
- `100svh` statt `100vh` (iOS Safari)

---

*Für Muster, Komponenten, Motion, Go-Live-Checkliste → GUIDES/03_EXECUTION/
