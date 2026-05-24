# Push8 Designguid – Claude Code Instructions

Dieses Repo ist der zentrale Wissens-Hub fuer Push8-Webprojekte. Lies diese Datei komplett bevor du irgendetwas tust.

---

## Pflichtlektuere beim Start

1. `GUIDES/CONTEXT.md` – Wer ist Push8, wie wird gearbeitet?
2. `GUIDES/RULES.md` – 10 verbindliche Regeln
3. `GUIDES/IDENTITY.md` – Marke, Tonalitaet, Visuelles System
4. `GUIDES/DESIGN_SYSTEM.md` – Tokens, Layout, Components

Bei Projektarbeit zusaetzlich:
- `GUIDES/PROJEKT_BRIEF.md` – zuerst ausfuellen
- `QUICK_START.md` – Workflow-Uebersicht

---

## Skill Auto-Trigger fuer Push8-Projekte

### Frontend bauen

Bei jeder Arbeit an HTML/CSS/JS oder einem Framework:
- Lade `frontend-design` Plugin (global aktiv – gibt Designrichtung vor)
- Lade `design-taste-frontend` → verhindert generisches AI-Output

### Design-Qualitaet sichern

| Situation | Skill |
|---|---|
| Design wirkt generisch / langweilig | `/impeccable audit` |
| Design verbessern, polishen | `/impeccable polish` |
| Font/Farbe/Spacing Entscheidung | `/impeccable distill` |
| Animation einbauen | `design-motion-principles` (Create-Mode) |
| Bestehende Animationen pruefen | `design-motion-principles` (Audit-Mode → HTML-Report) |
| Neues UI von Grund auf | `ui-ux-pro-max` |

### Rebuild-Workflow (Ralph Loop)

```
1. PROJEKT_BRIEF.md ausfuellen
2. Skill: design-taste-frontend laden (gibt Stil-Richtung)
3. Tokens ableiten → DESIGN_SYSTEM.md
4. Bauen (mit frontend-design Plugin aktiv)
5. Impeccable Audit → Qualitaet sichern
6. Deploy-Checkliste abarbeiten
```

---

## Push8 Design-Verbote (immer aktiv)

- Kein `Inter` als einziger Font – immer ein charakterstarker Display-Font dazu
- Kein lila/blauer Gradient auf weissem Hintergrund als Standard-Hero
- Kein `border-radius: 50%` auf quadratischen UI-Elementen → Squircle verwenden
- Keine Magic Numbers in CSS → Token-System
- Kein `100vh` auf Mobile → `100svh`
- Kein Google Fonts CDN → Self-hosted WOFF2
- Kein `!important` im CSS
- Keine CDN-Scripts ohne DSGVO-Pruefung

---

## Projekt-Brief Pflicht

**Kein Code ohne ausgefuellten Projekt-Brief.**

Wenn ein Rebuild oder Neubau gestartet wird:
→ `GUIDES/PROJEKT_BRIEF.md` oeffnen und Phase 0 komplett ausfuellen.

---

## Dateipfade Quick-Reference

| Was | Wo |
|---|---|
| Design Tokens, Layout | `GUIDES/DESIGN_SYSTEM.md` |
| Marke & Voice | `GUIDES/IDENTITY.md` |
| Agent-Kontext | `GUIDES/CONTEXT.md` |
| Code-Conventions | `GUIDES/STYLE.md` |
| Verbindliche Regeln | `GUIDES/RULES.md` |
| Design-Inspiration | `GUIDES/AWESOME_DESIGN.md` |
| Rechtliches | `GUIDES/RECHTLICHES.md` |
| Ralph Loop | `GUIDES/RALPH_LOOP.md` |
| Beispiel-HTML | `Beispiele/` |
| Skills & Plugins | `SKILLS/README.md` |
