# Awesome Design – Referenzen & Inspirationen

Kuratierte Design-Referenzen fuer Push8-Projekte. Dieser Guide hilft KI-Agenten und Designern, visuell hochwertige und unterscheidbare Websites zu bauen – statt generischer AI-Slop-Aesthetik.

---

## Das Problem

KI-Agenten generieren ohne Anleitung immer dasselbe:
- Inter oder Roboto als Font
- Lila oder blauer Gradient auf weissem Hintergrund
- Weisse abgerundete Cards mit `box-shadow`
- Kaum Animation, keine typografische Persoenlichkeit

Dieser Guide gibt die Gegengifte.

---

## Design-Kategorien & Referenzen

### Monochrome / Restraint (Weniger ist mehr)

**Charakteristik:** Reduzierte Farbpalette, starke Typografie traegt das Design.

Referenz-Ansaetze:
- Gross-Typografie als visuelles Element (Buchstaben als Layout)
- Schwarzweiss + eine einzige Akzentfarbe
- Viel Weissraum, wenige aber praezise platzierte Elemente
- Font-Wahl macht den Unterschied: Schriften mit starkem Charakter (Display-Fonts)

**Wann einsetzen:** Anwaelte, Berater, Premium-Handwerk, Architekten.

---

### Warm Editorial (Menschlich, texturiert)

**Charakteristik:** Organische Formen, warme Erdtöne, handwerkliches Gefuehl.

Referenz-Ansaetze:
- Warme Beige/Terracotta/Olive-Palette
- Serif-Fonts mit Persoenlichkeit (nicht Times New Roman)
- Leichte Texturen oder Papier-Hintergründe
- Fotografisch gepraegt, kein Stock-Foto-Look

**Wann einsetzen:** Hebammen, Therapeuten, Coaches, Foodbusiness, Handwerk.

---

### High-Contrast / Brutalist (Auffallend, direkt)

**Charakteristik:** Fette Typografie, harte Kontraste, keine Entschuldigung fuer starke Farben.

Referenz-Ansaetze:
- Oversized Headlines die ueber den Container brechen
- Schwarz + eine knallige Farbe (Rot, Gelb, Neon)
- Unerwartete Layout-Brüche die Aufmerksamkeit erzeugen
- Bold/Black Font-Weights, kein Regular-Text als Headline

**Wann einsetzen:** Agenturen, Kreativstudios, Streetwear, Events.

---

### Dark Mode / Premium (Tiefe, Qualitaet)

**Charakteristik:** Dunkle Hintergründe, Lichteffekte, Premium-Feeling.

Referenz-Ansaetze:
- Dunkle Basis (nicht schwarz – eher #0A0A0F oder #111118)
- Glassmorphism sparsam eingesetzt (Frosted Glass Effekt)
- Helle Akzente: Weiss, Gold, Neon
- Subtile Gradienten die Tiefe erzeugen

```css
/* Glassmorphism-Basis */
.glass-card {
  background: hsl(0 0% 100% / 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid hsl(0 0% 100% / 0.1);
}
```

**Wann einsetzen:** Tech-Startups, SaaS, Premium-Dienstleister.

---

## Font-Kombinationen (statt Inter)

| Display | Body | Charakter |
|---|---|---|
| **Playfair Display** | Source Serif 4 | Elegant, Editorial |
| **Fraunces** | Lato | Warm, Persoenlich |
| **DM Serif Display** | DM Sans | Modern-Klassisch |
| **Syne** | Inter | Tech, Kreativ |
| **Clash Display** | Cabinet Grotesk | Zeitgenoessisch |
| **Bebas Neue** | Open Sans | Bold, Impact |
| **Cormorant Garamond** | Jost | Luxus, Premium |

Alle auf Google Fonts verfuegbar → via google-webfonts-helper self-hosten.

---

## Motion-Referenzen (Emil Kowalski / Jhey Tompkins Stil)

### Hover-States mit Substanz

```css
/* Statt einfachem opacity-hover: */
.card {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px hsl(0 0% 0% / 0.15);
}
```

### Scroll-Reveal – Standard-Pattern (Pflicht für alle Website-Projekte)

Jedes Content-Element (Cards, Text-Blöcke, Bilder, Abschnitte) bekommt beim Eintreten in den Viewport einen smooth Einflug-Effekt. Das ist **Push8-Standard** – kein statisches Erscheinen ohne Animation.

#### CSS

```css
/* Basis-State: unsichtbar + leicht nach unten versetzt */
[data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity  0.6s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Sichtbar-State: wird per JS gesetzt */
[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger für Cards in einem Grid: jede Card etwas später */
[data-reveal]:nth-child(1) { transition-delay: 0ms; }
[data-reveal]:nth-child(2) { transition-delay: 80ms; }
[data-reveal]:nth-child(3) { transition-delay: 160ms; }
[data-reveal]:nth-child(4) { transition-delay: 240ms; }
[data-reveal]:nth-child(5) { transition-delay: 320ms; }
[data-reveal]:nth-child(6) { transition-delay: 400ms; }

/* prefers-reduced-motion: Animation komplett deaktivieren */
@media (prefers-reduced-motion: reduce) {
  [data-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

#### JavaScript (IntersectionObserver – kein scroll-Event)

```js
// Scroll-Reveal via IntersectionObserver
// Alle Elemente mit data-reveal Attribut werden beobachtet
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Einmal animiert → nicht mehr beobachten
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,       // 12% des Elements muss sichtbar sein
    rootMargin: '0px 0px -40px 0px', // Etwas früher triggern
  }
);

document.querySelectorAll('[data-reveal]').forEach((el) => {
  revealObserver.observe(el);
});
```

#### HTML-Verwendung

```html
<!-- Einzelnes Element -->
<h2 data-reveal>Unsere Leistungen</h2>
<p data-reveal>Beschreibungstext der smooth einfliest.</p>

<!-- Cards mit Stagger – alle im selben Container -->
<div class="card-grid">
  <article class="card" data-reveal>...</article>
  <article class="card" data-reveal>...</article>
  <article class="card" data-reveal>...</article>
</div>

<!-- Sektionen als Ganzes -->
<section data-reveal>
  <!-- gesamter Inhalt fliest als Block ein -->
</section>
```

#### Varianten

```css
/* Von links einfliegen (z.B. für Sidebar-Elemente) */
[data-reveal="left"] {
  opacity: 0;
  transform: translateX(-24px);
  transition:
    opacity  0.6s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Von rechts einfliegen */
[data-reveal="right"] {
  opacity: 0;
  transform: translateX(24px);
  transition:
    opacity  0.6s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Skalierung (für Hero-Elemente, Bilder) */
[data-reveal="scale"] {
  opacity: 0;
  transform: scale(0.95);
  transition:
    opacity  0.7s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Alle Varianten: gleicher sichtbarer Zielstate */
[data-reveal="left"].is-visible,
[data-reveal="right"].is-visible,
[data-reveal="scale"].is-visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  [data-reveal="left"],
  [data-reveal="right"],
  [data-reveal="scale"] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

---

### Clip-Path Reveal

```css
.reveal-clip {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.reveal-clip.is-visible {
  clip-path: inset(0 0% 0 0);
}
```

### Spring-artige Skalierung

```css
.btn {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn:active {
  transform: scale(0.96);
}
```

---

## Layout-Muster die auffallen

### Asymmetrisches Grid

```css
.asymmetric-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto;
  gap: var(--space-400);
}

/* Grosses Feature-Element links, Sidebar rechts */
.feature { grid-row: span 2; }
```

### Oversized Typography-Section

```css
.hero-big-text {
  font-size: clamp(4rem, 15vw, 12rem);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.03em;
}
```

### Floating Elements mit Depth

```css
.floating-card {
  transform: perspective(1000px) rotateY(-5deg) rotateX(2deg);
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.floating-card:hover {
  transform: perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(20px);
}
```

---

## Farb-Systeme die funktionieren

### Analoges Farbschema (harmonisch)

Basis-Farbwinkel + 30° Abstand = immer harmonisch.

```css
:root {
  --hue-primary: 220;
  --color-primary: hsl(var(--hue-primary) 80% 55%);
  --color-secondary: hsl(calc(var(--hue-primary) + 30) 70% 50%);
  --color-accent: hsl(calc(var(--hue-primary) - 30) 90% 60%);
}
```

### Split-Complementary (spannungsvoll)

```css
:root {
  --color-primary: hsl(220 80% 55%);   /* Blau */
  --color-warm: hsl(35 90% 60%);       /* Gold */
  --color-hot: hsl(5 85% 58%);         /* Rot-Orange */
}
```

---

## Quellen & weiterführende Referenzen

- **Impeccable** (`/impeccable`) – 23 Befehle fuer UI-Polish, Audit, Animation
- **KZ Design Motion Principles** (`/design-motion-principles`) – Emil Kowalski, Jhey Tompkins Stil
- **Frontend Design Plugin** – Anthropics offizielles Plugin (global installiert)
- **Taste Skill** (`/design-taste-frontend`) – Anti-AI-Slop Guidance
- **UI/UX Pro Max** (`/ui-ux-pro-max`) – 50+ Stile, 161 Farbpaletten

---

*Push8 Awesome Design Guide – Stand Juni 2026*
