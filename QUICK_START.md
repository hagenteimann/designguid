# Quick Start für Agenten

**Schritt 1: Track wählen**

| Was soll gebaut werden? | Track | Startpunkt |
|---|---|---|
| Interaktives Design System / CD-Manual HTML | `designsystem` | `GUIDES/KERN/DESIGNSYSTEM_STANDARD.md` |
| Website / Landing Page / Rebuild | `website` | `GUIDES/KERN/PROJEKT_BRIEF.md` |

**Schritt 2: Nur die nötigen Guides laden** → `guides-index.json` nutzen, nie alle Guides auf einmal.

**Schritt 3: Token-Mini immer griffbereit** → `GUIDES/KERN/design-tokens-mini.md` (wird auto-geladen)

---

## Track A: Design System HTML

Ziel: Eine offline-fähige, interaktive HTML-Datei die per Doppelklick lokal läuft.

```
1. GUIDES/KERN/DESIGNSYSTEM_STANDARD.md lesen  ← Aufbau + alle Regeln
2. Kundendaten klären: Farben, Fonts, Logo
3. Projekt/[Kunde]_designsystem.html anlegen (Struktur: Beispiele/Arche_designsystem.html)
4. Sektionen 01–09 aufbauen (Reihenfolge fix)
5. Fonts als base64 einbetten (kein CDN!)
6. Alle Motion-Demos lokal testen (Doppelklick)
```

Guides für diesen Track:
- `GUIDES/KERN/DESIGNSYSTEM_STANDARD.md` – Aufbau, Regeln, Checkliste
- `GUIDES/KERN/DESIGN_SYSTEM.md` – Tokens, Details, Komponenten
- `GUIDES/KERN/design-tokens-mini.md` – Schnellreferenz
- `GUIDES/WEBSITE/WORKFLOW_CD_MANUAL.md` – Design-Entscheidungen dokumentieren

---

## Track B: Website / Rebuild

Ziel: Fertige Push8-Website deployed auf Webspace.

```
1. GUIDES/KERN/PROJEKT_BRIEF.md ausfüllen  ← Pflicht vor erstem Code
2. guides-index.json → project-type wählen → relevante Guides laden
3. Token-Mapping: Primärfarbe, Fonts, Radius eintragen
4. Sektionen-Reihenfolge vorlegen + bestätigen
5. HTML/CSS schreiben (nur markierte Guides aktiv)
6. ./check.sh vor Deploy
```

Guides für diesen Track:
- `GUIDES/KERN/PROJEKT_BRIEF.md` – Phase 0 Analyse
- `GUIDES/WEBSITE/FUNNEL_STRATEGIE.md` – Seitenstruktur + CTAs
- `GUIDES/WEBSITE/RECHTLICHES.md` – Impressum, Datenschutz, AGB
- `GUIDES/WEBSITE/WORKFLOW_NAVIGATION.md` – Navigation + Sections
- `GUIDES/WEBSITE/WORKFLOW_ASSETS.md` – Bilder, Videos
- `GUIDES/WEBSITE/WORKFLOW_DEPLOYMENT.md` – Deploy + Git
- `GUIDES/WEBSITE/SEO.md`, `SECURITY.md`, `QA_TESTING.md` – bei Bedarf

---

## Wiedereinstieg in ein laufendes Projekt

```
1. MEMORY.md lesen (falls vorhanden)  ← komprimierter Kontext
2. PLAN.md prüfen (falls vorhanden)   ← offene Steps
3. Nur die in MEMORY.md genannten Guides laden
```

---

## Automation

```bash
./check.sh   # Pre-deploy: DSGVO, Assets, A11y, Rechtliches
./ralph.sh   # Ralph Loop (autonomer Build mit Validator-Agent)
```

---

## Ordner auf einen Blick

| Ordner | Inhalt | Wann laden |
|---|---|---|
| `GUIDES/KERN/` | Tokens, Design System, Regeln | Immer |
| `GUIDES/WEBSITE/` | Funnel, SEO, Deploy, Legal... | Bei Website-Projekten |
| `GUIDES/EXTENDED/` | Analytics, API, Browser... | Nur bei Bedarf |
| `CHECKLISTS/` | 1-Seiter für schnelle Checks | Als Gedächtnisstütze |
| `TEMPLATES/` | Plan-Vorlagen | Bei neuem Projekt-Plan |
| `Beispiele/` | Fertige Design System HTML | Nur lesen – nie bearbeiten |
| `Projekt/` | Neue Projektdateien | Hier wird gearbeitet |

---

*Push8 Web Agency – Stand Juni 2026*
