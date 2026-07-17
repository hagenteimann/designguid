#!/usr/bin/env bash
# Pre-Deploy Check – automatisierte Go-Live-Checkliste
# Basiert auf GUIDES/03_EXECUTION/components.md Checkliste

set -uo pipefail

TARGET="${1:-.}"
ERRORS=0
WARNINGS=0

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'

pass()  { echo -e "${GREEN}✅${NC} $1"; }
fail()  { echo -e "${RED}❌${NC} $1"; ERRORS=$((ERRORS+1)); }
warn()  { echo -e "${YELLOW}⚠️${NC}  $1"; WARNINGS=$((WARNINGS+1)); }

echo ""
echo "Brand & Web Pre-Deploy Check – $TARGET"
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

# ── Externe Fonts & Icons – VERBOTEN (self-host only) ──────────────────────

# 1. Externe @font-face src (JEDER Host) – der generische Fall: fängt alle
#    extern geladenen Fonts UND Icon-Fonts ab, egal von welchem CDN.
if grep -rnE "src:[^;]*url\(['\"]?[[:space:]]*(https?:)?//" "$TARGET" --include="*.html" --include="*.css" 2>/dev/null | grep -q .; then
  fail "Externes @font-face src gefunden – Fonts extern zu laden ist VERBOTEN. WOFF2 lokal hosten."
  grep -rnE "src:[^;]*url\(['\"]?[[:space:]]*(https?:)?//" "$TARGET" --include="*.html" --include="*.css" | head -3
else
  pass "Keine extern geladenen @font-face"
fi

# 2. Font-Provider (Link/Preconnect/Import) – Google, Typekit, Bunny, cdnfonts …
if grep -rnE "fonts\.googleapis\.com|fonts\.gstatic\.com|use\.typekit\.net|p\.typekit\.net|fonts\.bunny\.net|fnt\.bunny\.net|fonts\.cdnfonts\.com|cloud\.typography\.com|fast\.fonts\.net|fontlibrary\.org" "$TARGET" --include="*.html" --include="*.css" 2>/dev/null | grep -q .; then
  fail "Externer Font-Provider gefunden (z. B. Google Fonts) – VERBOTEN. Lokal hosten."
  grep -rnE "fonts\.googleapis\.com|fonts\.gstatic\.com|use\.typekit\.net|fonts\.bunny\.net|fonts\.cdnfonts\.com" "$TARGET" --include="*.html" --include="*.css" | head -3
else
  pass "Kein externer Font-Provider"
fi

# 3. Externe Icon-Quellen (Icon-Fonts, Icon-CDNs, Icon-APIs) – breite Liste
if grep -rniE "font-?awesome|/lucide|feather-?icons|material-?icons|material\.icons|iconify|api\.iconify|remix-?icon|boxicons|/ionicons|bootstrap-?icons|heroicons[^\"']*cdn|fonts\.googleapis\.com/icon|/tabler-icons|phosphor-?icons" "$TARGET" --include="*.html" --include="*.css" 2>/dev/null | grep -iE "https?:|//|cdn|unpkg|jsdelivr|cdnjs|googleapis" | grep -q .; then
  fail "Externe Icon-Quelle gefunden – Icons extern zu laden ist VERBOTEN. Inline SVG verwenden."
  grep -rniE "font-?awesome|iconify|material-?icons|/lucide|/ionicons|boxicons|remix-?icon" "$TARGET" --include="*.html" --include="*.css" | grep -iE "https?:|//|cdn|unpkg|jsdelivr|cdnjs|googleapis" | head -3
else
  pass "Keine externen Icon-Quellen (Inline SVG)"
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
