#!/usr/bin/env bash
# Compiles all GUIDES/**/*.md into a single MASTER_GUIDE.md for AI context pasting.
# Repo-relative FILE headers (no local paths), UTF-8, no BOM. Re-run after editing guides.
set -euo pipefail

cd "$(dirname "$0")"
ROOT="GUIDES"
OUT="MASTER_GUIDE.md"
SEP="$(printf '=%.0s' {1..80})"

emit_dir() {
  local dir="$1" f d
  # direct .md files first (sorted)
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    printf '\n%s\nFILE: %s\n%s\n\n' "$SEP" "$f" "$SEP"
    cat "$f"
    printf '\n'
  done < <(find "$dir" -maxdepth 1 -type f -name '*.md' | sort)
  # then subdirectories (sorted, recursive)
  while IFS= read -r d; do
    [ -z "$d" ] && continue
    emit_dir "$d"
  done < <(find "$dir" -maxdepth 1 -mindepth 1 -type d | sort)
}

{
  printf '# MASTER GUIDE - Brand & Web Strategy-to-Execution Framework\n'
  printf 'This file contains the complete generic guidelines and code standards compiled from the repository guides. Use this file as a master prompt context for any AI coding assistant.\n'
  emit_dir "$ROOT"
} > "$OUT"

echo "Wrote $OUT ($(wc -l < "$OUT") lines, $(grep -c '^FILE: ' "$OUT") guides)."
