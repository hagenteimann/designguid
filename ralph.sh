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

# ── Farben ───────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

log()  { echo -e "${GREEN}[Ralph]${NC} $1"; }
info() { echo -e "${BLUE}[Ralph]${NC} $1"; }
warn() { echo -e "${YELLOW}[Ralph]${NC} $1"; }
fail() { echo -e "${RED}[Ralph]${NC} $1"; }

# ── Config laden ─────────────────────────────────────────────────────────
if [[ ! -f "$CONFIG_FILE" ]]; then
  warn ".ralph-config nicht gefunden – erstelle Standard-Konfiguration..."
  cat > "$CONFIG_FILE" << 'EOF'
IMPLEMENTER_CMD="claude"
IMPLEMENTER_FLAGS="-p"
VALIDATOR_CMD="claude"
VALIDATOR_FLAGS="-p"
MAX_RETRIES=3
EOF
  log ".ralph-config erstellt – bitte anpassen und erneut starten."
  exit 0
fi

source "$CONFIG_FILE"

# ── Agent aufrufen ────────────────────────────────────────────────────────
# Gibt stdout zurück. Das Script schreibt alle Steuerdateien selbst –
# kein Agent muss Dateien schreiben können außer dem Implementer (Code-Dateien).
call_agent() {
  local cmd="$1"
  local flags="$2"
  local prompt="$3"
  echo "$prompt" | $cmd $flags 2>&1
}

# ── Hilfsfunktionen ───────────────────────────────────────────────────────
check_plan() {
  if [[ ! -f "$PLAN_FILE" ]]; then
    fail "PLAN.md nicht gefunden."
    echo ""
    echo "  Prompt zum Generieren:"
    echo "  'Lies GUIDES/PROJEKT_BRIEF.md und GUIDES/RALPH_LOOP.md."
    echo "   Fülle PROJEKT_BRIEF.md aus, dann erstelle PLAN.md.'"
    exit 1
  fi
}

extract_steps() {
  grep -n "^### Step " "$PLAN_FILE" | sed 's/:.*//' | sort -n
}

get_step_content() {
  local step_line="$1"
  local next_step_line="$2"
  if [[ -z "$next_step_line" ]]; then
    sed -n "${step_line},\$p" "$PLAN_FILE"
  else
    local end_line=$(( next_step_line - 1 ))
    sed -n "${step_line},${end_line}p" "$PLAN_FILE"
  fi
}

validation_passed() {
  [[ -f "$VALIDATION_FILE" ]] && grep -q "Ergebnis: ✅ BESTANDEN" "$VALIDATION_FILE"
}

# ── Implementer ───────────────────────────────────────────────────────────
run_implementer() {
  local step_content="$1"
  local retry_context="$2"

  local prompt="Du bist der Implementer-Agent im Ralph Loop.

AUFGABE – Dieser Step:
$step_content"

  if [[ -n "$retry_context" ]]; then
    prompt="$prompt

VORHERIGER VERSUCH FEHLGESCHLAGEN – behebe diese Fehler:
$retry_context"
  fi

  prompt="$prompt

REGELN:
- Nur die unter 'Guides:' genannten Guides laden – keine anderen
- CD-Manual aktualisieren wie unter 'Dokumentieren:' beschrieben
- Am Ende deiner Antwort diesen Block ausgeben (wird als DONE_NOTES gespeichert):

---DONE_NOTES---
Gebaut: [1 Satz was konkret erstellt wurde]
Entscheidung: [1 Satz zu Abweichungen, sonst: wie geplant]
CD-Manual: [aktualisiert / nicht nötig]
---END_DONE_NOTES---"

  local output
  output=$(call_agent "$IMPLEMENTER_CMD" "$IMPLEMENTER_FLAGS" "$prompt")

  # DONE_NOTES aus Output extrahieren und speichern
  echo "## Step – $(date +%Y-%m-%d)" > "$DONE_NOTES"
  echo "$output" \
    | sed -n '/---DONE_NOTES---/,/---END_DONE_NOTES---/p' \
    | grep -v "^---" \
    >> "$DONE_NOTES" 2>/dev/null || echo "$output" | tail -3 >> "$DONE_NOTES"

  # Output im Terminal zeigen
  echo "$output"
}

# ── Validator ─────────────────────────────────────────────────────────────
run_validator() {
  local step_content="$1"
  local diff_output="$2"
  local done_notes="$3"
  local retry_count="$4"

  local prompt="Du bist der Validator-Agent im Ralph Loop.
Antworte NUR mit dem VALIDATION.md-Inhalt – kein anderer Text.

PLAN – Dieser Step:
$step_content

GIT DIFF:
$diff_output

DONE_NOTES:
$done_notes

Prüfe jeden Punkt unter 'Done wenn:' binär. Antworte exakt in diesem Format:

## Validation – $(date +%Y-%m-%d)
Ergebnis: ✅ BESTANDEN

oder:

## Validation – $(date +%Y-%m-%d)
Ergebnis: ❌ FEHLER

Fehler:
- [konkreter Fehler, direkt behebbar]

Retry: $retry_count/${MAX_RETRIES}"

  local output
  output=$(call_agent "$VALIDATOR_CMD" "$VALIDATOR_FLAGS" "$prompt")

  # Script schreibt VALIDATION.md selbst – kein Agent-File-Access nötig
  echo "$output" > "$VALIDATION_FILE"
  echo "$output"
}

# ── Memory-Konsolidierung ─────────────────────────────────────────────────
run_memory_consolidation() {
  local total_steps="$1"
  local total_retries="$2"

  local plan_content done_content
  plan_content=$(cat "$PLAN_FILE" 2>/dev/null || echo "")
  done_content=$(cat "$DONE_NOTES" 2>/dev/null || echo "")

  local prompt="Du bist der Validator-Agent im Ralph Loop.
Antworte NUR mit dem MEMORY.md-Inhalt – kein anderer Text.

PLAN.md:
$plan_content

DONE_NOTES:
$done_content

Schreibe MEMORY.md exakt in diesem Format:

# MEMORY – [Projektname aus PLAN.md]
Stand: $(date +%Y-%m-%d)
Loop: $total_steps Steps, $total_retries Retries

## Was gebaut wurde
[3–5 Sätze]

## Schlüssel-Entscheidungen
- [Entscheidung]: [Wert] ([Begründung])

## Token-System (nur Abweichungen von DESIGN_SYSTEM.md)
- [Token]: [Wert]

## Relevante Guides
- [Liste der genutzten Guides]

## Nicht genutzte Guides (beim nächsten Start nicht laden)
- [Liste]

## Offene Punkte
- [ ] [Was noch fehlt]

## Nächste Session liest zuerst
1. MEMORY.md
2. [Nur relevante Guides von oben]"

  local output
  output=$(call_agent "$VALIDATOR_CMD" "$VALIDATOR_FLAGS" "$prompt")

  # Script schreibt MEMORY.md selbst
  echo "$output" > "$MEMORY_FILE"
  echo "$output"
}

# ── Hauptprozess ──────────────────────────────────────────────────────────
main() {
  log "Ralph Loop startet"
  info "Implementer: $IMPLEMENTER_CMD $IMPLEMENTER_FLAGS"
  info "Validator:   $VALIDATOR_CMD $VALIDATOR_FLAGS"
  echo ""

  check_plan

  mapfile -t step_lines < <(extract_steps)
  local total_steps=${#step_lines[@]}

  if [[ $total_steps -eq 0 ]]; then
    fail "Keine Steps in PLAN.md. Format: '### Step N – Name'"
    exit 1
  fi

  log "$total_steps Steps gefunden"
  echo ""

  local total_retries=0

  for (( i=0; i<total_steps; i++ )); do
    local current_line=${step_lines[$i]}
    local next_line=""
    if [[ $((i+1)) -lt $total_steps ]]; then
      next_line=${step_lines[$((i+1))]}
    fi

    local step_content step_name
    step_content=$(get_step_content "$current_line" "$next_line")
    step_name=$(sed -n "${current_line}p" "$PLAN_FILE")

    log "━━━ $step_name ━━━"

    local retry=0
    local passed=false
    local retry_context=""

    while [[ $retry -lt $MAX_RETRIES ]]; do
      info "Implementer läuft... (Versuch $((retry+1))/${MAX_RETRIES})"
      run_implementer "$step_content" "$retry_context"

      local diff_output done_notes
      diff_output=$(git diff HEAD 2>/dev/null || echo "(kein Git)")
      done_notes=$(cat "$DONE_NOTES" 2>/dev/null || echo "")

      info "Validator prüft..."
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
      fail "Details: $VALIDATION_FILE"
      exit 1
    fi

    echo ""
  done

  log "━━━ MEMORY.md Konsolidierung ━━━"
  run_memory_consolidation "$total_steps" "$total_retries"
  log "✅ MEMORY.md geschrieben"
  echo ""
  log "Fertig. $total_steps Steps, $total_retries Retries."
}

main "$@"
