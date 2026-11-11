# Build Configuration Reference

## Build Process

The build process is configured in `vite.config.ts` and produces optimized, production-ready assets for GitHub Pages.

### Key Configuration

```typescript
// Base URL for GitHub Pages subdirectory
base: '/fontgen-ai/'

// Asset hashing for cache busting
assetFileNames: '[name].[hash][extname]'
entryFileNames: '[name].[hash].js'
chunkFileNames: '[name].[hash].js'

// Code splitting for better caching
manualChunks: {
  react: ['react', 'react-dom'],
  query: ['@tanstack/react-query']
}

// Minification
minify: 'terser'
target: 'ES2020'
```

### Output Structure

```
dist/
├── index.html                 # SPA entry point (CSP meta tags)
├── app.[hash].js              # Main application bundle
├── app.[hash].css             # Tailwind + app styles
├── react.[hash].js            # React vendor bundle
├── query.[hash].js            # React Query vendor bundle
├── sw.js                      # Service Worker (not hashed)
├── 404.html                   # GitHub Pages 404 fallback
├── manifest.json              # PWA manifest
├── robots.txt                 # SEO crawling rules
├── sitemap.xml                # XML sitemap
└── _headers                   # Security headers config
```

## Build Scripts

### Development

```bash
npm run dev
# Starts Vite dev server at http://localhost:5173
# Hot module replacement enabled
# Type checking on save
```

### Production Build

```bash
npm run build
# 1. Runs tsc (TypeScript compilation check)
# 2. Runs vite build
# 3. Runs npm run generate-static-files
# Output: dist/ folder ready for deployment
```

### Type Checking

```bash
npm run type-check
# Run tsc without emitting (check only)
# Useful for CI/CD before build
```

### Check All

```bash
npm run check
# Runs type-check and build sequentially
# Ensures no errors before deployment
```

## Optimization Targets

### Bundle Analysis

To analyze bundle size:

```bash
npm install -D rollup-plugin-visualizer

# Update vite.config.ts:
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ]
})

npm run build
# Opens bundle visualization in browser
```

### Performance Budgets

Target sizes (gzipped):

- `app.*.js`: < 300 KB
- `react.*.js`: < 150 KB
- `query.*.js`: < 50 KB
- `app.*.css`: < 50 KB
- Total initial load: < 500 KB

### Tree Shaking

Ensure unused code is removed:

```javascript
// ✓ Good (tree-shakeable)
export function feature() { ... }
import { feature } from './module'

// ✗ Bad (not tree-shakeable)
export default { feature: () => ... }
```

## Environment Variables

### Available in Build

Variables prefixed with `VITE_` are embedded in build:

```
VITE_OPENAI_API_BASE=https://api.openai.com
VITE_APP_VERSION=0.1.0
```

Access in code:

```typescript
const apiBase = import.meta.env.VITE_OPENAI_API_BASE
const version = import.meta.env.VITE_APP_VERSION
```

### Build-Time Replacements

Vite replaces these at build time:

```typescript
// Replaced with 'development' | 'production'
import.meta.env.MODE

// Replaced with boolean
import.meta.env.DEV    // true in dev, false in build
import.meta.env.PROD   // false in dev, true in build
```

## GitHub Pages Deployment

### Automatic (Recommended)

The `.github/workflows/deploy.yml` workflow:

1. Checks out code
2. Installs dependencies (`npm ci`)
3. Type checks (`npm run type-check`)
4. Builds (`npm run build`)
5. Generates static files (`npm run generate-static-files`)
6. Uploads artifact
7. Deploys to GitHub Pages

**Trigger:** Push to `main` or `master` branch

**Result:** Site live at `https://[owner].github.io/fontgen-ai/`

### Deployment Checklist

- [ ] All tests pass
- [ ] `npm run type-check` passes
- [ ] `npm run build` completes without errors
- [ ] No console errors or warnings
- [ ] CSP meta tags correct in index.html
- [ ] Service Worker registers without errors
- [ ] Lighthouse score ≥90%
- [ ] Offline mode works
- [ ] API endpoints accessible

## Troubleshooting

### Build fails with "module not found"

```bash
npm ci                    # Clean install (use in CI)
npm cache clean --force
npm run build
```

### Build succeeds but site doesn't load

Check:
1. `base: '/fontgen-ai/'` in vite.config.ts
2. CSS/JS paths in index.html (should be relative)
3. GitHub Pages settings: source = "main" branch, "/docs" folder

### Build size too large

1. Check bundle analysis (visualizer)
2. Remove unused dependencies: `npm prune`
3. Lazy load routes with React.lazy()
4. Check for large images (convert to WebP)
5. Tree-shake unused exports

### Service Worker not updating

Cache versioning in `public/sw.js`:

```javascript
const CACHE_NAME = 'fontgen-ai-v2';  // Increment version
```

Old caches deleted automatically on activation.

### CORS errors when fetching API

Check CSP header in index.html:

```html
<meta http-equiv="Content-Security-Policy" content="
  connect-src 'self' https://api.openai.com https://api.anthropic.com;
">
```

Add domain to `connect-src` if missing.

## References

- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [Code Splitting](https://vitejs.dev/guide/ssr.html#code-splitting)
- [Environment Variables](https://vitejs.dev/guide/env-and-modes.html)
- [GitHub Pages Docs](https://docs.github.com/en/pages/getting-started-with-github-pages)

