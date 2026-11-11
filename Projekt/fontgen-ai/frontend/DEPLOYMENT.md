# FontGen AI Frontend - Deployment Guide

This document covers local setup, development, production builds, and GitHub Pages deployment.

## Prerequisites

- Node.js 18+ (use `nvm` or `fnm` for version management)
- npm 9+ or yarn
- Git
- Basic command-line familiarity

## Local Development

### 1. Install Dependencies

```bash
cd /home/user/designguid/Projekt/fontgen-ai/frontend
npm install
```

This installs:
- React 18 + React-DOM
- TypeScript
- Vite (dev server)
- TailwindCSS
- React Query
- Build tools

### 2. Start Dev Server

```bash
npm run dev
```

Output:
```
  VITE v5.0.7  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Open http://localhost:5173/ in your browser.

### 3. Environment Setup (Optional)

Create `.env.local` for custom settings:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_API_ENDPOINT=http://localhost:3000
VITE_ENABLE_ANALYTICS=false
VITE_APP_ENVIRONMENT=development
```

### 4. Backend Integration

The frontend expects a backend API at `/api/generate`. For local testing:

**Option A: Mock Backend (No Server Needed)**

```bash
# In browser console, run:
globalThis.mockBackend = true;
// Frontend will use mock responses
```

**Option B: Run Real Backend**

```bash
# In separate terminal, start backend:
cd ../backend
npm run dev
# Backend runs on http://localhost:3000
```

Frontend will automatically proxy requests to `http://localhost:3000/api/generate`.

### 5. Development Workflow

```bash
# Type checking
npm run type-check

# Build (test production build)
npm run build

# Preview production build locally
npm run preview
```

## Production Build

### Build for Distribution

```bash
npm run build
```

Outputs:
- `dist/index.html` - HTML entry point
- `dist/assets/app.*.js` - Application code
- `dist/assets/react.*.js` - React bundle
- `dist/assets/query.*.js` - React Query bundle
- `dist/assets/style.*.css` - Compiled styles

### Optimize Bundle

Check bundle size:
```bash
npm run build -- --analyze
# or use source-map-explorer
npx source-map-explorer 'dist/**/*.js'
```

Current size target: <150KB gzipped

### Generate Static Files (PWA)

```bash
npm run generate-static-files
```

Creates:
- `public/sw.js` - Service Worker for offline caching
- Precache manifest for PWA

## Deployment Targets

### GitHub Pages

#### Step 1: Configure Repository

```bash
# In your GitHub repository settings:
# - Go to Settings → Pages
# - Source: Deploy from a branch
# - Branch: main, /docs folder
```

#### Step 2: Update Vite Config (if needed)

```bash
# If deploying to /fontgen-ai/ subdirectory:
# Edit vite.config.ts
base: '/fontgen-ai/'
```

#### Step 3: Build & Deploy

```bash
# Build to docs/ folder
npm run build:gh-pages

# Commit and push
git add docs/
git commit -m "Deploy FontGen AI frontend to GitHub Pages"
git push origin main
```

Site will be available at: `https://yourusername.github.io/fontgen-ai/`

#### Step 4: Custom Domain (Optional)

```bash
# In your GitHub repository:
# 1. Settings → Pages → Custom domain
# 2. Enter: fontgen.yourdomain.com
# 3. Update DNS:
#    CNAME fontgen.yourdomain.com yourrepo.github.io
# 4. Wait for DNS propagation (5-15 min)
```

---

### Vercel

#### Step 1: Connect GitHub Repository

```bash
# Visit vercel.com, connect GitHub account
# Select this repository
```

#### Step 2: Configure Build Settings

```
Build Command: npm run build
Output Directory: dist
Environment: Production
```

#### Step 3: Deploy

```bash
# Vercel automatically deploys on push to main
# View deployment at: https://fontgen-ai.vercel.app
```

---

### Netlify

#### Step 1: Connect GitHub

```bash
# Visit netlify.com, connect GitHub account
# Select this repository
```

#### Step 2: Build Settings

```
Build command: npm run build
Publish directory: dist
```

#### Step 3: Environment Variables

```
VITE_API_ENDPOINT=https://api.fontgen.ai
VITE_ENABLE_ANALYTICS=true
```

#### Step 4: Deploy

```bash
# Netlify automatically deploys on push
# View at: https://fontgen-ai.netlify.app
```

---

### Self-Hosted (VPS / Docker)

#### Option A: Static File Server (Nginx)

```bash
# Build production
npm run build

# Copy dist/ to server
scp -r dist/ user@server.com:/var/www/fontgen-ai/

# Nginx config
server {
    listen 80;
    server_name fontgen.example.com;
    root /var/www/fontgen-ai;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache fonts & assets
    location ~* \.(js|css|png|jpg|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Option B: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build & run:
```bash
docker build -t fontgen-ai:latest .
docker run -p 80:80 fontgen-ai:latest
```

---

## Security Headers

### GitHub Pages (Limited Control)

GitHub Pages automatically sets:
- `Content-Security-Policy`: ⚠ Permissive (limited customization)
- `X-Frame-Options`: DENY
- `X-Content-Type-Options`: nosniff

### Nginx (Full Control)

Add to `nginx.conf`:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https://api.openai.com https://api.anthropic.com; img-src 'self' data: blob:; object-src 'none';" always;
```

---

## Environment Variables (Production)

Create `.env.production`:

```
VITE_API_ENDPOINT=https://api.fontgen.ai
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
VITE_ENABLE_OFFLINE_MODE=true
VITE_SW_ENABLED=true
```

Build with production env:
```bash
NODE_ENV=production npm run build
```

---

## Performance Optimization

### Bundle Analysis

```bash
# Install analyzer
npm install --save-dev rollup-plugin-analyzer

# Add to vite.config.ts
import analyzer from 'rollup-plugin-analyzer'

plugins: [
  analyzer({ summaryOnly: true })
]

# Build & view report
npm run build
```

### Image Optimization

All assets are already optimized:
- ✓ Icons: Inline SVG (not files)
- ✓ Fonts: Self-hosted WOFF2
- ✓ CSS: Tailwind purged (only used classes)
- ✓ JavaScript: Terser minified + code split

### CDN Configuration

Recommend CloudFlare:

```bash
# 1. Add domain to CloudFlare (free plan)
# 2. Update nameservers
# 3. Enable caching:
#    - Cache Level: Standard
#    - Browser Cache TTL: 1 hour (for index.html)
#    - Cache TTL: 24 hours (for assets)
# 4. Enable compression:
#    - Enable Brotli compression
```

---

## Monitoring & Analytics

### Error Tracking (Sentry)

Add to `src/main.tsx`:

```typescript
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: 'production',
    integrations: [
      new Sentry.Replay()
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
  })
}
```

### Analytics (Optional - Respect Privacy)

Use privacy-respecting analytics:
- Plausible Analytics
- Fathom Analytics
- GoAccess (self-hosted)

Avoid: Google Analytics, Mixpanel (send user data to third parties)

---

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Build
        run: npm run build:gh-pages
      
      - name: Commit changes
        run: |
          git config --global user.email "ci@example.com"
          git config --global user.name "CI Bot"
          git add docs/
          git commit -m "Deploy to GitHub Pages [skip ci]"
          git push
```

---

## Testing Before Deployment

### Pre-Deploy Checklist

- [ ] `npm run type-check` passes (no TypeScript errors)
- [ ] `npm run build` succeeds
- [ ] `npm run preview` loads in browser
- [ ] Try all UI interactions:
  - [ ] Enter API key
  - [ ] Change design tokens
  - [ ] Type in prompt
  - [ ] Click Generate button
  - [ ] Try export buttons
- [ ] Check responsive design (mobile, tablet, desktop)
- [ ] Verify CSP headers in DevTools
- [ ] Test with slow network (DevTools throttle)
- [ ] Run Lighthouse audit: Target 90+ for all metrics
- [ ] Test offline (Service Worker): Static shell loads

### Lighthouse Audit

```bash
# Local audit
npm run build
npm run preview
# Open http://localhost:4173
# Press Ctrl+Shift+I → Lighthouse → Analyze

# Automated (requires lighthouse CLI)
npm install -g lighthouse
lighthouse https://fontgen.yourdomain.com --view
```

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

---

## Rollback Procedure

### GitHub Pages

```bash
# Revert last commit
git revert HEAD
git push origin main

# Or reset to previous version
git reset --hard HEAD~1
git push --force origin main
```

### Vercel / Netlify

- Automatic rollback via UI dashboard
- Or redeploy previous commit (auto-built)

---

## Debugging Deployed Site

### View Production Logs

```bash
# In browser DevTools:
# 1. Console tab: Check for errors
# 2. Network tab: View API requests
# 3. Application tab → Cache Storage: View PWA cache
```

### Check Service Worker

```javascript
// In console:
navigator.serviceWorker.getRegistrations()
  .then(regs => regs.forEach(r => console.log(r)))

// Check cache storage:
caches.keys().then(names => 
  Promise.all(names.map(n => caches.open(n)))
)
```

### Monitor API Performance

```javascript
// In console, monitor API calls:
const originalFetch = window.fetch;
window.fetch = (...args) => {
  const start = performance.now();
  return originalFetch(...args)
    .then(r => {
      const time = performance.now() - start;
      console.log(`Fetch ${args[0]} took ${time.toFixed(0)}ms`);
      return r;
    })
};
```

---

## Troubleshooting

### "Cannot find module '@vitejs/plugin-react'"

```bash
npm install --save-dev @vitejs/plugin-react
```

### Blank page after deploy

1. Check browser console for errors
2. Verify `vite.config.ts` has correct `base` path
3. Check Service Worker registration
4. Verify API endpoint is correct

### API requests failing

1. Check CORS headers on backend
2. Verify API endpoint URL in `.env.production`
3. Check browser Network tab for exact error
4. Ensure API key is valid

### Slow performance

1. Run Lighthouse audit
2. Check bundle size: `npm run build` (look for output)
3. Enable compression: Brotli on CDN / Nginx
4. Check CSS usage: TailwindCSS purge working?

---

## Backup & Recovery

### Export Site State

```bash
# Backup dist/ folder
zip -r fontgen-ai-backup-$(date +%Y%m%d).zip dist/

# Keep in secure storage
```

### Restore Previous Version

```bash
# From git history
git log --oneline
git show <commit>:dist/index.html > index.html.bak

# Or restore from .zip
unzip fontgen-ai-backup-20251110.zip -d dist/
```

---

## Performance Monitoring

### Real User Monitoring (RUM)

Use Web Vitals API:

```typescript
import { onCLS, onFID, onLCP } from 'web-vitals';

onCLS(metric => console.log('CLS:', metric.value));
onFID(metric => console.log('FID:', metric.value));
onLCP(metric => console.log('LCP:', metric.value));

// Target values (Core Web Vitals):
// LCP (Largest Contentful Paint): < 2.5s
// FID (First Input Delay): < 100ms
// CLS (Cumulative Layout Shift): < 0.1
```

---

## Support

For deployment issues:
1. Check Lighthouse audit results
2. Review browser console for errors
3. Test locally: `npm run dev` & `npm run preview`
4. Check API connectivity
5. Verify environment variables

For production incidents, contact the FontGen AI team.

---

*Deployment Guide v0.1.0 – FontGen AI Frontend*
