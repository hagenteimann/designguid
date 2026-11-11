# FontGen AI - Frontend

> **Architecture note:** Runs entirely in the browser. The LLM (Gemini, OpenAI or Anthropic) is called directly with
> the user's own key and is only asked for *design parameters* (weight, width, x-height, contrast, squareness, slant,
> spacing, terminals, mono). A deterministic parametric engine in `src/lib/engine/` draws every glyph from stroke
> skeletons with an elliptical pen (consistent stems, overshoots, optical sidebearings), and `src/lib/fontBuilder.ts`
> merges overlaps (Clipper) and assembles the OTF with opentype.js. No backend is required; the Flask code in `../backend` is an unused legacy path.
> Not yet supported: serifs, kerning, italics beyond oblique slant.


A React 18 + TypeScript web application for generating custom fonts using AI-powered design tokens and interactive glyph editing.

## Features

- **API Key Management**: Secure sessionStorage-based API key entry with explicit security warnings
- **Prompt-Driven Design**: Text input + design-token chips (weight, contrast, style, mood)
- **Live Preview Panel**: Canvas-based glyph preview with selection tracking
- **QA Status**: Fontbakery integration for automated quality checks
- **Multi-Format Export**: OTF, TTF, and UFO formats
- **Design-Token Based**: Constrained parameter spaces for predictable output
- **Responsive UI**: Mobile-first TailwindCSS design system
- **Zero-External-Dependencies**: No CDN fonts/icons, all assets inline

## Tech Stack

- **React 18.3** with TypeScript
- **Vite** for fast builds and dev server
- **TailwindCSS** for styling
- **React Query** for API state management
- **Canvas 2D** for font preview rendering

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd /home/user/designguid/Projekt/fontgen-ai/frontend

# Install dependencies
npm install

# Set up environment (optional)
cp .env.example .env.local
```

### Development

```bash
# Start dev server (runs on http://localhost:5173)
npm run dev

# Type check
npm run type-check
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# For GitHub Pages deployment
npm run build:gh-pages
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ApiKeyInput.tsx      # API key entry + security warning
│   │   ├── PromptBuilder.tsx    # Text input + design-token chips
│   │   ├── PreviewPanel.tsx     # Canvas-based glyph display
│   │   └── OutputPanel.tsx      # Export buttons + QA status
│   ├── services/
│   │   └── api.ts               # API client + utilities
│   ├── App.tsx                  # Main application layout
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── public/
│   └── index.html               # HTML template with CSP headers
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind design tokens
├── postcss.config.js           # PostCSS + Autoprefixer
└── package.json
```

## Key Design Decisions

### API Key Security

API keys are stored in **sessionStorage** (not localStorage) to ensure they are cleared on browser tab close. This is explicit client-side architecture:

- Keys are NOT stored permanently
- Keys ARE exposed to the browser environment
- Use **spend-limited keys only** (from OpenAI, Claude, or custom endpoints)
- See `ApiKeyInput` component for explicit user consent flow

### Design Tokens

Rather than free-form styling, users select from constrained token sets:

- **Weight**: light, regular, bold
- **Contrast**: low, medium, high
- **Style**: serif, sans, mono
- **Mood**: elegant, playful, technical

This improves generative model predictability.

### Canvas Preview

The `PreviewPanel` uses HTML5 Canvas 2D for efficient rendering of:
- Glyph grids (96+ characters)
- Text preview with custom fonts
- Selection highlighting

Falls back gracefully if font fails to load.

### Export Workflow

Three export formats:
- **OTF**: For installation and design software
- **TTF**: Universal fallback
- **UFO**: For further editing in FontLab, Glyphs, etc.

Export buttons are disabled until:
1. Font has been generated
2. QA checks have passed
3. Export is not in progress

## API Integration

The frontend expects a backend at `/api/generate` with POST request:

```typescript
POST /api/generate
{
  "prompt": "A modern sans-serif with high contrast",
  "apiKey": "sk-...",
  "designTokens": {
    "weight": "regular",
    "contrast": "high",
    "style": "sans",
    "mood": "elegant"
  }
}
```

Response structure:

```typescript
{
  "status": "success" | "pending" | "error",
  "fontUrl": "https://...",
  "glyphs": [
    {
      "char": "A",
      "unicode": 65,
      "svg": "M...",
      "width": 600
    }
  ],
  "qaStatus": {
    "passed": true,
    "checks": [...],
    "issues": []
  },
  "error": null
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Mobile browsers (iOS Safari 15+, Android Chrome 90+)

Uses CSS variables, modern ES2020, and optional chaining.

## Performance

- **Bundle Size**: ~150KB gzipped (React + TailwindCSS + QueryClient)
- **Initial Load**: <2s on 4G
- **Preview Rendering**: 60fps on Canvas
- **API Call**: 5-10s estimated generation time (varies by model)

## Security

### CSP Headers

```
default-src 'self'
script-src 'self'
style-src 'self' 'unsafe-inline'
font-src 'self' data:
connect-src 'self' https://api.openai.com https://api.anthropic.com
```

### Best Practices

- No inline JavaScript event handlers
- No eval() or Function() constructors
- All external fonts are WOFF2 self-hosted
- All icons are inline SVG
- API keys never logged or cached long-term

## Testing

```bash
# Type checking
npm run type-check

# Building
npm run build

# Full validation
npm run check
```

## Deployment

### GitHub Pages

```bash
# Build to docs/ folder
npm run build:gh-pages

# Push to GitHub
git add docs/
git commit -m "Deploy frontend to GitHub Pages"
git push origin main
```

### Custom Server

```bash
npm run build
# Serve dist/ folder with your preferred server
# Ensure /api/generate endpoints are proxied
```

## Environment Variables

See `.env.example` for all available options:

- `VITE_API_ENDPOINT`: Backend API URL (default: `/api`)
- `VITE_ENABLE_UFO_EXPORT`: Toggle UFO export (default: true)
- `VITE_ENABLE_FONTBAKERY_QA`: Toggle QA checks (default: true)
- `VITE_CACHE_FONTS`: Enable service worker caching (default: true)

## Contributing

1. Follow TypeScript strict mode
2. Use CSS classes from TailwindCSS or inline `<style>` tags
3. No external CDN resources (fonts, icons)
4. Keep components under 300 lines
5. Document component props with JSDoc comments

## License

Your generated fonts are yours to use. Attribution appreciated.

## Troubleshooting

### "Failed to fetch font"

- Check backend `/api/generate` endpoint is accessible
- Verify CORS headers if backend is on different origin
- Check browser console for specific error messages

### "API key error"

- Ensure key format is correct (starts with `sk-` for OpenAI/Claude)
- Verify spend limit is set on provider side
- Check network tab in DevTools for exact API response

### Canvas not rendering glyphs

- Open DevTools Console tab
- Check if font file is valid OTF/TTF
- Verify canvas context is available (`getContext('2d')`)
- Try different browser to isolate issue

## Support

For issues or feature requests, contact the FontGen AI team or create an issue in the main repository.
