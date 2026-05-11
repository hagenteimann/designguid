# Design System & Coding Agent Guide – Version 4.0

Verbindliche Design- und Coding-Regeln für alle Push8-Projekte. Dieser Guide wird von KI-Agenten vor dem ersten Code-Schritt gelesen und befolgt.

---

## Phase 0: Agent-Initialisierung

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

### Spacing – 8pt Grid

Alle Abstände basieren auf einem 8pt-Raster. Verwende CSS-Custom-Properties:

```css
:root {
  --space-100:  4px;
  --space-200:  8px;
  --space-300: 16px;
  --space-400: 24px;
  --space-500: 32px;
  --space-600: 48px;
  --space-700: 64px;
  --space-800: 96px;
}
```

Fluid Spacing mit `clamp()`:
```css
.section-padding {
  padding: clamp(var(--space-500), 5vw, var(--space-800));
}
```

### Farbskala – 25% Steps

Skala 0–700, wobei **300 = Base** (Markenfarbe). Jede Stufe ist 25% heller oder dunkler:

```css
:root {
  /* Beispiel Primärfarbe */
  --color-primary-100: hsl(220, 80%, 95%);
  --color-primary-200: hsl(220, 80%, 85%);
  --color-primary-300: hsl(220, 80%, 60%); /* BASE */
  --color-primary-400: hsl(220, 80%, 45%);
  --color-primary-500: hsl(220, 80%, 30%);
  --color-primary-600: hsl(220, 80%, 20%);
  --color-primary-700: hsl(220, 80%, 10%);

  /* Neutral */
  --color-neutral-100: hsl(0, 0%, 97%);
  --color-neutral-200: hsl(0, 0%, 90%);
  --color-neutral-300: hsl(0, 0%, 70%);
  --color-neutral-400: hsl(0, 0%, 50%);
  --color-neutral-500: hsl(0, 0%, 30%);
  --color-neutral-600: hsl(0, 0%, 15%);
  --color-neutral-700: hsl(0, 0%, 5%);
}
```

### Bento-Box Ratios

Feste Seitenverhältnisse für alle Bento-Grid-Elemente:

| Format | Ratio | Verwendung |
|---|---|---|
| Quadrat | 1:1 | Icons, Profilbilder, kleine Feature-Kacheln |
| Widescreen | 16:9 | Videos, Hero-Media, große Feature-Kacheln |
| Portrait | 4:5 | Mobile-Hero, Social-Content-Kacheln |
| Landscape | 3:2 | Blog-Vorschau, Projekt-Thumbnails |

```css
.bento-square   { aspect-ratio: 1 / 1; }
.bento-wide     { aspect-ratio: 16 / 9; }
.bento-portrait { aspect-ratio: 4 / 5; }
.bento-card     { aspect-ratio: 3 / 2; }
```

### Assets & Performance

- **Format-Pflicht:** WebP für Fotos, SVG für Icons und Logos. Kein PNG/JPG in Production.
- **Bildkompression:** Agent komprimiert Bilder automatisch, wenn > 500KB. Ziel: max. 200KB für Desktop, max. 100KB für Mobile.
- **Videokompression:** Videos müssen komprimiert werden, wenn > 5MB. Ziel: max. 2MB für Desktop, max. 1MB für Mobile. Codec: H.264 (MP4), 30fps max.
- **Responsive Bilder:** Mit `<picture>` + `srcset` arbeiten für verschiedene Bildschirmgrößen.
- **Touch-Targets:** Mindestgröße 48x48px für alle interaktiven Elemente.
- **Skeleton Screens:** Vor dem Laden realer Daten immer einen Skeleton-Platzhalter zeigen (siehe Empty States).
- **Lazy Loading:** `loading="lazy"` auf alle Bilder außer dem LCP-Element (Hero).

### Barrierefreiheit (A11y)

- **Kontrast:** Mindestens **4.5:1** für Text auf Hintergrund (WCAG AA). Immer prüfen.
- **Focus-Styles:** Nie `outline: none` ohne eigenen Focus-Stil.
- **Alt-Texte:** Jedes Bild mit aussagekräftigem `alt`-Attribut.
- **ARIA-Labels:** Alle Buttons/Links ohne sichtbaren Text bekommen ein `aria-label`.

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
  background: linear-gradient(
    90deg,
    var(--color-neutral-200) 25%,
    var(--color-neutral-100) 50%,
    var(--color-neutral-200) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
  border-radius: var(--space-200);
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

## Checkliste vor dem Go-Live

- [ ] Alle Abstände aus Token-System, keine Magic Numbers
- [ ] 3-Column Grid auf Desktop, Single Column auf Mobile getestet
- [ ] Kontrast 4.5:1 geprüft
- [ ] Alle Bilder in WebP, SVGs optimiert
- [ ] Touch-Targets mind. 48px
- [ ] Skeleton Screens für alle async-geladenen Bereiche
- [ ] Empty States für alle Listen/Filter-Bereiche
- [ ] Alt-Texte vollständig
- [ ] Ankerlinks und Navigation synchron

---

*Design System Agent V4.0 – Push8 Web Agency – Stand Mai 2026*
