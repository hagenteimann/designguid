# FontGen AI – AI-Powered Font Generator

> Single-Page Application (SPA) running on GitHub Pages with Service Worker caching, PWA support, and full offline capabilities.

## Project Overview

FontGen AI combines:
- **Frontend:** React SPA with Vite bundler, Tailwind CSS, TypeScript
- **Backend:** Python microservice for font generation (OpenAI/Anthropic APIs)
- **Deployment:** GitHub Pages + GitHub Actions CI/CD
- **Caching:** Service Worker with precaching & network strategies
- **Security:** Content Security Policy, HSTS, X-Frame-Options

## Quick Links

- **Live Site:** https://hagenteimann.github.io/fontgen-ai/
- **Frontend Docs:** [/frontend/BUILD.md](./frontend/BUILD.md)
- **Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Architecture Report:** [reports/web-based_AI_font_generator_architecture.md](./reports/web-based_AI_font_generator_architecture.md)

## Directory Structure

```
fontgen-ai/
├── frontend/                    # React SPA
│   ├── src/                     # TypeScript source files
│   ├── public/                  # Static files (sw.js, manifest, robots.txt, etc.)
│   ├── dist/                    # Build output (generated)
│   ├── index.html               # SPA entry (with CSP meta tags)
│   ├── vite.config.ts           # Build configuration
│   ├── tailwind.config.js       # Tailwind CSS config
│   ├── tsconfig.json            # TypeScript config
│   └── package.json             # Dependencies & scripts
│
├── backend/                     # Python microservice
│   ├── src/                     # Python source files
│   ├── tests/                   # Test suite
│   └── requirements.txt         # Python dependencies
│
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions CI/CD
│
├── docs/                        # GitHub Pages deployment (generated)
├── DEPLOYMENT.md                # Complete deployment guide
├── README.md                    # This file
└── .gitignore                   # Git ignore rules
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 8+
- Git
- GitHub account

### Local Development

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev
# → http://localhost:5173/fontgen-ai/

# Type checking
npm run type-check

# Build for production
npm run build
```

## Deployment

### Automatic (Recommended)

The `.github/workflows/deploy.yml` workflow deploys automatically on push to main:

```bash
git add .
git commit -m "Deploy: fontgen-ai v0.1.0"
git push origin main
```

**Watch deployment:**
- GitHub Actions: https://github.com/[owner]/fontgen-ai/actions
- Site: https://[owner].github.io/fontgen-ai/

### Manual

```bash
cd frontend
npm run build                    # Build to dist/
mkdir -p ../docs
cp -r dist/* ../docs/           # Copy to GitHub Pages folder
touch ../docs/.nojekyll         # Disable Jekyll
git add docs/
git commit -m "Deploy: fontgen-ai"
git push origin main
```

## Key Features

### Frontend (React SPA)

- ✓ TypeScript for type safety
- ✓ Tailwind CSS for styling
- ✓ React Router for navigation (SPA)
- ✓ React Query for data fetching
- ✓ Responsive design (mobile-first)

### Deployment (GitHub Pages)

- ✓ Zero-cost hosting
- ✓ Automatic HTTPS
- ✓ CI/CD with GitHub Actions
- ✓ Custom domain ready

### Performance

- ✓ Code splitting (React, React Query vendors)
- ✓ Asset hashing for cache busting
- ✓ Minified bundles (Terser)
- ✓ Lighthouse target: 90+ score

### Caching (Service Worker)

- ✓ Precache app shell at install
- ✓ Network-first for API calls
- ✓ Cache-first for fonts & assets
- ✓ Offline fallback page
- ✓ Automatic cache versioning

### Security

- ✓ Content Security Policy (CSP)
- ✓ HSTS (Strict-Transport-Security)
- ✓ X-Frame-Options: DENY
- ✓ X-Content-Type-Options: nosniff
- ✓ Referrer-Policy: strict-origin-when-cross-origin
- ✓ No external fonts/icons (inline only)

### SEO & PWA

- ✓ robots.txt (crawling rules)
- ✓ sitemap.xml (SPA routes)
- ✓ manifest.json (PWA metadata)
- ✓ 404.html (SPA routing fallback)
- ✓ Installable on mobile & desktop

## Build Pipeline

### Scripts

```bash
npm run dev                      # Development server
npm run build                    # Production build
npm run preview                  # Preview production build
npm run type-check              # TypeScript validation
npm run check                    # Type check + build
npm run generate-static-files    # Copy static assets
```

### Build Output

```
dist/
├── index.html                   # SPA entry (CSP meta tags)
├── app.[hash].js                # Main bundle
├── react.[hash].js              # React vendor
├── query.[hash].js              # React Query vendor
├── app.[hash].css               # Styles
├── sw.js                        # Service Worker
├── 404.html                     # GitHub Pages fallback
├── manifest.json                # PWA metadata
├── robots.txt                   # SEO rules
└── sitemap.xml                  # XML sitemap
```

## API Endpoints

The app connects to external APIs:

| Service | Endpoint | Usage |
|---------|----------|-------|
| OpenAI | `https://api.openai.com` | Font generation (GPT) |
| Anthropic | `https://api.anthropic.com` | Font generation (Claude) |

### API Keys

Set in environment (not committed to repo):

```bash
VITE_OPENAI_API_KEY=sk-...
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

Injected at build time via `import.meta.env.VITE_*`

## Performance Targets

### Lighthouse Scores

- Performance: ≥85%
- Accessibility: ≥90%
- Best Practices: ≥85%
- SEO: ≥85%
- PWA: ≥80%

### Bundle Sizes (gzipped)

- Main app: < 300 KB
- React vendor: < 150 KB
- React Query: < 50 KB
- Styles: < 50 KB
- **Total: < 500 KB**

## Troubleshooting

### Build Failures

```bash
npm ci                          # Clean install
npm cache clean --force
npm run build
```

### Service Worker Not Registering

Check browser console for errors. Ensure:
- `sw.js` exists in `dist/` folder
- CSP allows Service Worker script
- HTTPS enabled (GitHub Pages is HTTPS)

### Offline Mode Not Working

Test offline:
1. DevTools → Network tab
2. Uncheck "Disable cache"
3. Set throttling to "Offline"
4. Reload page
5. Should show offline fallback

### API Calls Blocked by CSP

CSP restricts API endpoints. Update in `index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="
  connect-src 'self' https://new-api.example.com;
">
```

## Environment Variables

### Build Time

Set in `.env.local`:

```
VITE_OPENAI_API_BASE=https://api.openai.com
VITE_APP_VERSION=0.1.0
```

Access in code:

```typescript
const apiBase = import.meta.env.VITE_OPENAI_API_BASE
```

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Add my feature"`
4. Push branch: `git push origin feature/my-feature`
5. Open pull request

## Testing

Run checks before deployment:

```bash
npm run type-check              # TypeScript validation
npm run build                   # Production build
./check-deployment.sh           # Verify deployment (post-deploy)
```

## Deployment Checklist

- [ ] `npm run type-check` passes
- [ ] `npm run build` succeeds
- [ ] No console errors
- [ ] CSP headers correct
- [ ] Service Worker registers
- [ ] Lighthouse score ≥90%
- [ ] Offline mode works
- [ ] API accessible
- [ ] PWA installs on mobile

## Security

### CSP Headers

All inline scripts/styles blocked except:
- `<meta http-equiv="Content-Security-Policy">`
- Service Worker registration in `index.html`
- Tailwind CSS (inline styles safe with CSP)

### External Resources

- **Fonts:** Self-hosted WOFF2 only
- **Icons:** Inline SVG only
- **APIs:** Whitelist only (OpenAI, Anthropic)
- **Scripts:** No external CDNs

## Performance Optimization

### Techniques Used

1. **Code Splitting:** React, React Query as vendor bundles
2. **Asset Hashing:** Cache busting with `[hash]` in filenames
3. **Minification:** Terser for JS, inline CSS optimization
4. **Caching:** Service Worker precache + versioning
5. **Lazy Loading:** React.lazy() for route-based code splitting

### Monitoring

- Run Lighthouse audit: https://pagespeed.web.dev/
- Check bundle size: `npm run build` output
- Monitor Core Web Vitals in Google Search Console

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [GitHub Pages](https://docs.github.com/pages)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

## License

Specify license here (e.g., MIT, Apache 2.0)

## Support

For issues or questions:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section
2. Open GitHub issue
3. Review [reports/web-based_AI_font_generator_architecture.md](./reports/web-based_AI_font_generator_architecture.md)

---

**Status:** Production Ready ✓  
**Last Updated:** 2026-11-11  
**Version:** 0.1.0
