# Push8 – Skills & Plugins Referenz

Dieser Ordner dokumentiert alle Skills und Plugins, die Push8-Agenten installieren und verwenden sollen.

---

## Schnell-Übersicht

| Kategorie | Anzahl | Zweck |
|---|---|---|
| Plugins | 3 | MCP-Server, Tool-Erweiterungen |
| Design-Skills | 6+ | UI-Qualität, Anti-AI-Slop |
| Code-Qualität | 6 | Testing, Review, Debugging |
| Workflow | 3 | Planung, Dispatch, Git |

---

## Plugins installieren

Plugins sind MCP-Server-Erweiterungen für Claude Code. Global installieren:

```bash
claude plugin add figma
claude plugin add frontend-design
claude plugin add playwright
```

### Plugin-Liste

| Plugin | Zweck | Wann verwenden |
|---|---|---|
| `figma` | Figma MCP – Design lesen/schreiben, Code Connect | Figma-URL vorhanden, Design implementieren, in Figma pushen |
| `frontend-design` | Anthropics offizielles Frontend-Design-Plugin | Immer bei HTML/CSS/JS-Arbeit |
| `playwright` | Browser-Automatisierung, Screenshots, E2E-Tests | UI-Tests, Screenshots, Browser-Interaktion |

---

## Skills installieren

Skills sind Prompt-Bibliotheken für Claude Code. Installation via:

```bash
npx skills@latest add <github-repo> --global
```

Skills landen in `~/.agents/skills/` und werden automatisch nach `~/.claude/skills/` verlinkt.

---

## Design-Skills (Pflicht bei Push8)

### 1. impeccable – UI-Polish & Audit

```bash
npx skills@latest add pbakaus/impeccable --global
```

**Trigger:** `/impeccable audit`, `/impeccable polish`, `/impeccable distill`

**Wann:** Design wirkt generisch, zu KI-mäßig, braucht Schliff. 23 Befehle für UI-Verbesserung.

**Befehle (Auswahl):**
- `audit` – Vollständiger Design-Review
- `polish` – Visuell verfeinern
- `distill` – Auf das Wesentliche reduzieren
- `colorize` – Farb-System verbessern
- `animate` – Micro-Interactions hinzufügen
- `harden` – Konsistenz & Robustheit

---

### 2. design-motion-principles – Animation & Motion

```bash
# Manuell installieren (andere Repo-Struktur):
git clone https://github.com/kylezantos/kz-motion /tmp/kz-motion
cp -r /tmp/kz-motion/skills/design-motion-principles ~/.agents/skills/
```

**Trigger:** `design-motion-principles`

**Wann:** Animationen, Transitions, Hover-Effekte, Scroll-Animationen, Micro-Interactions.

**Stil:** Emil Kowalski / Jhey Tompkins – physikalisch korrekte, subtile Bewegung.

**Modi:**
- Create-Mode – Neue Animationen implementieren
- Audit-Mode – Bestehende Animationen prüfen (gibt HTML-Report aus)

---

### 3. taste-skill – Anti-AI-Slop Design-Taste

```bash
npx skills@latest add Leonxlnx/taste-skill --global
```

**Trigger:** `design-taste-frontend`, `stitch-design-taste`, und weitere

**Wann:** Neues UI ohne vorhandenes Design-System, Stil-Entscheidungen treffen, generisches Output verhindern.

**Enthält:**
- `design-taste-frontend` – Metriken-basierte UI-Regeln, Komponenten-Architektur
- `stitch-design-taste` – Semantic Design System für Google Stitch
- `gpt-taste` – GSAP ScrollTrigger, AIDA-Struktur, Editorial-Typografie
- `high-end-visual-design` – Agency-Niveau Fonts, Spacing, Shadows
- `minimalist-ui` – Editorial, Warm-Monochrome, Flat Bento
- `industrial-brutalist-ui` – Swiss Typografie, Military Terminal-Ästhetik
- `image-to-code` – Bild analysieren und als Code umsetzen
- `imagegen-frontend-web` – Section-by-Section Bilder generieren
- `imagegen-frontend-mobile` – Mobile App Screen-Konzepte

---

### 4. nextlevelbuilder – UI/UX Pro Max

```bash
npx skills@latest add nextlevelbuilder --global
```

**Trigger:** `ui-ux-pro-max`, `brandkit`, `ckm-design`, `ckm-slides`, und weitere

**Wann:** Komplexe UI-Systeme, Brand-Kits, Design-Token-Architektur, Slide-Decks.

**Enthält:**
- `ui-ux-pro-max` – 50+ Stile, 161 Farbpaletten, 57 Font-Pairings, 161 Produkt-Typen
- `brandkit` – Premium Brand-Guidelines, Logo-Systeme, Identity-Decks
- `ckm-design` – Brand Identity, Design Tokens, Logo-Generierung (55 Stile)
- `ckm-design-system` – Token-Architektur (3 Ebenen), CSS-Variablen
- `ckm-banner-design` – Social Media Banner, 22 Stile
- `ckm-slides` – HTML-Präsentationen mit Chart.js
- `ckm-ui-styling` – shadcn/ui + Tailwind + Radix UI

---

### 5. Figma Skills (via Plugin)

```bash
# Werden automatisch mit dem figma-Plugin geladen:
# /figma-use, /figma-generate-design, /figma-generate-library
# /figma-code-connect, /figma-generate-diagram, /figma-implement-design
```

**Wann:** Figma-URL vorhanden, Design in Code umsetzen, aus Code in Figma pushen.

---

## Code-Qualität Skills (Superpowers)

```bash
npx skills@latest add anthropics/superpowers --global
# oder einzeln via Claude Code built-in
```

Diese Skills sind in Claude Code integriert und werden via `Skill`-Tool geladen:

| Skill | Trigger | Wann |
|---|---|---|
| `superpowers:systematic-debugging` | Bug, Fehler, unerwartet | Vor jedem Fix |
| `superpowers:test-driven-development` | Feature implementieren | Vor dem Schreiben von Code |
| `superpowers:requesting-code-review` | Fertig, Code-Review | Nach Implementierung |
| `superpowers:verification-before-completion` | Fertig melden | Bevor "done" gesagt wird |
| `superpowers:writing-plans` | Komplexe Aufgabe planen | Vor mehrstufigen Tasks |
| `superpowers:subagent-driven-development` | Parallele Tasks | Unabhängige Subtasks |

---

## Trigger-Tabelle (Schnell-Referenz)

| Situation | Skill/Plugin |
|---|---|
| UI bauen, Component, Landing Page | `frontend-design` Plugin + `design-taste-frontend` |
| Design wirkt generisch/langweilig | `/impeccable audit` |
| Design polishen, verfeinern | `/impeccable polish` |
| Font/Farbe/Spacing entscheiden | `/impeccable distill` |
| Animation, Motion, Hover | `design-motion-principles` (Create-Mode) |
| Bestehende Animationen prüfen | `design-motion-principles` (Audit-Mode) |
| Neues UI ohne Design-System | `ui-ux-pro-max` |
| Figma-Design implementieren | `figma-implement-design` + figma Plugin |
| In Figma pushen | `figma-generate-design` + figma Plugin |
| Bug finden | `superpowers:systematic-debugging` |
| Feature bauen | `superpowers:test-driven-development` |
| Fertig melden | `superpowers:verification-before-completion` |

---

## Vollständige Erst-Installation

Für einen neuen Push8-Arbeitsplatz alle Skills auf einmal installieren:

```bash
# 1. Plugins
claude plugin add figma
claude plugin add frontend-design
claude plugin add playwright

# 2. Design Skills
npx skills@latest add pbakaus/impeccable --global
npx skills@latest add Leonxlnx/taste-skill --global
npx skills@latest add nextlevelbuilder --global

# 3. KZ Motion (manuell)
git clone https://github.com/kylezantos/kz-motion /tmp/kz-motion
cp -r /tmp/kz-motion/skills/design-motion-principles ~/.agents/skills/

# Überprüfen:
ls ~/.agents/skills/
ls ~/.claude/skills/
```

---

## Skill-Struktur in diesem Repo

```
SKILLS/
  README.md          ← diese Datei (Übersicht & Install)
  IMPECCABLE.md      ← Alle 23 Befehle mit Beispielen
  MOTION.md          ← Motion-Prinzipien Kurzreferenz
  TASTE.md           ← Anti-AI-Slop Regeln Kurzreferenz
```
