#!/bin/bash

# FontGen AI - Deployment Verification Script
# Run this after deployment to verify everything is working correctly

set -e

BASE_URL="${1:-https://hagenteimann.github.io/fontgen-ai}"
FAILED=0

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   FontGen AI - Deployment Verification                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Target: $BASE_URL"
echo ""

# Check 1: Main page loads
echo "🔍 Check 1: Main page loads..."
if curl -sSf "$BASE_URL/" > /dev/null; then
  echo "  ✓ Main page (/) accessible"
else
  echo "  ✗ Main page (/) NOT accessible"
  FAILED=$((FAILED + 1))
fi

# Check 2: 404 page exists
echo "🔍 Check 2: 404 page exists..."
if curl -sSf "$BASE_URL/nonexistent-page-12345" -H "Accept: text/html" | grep -q "You're Offline\|Page not found\|404"; then
  echo "  ✓ 404 fallback working"
else
  echo "  ✗ 404 fallback not working properly"
  FAILED=$((FAILED + 1))
fi

# Check 3: Service Worker registered
echo "🔍 Check 3: Service Worker available..."
if curl -sSf "$BASE_URL/sw.js" > /dev/null; then
  echo "  ✓ Service Worker (sw.js) available"
else
  echo "  ✗ Service Worker (sw.js) NOT found"
  FAILED=$((FAILED + 1))
fi

# Check 4: Manifest available
echo "🔍 Check 4: PWA manifest available..."
if curl -sSf "$BASE_URL/manifest.json" | grep -q "name\|short_name"; then
  echo "  ✓ Manifest (manifest.json) valid"
else
  echo "  ✗ Manifest (manifest.json) invalid or missing"
  FAILED=$((FAILED + 1))
fi

# Check 5: robots.txt available
echo "🔍 Check 5: robots.txt available..."
if curl -sSf "$BASE_URL/robots.txt" | grep -q "User-agent"; then
  echo "  ✓ robots.txt valid"
else
  echo "  ✗ robots.txt invalid or missing"
  FAILED=$((FAILED + 1))
fi

# Check 6: sitemap.xml available
echo "🔍 Check 6: sitemap.xml available..."
if curl -sSf "$BASE_URL/sitemap.xml" | grep -q "urlset"; then
  echo "  ✓ sitemap.xml valid"
else
  echo "  ✗ sitemap.xml invalid or missing"
  FAILED=$((FAILED + 1))
fi

# Check 7: Security headers
echo "🔍 Check 7: Security headers..."
HEADERS=$(curl -sSI "$BASE_URL/" 2>/dev/null)

if echo "$HEADERS" | grep -iq "x-content-type-options: nosniff"; then
  echo "  ✓ X-Content-Type-Options header present"
else
  echo "  ⚠ X-Content-Type-Options header missing"
fi

if echo "$HEADERS" | grep -iq "x-frame-options: deny"; then
  echo "  ✓ X-Frame-Options header present"
else
  echo "  ⚠ X-Frame-Options header missing"
fi

if echo "$HEADERS" | grep -iq "strict-transport-security"; then
  echo "  ✓ HSTS header present"
else
  echo "  ⚠ HSTS header missing"
fi

# Check 8: Content-Type headers
echo "🔍 Check 8: Content-Type headers..."
if curl -sSI "$BASE_URL/index.html" | grep -iq "content-type: text/html"; then
  echo "  ✓ HTML Content-Type correct"
else
  echo "  ⚠ HTML Content-Type may be incorrect"
fi

echo ""
echo "════════════════════════════════════════════════════════════"

if [ $FAILED -eq 0 ]; then
  echo "✓ All checks passed! Deployment verified."
  echo ""
  echo "Site URL: $BASE_URL"
  echo "Next steps:"
  echo "  - Test the app in your browser"
  echo "  - Run Lighthouse audit: https://pagespeed.web.dev/"
  echo "  - Test offline mode (DevTools → Network → Offline)"
  echo "  - Install as PWA (Chrome: install button)"
  exit 0
else
  echo "✗ $FAILED check(s) failed. Review deployment."
  exit 1
fi
