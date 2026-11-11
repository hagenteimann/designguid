# FontGen AI – Deployment & Infrastructure Guide

This document covers the complete deployment pipeline for FontGen AI, a React SPA running on GitHub Pages with Service Worker caching, security headers, and PWA support.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Pages (Static)                     │
│              https://hagenteimann.github.io/fontgen-ai/      │
├─────────────────────────────────────────────────────────────┤
│  index.html (SPA entry, CSP headers, SW registration)       │
│  ↓                                                             │
│  React App (Vite bundled, code-split)                        │
│  ├─ app.[hash].js (main bundle)                              │
│  ├─ react.[hash].js (vendor)                                 │
│  ├─ query.[hash].js (vendor)                                 │
│  └─ app.[hash].css                                           │
│  ↓                                                             │
│  Service Worker (sw.js)                                       │
│  ├─ Precaches app shell at install                           │
│  ├─ Network-first for API calls                              │
│  ├─ Cache-first for fonts & static assets                    │
│  └─ Offline fallback page                                    │
├─────────────────────────────────────────────────────────────┤
│  Security:                                                   │
│  ✓ CSP (no eval, no external fonts/icons)                   │
│  ✓ HSTS (Strict-Transport-Security)                         │
│  ✓ X-Frame-Options: DENY                                    │
│  ✓ X-Content-Type-Options: nosniff                          │
│  ✓ Referrer-Policy: strict-origin-when-cross-origin         │
├─────────────────────────────────────────────────────────────┤
│  Static Files:                                               │
│  ✓ robots.txt (SEO crawling rules)                          │
│  ✓ sitemap.xml (SPA routes indexed)                         │
│  ✓ manifest.json (PWA metadata)                             │
│  ✓ 404.html (SPA routing fallback)                          │
│  ✓ .nojekyll (disable Jekyll processing)                    │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Prerequisites

- Node.js 18+ 
- npm 8+
- Git
- GitHub account with repo access

### 2. Initial Setup

```bash
cd frontend

# Install dependencies
npm install

# Development server (hot reload)
npm run dev
# Access: http://localhost:5173/fontgen-ai/

# Type checking
npm run type-check

# Production build
npm run build
# Output: dist/ folder (ready for GitHub Pages)
```

### 3. Deployment (GitHub Pages)

#### Option A: Automatic (Recommended)

The GitHub Actions workflow deploys automatically on push to `main`:

```bash
git add .
git commit -m "Deploy: fontgen-ai v0.1.0"
git push origin main
```

**Watch the deployment:**
- Go to: https://github.com/[owner]/fontgen-ai/actions
- Monitor the "Deploy to GitHub Pages" workflow
- Site live at: https://[owner].github.io/fontgen-ai/

#### Option B: Manual

```bash
cd frontend

# Build locally
npm run build

# Copy to docs folder (GitHub Pages serves from /docs)
mkdir -p ../docs
cp -r dist/* ../docs/

# Create .nojekyll (disable Jekyll)
touch ../docs/.nojekyll

# Commit & push
git add docs/
git commit -m "Deploy: fontgen-ai"
git push origin main
```

## Build Pipeline

### Vite Configuration

The build process:

1. **Code Splitting**: Separate vendor chunks (React, React Query) for better caching
2. **Asset Hashing**: All assets get content-based hashes for cache busting
3. **Minification**: terser for JS, CSS, HTML
4. **Output**: `dist/` folder (copied to `docs/` for GitHub Pages)

```bash
npm run build
# Output structure:
# dist/
#  ├─ index.html (SPA entry)
#  ├─ app.a1b2c3d4.js
#  ├─ react.e5f6g7h8.js
#  ├─ query.i9j0k1l2.js
#  ├─ app.m3n4o5p6.css
#  ├─ sw.js (Service Worker)
#  ├─ 404.html
#  ├─ manifest.json
#  ├─ robots.txt
#  └─ sitemap.xml
```

### Static File Generation

Run after build:

```bash
npm run generate-static-files
```

This copies:
- `public/404.html` → `dist/404.html` (404 routing)
- `public/robots.txt` → `dist/robots.txt` (SEO)
- `public/sitemap.xml` → `dist/sitemap.xml` (SPA routes)
- `public/manifest.json` → `dist/manifest.json` (PWA)
- `public/sw.js` → `dist/sw.js` (Service Worker)
- `public/_headers` → `dist/_headers` (Security headers)

Creates: `dist/.nojekyll` (tells GitHub to skip Jekyll)

## Service Worker Strategy

### Caching Layers

1. **App Shell (Precache)**
   - `index.html`, core CSS, core JS
   - Downloaded at Service Worker install
   - Updated when app version changes

2. **Network-First (API Calls)**
   - Endpoint: `https://api.openai.com`, `https://api.anthropic.com`
   - Tries network first, falls back to cached response
   - Updates cache on success

3. **Cache-First (Fonts & Assets)**
   - Fonts: `.woff2`, `.woff`, `.ttf`, `.otf`
   - CSS/JS chunks: `[name].[hash].js`
   - Images: `.svg`, `.png`, `.webp`, etc.
   - Falls back to network if not cached

4. **Offline Fallback**
   - Generic offline page (503 Service Unavailable)
   - Shown when network unavailable and no cache

### Cache Versioning

The Service Worker implements versioning:

```javascript
const CACHE_NAME = 'fontgen-ai-v1';
```

To invalidate cache (e.g., after major update):
1. Increment version: `'fontgen-ai-v2'`
2. Old caches deleted on Service Worker activation
3. New precache fetched automatically

### Update Detection

The app detects Service Worker updates and prompts user to refresh:

```javascript
// Automatic registration in index.html
navigator.serviceWorker.register('/fontgen-ai/sw.js')
```

## Security Headers

### Content Security Policy (CSP)

```
default-src 'self'
script-src 'self'
style-src 'self' 'unsafe-inline'
font-src 'self' data:
connect-src 'self' https://api.openai.com https://api.anthropic.com
img-src 'self' data: blob:
object-src 'none'
base-uri 'self'
form-action 'self'
frame-ancestors 'none'
upgrade-insecure-requests
```

**Rules:**
- No inline scripts (except registration)
- No external fonts or icons
- Only 'self' and specific API endpoints allowed
- No object embedding (Flash, etc.)
- Force HTTPS

### Other Headers

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-XSS-Protection` | `1; mode=block` | XSS protection |
| `Strict-Transport-Security` | `max-age=31536000` | Force HTTPS for 1 year |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Privacy |
| `Permissions-Policy` | Deny all sensors | Disable unnecessary APIs |

## PWA Features

### manifest.json

Defines app metadata for:
- Install prompts
- App icon & name
- Display mode (standalone)
- Shortcuts (Generate, Editor)
- Share target (web share API)
- File handling (import fonts)

### Installation

1. **Browser Prompt**
   - Chrome: "Install app" button in address bar
   - Safari: "Add to Home Screen" in share menu
   - Firefox: "Install" button

2. **Installation Result**
   - App icon on home screen
   - Launch in standalone mode (no browser UI)
   - Offline access via Service Worker
   - Push notifications (if configured)

## Static Content

### 404.html

Implements SPA routing fallback:

```
User hits: /fontgen-ai/some-route
GitHub Pages can't find it → serves 404.html
JS redirects to /fontgen-ai/
React Router handles the route
```

**Alternative:** If GitHub Pages doesn't serve 404.html for missing routes:
- Configure repo settings: "Source" → Branch: main, Folder: /docs
- GitHub automatically serves 404.html for missing files

### robots.txt

SEO rules:

```
Allow: /                    (index all)
Disallow: /api/            (no API routes)
Sitemap: .../sitemap.xml   (SPA route map)
```

Blocks: GPTBot, CCBot, anthropic-ai (opt-out of AI training)

### sitemap.xml

XML sitemap for Google/Bing:

```xml
<url>
  <loc>https://hagenteimann.github.io/fontgen-ai/</loc>
  <priority>1.0</priority>
  <changefreq>weekly</changefreq>
</url>
```

Update manually or generate dynamically from route config.

## GitHub Actions CI/CD

### Workflow: `.github/workflows/deploy.yml`

**Trigger:** Push to `main` or `master`

**Steps:**

1. Checkout repository
2. Setup Node.js (18.x from matrix)
3. `npm ci` (clean install, reproducible)
4. `npm run type-check` (TypeScript validation)
5. `npm run build` (Vite + static file generation)
6. Run Lighthouse CI (performance, a11y, best practices)
7. Upload build artifact
8. Deploy to GitHub Pages (automatic if main branch)

**Deployment Output:**

```
✓ Build: PASSED
✓ Type Check: PASSED
✓ Lighthouse: Performance 90, A11y 95, Best Practices 90, SEO 95
✓ Deploy: Pages site updated
✓ URL: https://hagenteimann.github.io/fontgen-ai/
```

## Performance Optimization

### Lighthouse Targets

- **Performance:** ≥85% (LCP <2.5s, CLS <0.1)
- **Accessibility:** ≥90% (WCAG AA)
- **Best Practices:** ≥85% (HTTPS, no console errors)
- **SEO:** ≥85% (mobile-friendly, meta tags)
- **PWA:** ≥80% (manifest, SW, installable)

### Optimization Techniques

1. **Code Splitting**
   - React vendor in separate chunk
   - React Query in separate chunk
   - Lazy load routes (use React.lazy)

2. **Image Optimization**
   - Use WebP with PNG fallback
   - Compress with `sharp` or similar
   - Responsive images with srcset

3. **Font Optimization**
   - Local WOFF2 (fastest)
   - Preload critical fonts
   - Font subsetting (only needed glyphs)

4. **Caching**
   - Assets: `Cache-Control: public, immutable, max-age=31536000`
   - HTML: `Cache-Control: no-cache, no-store`
   - Service Worker: network-first for freshness

5. **Bundle Size**
   - Tree-shaking (remove unused code)
   - Minification (terser)
   - No large dependencies (check bundlesize)

## Monitoring & Maintenance

### Health Checks

```bash
# Local build
npm run build

# Type check
npm run type-check

# Lighthouse audit
npm run lighthouse

# Check CSP compliance
# → Browser DevTools → Console (no CSP errors)

# Test offline
# → DevTools → Network → Offline → refresh
# → Should show offline page
```

### Updating Dependencies

```bash
npm update                    # Update within version ranges
npm audit                     # Check for vulnerabilities
npm audit fix                 # Auto-fix security issues
npm outdated                  # Show outdated packages
```

### Deployment Checklist

- [ ] `npm run type-check` passes
- [ ] `npm run build` completes without errors
- [ ] No console errors or CSP violations
- [ ] Service Worker registers successfully
- [ ] Lighthouse score ≥90 (all categories)
- [ ] Offline mode works (404, offline page)
- [ ] Cache headers correct (DevTools → Network → Size column)
- [ ] PWA installs on mobile
- [ ] API calls to OpenAI/Anthropic work
- [ ] All routes accessible (404.html fallback works)

## Troubleshooting

### Issue: Build fails with "module not found"

```bash
npm ci                # Clean install
npm run type-check    # Check types
npm run build         # Rebuild
```

### Issue: Service Worker not registering

Check browser console:
```
✗ Service Worker registration failed
```

Ensure `sw.js` exists in `dist/` and CSP allows it.

### Issue: 404 page not serving for missing routes

GitHub Pages should auto-serve `404.html`. If not:
1. Go to repo → Settings → Pages
2. Ensure Source = "main" branch, "/docs" folder
3. Check 404.html exists in /docs/
4. Try clearing browser cache

### Issue: Cache not updating

Service Worker caching might be stale:

```javascript
// In DevTools Console
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
});
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
});
location.reload();
```

### Issue: API calls blocked by CSP

Check `connect-src` in CSP header. If API domain missing:

1. Update `index.html` CSP meta tag
2. Update `public/_headers` CSP
3. Rebuild and deploy

## Additional Resources

- [Vite Docs](https://vitejs.dev/)
- [GitHub Pages](https://docs.github.com/en/pages)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Last Updated:** 2026-11-11
**Status:** Production Ready ✓
