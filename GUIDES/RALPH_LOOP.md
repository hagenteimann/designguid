# Ralph Loop – Autonomer Build-Prozess mit Validator-Agent

Der Ralph Loop ist ein zwei-Agenten-System für vollständige Website-Builds. Ein Agent implementiert, ein zweiter validiert – beide starten pro Phase frisch und halten den Kontext minimal.

Benannt nach Geoffrey Huntley's Technik (2025/2026), viral in Vibe-Coding-Kreisen.

---

## Wann nutzen

| Situation | Ralph Loop? |
|---|---|
| Kompletter Website-Build (Rebuild oder neu) | ✅ Ja |
| Einzelne Section hinzufügen | ❌ Nein – normaler Workflow |
| Bug fixen | ❌ Nein – zu viel Overhead |
| Großes Feature (5+ Steps) | ✅ Ja |

---

## Die Architektur

```
Phase 0 (1×):
  PROJEKT_BRIEF.md ausfüllen → PLAN.md schreiben

Phase 1–N (Loop pro Step):
  Implementer liest PLAN.md Step N
       ↓
  Code schreiben + CD-Manual aktualisieren + DONE_NOTES.md (3 Zeilen)
       ↓
  Validator liest PLAN.md Step N + git diff + DONE_NOTES.md
       ↓
  ✅ bestanden → nächster Step
  ❌ Fehler → Implementer nochmal mit VALIDATION.md als Input
  ❌❌❌ 3× Fehler → Loop pausiert → Human Review

Phase Final (1×):
  Validator schreibt MEMORY.md (Kontext-Konsolidierung)
```

---

## Phase 0: PLAN.md schreiben

Vor dem ersten Loop-Durchlauf schreibt der Agent einen PLAN.md ins Projektroot.
Kein Loop-Start ohne vollständigen Plan.

### PLAN.md Struktur

```markdown
# Build Plan – [Projektname]
Erstellt: [Datum]
Basis: PROJEKT_BRIEF.md (ausgefüllt)

## Steps

### Step 1 – Hero Section
Task: Hero mit H1, CTA-Button, Trust-Signal bauen

Done wenn:
- [ ] <section id="section-hero" data-nav-label="Hero"> vorhanden
- [ ] H1 enthält Primär-Keyword aus Brief
- [ ] Button mit class="btn btn--primary" + korrektem CTA-Text
- [ ] Trust-Signal direkt unter CTA (Text oder Icon)
- [ ] Mobile: Single Column, Desktop: 2-spaltig

Dokumentieren:
- CD-Manual: Primärfarbe + CTA-Text als Entscheidung eintragen
- Kategorie: Farbpalette + UX-Patterns

Validator-Check:
- grep -r "section-hero" index.html → vorhanden?
- grep -r "btn--primary" → vorhanden?
- Lighthouse Mobile Score ≥ 90?

---

### Step 2 – Navigation
Task: Sticky Nav mit Auto-Generation aus Section-IDs

Done wenn:
- [ ] nav[data-open] vorhanden
- [ ] Hamburger-Button mit aria-label
- [ ] Alle Sections in data-nav-visible="true" erscheinen in Nav
- [ ] Scroll-Listener mit { passive: true }
- [ ] smooth scroll in prefers-reduced-motion guard

Dokumentieren:
- CD-Manual: Breakpoint (768px) + Nav-Typ als Entscheidung

Validator-Check:
- grep "passive: true" js/navigation.js → vorhanden?
- grep "prefers-reduced-motion" css/style.css → vorhanden?

---

### Step N – ...

## Offene Punkte
(Validator trägt hier ein was 3× fehlgeschlagen ist)
```

---

## Agenten-Konfiguration

Der Loop ist **agent-agnostisch** – er funktioniert mit Claude, Gemini, GPT oder jedem anderen CLI-Agent. Konfiguration über `.ralph-config` im Projektroot.

### Rollen statt Modellnamen

| Rolle | Anforderung | Beispiele |
|---|---|---|
| **Implementer** | Hohe Coding-Qualität, großes Kontextfenster | claude-sonnet, gemini-2.0-pro, gpt-4o |
| **Validator** | Schnell, günstig, binäre Checks reichen | claude-haiku, gemini-flash, gpt-4o-mini |

### `.ralph-config` (Projektroot)

```bash
# Implementer Agent – kapazitätsstarkes Modell
IMPLEMENTER_CMD="claude"

# Validator Agent – schnelles/günstiges Modell
VALIDATOR_CMD="claude --model claude-haiku-4-5-20251001"

# Für Gemini:
# IMPLEMENTER_CMD="gemini"
# VALIDATOR_CMD="gemini --model gemini-2.0-flash"

# Für OpenAI:
# IMPLEMENTER_CMD="openai api chat.completions.create -m gpt-4o"
# VALIDATOR_CMD="openai api chat.completions.create -m gpt-4o-mini"

MAX_RETRIES=3
```

### Agent A – Implementer

```
Liest:   PLAN.md → aktueller Step + VALIDATION.md (wenn Retry)
Schreibt: Code + CD-Manual Update + DONE_NOTES.md (3 Zeilen max)
Stoppt:  Nach jedem Step – kein kontinuierlicher Loop
Guides:  Nur die im jeweiligen Step angegebenen laden
```

### Agent B – Validator

```
Liest:   PLAN.md Step N + git diff HEAD~1 + DONE_NOTES.md
Schreibt: VALIDATION.md (✅ bestanden / ❌ Fehler + Grund)
Stoppt:  Sofort nach Verdict – nie die ganze Codebase lesen
```

---

## DONE_NOTES.md Format (Implementer schreibt nach jedem Step)

```markdown
## Step [N] – [Name] – [Datum]
Gebaut: [1 Satz was konkret erstellt wurde]
Entscheidung: [1 Satz zu abweichenden Entscheidungen, sonst "wie geplant"]
CD-Manual: [aktualisiert / nicht nötig]
```

Maximal 3 Zeilen. Kein langer Bericht.

---

## VALIDATION.md Format (Validator schreibt nach jedem Check)

```markdown
## Validation Step [N] – [Datum]
Ergebnis: ✅ BESTANDEN / ❌ FEHLER

Fehler (wenn ❌):
- [Konkreter Fehler aus Done-Kriterien]
- [Was fehlt oder falsch ist]

Retry [1/2/3]:
```

---

## MEMORY.md – Kontext-Konsolidierung (letzter Step)

Der Validator schreibt am Ende des gesamten Loops eine MEMORY.md ins Projektroot.
Zweck: Nächste Session liest nur MEMORY.md statt alle Guides + ganzen Verlauf.
Spart 80–90% Kontext-Tokens beim Wiedereinstieg.

```markdown
# MEMORY – [Projektname]
Stand: [Datum]
Loop-Durchläufe: [N Steps, X Retries]

## Was gebaut wurde
[3–5 Sätze: Welche Sections, welche Features, welcher Stack]

## Schlüssel-Entscheidungen
- Primärfarbe: #______ (Begründung: ___)
- CTA-Text: "___" (Begründung: ___)
- Breakpoint Mobile: 768px
- Navigation: Sticky + Hamburger
- [Weitere abweichende Entscheidungen]

## Token-System (projektspezifisch)
- Primärfarbe: --color-primary-300: [Wert]
- Alle anderen Tokens: Standard aus DESIGN_SYSTEM.md

## Guides die relevant waren
- DESIGN_SYSTEM.md – immer
- FUNNEL_STRATEGIE.md – Sektionsreihenfolge
- [Weitere genutzte Guides]

## Guides die nicht genutzt wurden
- ACCESSIBILITY_TESTING.md, API_INTEGRATION.md, ... (nicht laden)

## Offene Punkte / Nächste Session
- [ ] [Was noch fehlt]
- [ ] [Was zu prüfen ist]

## Nächster Agent liest zuerst
1. Diese MEMORY.md
2. PLAN.md (offene Steps)
3. [Nur die oben genannten relevanten Guides]
```

---

## Token-Budget-Empfehlungen

| Phase | Rolle | Erwartete Token pro Step |
|---|---|---|
| Plan schreiben | Implementer | 2.000–5.000 |
| Implementer pro Step | Implementer | 3.000–8.000 |
| Validator pro Step | Validator | 500–1.500 |
| MEMORY.md schreiben | Validator | 1.000–2.000 |

Ein kompletter 10-Step-Build: ~80.000–100.000 Token gesamt.
Ohne Phasen-Struktur (kontinuierlicher Loop): 300.000–500.000+ Token.

## Loop starten

```bash
# Einmalig ausführbar machen
chmod +x ralph.sh

# Loop starten (liest .ralph-config automatisch)
./ralph.sh
```

→ Script liegt im Projektroot: `ralph.sh`
→ Konfiguration: `.ralph-config`

---

## Abbruchkriterien

- **3× gleicher Fehler** → Loop pausiert, Human Review nötig
- **Step läuft > 10.000 Token** → Implementer hat sich verzettelt, Step splitten
- **Validator findet > 5 Fehler auf einmal** → Plan-Step zu groß, aufteilen

---

## Integration mit bestehenden Workflows

| Workflow | Verbindung |
|---|---|
| PROJEKT_BRIEF.md | Pflicht vor PLAN.md – Brief ist Basis für jeden Step |
| WORKFLOW_CD_MANUAL.md | Implementer updated CD-Manual pro Step automatisch |
| WORKFLOW_ASSETS.md | Assets-Steps werden wie normale Steps behandelt |
| WORKFLOW_DEPLOYMENT.md | Letzter Step im PLAN.md ist immer der Deploy-Step |
| QA_TESTING.md | Validator nutzt QA-Checkliste als Done-Kriterien-Basis |

---

*Push8 Web Agency – Ralph Loop Guide – Stand Mai 2026*
