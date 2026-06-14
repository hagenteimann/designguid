# Design System & Coding Agent Guide – Version 4.0

Verbindliche Design- und Coding-Regeln für alle Push8-Projekte. Dieser Guide wird von KI-Agenten vor dem ersten Code-Schritt gelesen und befolgt.

> **TL;DR**
> - Alle Werte aus Token-System – keine Magic Numbers
> - Mobile-First: Single Column → 3-Column Grid
> - Icons: Inline SVG, MIT-Lizenz – nie CDN
> - Fonts: selbst hosten – kein Google Fonts CDN
> - Kein Deploy ohne Go-Live-Checkliste + `./check.sh`

---

## Phase 0: Agent-Initialisierung

> **Bei einem Website-Rebuild: Zuerst [PROJEKT_BRIEF.md](./PROJEKT_BRIEF.md) ausfüllen – dann erst diesen Guide lesen.**
> **Für autonome Builds mit Validator-Agent:** [RALPH_LOOP.md](./RALPH_LOOP.md) – dieser Guide wird dort pro Step gezielt geladen, nicht als Block.

Bevor eine einzige Zeile Code geschrieben wird, klärt der Agent folgende Punkte:

1. **Branche & Referenz:** Nach Branche und konkreten Mitbewerber-Links fragen.
2. **Autonomous Deep Research:** Falls kein Link vorhanden, eigenständig nach Branchen-Best-Practices 2026 suchen und diese vor dem Coding evaluieren.
3. **Stack-Klärung:** HTML/CSS/JS, Next.js, Astro oder anderer Framework?
4. **Funnel-Ziel:** Was ist die primäre Conversion-Action der Seite?

---

## Phase 1: Layout-Regeln

### Grundstruktur

- **3-Column Design:** Standard-Desktop-Layout basiert auf einem flexiblen 3-Spalten-Grid (ideal für Bento-Kombinationen).
- **Full-Width Prinzip:** Nutze die volle Breite des Screens (Edge-to-Edge). Keine "Schlauch-Designs" (starre, schmale Content-Container).
- **Mobile-First Priority:** Designe primär für Mobile (Single Column) und transformiere flüssig in das Full-Width 3-Column Grid.

### Grid-Umsetzung

```css
/* Basis-Grid */
.grid-3col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-400);
}

/* Mobile-First */
@media (max-width: 768px) {
  .grid-3col { grid-template-columns: 1fr; }
}
```

---

## Phase 2: Workflow & Komponenten

- **Komponenten-Zwang:** Keine redundanten Codeschnipsel. Baue wiederverwendbare Module. Jede Komponente einmal schreiben, überall einsetzen.
- **Nav-Anchor-Sync:** Jede Section wird mit einer ID getaggt und **automatisch** in die Navigation aufgenommen. Siehe **[NAVIGATION.md](./NAVIGATION.md)** für Mobile-First Navigation und Section-Management.
- **Deep Research Modus:** Bei UX-Unsicherheit (z.B. Formular-Logik) automatisch Best Practices recherchieren, nicht raten.
- **Kein Magic Number:** Alle Abstände, Größen und Farben aus dem Token-System nehmen – keine hardcodierten Werte.

---

## Phase 3: Design Tokens & Specs

> **Single Source of Truth für alle Token-Werte:** `GUIDES/KERN/design-tokens-mini.md`
> CSS-Custom-Properties für Spacing, Farben, Radien, Typografie und Breakpoints sind ausschließlich dort definiert. Hier nur Kontext, Anwendungsregeln und Muster.

### Spacing – 8pt Grid

Alle Abstände basieren auf einem 8pt-Raster. Token-Werte → `design-tokens-mini.md`.

Fluid Spacing mit `clamp()`:
```css
.section-padding {
  padding: clamp(var(--space-500), 5vw, var(--space-800));
}
```

### Farbskala – 25% Steps

Skala 100–700, wobei **300 = Base** (Markenfarbe des Kunden, wird in `PROJEKT_BRIEF.md` festgelegt). Jede Stufe ist 15–25% heller oder dunkler. Token-Werte → `design-tokens-mini.md`.

### Bento-Box Ratios

Feste Seitenverhältnisse für alle Bento-Grid-Elemente. Token-Werte → `design-tokens-mini.md`.

| Format | Ratio | Verwendung |
|---|---|---|
| Quadrat | 1:1 | Icons, Profilbilder, kleine Feature-Kacheln |
| Widescreen | 16:9 | Videos, Hero-Media, große Feature-Kacheln |
| Portrait | 4:5 | Mobile-Hero, Social-Content-Kacheln |
| Landscape | 3:2 | Blog-Vorschau, Projekt-Thumbnails |

### Assets & Performance

→ Vollständige Regeln in **[WORKFLOW_ASSETS.md](./WORKFLOW_ASSETS.md)**

- Bilder: WebP, max. 200KB Desktop / 100KB Mobile. Kein PNG/JPG in Production.
- Videos: MP4 H.264, max. 2MB Desktop / 1MB Mobile.
- `loading="lazy"` auf alle Bilder außer dem LCP-Element.
- Responsive Bilder: `<picture>` + `srcset` – immer.

### Erlaubte Quellen – Icons, Bilder, Fonts

> **Kein Asset ohne bekannte Lizenz. Kein CDN ohne Self-Hosting-Prüfung.**

#### Icons – erlaubte Libraries

| Library | Lizenz | Einbindung |
|---|---|---|
| Heroicons | MIT | Inline SVG |
| Lucide | ISC | Inline SVG |
| Phosphor Icons | MIT | Inline SVG |
| Tabler Icons | MIT | Inline SVG |
| Bootstrap Icons | MIT | Inline SVG |
| Material Symbols | Apache 2.0 | Inline SVG |

**Einbindung immer als Inline SVG** – nie per CDN, nie als Icon-Font:

```html
<!-- ✅ Richtig: Inline SVG, kein externer Request -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
  <path d="..."/>
</svg>

<!-- ❌ Verboten: CDN-Request → IP an Dritte → DSGVO -->
<script src="https://unpkg.com/lucide@latest"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/...">
```

#### Icons – verboten

- Font Awesome über CDN (fontawesome.com oder cdnjs)
- Google Material Icons über CDN
- Ionicons über CDN
- Icons von Flaticon / Freepik ohne aktive Lizenz
- Icons aus Google-Bildersuche oder Screenshot

#### Bilder – erlaubte Quellen

| Quelle | Lizenz | Hinweis |
|---|---|---|
| Unsplash | Unsplash License | Kostenlos, kommerziell nutzbar, keine Attribution Pflicht |
| Pexels | CC0 | Kostenlos, keine Attribution nötig |
| Pixabay | CC0 | Kostenlos, keine Attribution nötig |
| Undraw | MIT | Illustrationen, anpassbar |
| Eigene Fotos/Grafiken | Eigentum | Immer bevorzugen |

**Nie verwenden:** Shutterstock, Getty, Adobe Stock ohne aktive Lizenz. Nie Bilder von fremden Websites kopieren.

#### Fonts – Self-Hosting Pflicht

Google Fonts über CDN lädt die IP des Nutzers zu Google – DSGVO-Verstoß.

```html
<!-- ❌ Verboten: IP geht an Google -->
<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet">

<!-- ✅ Richtig: Font lokal hosten -->
<style>
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter-regular.woff2') format('woff2');
    font-display: swap;
  }
</style>
```

Font-Dateien herunterladen: [google-webfonts-helper.herokuapp.com](https://google-webfonts-helper.herokuapp.com) – gibt WOFF2 + CSS direkt zum Self-Hosting.

### Barrierefreiheit (A11y)

- Kontrast: **4.5:1** Minimum (WCAG AA). Kein Deployment ohne Prüfung.
- `outline: none` ohne eigenen Focus-Stil: verboten.
- Jedes Bild bekommt ein aussagekräftiges `alt`-Attribut.
- Alle Buttons/Links ohne sichtbaren Text: `aria-label` Pflicht.
- Touch-Targets: **48×48px** Minimum für alle interaktiven Elemente.

---

## Phase 4: Empty State Philosophie

> **Ein leerer Bildschirm ist kein neutraler Zustand – er ist ein gescheitertes Nutzererlebnis.**

Empty States sind vollwertige UI-Zustände und werden von Anfang an mitdesigned.

### Die 4 Typen

| Typ | Situation | Ziel |
|---|---|---|
| **First-Use** | Nutzer startet zum ersten Mal | Onboarding, Orientierung geben |
| **No Results** | Suche/Filter ohne Treffer | Frustration abfedern, Alternativen anbieten |
| **Error** | Ladefehler, Server-Problem | Vertrauen erhalten, Lösung anbieten |
| **Cleared** | Nutzer hat alles gelöscht | Erfolg bestätigen, nächsten Schritt zeigen |

### Regeln für jeden Empty State

1. **Niemals leer lassen.** Jeder leere Zustand hat: Icon/Illustration + Headline + kurzen Erklärungstext + CTA-Button.
2. **Ton anpassen.** First-Use = motivierend. Error = ruhig und lösungsorientiert.
3. **Skeleton Screens zuerst.** Beim Laden immer Skeleton zeigen, nicht weißen Screen.
4. **CTA ist Pflicht.** Jeder Empty State leitet zur nächsten sinnvollen Aktion.

### Skeleton Screen Muster

```css
.skeleton {
  background: var(--color-neutral-200);
  border-radius: var(--space-200);
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

### Empty State Komponente (HTML-Muster)

```html
<div class="empty-state" role="status" aria-label="Kein Inhalt vorhanden">
  <div class="empty-state__icon">
    <!-- SVG Icon oder Illustration -->
  </div>
  <h3 class="empty-state__headline">Noch keine Projekte</h3>
  <p class="empty-state__text">
    Starte dein erstes Projekt und es erscheint hier.
  </p>
  <a href="/neu" class="btn btn--primary">Projekt erstellen</a>
</div>
```

---

## Phase 5: Quintic Superellipsen

> **Zwischen Rechteck und Kreis: die Superellipse als universelle UI-Form.**

Eine Superellipse (Lamé-Kurve) folgt der Formel `|x/a|^n + |y/b|^n = 1`. Bei **n = 5 (quintic)** entsteht die sogenannte **Squircle** – eine Form, die weicher wirkt als ein Rechteck, aber strukturierter als ein Kreis. Apple nutzt sie seit iOS 7 für alle App-Icons; sie ist heute der Standard für moderne, hochwertige UI-Elemente.

### Wann einsetzen

| Element | Empfehlung |
|---|---|
| App-Icons / Feature-Icons | Squircle als Clip-Shape |
| Prominent platzierte Cards | Superellipse statt hartem `border-radius` |
| Avatare / Profilbilder | Squircle statt Kreis |
| Badges, Chips, Tags | Superellipse statt `border-radius: 50%` |

### Design Tokens

```css
:root {
  --radius-squircle: 28%;        /* quintic approximation */
  --radius-squircle-sm: 22%;     /* kleine Elemente (Badges) */
  --radius-squircle-lg: 32%;     /* große Cards, Hero-Elemente */
}
```

### CSS-Implementierung

**Einfache Näherung (für Rechteck-Elemente):**

```css
.squircle {
  border-radius: var(--radius-squircle); /* 28% ≈ quintic n=5 */
}
```

**Präzise Form via SVG clip-path (für quadratische Icons):**

```css
.squircle-icon {
  clip-path: url(#squircle);
}
```

```html
<!-- Einmalig im <body> platzieren -->
<svg width="0" height="0" style="position:absolute;overflow:hidden">
  <defs>
    <clipPath id="squircle" clipPathUnits="objectBoundingBox">
      <path d="
        M 0.5,0
        C 0.78,0 1,0.22 1,0.5
        C 1,0.78 0.78,1 0.5,1
        C 0.22,1 0,0.78 0,0.5
        C 0,0.22 0.22,0 0.5,0 Z
      "/>
    </clipPath>
  </defs>
</svg>
```

### Regeln

1. **Kein border-radius: 50% für quadratische UI-Elemente.** Squircle verwenden – Kreise nur für echte kreisförmige Inhalte (Avatare mit Foto).
2. **Konsistenz erzwingen.** Alle Icons einer Seite nutzen dieselbe Radius-Stufe aus dem Token-System.
3. **Keine spitzen Ecken neben Squircles.** Rechteckige Elemente im gleichen UI-Bereich bekommen mindestens `--radius-squircle-sm`.
4. **Skalierungstest:** `border-radius: 28%` skaliert proportional – funktioniert für jede Größe ohne Anpassung.

---

## Phase 6: Motion, Hero & Global Defaults

### Scrollbar ausblenden (Global Pflicht)

Jede Push8-Website blendet die Scrollbar aus – Scroll-Funktionalität bleibt erhalten.

```css
html {
  scrollbar-width: none;        /* Firefox */
  -ms-overflow-style: none;     /* IE / Edge */
}
html::-webkit-scrollbar {
  display: none;                /* Chrome / Safari */
}
```

---

### Paragraph-Reveal-Effekt im Hero (Pflicht)

Hero-Text erscheint nicht sofort – jede Zeile/jeder Block gleitet beim Laden von unten herein. Erzeugt Hochwertigkeit und lenkt die Aufmerksamkeit.

```html
<div class="hero-text">
  <span class="reveal-line">Websites, die Kunden gewinnen.</span>
  <span class="reveal-line">Für Handwerker, Berater, Agenturen.</span>
</div>
```

```css
.hero-text {
  overflow: hidden;
}

.reveal-line {
  display: block;
  opacity: 0;
  transform: translateY(60px);
}

@media (prefers-reduced-motion: no-preference) {
  .reveal-line {
    animation: line-reveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .reveal-line:nth-child(1) { animation-delay: 0.1s; }
  .reveal-line:nth-child(2) { animation-delay: 0.25s; }
  .reveal-line:nth-child(3) { animation-delay: 0.4s; }
}

/* Kein Motion: sofort sichtbar */
@media (prefers-reduced-motion: reduce) {
  .reveal-line {
    opacity: 1;
    transform: none;
  }
}

@keyframes line-reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

### Parallax + Filter im Hero (Pflicht)

Hero-Hintergrundbild bewegt sich langsamer als der Inhalt. Overlay-Filter erhöht Lesbarkeit und Tiefe. `will-change: transform` aktiviert GPU-Rendering.

```html
<section id="section-hero" class="hero" data-nav-label="Hero" data-nav-order="1">
  <div class="hero__bg" id="hero-bg"></div>
  <div class="hero__overlay"></div>
  <div class="hero__content">
    <!-- Paragraph-Reveal-Text hier -->
  </div>
</section>
```

```css
.hero {
  position: relative;
  overflow: hidden;
  min-height: 100svh;
}

.hero__bg {
  position: absolute;
  inset: -20%;           /* Überschuss für Parallax-Bewegung */
  background-image: url('hero-bg.webp');
  background-size: cover;
  background-position: center;
  will-change: transform;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  /* Fallback für ältere Browser */
  background: linear-gradient(135deg, rgba(0, 0, 80, 0.55) 0%, rgba(0, 0, 0, 0.3) 100%);
  /* Modern (Chrome 119+, Safari 16.4+, Firefox 128+): Markenfarbe aus Token */
  @supports (background: hsl(from red h s l)) {
    background: linear-gradient(
      135deg,
      hsl(from var(--color-primary-500) h s l / 0.6) 0%,
      hsl(0 0% 0% / 0.3) 100%
    );
  }
  backdrop-filter: blur(1px);
}

.hero__content {
  position: relative;
  z-index: 1;
  padding: clamp(var(--space-700), 10vw, var(--space-800));
  color: white;
}
```

```javascript
// prefers-reduced-motion in JS via matchMedia prüfen – nicht @media (das ist CSS-Syntax)
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const heroBg = document.getElementById('hero-bg');
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
  }, { passive: true });
}
```

> `100svh` statt `100vh` – vermeidet den iOS-Safari-Bug mit der dynamischen Browser-Toolbar.

---

## Checkliste vor dem Go-Live

**Kein Deploy ohne alle Punkte abgehakt.**

- [ ] Alle Abstände aus Token-System – keine Magic Numbers
- [ ] 3-Column Grid Desktop + Single Column Mobile getestet
- [ ] Kontrast 4.5:1 geprüft (Tool: axe oder Lighthouse)
- [ ] Alle Bilder WebP, alle Icons SVG – kein PNG/JPG
- [ ] Touch-Targets mind. 48×48px
- [ ] Skeleton Screens für alle async-Bereiche vorhanden
- [ ] Empty States für alle Listen/Filter vorhanden
- [ ] Alt-Texte auf allen Bildern
- [ ] Ankerlinks und Navigation synchron (IDs stimmen)
- [ ] Alle Icons: MIT/Apache-Lizenz, inline SVG – kein CDN
- [ ] Alle Bilder: Lizenz geprüft (Unsplash/Pexels/Pixabay oder eigen)
- [ ] Fonts: selbst gehostet (kein Google Fonts CDN)
- [ ] Keine externen CDN-Requests ohne DSGVO-Prüfung
- [ ] Impressum + Datenschutz vorhanden und im Footer verlinkt → [RECHTLICHES.md](./RECHTLICHES.md)

---

*Design System Agent V4.0 – Push8 Web Agency – Stand Mai 2026*
