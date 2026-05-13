# Workflow: CD-Manual (Design-Entscheidungen dokumentieren)

**Konsolidiert aus: CD_MANUAL_WORKFLOW.md**

---

## Übersicht

Das **Corporate Design Manual (CD-Manual)** ist eine **interaktive HTML-Datei**, die alle Design- und UX-Entscheidungen dokumentiert.

**Agent-Verhalten:**
- Fragt aktiv nach CD-Manual bei Design-Entscheidungen
- Prüft, ob neue Entscheidungen bereits dokumentiert sind
- Aktualisiert CD-Manual auf User-Bestätigung

---

> **Im Ralph Loop:** CD-Manual wird vom Implementer-Agent automatisch nach jedem Step aktualisiert – kein separater Workflow nötig. Jeder Step im PLAN.md enthält ein "Dokumentieren:"-Feld das vorschreibt was eingetragen wird. → [RALPH_LOOP.md](./RALPH_LOOP.md)

## Agent-Workflow

### 1. Beim Projekt-Start
```
Agent fragt:
"Existiert bereits ein CD-Manual für dieses Projekt?
Falls ja: Wo liegt die Datei? (Link/Pfad)"
```

### 2. Bei Design-Entscheidung
```
User: "Primary Button Color = #FF6B35"

Agent:
1. Prüft CD-Manual: Ist das schon dokumentiert?
2. Nein? Fragt:
   "Soll ich das jetzt dokumentieren?
    a) Neu dokumentieren
    b) Bestehende Regel ändern
    c) Nicht ins Manual"
3. User bestätigt
4. CD-Manual aktualisiert
5. Message: "✅ CD-Manual aktualisiert"
```

---

## CD-Manual Struktur

### HTML Template

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>CD-Manual – [Projektname]</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI"; }
    .decision { border: 1px solid #eee; padding: 1rem; margin: 1rem 0; }
    .category { border-left: 4px solid #007bff; padding-left: 1rem; }
    .timestamp { font-size: 0.85rem; color: #666; }
  </style>
</head>
<body>
  <h1>Corporate Design Manual</h1>
  <p><strong>Projekt:</strong> [Projektname]</p>
  <p><strong>Zuletzt aktualisiert:</strong> <span id="lastUpdate">2026-05-11</span></p>

  <nav>
    <h2>Kategorien</h2>
    <ul id="categories"></ul>
  </nav>

  <main id="decisions"></main>

  <script>
    const decisions = [];
    // Agent fügt Decisions via JavaScript hinzu
  </script>
</body>
</html>
```

### Entscheidungs-Eintrag

```html
<section class="decision category-farben">
  <h3>Entscheidung: Primary Button Color</h3>

  <p><strong>Kategorie:</strong> Farbpalette</p>
  <p><strong>Entscheidung:</strong> #FF6B35 (Orange)</p>
  <p><strong>Begründung:</strong> Hoher Kontrast, auffällig, performant</p>
  <p><strong>Datum:</strong> 2026-05-11</p>
  <p><strong>Anwendung:</strong> Alle Primary Buttons, CTAs</p>

  <details>
    <summary>Verwandte Entscheidungen</summary>
    <ul>
      <li><a href="#button-styles">Button Styles</a></li>
      <li><a href="#color-palette">Farbpalette</a></li>
    </ul>
  </details>
</section>
```

---

## Kategorien

| Kategorie | Beispiele |
|-----------|-----------|
| **Farbpalette** | Primary, Secondary, Neutral, Error |
| **Typografie** | Font-Familie, Größen, Gewichte |
| **Spacing** | Padding, Margin, Gap (8pt Grid) |
| **Komponenten** | Buttons, Cards, Navigation |
| **Icons** | Icon-Set, Größen, Farben |
| **Responsive** | Breakpoints, Mobile Stacking |
| **Accessibility** | Contrast, Focus States |
| **UX-Patterns** | Forms, Modals, Loading States |

---

## Agent-Checkliste bei Entscheidung

```
1. ✅ Ist das bereits im CD-Manual dokumentiert?
2. ✅ Falls nein: User fragen, ob dokumentieren?
3. ✅ Entscheidung + Begründung hinzufügen
4. ✅ Kategorie richtig setzen
5. ✅ Timestamp aktualisieren
6. ✅ Verwandte Entscheidungen verlinken
7. ✅ HTML neu generieren (interaktiv)
8. ✅ User benachrichtigen: "✅ CD-Manual aktualisiert"
```

---

## Versionierung

### Alte Versionen speichern
```
cd-manual/
├── index.html           (← Aktuelle Version)
└── versions/
    ├── v1-2026-05-01.html
    ├── v2-2026-05-05.html
    └── v3-2026-05-11.html
```

### Versions-Eintrag
```json
{
  "version": "3",
  "date": "2026-05-11",
  "changes": [
    "Added: Dark mode colors",
    "Changed: Primary button size",
    "Fixed: Focus state contrast"
  ]
}
```

---

## Integration mit Deployment

**Beim Deploy:**
```
1. Website deployen zu Webspace
2. Git Push
3. CD-Manual aktualisieren? (optional)
4. Changelog updaten (wer hat was geändert?)
```

**CD-Manual Eintrag für Deploy:**
```
- Kategorie: Deployment
- Entscheidung: Version 1.2.0 deployed
- Inhalt: [Link zu Commit]
- Features: Dark mode, Testimonials
- Datum: 2026-05-11
```

---

## Zusammenarbeit

### Für Designer
- CD-Manual öffnen → Design-Entscheidungen sehen
- Neue Entscheidung? → Agent dokumentiert automatisch

### Für Developer
- CD-Manual öffnen → Design-Tokens/Werte sehen
- Implementierung anhand CD-Manual

### Für Manager/Client
- CD-Manual öffnen → Historie der Entscheidungen
- Warum wurde das so entschieden?

---

## Beispiel: Dark Mode Entscheidung

**User:** "Wir brauchen Dark Mode"

**Agent:**
```
1. Prüft CD-Manual: Ist "Dark Mode" dokumentiert? Nein.
2. Fragt: "Soll ich Dark Mode Entscheidungen dokumentieren?"
3. User: "Ja"
4. Agent erstellt Einträge:

   Entscheidung 1: Dark Mode Background
   - Kategorie: Farbpalette
   - Entscheidung: #1a1a1a (fast schwarz)
   - Begründung: WCAG AA Kontrast, angenehm für Augen
   - Verwandt mit: Dark Mode Text Color

   Entscheidung 2: Dark Mode Text Color
   - Kategorie: Farbpalette
   - Entscheidung: #f5f5f5 (fast weiß)
   - Begründung: 4.5:1 Kontrast auf #1a1a1a
   - Verwandt mit: Dark Mode Background

5. CD-Manual wird regeneriert
6. "✅ Dark Mode in CD-Manual dokumentiert (2 neue Entscheidungen)"
```

---

*Workflow: CD-Manual – Push8 Web Agency – Stand Mai 2026*
