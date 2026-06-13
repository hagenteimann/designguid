# Design System Standard – Aufbau & Regeln

> Dieser Guide definiert den verbindlichen Standard für alle Push8 CD-Manual HTML-Dateien.
> Arche ist der Referenz-Blueprint. Alle zukünftigen Kunden-Design-Systeme folgen dieser Struktur.

---

## Pflicht-Sektionen (Reihenfolge fix)

```
01 // Logo & Brand Mark
02 // Farbpalette (7-stufige Skala)
03 // Typografie-Hierarchie (Desktop + Mobile)
04 // Spacing (8pt Grid – Desktop + Mobile)
05 // Formen & Radien
06 // Komponenten (Buttons, Inputs, Navigation)
07 // Voice & Copy Guidelines
08 // Motion & Animation (interaktive Demo)
09 // Assets & Meta-Specs (Favicon, OG, Fonts)
```

Jede Sektion wird mit `<!-- 01 // LOGO -->` kommentiert.
Jede Sektion hat eine eindeutige `id` für Anker-Navigation.

---

## Single-File Prinzip

> Das CD-Manual wird als **einzelne HTML-Datei** an Kunden gesendet.
> Sie muss per **Doppelklick lokal im Browser** vollständig funktionieren – ohne Internet.

**Was das bedeutet:**
- Kein CDN – weder für Fonts, noch Icons, noch JS-Libraries
- Fonts werden als **base64 Data URI** eingebettet
- Icons als **Inline SVG** direkt im HTML
- Alle Styles im `<style>`-Tag, alle Scripts im `<script>`-Tag
- Keine externen Requests – `file://` muss 1:1 funktionieren

---

## DSGVO: Fonts lokal in Single-File HTML einbetten

### Warum base64?

Für eine deployete Website reicht `@font-face` mit relativem Pfad zur WOFF2-Datei.
Für eine **offline verschickte HTML-Datei** gibt es keinen Server – der Pfad `/fonts/inter.woff2` schlägt fehl.
Lösung: Die Font-Datei wird direkt als Data URI in den `<style>`-Block eingebettet.

### Schritt-für-Schritt: Font als base64 einbetten

**1. Font-Datei herunterladen (WOFF2)**

Quelle: [google-webfonts-helper.herokuapp.com](https://google-webfonts-helper.herokuapp.com)
→ Font wählen → Gewünschte Weights → "Modern Browsers" → WOFF2 herunterladen

**2. Datei in base64 umwandeln**

```bash
# macOS / Linux
base64 -i inter-regular.woff2 | tr -d '\n'

# Windows PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("inter-regular.woff2"))
```

**3. In `@font-face` einbetten**

```css
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('data:font/woff2;base64,HIER_DER_BASE64_STRING==') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('data:font/woff2;base64,ANDERER_BASE64_STRING==') format('woff2');
}
```

**Regel:** Pro Font-Weight eine eigene `@font-face`-Regel.
**Empfohlene Weights:** Regular (400), Medium (500), Bold (700) – nur was wirklich genutzt wird.

### Für deployete Websites (nicht Single-File)

```css
/* Fonts liegen unter /fonts/ auf dem Server */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter-400.woff2') format('woff2');
}
```

**Kein Google Fonts CDN** – auch nicht mit `display=swap`. Die IP-Übermittlung an Google ist DSGVO-relevant.

---

## Spacing Tokens – Desktop + Mobile

### Token-Tabelle

| Token | Desktop | Mobile | clamp() |
|---|---|---|---|
| `--space-100` | 4px | 4px | fix |
| `--space-200` | 8px | 8px | fix |
| `--space-300` | 16px | 12px | `clamp(12px, 2vw, 16px)` |
| `--space-400` | 24px | 16px | `clamp(16px, 3vw, 24px)` |
| `--space-500` | 32px | 24px | `clamp(24px, 4vw, 32px)` |
| `--space-600` | 48px | 32px | `clamp(32px, 5vw, 48px)` |
| `--space-700` | 64px | 40px | `clamp(40px, 6vw, 64px)` |
| `--space-800` | 96px | 56px | `clamp(56px, 8vw, 96px)` |

### CSS-Implementierung (fluid)

```css
:root {
  /* Fix – skalieren nicht */
  --space-100: 4px;
  --space-200: 8px;

  /* Fluid – skalieren mit Viewport */
  --space-300: clamp(12px, 2vw,  16px);
  --space-400: clamp(16px, 3vw,  24px);
  --space-500: clamp(24px, 4vw,  32px);
  --space-600: clamp(32px, 5vw,  48px);
  --space-700: clamp(40px, 6vw,  64px);
  --space-800: clamp(56px, 8vw,  96px);
}
```

**Regel:** Kein `@media`-Breakpoint für Spacing nötig – `clamp()` handelt alles fluid.
**Ausnahme:** Section-Padding nutzt `--space-700` oder `--space-800`. Im Design System beide Extremwerte dokumentieren (min + max).

---

## Typografie – Desktop + Mobile

### Fluid Type Scale

```css
:root {
  /* Fluid – skalieren zwischen Mobile-Min und Desktop-Max */
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

### Dokumenation im Design System

Im CD-Manual muss für jede Typografie-Stufe dokumentiert werden:

| Stufe | Desktop | Mobile | Einsatz |
|---|---|---|---|
| H1 | 56px (3.5rem) | 32px (2rem) | Hero Headline |
| H2 | 40px (2.5rem) | 26px (1.625rem) | Section Title |
| H3 | 32px (2rem) | 22px (1.375rem) | Card Title |
| H4 | 24px (1.5rem) | 19px (1.188rem) | Subheading |
| H5 | 20px (1.25rem) | 17px (1.063rem) | UI Label groß |
| H6 | 16px (1rem) | 15px (0.938rem) | Kategorie / Meta |
| Body L | 18px | 16px | Lead-Text |
| Body M | 16px | 15px | Fließtext |
| Body S | 14px | 13px | UI / Cards |
| Body XS | 12px | 11px | Tags / Meta |

### Line-Height Tokens

```css
:root {
  --leading-tight:   1.15;  /* Headlines (kein Zeilenumbruch-Lücke) */
  --leading-snug:    1.35;  /* Subheadings */
  --leading-body:    1.6;   /* Fließtext (Lesbarkeit) */
  --leading-relaxed: 1.8;   /* UI-Labels, lange Texte */
}
```

**Regel:** Headlines immer `--leading-tight`. Fließtext immer `--leading-body`. Nie hardcoded `line-height: 1`.

---

## Motion & Animation – Demo-Standard

### Pflicht-Animationen die dokumentiert werden

Jede dieser Animationen bekommt im CD-Manual eine **live Demo** – nicht nur Code-Snippet:

| # | Name | Trigger | Zweck |
|---|---|---|---|
| 1 | **Hover Lift** | `:hover` | Buttons, Cards – `translateY(-2px)` |
| 2 | **Fade Slide Up** | Scroll / Laden | Section-Reveal – `opacity + translateY` |
| 3 | **Line Reveal** | Laden | Hero-Text – Zeile für Zeile |
| 4 | **Skeleton Shimmer** | Laden | Perceived Performance |
| 5 | **Parallax Scroll** | Scroll | Hero-Hintergrund |
| 6 | **Nav Blur** | Scroll | Navbar Background erscheint |
| 7 | **Button Active** | `:active` | Klick-Feedback – `scale(0.97)` |
| 8 | **Color Transition** | `:hover` | Smooth Farbwechsel |

### Aufbau der Motion-Sektion (Sektion 08)

```html
<!-- 08 // MOTION & ANIMATION -->
<section id="motion" class="ds-section">
  <div class="panel-label">08 // Motion & Animation</div>

  <!-- Für jede Animation: -->
  <div class="motion-demo">
    <div class="motion-demo__preview">
      <!-- Hier: lebendiges Demo-Element -->
    </div>
    <div class="motion-demo__specs">
      <code>Transition: 0.3s ease</code>
      <code>Transform: translateY(-2px)</code>
    </div>
  </div>

</section>
```

### prefers-reduced-motion – Pflicht

Jede Animation muss mit `prefers-reduced-motion` absicherbar sein:

```css
/* Standard: Animation aktiv */
.btn {
  transition: transform 0.3s ease, background 0.3s ease;
}
.btn:hover {
  transform: translateY(-2px);
}

/* Reduced Motion: keine Bewegung */
@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: background 0.3s ease; /* Farbe ok, Bewegung nicht */
  }
  .btn:hover {
    transform: none;
  }
}
```

**Regel:** Im CD-Manual immer beide Zustände zeigen – mit und ohne Motion.

### Timing-Token

```css
:root {
  --duration-instant:  100ms;  /* Immediate feedback (Button Active) */
  --duration-fast:     200ms;  /* Hover States */
  --duration-base:     300ms;  /* Standard Transitions */
  --duration-slow:     600ms;  /* Scroll Reveals, Page Loads */
  --duration-crawl:   1000ms;  /* Skeleton, Ambient */

  --ease-default:   ease;
  --ease-spring:    cubic-bezier(0.22, 1, 0.36, 1);   /* Overshoot */
  --ease-out:       cubic-bezier(0.0, 0, 0.2, 1);     /* Natural decel */
  --ease-in-out:    cubic-bezier(0.4, 0, 0.2, 1);     /* Material */
}
```

---

## HTML-Datei Grundstruktur (Template)

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Kundenname] – CD Manual v1.0</title>
  <!-- KEINE externen Links. Alles inline. -->
  <style>
    /* === 1. FONTS (base64 eingebettet) === */
    @font-face { font-family: '[Font]'; src: url('data:font/woff2;base64,...') format('woff2'); font-weight: 400; }
    @font-face { font-family: '[Font]'; src: url('data:font/woff2;base64,...') format('woff2'); font-weight: 700; }

    /* === 2. TOKENS === */
    :root { /* Spacing, Farben, Typografie, Radien */ }

    /* === 3. BASE STYLES === */
    /* === 4. LAYOUT === */
    /* === 5. KOMPONENTEN === */
  </style>
</head>
<body>

  <!-- ANKER-NAVIGATION -->
  <nav class="ds-nav">
    <a href="#logo">01 Logo</a>
    <a href="#farben">02 Farben</a>
    <a href="#typografie">03 Typografie</a>
    <a href="#spacing">04 Spacing</a>
    <a href="#formen">05 Formen</a>
    <a href="#komponenten">06 Komponenten</a>
    <a href="#voice">07 Voice</a>
    <a href="#motion">08 Motion</a>
    <a href="#assets">09 Assets</a>
  </nav>

  <!-- HEADER -->
  <header class="ds-header">
    <!-- Logo + Projektname + Version + Datum -->
  </header>

  <!-- 01 // LOGO -->
  <section id="logo" class="ds-section">...</section>

  <!-- 02 // FARBEN -->
  <section id="farben" class="ds-section">...</section>

  <!-- 03 // TYPOGRAFIE -->
  <section id="typografie" class="ds-section">
    <!-- Desktop + Mobile Werte in einer Tabelle -->
    <!-- Live-Demo aller Stufen -->
  </section>

  <!-- 04 // SPACING -->
  <section id="spacing" class="ds-section">
    <!-- Desktop + Mobile Werte -->
    <!-- Visuelle Spacing-Bars -->
  </section>

  <!-- 05 // FORMEN -->
  <section id="formen" class="ds-section">...</section>

  <!-- 06 // KOMPONENTEN -->
  <section id="komponenten" class="ds-section">
    <!-- Live Buttons, Inputs, Navigation-Demo -->
  </section>

  <!-- 07 // VOICE & COPY -->
  <section id="voice" class="ds-section">...</section>

  <!-- 08 // MOTION & ANIMATION -->
  <section id="motion" class="ds-section">
    <!-- Live-Demos aller Animationen (kein CDN) -->
  </section>

  <!-- 09 // ASSETS & META -->
  <section id="assets" class="ds-section">
    <!-- Font-Hosting Dokumentation -->
    <!-- Favicon, OG-Image Specs -->
    <!-- Deployment-Infos -->
  </section>

  <script>
    /* Alles inline – kein src="..." */
    /* prefers-reduced-motion Check */
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  </script>

</body>
</html>
```

---

## Checkliste vor Übergabe (CD-Manual)

- [ ] Alle 9 Pflicht-Sektionen vorhanden
- [ ] Fonts als base64 eingebettet (kein CDN, kein externer Pfad)
- [ ] Anker-Navigation funktioniert lokal (file://)
- [ ] Motion-Demos laufen ohne Internet
- [ ] Desktop + Mobile Werte für Spacing dokumentiert
- [ ] Desktop + Mobile Werte für Typografie dokumentiert
- [ ] prefers-reduced-motion berücksichtigt
- [ ] Datei per Doppelklick im Browser öffenbar (getestet!)
- [ ] Kein `<link>`, kein `<script src="...">` zu externen Quellen

---

*Push8 Web Agency – Design System Standard – Stand Juni 2026*
