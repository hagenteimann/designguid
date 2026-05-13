#!/usr/bin/env bash
# Ralph Loop – universeller Agent-Orchestrator
# Konfiguration: .ralph-config im selben Verzeichnis

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/.ralph-config"
PLAN_FILE="$SCRIPT_DIR/PLAN.md"
DONE_NOTES="$SCRIPT_DIR/DONE_NOTES.md"
VALIDATION_FILE="$SCRIPT_DIR/VALIDATION.md"
MEMORY_FILE="$SCRIPT_DIR/MEMORY.md"

# ── Farben ──────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'

log()  { echo -e "${GREEN}[Ralph]${NC} $1"; }
warn() { echo -e "${YELLOW}[Ralph]${NC} $1"; }
fail() { echo -e "${RED}[Ralph]${NC} $1"; }

# ── Config laden ─────────────────────────────────────────────────────────
if [[ ! -f "$CONFIG_FILE" ]]; then
  warn ".ralph-config nicht gefunden – erstelle Standard-Konfiguration..."
  cat > "$CONFIG_FILE" << 'EOF'
# Ralph Loop Konfiguration
# Implementer: kapazitätsstarkes Modell (Coding-Qualität)
IMPLEMENTER_CMD="claude"

# Validator: schnelles/günstiges Modell (binäre Checks)
VALIDATOR_CMD="claude"

# Für Gemini:
# IMPLEMENTER_CMD="gemini"
# VALIDATOR_CMD="gemini"

MAX_RETRIES=3
EOF
  log ".ralph-config erstellt – bitte anpassen und erneut starten."
  exit 0
fi

source "$CONFIG_FILE"

# ── Hilfsfunktionen ───────────────────────────────────────────────────────
check_plan() {
  if [[ ! -f "$PLAN_FILE" ]]; then
    fail "PLAN.md nicht gefunden."
    echo ""
    echo "  Entweder manuell erstellen (siehe GUIDES/RALPH_LOOP.md)"
    echo "  oder Agenten beauftragen:"
    echo ""
    echo "  Prompt für Implementer:"
    echo "  'Lies GUIDES/PROJEKT_BRIEF.md und GUIDES/RALPH_LOOP.md."
    echo "   Fülle PROJEKT_BRIEF.md aus, dann erstelle PLAN.md.'"
    exit 1
  fi
}

extract_steps() {
  grep -n "^### Step " "$PLAN_FILE" | sed 's/:.*//' | sort -n
}

get_step_content() {
  local step_line=$1
  local next_step_line=$2
  if [[ -z "$next_step_line" ]]; then
    sed -n "${step_line},\$p" "$PLAN_FILE"
  else
    local end_line=$(( next_step_line - 1 ))
    sed -n "${step_line},${end_line}p" "$PLAN_FILE"
  fi
}

run_implementer() {
  local step_content="$1"
  local retry_context="$2"

  local prompt="Du bist der Implementer-Agent im Ralph Loop.

DEINE AUFGABE – Dieser Step:
$step_content"

  if [[ -n "$retry_context" ]]; then
    prompt="$prompt

VORHERIGER VERSUCH FEHLGESCHLAGEN:
$retry_context

Behebe die genannten Fehler."
  fi

  prompt="$prompt

REGELN:
- Lade nur die Guides die im Step unter 'Guides:' stehen
- Aktualisiere CD-Manual wie unter 'Dokumentieren:' beschrieben
- Schreibe nach Abschluss DONE_NOTES.md (max 3 Zeilen):
  ## Step [N] – [Name]
  Gebaut: [1 Satz]
  Entscheidung: [1 Satz oder 'wie geplant']
  CD-Manual: [aktualisiert / nicht nötig]"

  echo "$prompt" | $IMPLEMENTER_CMD
}

run_validator() {
  local step_content="$1"
  local diff_output="$2"
  local done_notes="$3"
  local retry_count="$4"

  local prompt="Du bist der Validator-Agent im Ralph Loop.

PLAN – Dieser Step:
$step_content

GIT DIFF (was wurde gemacht):
$diff_output

DONE_NOTES vom Implementer:
$done_notes

AUFGABE:
Prüfe jeden Punkt unter 'Done wenn:' binär (✅/❌).
Schreibe VALIDATION.md:

## Validation Step – $(date +%Y-%m-%d)
Ergebnis: ✅ BESTANDEN / ❌ FEHLER

Fehler (wenn ❌, konkret und behebbar):
- ...

Retry: $retry_count/${MAX_RETRIES}

NUR Diff und Plan lesen – nicht die ganze Codebase."

  echo "$prompt" | $VALIDATOR_CMD
}

run_memory_consolidation() {
  local prompt="Du bist der Validator-Agent im Ralph Loop.
Der Build ist abgeschlossen. Schreibe MEMORY.md als komprimierte Kontext-Zusammenfassung.

Lies dazu:
- PLAN.md (was geplant war)
- DONE_NOTES.md (was gemacht wurde)
- cd-manual/index.html oder CD-Manual-Einträge (Design-Entscheidungen)

MEMORY.md Format (exakt einhalten):

# MEMORY – [Projektname]
Stand: $(date +%Y-%m-%d)
Loop-Durchläufe: [N Steps, X Retries gesamt]

## Was gebaut wurde
[3–5 Sätze]

## Schlüssel-Entscheidungen
- Primärfarbe: #... (Begründung: ...)
- [Weitere abweichende Entscheidungen]

## Token-System (projektspezifisch)
- [Nur abweichende Tokens – Rest = Standard DESIGN_SYSTEM.md]

## Guides die relevant waren
- [Liste]

## Guides die nicht genutzt wurden
- [Liste – diese beim nächsten Start NICHT laden]

## Offene Punkte
- [ ] ...

## Nächster Agent liest zuerst
1. MEMORY.md
2. PLAN.md (offene Steps falls vorhanden)
3. [Nur relevante Guides von oben]"

  echo "$prompt" | $VALIDATOR_CMD
}

validation_passed() {
  if [[ ! -f "$VALIDATION_FILE" ]]; then return 1; fi
  grep -q "Ergebnis: ✅ BESTANDEN" "$VALIDATION_FILE"
}

# ── Hauptprozess ──────────────────────────────────────────────────────────
main() {
  log "Ralph Loop startet..."
  log "Implementer: $IMPLEMENTER_CMD"
  log "Validator:   $VALIDATOR_CMD"
  echo ""

  check_plan

  # Steps aus PLAN.md extrahieren
  mapfile -t step_lines < <(extract_steps)
  total_steps=${#step_lines[@]}

  if [[ $total_steps -eq 0 ]]; then
    fail "Keine Steps in PLAN.md gefunden. Format: '### Step N – Name'"
    exit 1
  fi

  log "Gefundene Steps: $total_steps"
  echo ""

  total_retries=0

  for (( i=0; i<total_steps; i++ )); do
    current_line=${step_lines[$i]}
    next_line=${step_lines[$((i+1))] 2>/dev/null || echo ""}
    step_content=$(get_step_content "$current_line" "$next_line")
    step_name=$(sed -n "${current_line}p" "$PLAN_FILE")

    log "━━━ $step_name ━━━"

    retry=0
    passed=false
    retry_context=""

    while [[ $retry -lt $MAX_RETRIES ]]; do
      # Implementer
      log "Implementer läuft... (Versuch $((retry+1))/${MAX_RETRIES})"
      run_implementer "$step_content" "$retry_context"

      # Git diff für Validator
      diff_output=$(git diff HEAD 2>/dev/null || echo "(kein Git-Repository)")
      done_notes=$(cat "$DONE_NOTES" 2>/dev/null || echo "(keine DONE_NOTES)")

      # Validator
      log "Validator prüft..."
      run_validator "$step_content" "$diff_output" "$done_notes" "$((retry+1))"

      if validation_passed; then
        log "✅ Step bestanden"
        git add -A && git commit -m "Ralph Loop: $step_name" 2>/dev/null || true
        passed=true
        break
      else
        retry=$(( retry + 1 ))
        total_retries=$(( total_retries + 1 ))
        retry_context=$(cat "$VALIDATION_FILE" 2>/dev/null)
        if [[ $retry -lt $MAX_RETRIES ]]; then
          warn "❌ Fehler – Retry $retry/${MAX_RETRIES}..."
        fi
      fi
    done

    if [[ "$passed" == false ]]; then
      fail "Step nach ${MAX_RETRIES} Versuchen nicht bestanden – Human Review nötig."
      fail "Fehlerdetails: $VALIDATION_FILE"
      exit 1
    fi

    echo ""
  done

  # MEMORY.md Konsolidierung
  log "━━━ MEMORY.md Konsolidierung ━━━"
  run_memory_consolidation
  log "✅ MEMORY.md geschrieben – Kontext für nächste Session komprimiert"
  echo ""
  log "Loop abgeschlossen. $total_steps Steps, $total_retries Retries gesamt."
}

main "$@"
