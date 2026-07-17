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

### 0.3 – Design-Entscheidungen ableiten

Drei Felder – mehr nicht. Alles andere ergibt sich aus dem Projekt-Typ-Bundle oder ist Standard.

```
DESIGN-ENTSCHEIDUNGEN
─────────────────────────────────────────────
Projekt-Typ:
  [ ] local-service   [ ] portfolio   [ ] ecommerce   [ ] saas   [ ] corporate

TON (leer = "Klar, authentisch, aktiv"):
  ________________________________  Grund: ________________________________

PRIMÄRFARBE (leer = aus Kontext ableiten):
  #______  Grund: ________________________________

MOTION (leer = Standard):
  [ ] Standard (Parallax + Reveal)  [ ] Subtil (kein Parallax)  [ ] Keine

ABOVE-THE-FOLD-ZIEL:   ________________________________
PRIMÄRER CTA:          ________________________________  →  ________________________________
VERTRAUENSELEMENTE:    1. ________  2. ________  3. ________

SEKTIONEN:  1. Hero  2.________  3.________  4.________  5.________
```

**Regel:** Accessibility / Security / Legal nie überschreibbar. Alles andere mit Begründung änderbar.

### 0.4 – Guides automatisch auswählen

Projekt-Typ aus 0.3 → Bundle aus `guides-index.json` `project-types` laden. Dann ergänzen:

```
GUIDES FÜR DIESES PROJEKT
─────────────────────────────────────────────
Bundle (Projekt-Typ):   _______________ (aus guides-index.json)
Enthält automatisch:    _______________

Zusätzlich laden:
[ ] tone_of_voice.md        – wenn Texte miterstellt werden
[ ] components.md           – wenn Video/Bild-Optimierung nötig
[ ] qa_testing.md           – bei erhöhter A11y-Anforderung
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
4. **Token-Mapping dokumentieren.** Jede Farbentscheidung braucht eine Begründung aus 0.1 or 0.2.
5. **Sektionen bestätigen lassen.** Reihenfolge vor dem Coding freigeben lassen.
6. **Keine parallelen Entscheidungen.** Entweder altes Design weiterverwenden oder neu ableiten – nicht beides gleichzeitig.

---

## Verbindung zur Automation

Dieser Brief ist die Pflichtbasis für jeden automatisierten Build. Nach Phase 2 (Sektionen bestätigt) wird aus dem Brief direkt der **PLAN.md** generiert:

- Jede Section aus 0.3 → ein Step im PLAN.md
- Token-Mapping aus Phase 1 → Step 1 im PLAN.md
- Relevante Guides aus 0.4 → werden pro Step geladen, nicht alle auf einmal

→ Wie PLAN.md strukturiert sein muss: **[automation.md](../03_EXECUTION/technical/automation.md)**

---

*Website Guide – Stand Mai 2026*
