# FontGen AI Frontend - Architecture Guide

## Overview

The FontGen AI frontend is a React 18 + TypeScript application designed to:
1. Accept user-supplied API keys (OpenAI/Claude/custom)
2. Allow users to describe fonts via text + design-token chips
3. Display live preview of generated glyphs
4. Show QA status and export options
5. Integrate with a backend font generation pipeline

The architecture follows **design-token-driven constraints** to improve generative model predictability and **sessionStorage-only key management** for security.

## Component Architecture

### Entry Point: `main.tsx`

```
React App + QueryClient Provider
  ↓
App.tsx (Main Layout & State)
  ├── ApiKeyInput (Modal - shown if no key)
  ├── Header (Title + Reset Button)
  └── Main Grid (3-column on desktop, 1-column on mobile)
      ├── Left Panel (Sticky)
      │   └── PromptBuilder
      │       ├── Prompt textarea
      │       ├── Quick templates
      │       └── Design token chips (Weight/Contrast/Style/Mood)
      │
      └── Right Panels (Tabbed)
          ├── Tab: "Generate" (Preview & Output)
          │   ├── PreviewPanel (Canvas-based glyph grid)
          │   └── OutputPanel (QA status + export buttons)
          │
          └── Tab: "Edit" (Glyph Editor - external component)
```

### Component Responsibilities

#### `App.tsx` - Main orchestrator

- **State Management**:
  - `apiKey`: API key string from sessionStorage
  - `hasApiKey`: Boolean flag (triggers modal)
  - `prompt`: Current font description text
  - `designTokens`: Selected design-token values
  - `tab`: Active tab (generate/edit)
  - `generationResult`: API response with glyphs + QA status

- **API Integration**:
  - Uses React Query for `generateFont()` calls
  - Triggers generation when user clicks "Generate Font"
  - Handles loading/error states
  - Stores API key in sessionStorage on first entry

- **Key Methods**:
  - `handleApiKeySubmit(key)`: Save key → sessionStorage → enable app
  - `handlePromptChange(prompt, tokens)`: Update state → live preview trigger
  - `handleGenerate()`: Validate → trigger React Query → show spinner
  - `handleResetApiKey()`: Clear sessionStorage → reset UI

#### `ApiKeyInput.tsx` - Security gating

- **Purpose**: First-run modal ensuring user consent
- **Props**:
  - `onSubmit`: Called with validated key
  - `isLoading`: Disables form during submission

- **Features**:
  - Password-masked input with Show/Hide toggle
  - Explicit consent checkbox (must be checked to continue)
  - Security warning listing key exposure risks
  - Support for OpenAI (`sk-...`) and Claude (`sk-ant-...`) keys
  - Validation: key must be >8 chars (basic format check)

- **Security Design**:
  - No API call to validate key (prevents credential leaks on typo)
  - No localStorage fallback (only sessionStorage)
  - Warning text explicitly states "Your API key will be... exposed to this website"
  - No error message that reveals whether key is valid (prevents enumeration)

#### `PromptBuilder.tsx` - Design input interface

- **Props**:
  - `onPromptChange`: Called when prompt or tokens change
  - `isLoading`: Disables inputs during generation

- **State**:
  - `prompt`: Textarea value
  - `tokens`: Selected design-token values

- **Features**:
  - Textarea (placeholder guidance)
  - Character counter (0–500 chars)
  - Quick-start templates (6 pre-written examples)
  - Design-token chips organized in 4 categories:
    - **Weight**: light, regular, bold (affects stroke thickness)
    - **Contrast**: low, medium, high (affects stroke-to-counter ratio)
    - **Style**: serif, sans, mono (affects form family)
    - **Mood**: elegant, playful, technical (affects spacing/terminals)

- **Interaction Pattern**:
  - Clicking a template fills textarea
  - Clicking a token chip updates selection (visual toggle: primary-300 bg)
  - Every change calls `onPromptChange()` → App state updates → PreviewPanel may re-render

#### `PreviewPanel.tsx` - Canvas-based glyph display

- **Props**:
  - `glyphs`: Array of GlyphInfo objects
  - `isLoading`: Shows spinner during generation
  - `fontUrl`: URL to generated font file

- **Rendering Strategy**:
  - Uses HTML5 Canvas 2D (faster than SVG/WebGL for grids)
  - Scales to `window.devicePixelRatio` for retina displays
  - Renders glyph grid (rows × cols auto-calculated)
  - Each cell shows glyph character centered
  - Selected glyph highlighted with primary-200 background

- **Fallback Behavior**:
  - Empty state: "No glyphs generated yet"
  - Loading: "Generating glyphs..."
  - Font load error: Falls back to glyph grid (no custom font)

- **Click Handling**:
  - Calculate which glyph was clicked by cell position
  - Update `selectedGlyph` state → re-render details panel

- **Glyph Details Panel**:
  - Shows selected glyph character (large display)
  - Unicode codepoint (e.g., U+0041 for 'A')
  - Glyph width in font units

#### `OutputPanel.tsx` - QA status and export workflow

- **Props**:
  - `qaStatus`: QA check results (checks array, issues array)
  - `fontUrl`: URL to font file
  - `isLoading`: Disables buttons during generation
  - `onExport`: Callback after export

- **QA Status Display**:
  - Overall pass/fail badge (green/amber)
  - List of checks (✓ passed, ◆ warning)
  - Issues section (if any)

- **Export Buttons**:
  - Three buttons: OTF, TTF, UFO
  - Disabled until:
    - Font URL is populated
    - QA checks pass
    - Not currently loading
  - Clicking triggers `exportFont()` → `downloadFont()`
  - Shows spinner while exporting

- **Format Information**:
  - Explains each format (OTF: design software, TTF: universal, UFO: editing)

#### `api.ts` - Backend communication service

- **Core Functions**:

  ```typescript
  generateFont(request: GenerateRequest, onProgress?: callback)
    → POST /api/generate
    → Returns: GenerateResponse
  
  exportFont(fontUrl: string, format: 'otf'|'ttf'|'ufo')
    → Fetches binary font file
    → Returns: Blob with correct MIME type
  
  downloadFont(blob: Blob, filename: string)
    → Creates object URL
    → Triggers download via <a> element
    → Cleans up URL
  ```

- **Request Validation**:
  - `isValidApiKey(key)`: Returns true if key looks reasonable (>8 chars)
  - `generateFont()` validates prompt + key before POST

- **Error Handling**:
  - Network errors → Caught in try/catch → Returns `{ status: 'error', error: message }`
  - HTTP errors (non-2xx) → Reads response JSON → Returns error object
  - No retry logic (handled by React Query)

- **Utility Functions**:
  - `getEstimatedTime(tokens)`: Returns ms based on token complexity
  - `formatFileSize(bytes)`: Returns "1.23 MB" string
  - `getExportFormats()`: Returns available export formats

## State Flow

### Initialization

```
User opens app
  ↓
sessionStorage has api_key?
  ├─ YES → Load into state → Show App UI
  └─ NO → Show ApiKeyInput modal
```

### API Key Entry

```
User submits form
  ↓
Check consent + validate key
  ↓
POST to backend validation (optional)
  ↓
Store in sessionStorage
  ↓
Update state → Show App UI
```

### Font Generation Flow

```
User enters prompt + selects tokens
  ↓
State updates via PromptBuilder
  ↓
User clicks "Generate Font"
  ↓
App validates prompt (not empty)
  ↓
React Query triggers generateFont()
  ↓
API.generateFont() POST /api/generate
  {
    "prompt": "...",
    "apiKey": "...",
    "designTokens": { ... }
  }
  ↓
Backend processes (5-10s typical)
  ↓
Response:
  {
    "status": "success",
    "fontUrl": "...",
    "glyphs": [
      { "char": "A", "unicode": 65, "width": 600 },
      ...
    ],
    "qaStatus": { ... }
  }
  ↓
PreviewPanel renders glyph grid
OutputPanel shows QA status
Export buttons become enabled
```

### Export Flow

```
User clicks "OTF" button
  ↓
exportFont(fontUrl, 'otf')
  ├─ Fetch fontUrl
  ├─ Create Blob with MIME type 'font/otf'
  └─ Return Blob
  ↓
downloadFont(blob, 'generated-font.otf')
  ├─ Create object URL
  ├─ Create <a> element
  ├─ Trigger click
  └─ Clean up
  ↓
Browser downloads file
```

## Backend Integration Contract

### API Endpoint: `POST /api/generate`

**Request:**
```json
{
  "prompt": "Modern sans-serif with high contrast",
  "apiKey": "sk-...",
  "designTokens": {
    "weight": "regular",
    "contrast": "high",
    "style": "sans",
    "mood": "elegant"
  }
}
```

**Response (Success):**
```json
{
  "status": "success",
  "fontUrl": "https://cdn.example.com/fonts/abc123.otf",
  "glyphs": [
    {
      "char": "A",
      "unicode": 65,
      "svg": "M 100,0 L 500,700 L 600,700 L 1100,0 L 900,0 L ...",
      "width": 600
    },
    ...95 more glyphs...
  ],
  "qaStatus": {
    "passed": true,
    "checks": [
      { "name": "Glyph Count", "passed": true },
      { "name": "Kerning Pairs", "passed": false, "message": "No kerning pairs found" },
      { "name": "Meta Info", "passed": true }
    ],
    "issues": [
      "Some accented characters missing - use composition from base glyphs"
    ]
  }
}
```

**Response (Error):**
```json
{
  "status": "error",
  "error": "API rate limit exceeded"
}
```

**Response (Pending/Polling):**
```json
{
  "status": "pending",
  "estimatedTime": 7000
}
```

### CORS & Security Headers

Frontend expects:
- `Access-Control-Allow-Origin: *` or `https://[frontend-domain]`
- `Access-Control-Allow-Methods: POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

### Timeout & Retry

- React Query retries once on 5xx errors
- Frontend shows spinner with estimated time
- Frontend has no client-side timeout (relies on HTTP timeout)

## Data Structures

### TypeScript Interfaces (from `api.ts`)

```typescript
interface DesignTokens {
  weight: 'light' | 'regular' | 'bold';
  contrast: 'low' | 'medium' | 'high';
  style: 'serif' | 'sans' | 'mono';
  mood: 'elegant' | 'playful' | 'technical';
}

interface GenerateRequest {
  prompt: string;
  apiKey: string;
  designTokens: DesignTokens;
}

interface GenerateResponse {
  status: 'pending' | 'success' | 'error';
  fontUrl?: string;
  glyphs?: GlyphInfo[];
  qaStatus?: QAStatus;
  error?: string;
  estimatedTime?: number;
}

interface GlyphInfo {
  char: string;
  unicode: number;
  svg?: string;
  width?: number;
}

interface QAStatus {
  passed: boolean;
  checks: QACheck[];
  issues: string[];
}

interface QACheck {
  name: string;
  passed: boolean;
  message?: string;
}
```

## Styling & Design Tokens

### TailwindCSS Configuration

- **Breakpoints**: `md: 768px`, `lg: 1024px`, `xl: 1280px`
- **Colors**: Primary (blue/cyan), Neutral (gray), functional (green/red)
- **Spacing**: 8px base grid (`space-100` = 4px, `space-500` = 32px, etc.)
- **Border Radius**: `radius-md` = 8px, `radius-lg` = 16px

### Responsive Design

- **Mobile first**: Single column on mobile
- **Tablet** (`md`): Two-column layout (left panel still sticky)
- **Desktop** (`lg`): Three-column grid (left panel + right panels)

### Dark Mode (Future)

All color values use HSL format for easy theming:
```css
--color-primary-300: hsl(210, 100%, 60%);
--color-neutral-700: hsl(0, 0%, 5%);
```

## Performance Optimizations

### Bundle Size

- React 18.3: ~42KB
- TailwindCSS: ~30KB (purged)
- React Query: ~25KB
- App code: ~35KB
- **Total**: ~150KB gzipped

### Code Splitting

Vite automatically chunks:
- `react.js`: React + React-DOM
- `query.js`: React Query
- `app.js`: App + components + services

### Canvas Rendering

- Uses `window.devicePixelRatio` for retina displays
- Offscreen canvas for complex glyphs (future)
- Minimal redraws (only on state change)

### Query Caching

- React Query caches generation results
- Prevents duplicate API calls
- `staleTime: Infinity` (generated fonts don't change)

## Security Considerations

### API Key Management

✓ Stored in **sessionStorage** only (cleared on tab close)
✗ Never logged to console
✗ Never sent in headers (except to backend)
✗ No localStorage fallback
✗ No IndexedDB storage

### Content Security Policy (CSP)

Meta tag in `index.html`:
```
default-src 'self'
script-src 'self'
style-src 'self' 'unsafe-inline'
font-src 'self' data:
connect-src 'self' https://api.openai.com https://api.anthropic.com
```

### Input Validation

- Prompt: Max 500 chars (enforced by textarea UI)
- API key: Basic format check (>8 chars)
- Design tokens: Enum validation (only allowed values)

### No External Dependencies

✓ All fonts local WOFF2
✓ All icons inline SVG
✗ No Google Fonts CDN
✗ No Font Awesome / icon CDN
✗ No third-party analytics

## Extensibility

### Adding New Design Tokens

1. Update `DesignTokens` interface in `api.ts`
2. Add new option array to `DESIGN_TOKENS` object in `PromptBuilder.tsx`
3. Add UI chips for the new token
4. Pass to backend in `generateFont()` call

### Adding New Export Formats

1. Add format to `EXPORT_FORMATS` in `api.ts`
2. Add export button to `OutputPanel.tsx`
3. Implement format conversion (if needed) in backend

### Adding QA Checks

Backend adds checks to `qaStatus.checks` array:
```typescript
{
  "name": "Descenders",
  "passed": true,
  "message": "All lowercase letters have correct descender depth"
}
```

Frontend automatically displays them.

### Integrating Glyph Editor

Replace the "Edit" tab content:
```tsx
{tab === 'edit' && (
  <GlyphEditorComponent
    fontUrl={generationResult?.fontUrl}
    onSave={(updatedFont) => { /* Save logic */ }}
  />
)}
```

## Development Workflow

### Local Development

```bash
# Start dev server
npm run dev

# In another terminal, start mock backend
node mock-server.js
```

### Testing API Integration

Use Postman/curl to test backend:
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Test font",
    "apiKey": "sk-test",
    "designTokens": { "weight": "regular", "contrast": "medium", "style": "sans", "mood": "elegant" }
  }'
```

### Debugging

- Open DevTools Console tab
- React Query DevTools (install extension for real-time query state)
- Network tab to inspect API requests/responses

## Known Limitations

1. **No multilingual support** (MVP: Latin only)
2. **No kerning** (not generated, export includes basic spacing)
3. **No hinting** (fonts are unhinted, may be fuzzy on small sizes)
4. **No variable fonts** (single weight only)
5. **No real-time preview** while typing (waits for generation call)

## Future Enhancements

1. **Glyph Editor**: Paper.js-based bezier curve editing
2. **Undo/Redo**: Command pattern history
3. **Variable Fonts**: Weight axis + interpolation
4. **Multilingual**: Support accents, non-Latin scripts
5. **Collaboration**: Share font settings, version history
6. **Mobile App**: Electron or React Native wrapper

## Deployment Checklist

- [ ] Environment variables set (`.env.local`)
- [ ] CSP headers verified in HTML
- [ ] CORS headers configured on backend
- [ ] API endpoint URL correct
- [ ] Service Worker precaching tested
- [ ] Lighthouse audit >90 on all metrics
- [ ] Mobile responsiveness tested
- [ ] Export formats tested
- [ ] Error states tested (no API key, network timeout, etc.)
- [ ] Accessibility audit (WCAG AA)

## Support & Issues

See README.md for troubleshooting guide. For architectural questions, refer to the main repository's ARCHITECTURE.md.
