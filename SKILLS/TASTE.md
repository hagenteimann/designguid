# design-taste-frontend – Anti-AI-Slop Kurzreferenz

Skill von Leonxlnx/taste-skill. Verhindert generischen KI-Output.

**Installation:** `npx skills@latest add Leonxlnx/taste-skill --global`

---

## Das Problem mit KI-Design

KI-Agenten tendieren zu denselben generischen Mustern:
- Inter als einziger Font
- Lila/blauer Gradient auf weißem Hintergrund
- `border-radius: 50%` auf Avataren
- 3-Spalten Card-Grids für alles
- Gleiche Abstände überall
- Shadows als Tiefen-Ersatz

Diese Muster sind erkennbar als "KI-Design" und untergraben Vertrauen.

---

## Verbotene Muster (nie verwenden)

```
FONT:
- Inter als einziger Font ohne Display-Schrift
- System-Font-Stack ohne Persönlichkeit

FARBE:
- #6366f1 (Indigo) als Primary
- Lila/blauer Gradient auf Weiß als Hero
- Weißer Hintergrund + bunte Cards ohne Struktur

LAYOUT:
- 3-Spalten Feature-Grid immer gleich
- Centered alles ohne Asymmetrie
- Gleiche Abstände für alles (kein Rhythmus)

KOMPONENTEN:
- border-radius: 50% auf quadratischen Elementen
- box-shadow als einzige Tiefen-Aussage
- Chevrons rechts bei jedem Link
- "Get Started" + "Learn More" als CTAs
```

---

## Stattdessen: Push8-Richtung

### Typografie
```css
/* Immer: charakterstarker Display-Font + lesbarer Text-Font */
--font-display: 'Fraunces', serif;    /* oder: Playfair, Cormorant, Syne */
--font-body: 'Instrument Sans', sans-serif; /* oder: DM Sans, Plus Jakarta */

/* Skala muss Kontrast haben */
--text-hero: clamp(48px, 8vw, 120px);
--text-body: 16px;
/* Kein mittelmäßiger 24px-Titel */
```

### Layout
```css
/* Asymmetrie bewusst einsetzen */
/* Nicht: 3 gleiche Spalten */
/* Besser: 7fr / 5fr oder 60% / 40% */

/* Vertikaler Rhythmus sichtbar */
--space-section: clamp(80px, 12vw, 160px);
--space-component: clamp(32px, 5vw, 64px);
```

### Farbe
```css
/* Immer: eigene Richtung, kein Standard-Indigo */
/* Warm Neutral + 1 Akzentfarbe */
--color-base: #F5F0E8;
--color-ink: #1A1614;
--color-accent: #C84B2F;  /* oder eigene Auswahl */
```

---

## Enthaltene Skills

| Skill | Einsatz |
|---|---|
| `design-taste-frontend` | Standard Anti-Slop bei jedem UI |
| `stitch-design-taste` | Semantic Design System (Google Stitch) |
| `gpt-taste` | GSAP ScrollTrigger, AIDA, Editorial |
| `high-end-visual-design` | Agency-Niveau, teuer wirken |
| `minimalist-ui` | Editorial, Warm-Monochrome |
| `industrial-brutalist-ui` | Swiss Typ, Military Terminal |
| `impeccable` | Audit + Polish (23 Befehle) |
| `image-to-code` | Bild → präziser Code |
| `imagegen-frontend-web` | Sektion-für-Sektion Bilder |
| `imagegen-frontend-mobile` | Mobile App Konzepte |
| `redesign-existing-projects` | Upgrade bestehender Sites |

---

## Workflow: Neues UI

```
1. design-taste-frontend laden (Stil-Richtung festlegen)
2. Font-Kombination wählen (Display + Body, nie nur Inter)
3. Eigene Farbpalette definieren (kein Standard-Indigo)
4. Asymmetrisches Layout-Konzept
5. Bauen
6. /impeccable audit (Qualität prüfen)
7. Bei Animationen: design-motion-principles
```
