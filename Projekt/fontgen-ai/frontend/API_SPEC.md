# FontGen AI Backend API Specification

This document defines the contract between the frontend React application and the backend font generation service.

## Base URL

```
http://localhost:3000        # Development
https://api.fontgen.ai       # Production
```

## Authentication

API key authentication is **user-provided** and **passed by the frontend**. The backend should:

1. Accept API keys from third-party providers (OpenAI, Anthropic, custom)
2. Use the key to authenticate requests to the actual model provider
3. Never store the key persistently
4. Clear the key from memory after the request

### Example: OpenAI Integration

```typescript
// Backend receives request with user's OpenAI key
POST /api/generate {
  apiKey: "sk-proj-...",
  prompt: "...",
  designTokens: {...}
}

// Backend uses key to call OpenAI
const response = await openai.images.generate({
  api_key: request.apiKey,  // User's key, not backend key
  prompt: request.prompt,
  ...
})
```

## Endpoints

### POST /api/generate

Generate a single-weight font from a text prompt and design tokens.

#### Request

```typescript
{
  prompt: string;              // Max 500 chars, user's font description
  apiKey: string;              // OpenAI, Claude, or custom endpoint key
  designTokens: {
    weight: 'light' | 'regular' | 'bold';      // Stroke thickness hint
    contrast: 'low' | 'medium' | 'high';       // Stroke-to-counter ratio
    style: 'serif' | 'sans' | 'mono';          // Classification hint
    mood: 'elegant' | 'playful' | 'technical'; // Stylistic intent
  };
  
  // Optional fields for advanced users
  includeAccents?: boolean;    // Default: false (MVP: Latin only)
  outputFormat?: 'otf' | 'ttf' | 'ufo';  // Default: 'otf'
  qaCheckLevel?: 'strict' | 'normal' | 'relaxed'; // Default: 'normal'
}
```

#### Response (Success - HTTP 200)

```typescript
{
  status: 'success';
  fontUrl: string;             // URL to downloadable font file (OTF/TTF/UFO)
  fontData?: ArrayBuffer;      // Optional: inline font binary (base64 in JSON)
  glyphs: Array<{
    char: string;              // Single character ('A', 'a', '1', etc.)
    unicode: number;           // Unicode codepoint (65 for 'A')
    svg?: string;              // SVG path data for visualization (optional)
    width: number;             // Glyph advance width in font units
    height?: number;           // Glyph height (optional)
    advanceWidth: number;      // Same as width (for compatibility)
  }>;
  
  qaStatus: {
    passed: boolean;           // true if all checks pass
    checks: Array<{
      name: string;
      passed: boolean;
      message?: string;        // Human-readable explanation
      severity?: 'error' | 'warning' | 'info';
    }>;
    issues: string[];          // Known limitations/workarounds
  };
  
  generationMetrics?: {
    tokensUsed: number;        // Total tokens used (for cost tracking)
    generationTime: number;    // Time in milliseconds
    glyphCount: number;        // Number of glyphs generated
  };
  
  downloadUrl?: string;        // Alternative CDN URL if fontUrl is slow
}
```

#### Response (Error - HTTP 400/401/429/500)

```typescript
{
  status: 'error';
  error: string;               // Human-readable error message
  code?: string;               // Machine-readable code:
                               // 'invalid_api_key'
                               // 'rate_limit_exceeded'
                               // 'invalid_prompt'
                               // 'generation_failed'
                               // 'qa_checks_failed'
  details?: {
    field?: string;            // Field that failed (e.g., 'apiKey')
    message?: string;          // Additional context
    suggestedAction?: string;  // Hint for recovery
  };
}
```

#### Response (Pending - HTTP 202)

For long-running generation:

```typescript
{
  status: 'pending';
  jobId: string;               // ID for polling
  estimatedTime: number;       // Milliseconds until completion
  pollUrl: string;             // URL to poll for status
}
```

Then poll:

```
GET /api/generate/{jobId}
  → Returns: { status: 'pending' } or { status: 'success', fontUrl: '...', glyphs: [...] }
```

---

### GET /api/generate/{jobId}

Poll status of a pending font generation job.

#### Response

Same as POST response, either still pending or completed.

---

### POST /api/validate-key

Validate API key without generating a font. **Optional** - frontend may skip this.

#### Request

```json
{
  apiKey: string;
  provider?: "openai" | "anthropic" | "custom"
}
```

#### Response

```json
{
  valid: boolean;
  provider: string;
  remainingQuota?: number;
  error?: string;
}
```

---

## Design Tokens Mapping

The frontend sends design tokens as hints to the generative model. The backend should incorporate these into the system prompt:

| Token | Value | System Prompt Hint |
|-------|-------|------------------|
| weight | light | "Create lightweight letterforms with thin strokes" |
| weight | regular | "Create balanced letterforms with medium strokes" |
| weight | bold | "Create heavyweight letterforms with thick strokes" |
| contrast | low | "Use low stroke-to-counter contrast (low-contrast typography)" |
| contrast | medium | "Use medium stroke-to-counter contrast" |
| contrast | high | "Use high stroke-to-counter contrast (high-contrast typography)" |
| style | serif | "Include serifs on terminals" |
| style | sans | "Omit serifs, use clean sans-serif letterforms" |
| style | mono | "Create monospace letterforms with uniform widths" |
| mood | elegant | "Design elegant, refined letterforms with smooth curves" |
| mood | playful | "Design playful, friendly letterforms with personality" |
| mood | technical | "Design technical, geometric letterforms with precision" |

**Example Prompt Construction:**

```
Original prompt: "A modern font for body text"

Tokens: weight=bold, contrast=high, style=sans, mood=elegant

Combined: "A modern font for body text. 
Create heavyweight letterforms with thick strokes.
Use high stroke-to-counter contrast.
Omit serifs, use clean sans-serif letterforms.
Design elegant, refined letterforms with smooth curves.
Generate exactly 95 Latin glyphs (A-Z, a-z, 0-9, punctuation, symbols).
Output as a valid OpenType font."
```

---

## Font Generation Pipeline

### Minimal Implementation (MVP)

1. **Prompt Engineering**: Combine user prompt + design tokens into detailed system prompt
2. **Model Call**: Use user's API key to call GPT-4V / Claude / local model
3. **SVG Output**: Request model to generate SVG path data for each glyph
4. **UFO Compilation**: Convert SVG paths → UFO GLIF format
5. **Font Build**: UFO → ufo2ft → OTF/TTF binary
6. **QA Checks**: Run Fontbakery checks
7. **Upload/Cache**: Store font on CDN or temp storage with URL

### Pseudo-Code Flow

```python
def generate_font(request: GenerateRequest) -> GenerateResponse:
    # 1. Validate input
    validate_api_key(request.apiKey)
    validate_prompt(request.prompt, max_len=500)
    
    # 2. Build system prompt
    system_prompt = build_prompt(
        user_prompt=request.prompt,
        design_tokens=request.designTokens
    )
    
    # 3. Call model
    svg_glyphs = call_model(
        system_prompt,
        api_key=request.apiKey,
        model="gpt-4-vision",  # or Claude, or VecGlypher
        max_tokens=8000
    )
    
    # 4. Parse SVG → paths
    glyph_data = parse_svgs(svg_glyphs)
    
    # 5. Build UFO
    ufo = build_ufo(
        glyphs=glyph_data,
        metadata={
            "familyName": "Generated Font",
            "unitsPerEm": 1000,
            "ascender": 800,
            "descender": -200
        }
    )
    
    # 6. Compile to OTF
    font_binary = ufo2ft.compileTTF(ufo)  # Returns TTF; OTF via post-processing
    
    # 7. QA checks
    qa_result = run_fontbakery(font_binary)
    
    # 8. Upload & cache
    font_url = upload_to_cdn(font_binary, format="otf")
    
    # 9. Return response
    return GenerateResponse(
        status="success",
        fontUrl=font_url,
        glyphs=extract_glyph_info(ufo),
        qaStatus=qa_result
    )
```

---

## QA Checks (Fontbakery Integration)

The backend should run Fontbakery checks and report results:

### Sample Checks

```typescript
qaStatus: {
  passed: true,
  checks: [
    {
      name: "Glyph Count",
      passed: true,
      message: "95 glyphs generated (expected 95)"
    },
    {
      name: "Unicode Mapping",
      passed: true,
      message: "All glyphs mapped to correct Unicode codepoints"
    },
    {
      name: "Bounding Box",
      passed: true,
      message: "All glyphs within expected bounds"
    },
    {
      name: "Kerning Pairs",
      passed: false,
      message: "No kerning pairs found - MVP limitation",
      severity: "warning"
    },
    {
      name: "Hinting",
      passed: false,
      message: "Font is unhinted - small sizes may be fuzzy",
      severity: "info"
    }
  ],
  issues: [
    "Accented characters are not generated (use composition from base glyphs)",
    "Some punctuation marks may be simplified or missing"
  ]
}
```

---

## Error Handling

### API Key Errors

```json
{
  "status": "error",
  "code": "invalid_api_key",
  "error": "API key is invalid or expired",
  "details": {
    "field": "apiKey",
    "suggestedAction": "Double-check your API key and regenerate if needed"
  }
}
```

### Rate Limit Errors

```json
{
  "status": "error",
  "code": "rate_limit_exceeded",
  "error": "Rate limit exceeded. Try again in 60 seconds.",
  "details": {
    "retryAfter": 60
  }
}
```

### Model Errors

```json
{
  "status": "error",
  "code": "generation_failed",
  "error": "Model failed to generate glyphs. Ensure prompt is descriptive.",
  "details": {
    "message": "Model returned malformed SVG paths"
  }
}
```

### Invalid Prompt

```json
{
  "status": "error",
  "code": "invalid_prompt",
  "error": "Prompt is too vague. Use more specific descriptors.",
  "details": {
    "field": "prompt",
    "suggestedAction": "Include weight, style, and mood keywords"
  }
}
```

---

## Performance Targets

- **Generation Time**: 5–10 seconds (including API call + font build)
- **Font File Size**: 15–50KB (OTF, single weight, Latin-1 + symbols)
- **Glyph Count**: 95 (A-Z, a-z, 0-9, punctuation, common symbols)
- **Max Concurrent Requests**: Scale based on model rate limits

---

## CORS Configuration

The backend must set CORS headers to allow the frontend:

```
Access-Control-Allow-Origin: https://fontgen.ai (or * for development)
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

---

## Caching Strategy

- **Font URLs**: Cache for 24–48 hours (fonts don't change)
- **Generation Jobs**: Store in temp storage (clear after 7 days)
- **API Key Validation**: Cache valid/invalid status for 1 hour (prevents enumeration)

---

## Monitoring & Logging

Log the following for debugging:

- **Request**: Timestamp, user IP (anonymized), prompt length, design tokens
- **Model Call**: Model name, tokens used, latency, status
- **Font Build**: SVG parsing success, UFO compilation success, file size
- **QA Result**: Checks passed/failed, issues detected
- **Response**: Status code, response time, font URL

Do NOT log API keys or user prompts (except for debugging at admin level).

---

## Testing the Integration

### 1. Test with Mock Response

```bash
# Start frontend
npm run dev

# In DevTools Console, mock the API:
globalThis.fetch = async (url, opts) => {
  if (url === '/api/generate') {
    return new Response(JSON.stringify({
      status: 'success',
      fontUrl: 'data:font/otf;base64,...',
      glyphs: [
        { char: 'A', unicode: 65, width: 600 },
        // ... 94 more
      ],
      qaStatus: { passed: true, checks: [], issues: [] }
    }))
  }
}
```

### 2. Test with Real Backend

```bash
# Start backend
npm run dev:backend

# In frontend, API calls will go to http://localhost:3000/api/generate
npm run dev
```

### 3. Integration Test Checklist

- [ ] API key validation
- [ ] Rate limit handling
- [ ] Font download works
- [ ] Glyph preview renders
- [ ] QA status displays correctly
- [ ] Export buttons function
- [ ] Error states show proper messages
- [ ] Mobile responsive
- [ ] Keyboard navigation works

---

## Future Enhancements

1. **Streaming Glyphs**: Stream SVG data as generated (Server-Sent Events)
2. **Variable Fonts**: Support weight axis + multiple masters
3. **Multilingual**: Support accented Latin, Greek, Cyrillic, CJK
4. **Kerning**: Generate kern pairs from font metrics
5. **Hinting**: Add hinting for small sizes (Microsoft VOLT or VTT)
6. **Batch Generation**: Generate multiple weights in one request
7. **Webhook Notifications**: Notify frontend when job completes (long-running)

---

## Example Backend Implementation Checklist

- [ ] **Framework**: Express.js, FastAPI, Node.js, or Go
- [ ] **Dependencies**: fonttools, ufo2ft, Fontbakery, openai, anthropic
- [ ] **API Structure**: POST /api/generate, GET /api/generate/{jobId}
- [ ] **Validation**: Prompt length, API key format, design tokens enum
- [ ] **Error Handling**: Graceful fallback for API failures
- [ ] **Logging**: Request/response logging (no secrets)
- [ ] **CORS**: Proper headers for frontend origin
- [ ] **Rate Limiting**: Token bucket or similar
- [ ] **Caching**: Font URL caching + CDN integration
- [ ] **Testing**: Unit tests for prompt engineering, integration tests with real model
- [ ] **Monitoring**: Error tracking (Sentry, DataDog)
- [ ] **Documentation**: This spec + API docs (Swagger/OpenAPI)

---

## Useful Libraries

### Python
- `ufo2ft`: UFO → OTF/TTF
- `fonttools`: Font manipulation
- `fontbakery`: QA checks
- `openai`: GPT integration
- `anthropic`: Claude integration
- `Pillow`: Image operations (if needed)

### JavaScript/Node.js
- `opentype.js`: Font parsing/rendering
- `paper.js`: Vector graphics (if editing SVG)
- `openai`: GPT integration via Node.js
- `axios`: HTTP client

### Command-Line Tools
- `fontbakery`: `fontbakery check-googlefonts font.otf`
- `gftools`: `gftools sandbox-check font.otf`
- `otf2ttf` / `ttf2otf`: Format conversion

---

*API Specification v0.1.0 – FontGen AI Backend*
