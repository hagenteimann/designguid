# Push8 Design System – Agent Instructions

Dieses Repository enthält verbindliche Design- und Coding-Regeln für Push8-Website-Projekte und interaktive Design-System-HTML-Dateien.

> Token-Referenz (immer geladen): @GUIDES/KERN/design-tokens-mini.md
> Für andere Agenten (Gemini, Codex, Cursor): @AGENTS.md

## Arbeitsverzeichnis – KRITISCH

- **`Projekt/`** → Hier wird gearbeitet. Alle neuen Dateien werden ausschließlich hier angelegt.
- **`Beispiele/`** → Nur lesen. Vorlagen und Referenz. Niemals bearbeiten.

> Datei aus `Beispiele/` als Vorlage → lesen, neue Datei in `Projekt/` anlegen.

## 5 harte Regeln

1. **Kein Code ohne Brief.** Bei jedem Website-Rebuild zuerst `GUIDES/KERN/PROJEKT_BRIEF.md` ausfüllen.
2. **Nie alle Guides laden.** Nur die relevanten – Orientierung via `guides-index.json`.
3. **Kein Magic Number.** Alle Abstände, Farben, Radien aus `GUIDES/KERN/design-tokens-mini.md`. Details → `GUIDES/KERN/DESIGN_SYSTEM.md`.
4. **Kein Deploy ohne Checkliste.** Go-Live-Checkliste in `GUIDES/KERN/DESIGN_SYSTEM.md` – alle Punkte abgehakt. Dann `./check.sh` ausführen.
5. **Kein Asset ohne Lizenz.** Erlaubte Quellen in `GUIDES/KERN/DESIGN_SYSTEM.md` → „Erlaubte Quellen".

## Track wählen

| Was will der User? | Track | Startpunkt |
|---|---|---|
| Design System / CD-Manual HTML bauen | `designsystem` | `GUIDES/KERN/DESIGNSYSTEM_STANDARD.md` |
| Website / Landing Page / Rebuild | `website` | `GUIDES/KERN/PROJEKT_BRIEF.md` |

→ Dann `guides-index.json` für den genauen Guide-Pfad nutzen.

## Aufgabe → Datei

### KERN (immer relevant)

| Aufgabe | Lies zuerst |
|---|---|
| Design System HTML aufbauen | `GUIDES/KERN/DESIGNSYSTEM_STANDARD.md` |
| Token-Werte schnell nachschlagen | `GUIDES/KERN/design-tokens-mini.md` |
| Design Tokens, Layout, Farben, Icons (Details) | `GUIDES/KERN/DESIGN_SYSTEM.md` |
| Website neu bauen / Rebuild | `GUIDES/KERN/PROJEKT_BRIEF.md` |
| Verbindliche Regeln | `GUIDES/KERN/RULES.md` |
| HTML/CSS Coding Conventions | `GUIDES/KERN/STYLE.md` |

### WEBSITE (bei Website-Projekten)

| Aufgabe | Lies zuerst |
|---|---|
| Autonomer Build (Ralph Loop) | `GUIDES/WEBSITE/RALPH_LOOP.md` |
| Navigation, Hamburger, Indikator | `GUIDES/WEBSITE/WORKFLOW_NAVIGATION.md` |
| Bilder / Videos / Assets | `GUIDES/WEBSITE/WORKFLOW_ASSETS.md` |
| Deployment + Git | `GUIDES/WEBSITE/WORKFLOW_DEPLOYMENT.md` |
| Design-Entscheidungen dokumentieren | `GUIDES/WEBSITE/WORKFLOW_CD_MANUAL.md` |
| CD-Manual HTML aufbauen (Standard) | `GUIDES/KERN/DESIGNSYSTEM_STANDARD.md` |
| Impressum / Datenschutz / AGB | `GUIDES/WEBSITE/RECHTLICHES.md` |
| Kontaktformular → Genie CRM | `GUIDES/WEBSITE/KONTAKTFORMULAR.md` |
| Funnel-Struktur / CTA-Logik | `GUIDES/WEBSITE/FUNNEL_STRATEGIE.md` |
| SEO | `GUIDES/WEBSITE/SEO.md` |
| Security / CSP | `GUIDES/WEBSITE/SECURITY.md` |
| QA vor Deploy | `GUIDES/WEBSITE/QA_TESTING.md` |
| Texte / Copy / Tone of Voice | `GUIDES/WEBSITE/CONTENT_GUIDELINES.md` |

### EXTENDED (nur bei Bedarf)

Analytics, Monitoring, API, Browser-Support → `GUIDES/EXTENDED/`

## Automatisierung

```bash
./check.sh        # Pre-deploy Checks (DSGVO, Assets, A11y, Rechtliches)
./ralph.sh        # Ralph Loop starten (.ralph-config anpassen)
```

## Wiedereinstieg in ein Projekt

1. `MEMORY.md` lesen (falls vorhanden) – komprimierter Kontext der letzten Session
2. `PLAN.md` prüfen (falls vorhanden) – offene Steps
3. Nur die in MEMORY.md genannten Guides laden
