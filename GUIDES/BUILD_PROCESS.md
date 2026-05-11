# Build Process & Bundling

---

## Übersicht

Wie Quellcode (src/) zu Production-Code (public/) wird.

---

## Build Tools

### Moderne Build Tools (2026)
1. **Vite** (Modern, Fast) – empfohlen
2. **Webpack** (Traditionell, Flexibel)
3. **Parcel** (Zero-Config)
4. **esbuild** (Super-Schnell)

### Setup im package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

---

## Build Prozess (mit Vite)

```bash
npm run dev      # Development (mit Hot Reload)
npm run build    # Production (minified)
npm run preview  # Preview des Builds
```

### Development Mode
```
src/
├── App.tsx      (nicht minified)
├── styles/
└── components/

→ http://localhost:5173 (mit Auto-Reload)
```

### Production Build
```
src/ → npm run build → public/
dist/
├── index.html   (minified, Assets verlinkt)
├── js/
│   └── index-ABC123.js  (minified, hash)
├── css/
│   └── style-DEF456.css (minified, hash)
└── assets/
    └── image.webp
```

**Was passiert:**
- JavaScript minified & bundled
- CSS minified & bundled
- Assets optimiert & gehashed
- Source Maps erstellt (für Debugging)

---

## Optimization Flags

### CSS Minification
```javascript
// vite.config.js
export default {
  build: {
    minify: 'terser',  // JS Minifier
    cssMinify: true    // CSS Minifier
  }
}
```

### Tree Shaking (Unbenutzer Code entfernen)
```javascript
// Nur benutzte Funktionen bundeln
import { usedFunction } from './utils';  // ✅ Wird bundelt
// unusedFunction wird entfernt
```

### Code Splitting (Separate Bundles)
```javascript
// Dynamic Import
const modal = await import('./modal.js');  // Separat geladen
```

---

## Bundle Analysis

### Welche Libs größer sind?

```bash
npm install webpack-bundle-analyzer --save-dev
```

### Bundle Size reduzieren

**Checkliste:**
- [ ] Tree Shaking aktiv?
- [ ] Lazy Loading für große Components?
- [ ] Polyfills minimal?
- [ ] Minimale Dependencies?
- [ ] CSS nicht dupliziert?

**Tools:**
- Bundlephobia (Lib-Größe checken)
- Webpack Bundle Analyzer
- Lighthouse (Bundle Size Check)

---

## Pre-Deploy Build Checklist

Vor jedem Deploy:

```bash
npm run lint      # Code-Qualität
npm run test      # Unit Tests
npm run build     # Production Build
npm run preview   # Test Build lokal
```

**Checks:**
- [ ] Build erfolgreich (0 Errors)?
- [ ] No warnings/deprecated code?
- [ ] CSS/JS minified?
- [ ] Source Maps erstellt?
- [ ] Assets optimiert?
- [ ] Bundle Size OK? (< 500KB JS ideal)

---

## CI/CD Build Pipeline (GitHub Actions)

```yaml
name: Build & Deploy

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm install
      - run: npm run lint
      - run: npm run test
      - run: npm run build

      - name: Deploy
        if: github.ref == 'refs/heads/main'
        run: ./deploy.sh
```

---

## Build Artefakte

Nach `npm run build`:

```
dist/
├── index.html           (Entry Point)
├── js/
│   ├── index-HASH.js   (Minified, Hashed)
│   └── vendor-HASH.js  (Vendor libs)
├── css/
│   └── style-HASH.css  (Minified, Hashed)
└── assets/
    ├── image.webp
    ├── icon.svg
    └── fonts/
```

**Was zu deployen:**
- ✅ Alles im dist/ Ordner
- ❌ node_modules/ (nicht deployen!)
- ❌ src/ (nicht deployen!)

---

## Versioning mit Hash

```
index-ABC123.js  ← Hash ändert sich bei Änderungen
index-DEF456.js  ← Neue Version

Browsers können alte Version cachen:
- Wenn Hash gleich → Cache nutzen
- Wenn Hash unterschiedlich → Neu laden
```

→ Ermöglicht lange-term caching!

---

## Production Server Config

### .htaccess (Apache)
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

→ Single Page Apps funktionieren korrekt

### nginx Config
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## Cache Headers

Damit Browser alte Versionen cachen:

```apache
# .htaccess
<FilesMatch "\.js$|\.css$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

<FilesMatch "\.html$">
  Header set Cache-Control "public, max-age=0, must-revalidate"
</FilesMatch>
```

→ JS/CSS werden 1 Jahr gecacht (wegen Hash)
→ HTML wird immer neu geladen

---

## Debugging Production Build

```bash
npm run preview   # Testet Production Build lokal

http://localhost:4173  # Preview öffnen
```

**Wenn Problem im Production Build aber nicht Dev:**
- Check Source Maps
- Chrome DevTools → Sources Tab
- Suche nach Minified Code
- Verwende Source Maps zum Debuggen

---

## Build Troubleshooting

### "Build failed"
```bash
npm run build 2>&1 | head -20  # Erste 20 Fehler
```

### "Module not found"
```bash
# Dependency vergessen
npm install missing-package
```

### "Memory limit exceeded"
```bash
# Erhöhe Node Memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

---

*Build Process & Bundling – Push8 Web Agency – Stand Mai 2026*
