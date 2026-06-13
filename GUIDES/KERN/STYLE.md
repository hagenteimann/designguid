# Code Style Guide – Push8

Verbindliche Code-Konventionen fuer alle Push8-Projekte. KI-Agenten halten sich daran ohne Ausnahme.

---

## HTML

### Struktur & Semantik

```html
<!-- Sections: immer mit ID + data-Attributen fuer Navigation -->
<section id="section-leistungen" data-nav-label="Leistungen" data-nav-order="2">
  <div class="container">
    <!-- Inhalt -->
  </div>
</section>

<!-- Bilder: immer picture + srcset + lazy (ausser LCP) -->
<picture>
  <source srcset="bild-800.webp 800w, bild-400.webp 400w" type="image/webp">
  <img src="bild-800.webp" alt="Beschreibung des Bildes" loading="lazy" width="800" height="600">
</picture>

<!-- Icons: immer Inline SVG, nie CDN -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path d="..."/>
</svg>
```

### Verboten in HTML

```html
<!-- Kein: CDN-Scripts ohne DSGVO-Pruefung -->
<script src="https://unpkg.com/..."></script>

<!-- Kein: leere alt-Attribute ausser rein dekorativen Elementen -->
<img src="..." alt="">  <!-- NUR fuer rein dekorative Bilder -->

<!-- Kein: onclick in HTML -->
<button onclick="doSomething()">  <!-- Stattdessen: addEventListener -->
```

---

## CSS

### Dateistruktur

```css
/* 1. Custom Properties (Tokens) */
:root { ... }

/* 2. Reset / Globals */
*, *::before, *::after { box-sizing: border-box; }

/* 3. Typografie */
body { ... }
h1, h2, h3 { ... }

/* 4. Layout-Utilities */
.container { ... }
.grid-3col { ... }

/* 5. Komponenten (alphabetisch) */
.btn { ... }
.card { ... }
.hero { ... }

/* 6. Sections */
#section-hero { ... }
#section-leistungen { ... }

/* 7. Media Queries (am Ende) */
@media (max-width: 768px) { ... }
```

### Naming Convention: BEM-Lite

```css
/* Block */
.card { ... }

/* Element */
.card__title { ... }
.card__body { ... }
.card__footer { ... }

/* Modifier */
.card--featured { ... }
.card--dark { ... }

/* States */
.btn.is-loading { ... }
.nav.is-open { ... }
```

### Token-Pflicht

```css
/* Korrekt: aus Token-System */
padding: var(--space-400);
color: var(--color-primary-300);
border-radius: var(--radius-squircle);

/* Verboten: Magic Numbers */
padding: 24px;        /* Nein */
color: #3B82F6;       /* Nein */
border-radius: 12px;  /* Nein */
```

### Fluid Values

```css
/* Fluid Spacing mit clamp() */
padding: clamp(var(--space-500), 5vw, var(--space-800));

/* Fluid Typografie */
font-size: clamp(1rem, 2.5vw, 1.25rem);
```

---

## JavaScript

### Allgemein

```js
// Vanilla ES6+ bevorzugen
// Kein jQuery
// Kein globaler State ohne Begruendung

// DOM-Selektion
const nav = document.getElementById('main-nav');
const cards = document.querySelectorAll('.card');

// Events: addEventListener, nie onclick in HTML
btn.addEventListener('click', handleClick);

// Scroll-Events: immer passive
window.addEventListener('scroll', onScroll, { passive: true });

// Intersection Observer fuer Scroll-Animationen (kein scroll-Event dafuer)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.1 });
```

### Motion: immer prefers-reduced-motion pruefen

```js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // Animationen initialisieren
}
```

### Verboten in JS

```js
// Kein: eval()
// Kein: document.write()
// Kein: innerHTML fuer User-Input (XSS)
// Kein: var (nur const/let)
// Kein: unbehandelte Promises ohne .catch()
```

---

## Dateinamen & Ordnerstruktur

```
project/
├── index.html
├── public/              ← was deployed wird
│   ├── css/
│   │   └── style.css   ← eine Haupt-CSS-Datei (oder kompiliert)
│   ├── js/
│   │   └── main.js
│   ├── fonts/           ← self-hosted WOFF2
│   └── img/             ← WebP-Bilder
├── src/                 ← Quellcode (nicht deployed)
└── docs/                ← Dokumentation
```

**Dateinamen:** immer kebab-case. Kein camelCase, kein snake_case fuer Dateien.
- `hero-background.webp` ✅
- `heroBackground.webp` ❌
- `hero_background.webp` ❌

---

## Git Commit-Style

```
feat: Hero-Section mit Paragraph-Reveal hinzugefuegt
fix: Mobile Navigation Overflow behoben
style: Spacing-Token in Card-Komponente vereinheitlicht
docs: CD-Manual mit Primärfarbe aktualisiert
perf: Hero-Video auf 1.8MB komprimiert
```

Format: `type: kurze Beschreibung (Imperativ, Deutsch)`

---

*Push8 Code Style Guide – Stand Mai 2026*
