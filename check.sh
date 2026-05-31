#!/usr/bin/env bash
# Pre-Deploy Check – automatisierte Go-Live-Checkliste
# Basiert auf GUIDES/DESIGN_SYSTEM.md Checkliste

set -uo pipefail

TARGET="${1:-.}"
ERRORS=0
WARNINGS=0

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'

pass()  { echo -e "${GREEN}✅${NC} $1"; }
fail()  { echo -e "${RED}❌${NC} $1"; ERRORS=$((ERRORS+1)); }
warn()  { echo -e "${YELLOW}⚠️${NC}  $1"; WARNINGS=$((WARNINGS+1)); }

echo ""
echo "Push8 Pre-Deploy Check – $TARGET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Assets ────────────────────────────────────────────────────────────────

# PNG/JPG in Production
if find "$TARGET" -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" 2>/dev/null | grep -v "node_modules" | grep -q .; then
  fail "PNG/JPG gefunden – nur WebP und SVG erlaubt"
  find "$TARGET" \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) | grep -v "node_modules" | head -5
else
  pass "Keine PNG/JPG Dateien"
fi

# loading="lazy" auf Video-Elementen
if grep -rn 'loading="lazy"' "$TARGET" --include="*.html" 2>/dev/null | grep -i '<video' | grep -q .; then
  fail 'loading="lazy" auf <video> gefunden – Attribut gilt nur für <img> und <iframe>'
else
  pass 'Kein loading="lazy" auf Video-Elementen'
fi

# ── Externe Requests (DSGVO) ───────────────────────────────────────────────

# Google Fonts CDN
if grep -rn "fonts.googleapis.com\|fonts.gstatic.com" "$TARGET" --include="*.html" --include="*.css" 2>/dev/null | grep -q .; then
  fail "Google Fonts CDN gefunden – IP-Übertragung an Google → DSGVO-Verstoß. Lokal hosten."
else
  pass "Keine Google Fonts CDN"
fi

# Externe Icon-CDNs
if grep -rn "cdnjs.cloudflare.com/ajax/libs/font-awesome\|unpkg.com/lucide\|cdn.jsdelivr.net/npm/lucide\|use.fontawesome.com" "$TARGET" --include="*.html" 2>/dev/null | grep -q .; then
  fail "Icon-CDN gefunden – Icons immer als Inline SVG oder lokal hosten"
else
  pass "Keine Icon-CDN Requests"
fi

# Externe Scripts ohne SRI
if grep -rn '<script src="http' "$TARGET" --include="*.html" 2>/dev/null | grep -v 'integrity=' | grep -q .; then
  warn "Externe Scripts ohne SRI-Hash gefunden – Integrity-Attribut fehlt"
  grep -rn '<script src="http' "$TARGET" --include="*.html" | grep -v 'integrity=' | head -3
else
  pass "Alle externen Scripts haben SRI oder sind lokal"
fi

# ── Accessibility ──────────────────────────────────────────────────────────

# Bilder ohne alt-Attribut
if grep -rn '<img ' "$TARGET" --include="*.html" 2>/dev/null | grep -v 'alt=' | grep -q .; then
  fail "Bilder ohne alt-Attribut gefunden"
  grep -rn '<img ' "$TARGET" --include="*.html" | grep -v 'alt=' | head -3
else
  pass "Alle Bilder haben alt-Attribut"
fi

# outline: none ohne Ersatz (einfache Heuristik)
if grep -rn "outline:\s*none\|outline:\s*0" "$TARGET" --include="*.css" 2>/dev/null | grep -v "focus\|:focus" | grep -q .; then
  warn "outline:none außerhalb von :focus gefunden – Focus-Style prüfen"
else
  pass "outline:none nur in Focus-Kontexten"
fi

# ── Navigation & Struktur ──────────────────────────────────────────────────

# section ohne id
if grep -rn '<section' "$TARGET" --include="*.html" 2>/dev/null | grep -v 'id=' | grep -q .; then
  warn "Section ohne ID gefunden – Navigation-Sync prüfen"
else
  pass "Alle Sections haben IDs"
fi

# ── Rechtliches ────────────────────────────────────────────────────────────

# Impressum-Link
if grep -rn "impressum\|Impressum" "$TARGET" --include="*.html" 2>/dev/null | grep -q .; then
  pass "Impressum-Link gefunden"
else
  fail "Kein Impressum-Link gefunden – Pflicht nach §5 TMG"
fi

# Datenschutz-Link
if grep -rn "datenschutz\|Datenschutz\|privacy" "$TARGET" --include="*.html" 2>/dev/null | grep -qi .; then
  pass "Datenschutz-Link gefunden"
else
  fail "Kein Datenschutz-Link gefunden – DSGVO Pflicht"
fi

# ── JavaScript ─────────────────────────────────────────────────────────────

# console.log in Production
if grep -rn "console\.log" "$TARGET" --include="*.js" 2>/dev/null | grep -v "node_modules\|\.min\." | grep -q .; then
  warn "console.log in JS gefunden – vor Deploy entfernen"
  grep -rn "console\.log" "$TARGET" --include="*.js" | grep -v "node_modules\|\.min\." | head -3
else
  pass "Keine console.log in JS"
fi

# Scroll-Listener ohne passive
if grep -rn "addEventListener.*scroll" "$TARGET" --include="*.js" 2>/dev/null | grep -v "passive" | grep -q .; then
  warn "Scroll-Listener ohne { passive: true } gefunden"
else
  pass "Alle Scroll-Listener haben passive:true"
fi

# ── Ergebnis ───────────────────────────────────────────────────────────────

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [[ $ERRORS -eq 0 && $WARNINGS -eq 0 ]]; then
  echo -e "${GREEN}✅ Alle Checks bestanden – bereit für Deploy${NC}"
elif [[ $ERRORS -eq 0 ]]; then
  echo -e "${YELLOW}⚠️  $WARNINGS Warnung(en) – Deploy möglich, aber prüfen${NC}"
else
  echo -e "${RED}❌ $ERRORS Fehler, $WARNINGS Warnung(en) – kein Deploy${NC}"
  exit 1
fi
echo ""
