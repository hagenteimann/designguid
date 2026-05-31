# Projekt-Brief – Website Rebuild Workflow

Dieser Guide regelt den Prozess, wenn eine bestehende Website neu gebaut werden soll.
**Der Agent füllt diesen Brief aus, bevor er einen einzigen Guide liest oder Code schreibt.**

> **TL;DR**
> - Phase 0 zuerst: alte Website analysieren → Zielgruppe ableiten → Entscheidungen dokumentieren
> - Danach: Token-Mapping, Sektionen bestätigen lassen, dann erst Code
> - Projekt schlägt Generic-Guide – Zielgruppe entscheidet, nicht das Template
> - Anschließend PLAN.md aus `TEMPLATES/` auswählen und anpassen

---

## Warum dieser Brief zuerst?

Generische Design-Regeln (Token-System, Grid, Komponenten) sind Werkzeuge – kein Ziel.
Ohne Projekt-Brief konkurrieren sie mit dem, was die alte Website zeigt und was die Zielgruppe braucht.
Erst wenn dieser Brief vollständig ist, ist klar, welche Regeln gelten und welche angepasst werden.

---

## Phase 0: Brief ausfüllen (vor allem anderen)

### 0.1 – Alte Website analysieren

Agent untersucht die alte Website und dokumentiert:

```
ALTE WEBSITE
─────────────────────────────────────────────
URL / Dateipfad:
Primäre Schwächen:
  - [ ] Kein klarer CTA
  - [ ] Veraltetes Layout
  - [ ] Schlechte Mobile-Darstellung
  - [ ] Unklare Zielgruppenansprache
  - [ ] Zu langsam (Performance)
  - [ ] Sonstiges: ___

Was funktioniert / behalten:
  - Farbe/Branding:
  - Vertrauenselemente (Logos, Zertifikate, Testimonials):
  - Inhalte die gut performen:

Vorhandene Farbcodes:
  Primär:    #______
  Sekundär:  #______
  Hintergrund: #______
```

### 0.2 – Zielgruppe ableiten

Agent analysiert oder fragt nach Zielgruppe und dokumentiert:

```
ZIELGRUPPE
─────────────────────────────────────────────
Persona (kurz):
Alter / technische Affinität:
Entscheidungstreiber (sortiert nach Priorität):
  1.
  2.
  3.
Primäres Gerät: [ ] Desktop  [ ] Mobile  [ ] Beides
Sprache / Ton der Ansprache: [ ] Sachlich  [ ] Emotional  [ ] Premium  [ ] Locker
Größter Einwand vor dem Kauf/Kontakt:
```

### 0.3 – Design-Persona-Matrix

Aus 0.1 und 0.2 wird eine **Design-Persona-Matrix** abgeleitet. Jede Abweichung vom Push8-Standard braucht eine Begründung. Ohne Begründung gilt der Standard.

```
DESIGN-PERSONA MATRIX
─────────────────────────────────────────────
Projekt-Typ:
  [ ] local-service   (Handwerker, Dienstleister, lokale Geschäfte)
  [ ] portfolio       (Freelancer, Kreative, Agenturen)
  [ ] ecommerce       (Online-Shops, Produkt-Websites)
  [ ] saas            (Software-Produkte, Apps, Tools)
  [ ] corporate       (Unternehmen, B2B, Konzerne)

TON
  Push8-Standard:     Klar, authentisch, aktiv
  Dieses Projekt:     ________________________________
  Override-Grund:     ________________________________  ← leer = Standard

PRIMÄRFARBE
  Push8-Standard:     Aus Projekt-Kontext (HSL-Skala)
  Dieses Projekt:     #______
  Override-Grund:     ________________________________  ← leer = Standard

TYPOGRAFIE
  Push8-Standard:     Inter, selbst gehosted
  Dieses Projekt:     ________________________________
  Override-Grund:     ________________________________  ← leer = Standard beibehalten

MOTION / ANIMATION
  Push8-Standard:     Paragraph-Reveal + Parallax-Hero
  Dieses Projekt:     [ ] Standard  [ ] Subtil (20px statt 60px)  [ ] Deaktiviert
  Override-Grund:     ________________________________  ← leer = Standard

SQUIRCLES
  Push8-Standard:     border-radius: 28% (quintic)
  Dieses Projekt:     [ ] Standard  [ ] Klassisch (px-Radien)
  Override-Grund:     ________________________________  ← leer = Standard

INFORMATIONSDICHTE
  Push8-Standard:     Sparse (viel Whitespace, < 3 Infos pro Viewport)
  Dieses Projekt:     [ ] Sparse  [ ] Medium  [ ] Dense
  Override-Grund:     ________________________________  ← leer = Standard

ABOVE-THE-FOLD-ZIEL
  Was muss in den ersten 3 Sekunden sichtbar sein:
  ________________________________

PRIMÄRER CTA
  Text:               ________________________________
  Ziel (URL/Aktion):  ________________________________

VERTRAUENSELEMENTE
  Wichtigste (max 3): 1. ____  2. ____  3. ____

SEKTIONEN-REIHENFOLGE
  1. Hero
  2.
  3.
  4.
  5.
  6.
```

**Regel:** Schicht 1 (Accessibility, Security, Legal) ist nie überschreibbar. Schicht 2 (Push8-Defaults) kann mit Begründung überschrieben werden. Schicht 3 (Persona-Matrix) ist projektspezifisch.

### 0.4 – Guides automatisch auswählen

Projekt-Typ aus 0.3 → Bundle aus `guides-index.json` `project-types` laden. Dann ergänzen:

```
GUIDES FÜR DIESES PROJEKT
─────────────────────────────────────────────
Bundle (Projekt-Typ):   _______________ (aus guides-index.json)
Enthält automatisch:    _______________

Zusätzlich laden:
[ ] CONTENT_GUIDELINES.md   – wenn Texte miterstellt werden
[ ] WORKFLOW_ASSETS.md      – wenn Video/Bild-Optimierung nötig
[ ] ACCESSIBILITY_TESTING.md – bei erhöhter A11y-Anforderung
[ ] Sonstiges: ___
```

**Alle anderen Guides werden nicht geladen** – sie stehen bei Bedarf zur Verfügung, belasten aber nicht den Kontext.

---

## Phase 1: Token-Mapping (alte Website → neues System)

Vor dem Coding werden die Werte aus 0.3 direkt in CSS-Token übertragen:

```css
:root {
  /* Abgeleitet aus Zielgruppenanalyse, nicht aus Standard-Template */
  --color-primary-300: /* Primärfarbe aus 0.3 */;

  /* Aus alter Website übernommen / angepasst */
  --color-brand-trust: /* Vertrauensfarbe, wenn vorhanden */;

  /* Spacing & Radius nach Design System – keine Anpassung nötig */
  --space-300: 16px;
  --radius-squircle: 28%;
}
```

Erst wenn das Token-Mapping dokumentiert ist, beginnt der erste HTML/CSS-Block.

---

## Phase 2: Sektionen-Reihenfolge bestätigen

Agent legt Sektionen-Reihenfolge aus 0.3 vor und wartet auf Bestätigung:

```
Geplante Sektionen:
1. Hero – [CTA-Text] → [Ziel]
2. Problem / Schmerz der Zielgruppe
3. Lösung / Leistungen
4. Vertrauen (Logos, Testimonials)
5. CTA / Kontakt

Bestätigung abwarten bevor mit Coding begonnen wird.
```

---

## Regeln für den gesamten Rebuild-Prozess

1. **Brief vor Code.** Kein HTML ohne ausgefüllte Phase 0.
2. **Projekt schlägt Guide.** Wenn die Zielgruppe sachliche Ansprache braucht, gilt das – auch wenn ein Generic-Template etwas anderes zeigt.
3. **Minimal-Guides.** Nur die in 0.4 markierten Guides werden aktiv gelesen.
4. **Token-Mapping dokumentieren.** Jede Farbentscheidung braucht eine Begründung aus 0.1 oder 0.2.
5. **Sektionen bestätigen lassen.** Reihenfolge vor dem Coding freigeben lassen.
6. **Keine parallelen Entscheidungen.** Entweder altes Design weiterverwenden oder neu ableiten – nicht beides gleichzeitig.

---

---

## Verbindung zum Ralph Loop

Dieser Brief ist die Pflichtbasis für jeden Ralph Loop Build. Nach Phase 2 (Sektionen bestätigt) wird aus dem Brief direkt der **PLAN.md** generiert:

- Jede Section aus 0.3 → ein Step im PLAN.md
- Token-Mapping aus Phase 1 → Step 1 im PLAN.md
- Relevante Guides aus 0.4 → werden pro Step geladen, nicht alle auf einmal

→ Wie PLAN.md strukturiert sein muss: **[RALPH_LOOP.md](./RALPH_LOOP.md)**

---

*Push8 Website Guide – Stand Mai 2026*
