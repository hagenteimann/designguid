# Push8 Design System – Agent Instructions

Dieses Repository enthält verbindliche Design- und Coding-Regeln für Push8-Website-Projekte.

> Token-Referenz (immer geladen): @GUIDES/design-tokens-mini.md
> Für andere Agenten (Gemini, Codex, Cursor): @AGENTS.md

## Arbeitsverzeichnis – KRITISCH

- **`Projekt/`** → Hier wird gearbeitet. Alle neuen Dateien, Seiten und Komponenten werden ausschließlich hier angelegt.
- **`Beispiele/`** → Nur lesen. Dienen als Vorlagen und Referenz. Niemals bearbeiten oder überschreiben.

> Wenn der User eine Datei aus `Beispiele/` als Vorlage nennt → Inhalt lesen, neue Datei in `Projekt/` anlegen.

## 5 harte Regeln

1. **Kein Code ohne Brief.** Bei jedem Rebuild zuerst `GUIDES/PROJEKT_BRIEF.md` ausfüllen.
2. **Nie alle Guides laden.** Nur die relevanten – Orientierung via `guides-index.json`.
3. **Kein Magic Number.** Alle Abstände, Farben, Radien aus `GUIDES/design-tokens-mini.md` (immer geladen). Details → `GUIDES/DESIGN_SYSTEM.md`.
4. **Kein Deploy ohne Checkliste.** Go-Live-Checkliste in `GUIDES/DESIGN_SYSTEM.md` – alle Punkte abgehakt. Dann `./check.sh` ausführen.
5. **Kein Asset ohne Lizenz.** Erlaubte Quellen in `GUIDES/DESIGN_SYSTEM.md` Abschnitt „Erlaubte Quellen".

## Aufgabe → Datei

| Aufgabe | Lies zuerst |
|---|---|
| Website neu bauen / Rebuild | `GUIDES/PROJEKT_BRIEF.md` |
| Autonomer Build (Ralph Loop) | `GUIDES/RALPH_LOOP.md` |
| Token-Werte schnell nachschlagen | `GUIDES/design-tokens-mini.md` |
| Design Tokens, Layout, Farben, Icons (Details) | `GUIDES/DESIGN_SYSTEM.md` |
| Navigation, Hamburger, Indikator | `GUIDES/WORKFLOW_NAVIGATION.md` |
| Bilder / Videos / Assets | `GUIDES/WORKFLOW_ASSETS.md` |
| Deployment + Git | `GUIDES/WORKFLOW_DEPLOYMENT.md` |
| Impressum / Datenschutz / AGB | `GUIDES/RECHTLICHES.md` |
| Kontaktformular → Genie CRM | `GUIDES/KONTAKTFORMULAR.md` |
| Funnel-Struktur / CTA-Logik | `GUIDES/FUNNEL_STRATEGIE.md` |
| SEO | `GUIDES/SEO.md` |
| Security / CSP | `GUIDES/SECURITY.md` |
| QA vor Deploy | `GUIDES/QA_TESTING.md` |
| Texte / Copy / Tone of Voice | `GUIDES/CONTENT_GUIDELINES.md` |
| Design-Entscheidungen dokumentieren | `GUIDES/WORKFLOW_CD_MANUAL.md` |

## Automatisierung

```bash
./check.sh        # Pre-deploy Checks (DSGVO, Assets, A11y, Rechtliches)
./ralph.sh        # Ralph Loop starten (.ralph-config anpassen)
```

## Wiedereinstieg in ein Projekt

1. `MEMORY.md` lesen (falls vorhanden) – komprimierter Kontext der letzten Session
2. `PLAN.md` prüfen (falls vorhanden) – offene Steps
3. Nur die in MEMORY.md genannten Guides laden

## Für Gemini und andere Agenten

→ `QUICK_START.md`
