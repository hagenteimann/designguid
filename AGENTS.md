# Brand & Web Strategy-to-Execution Framework – Agent Instructions

> Universal entry point for all AI coding agents (Gemini, Claude, Codex, Cursor, Windsurf, etc.)
> Claude Code users: CLAUDE.md is also auto-loaded with the same rules.
>
> **Sync note:** This file (AGENTS.md) and CLAUDE.md are intentionally identical in content.
> When making changes, **always update both files**.

---

## Working Directory – CRITICAL

- **`Projekt/`** → All work happens here. Create all new files exclusively here.
- **`Beispiele/`** → Read only reference. Never edit or overwrite. (Note: Cleaned/empty by default).

---

## 5 Hard Rules

1. **No code without brief.** For website rebuilds, fill out `GUIDES/KERN/PROJEKT_BRIEF.md` first.
2. **Never load all guides.** Use `guides-index.json` to find the right file.
3. **No magic numbers.** All spacing, colors, radii from `GUIDES/KERN/design-tokens-mini.md` (always load).
4. **No deploy without checklist.** Run `./check.sh` before every deploy.
5. **No asset without license.** Allowed sources in `GUIDES/03_EXECUTION/components.md` → "Allowed Asset Sources".

---

## Choose your track

| What does the user want? | Track | Start here |
|---|---|---|
| Build a Design System / CD-Manual HTML | `designsystem` | `GUIDES/02_CONCEPT/design_concept.md` |
| Build a website / landing page / rebuild | `website` | `GUIDES/KERN/PROJEKT_BRIEF.md` |

→ Then use `guides-index.json` for the exact guide path.

---

## Task → File

### KERN (always relevant)

| Task | Read first |
|---|---|
| Token values (quick) | `GUIDES/KERN/design-tokens-mini.md` |
| Binding rules | `GUIDES/KERN/RULES.md` |
| HTML/CSS coding conventions | `GUIDES/KERN/STYLE.md` |
| Agent context, stack, client types | `GUIDES/KERN/CONTEXT.md` |

### 01_STRATEGY (Inputs)

| Task | Read first |
|---|---|
| Customer analysis, Funnel & Journey | `GUIDES/01_STRATEGY/customer.md` |
| Shareholder strategy | `GUIDES/01_STRATEGY/shareholder.md` |
| Stakeholder strategy | `GUIDES/01_STRATEGY/stakeholder.md` |
| Product & competitor analysis | `GUIDES/01_STRATEGY/product_service.md` |
| HR recruitment & demand mapping | `GUIDES/01_STRATEGY/hr.md` |

### 02_CONCEPT (Synthesis)

| Task | Read first |
|---|---|
| Design Concept (Form follows Function) | `GUIDES/02_CONCEPT/design_concept.md` |

### 03_EXECUTION (Deliverables)

| Task | Read first |
|---|---|
| Logo, geometry & reduction | `GUIDES/03_EXECUTION/logo.md` |
| Typography, scales & self-hosting | `GUIDES/03_EXECUTION/typography.md` |
| Colors & Design Tokens | `GUIDES/03_EXECUTION/colors.md` |
| Components, asset budgets & licensing | `GUIDES/03_EXECUTION/components.md` |
| Layouting, grids & information flow | `GUIDES/03_EXECUTION/layouting.md` |
| AI Image prompt engineering | `GUIDES/03_EXECUTION/ai_prompts.md` |
| Tone of voice, address & antagonists | `GUIDES/03_EXECUTION/tone_of_voice.md` |
| Motion, scroll-reveal & transitions | `GUIDES/03_EXECUTION/motion_interaction.md` |

### TECHNICAL (Security, SEO, Legal)

| Task | Read first |
|---|---|
| SEO, GEO & Schema.org JSON-LD | `GUIDES/03_EXECUTION/technical/seo.md` |
| GDPR, Legal Notice & Privacy Policy | `GUIDES/03_EXECUTION/technical/legal.md` |
| CSP, Security Headers & sanitization | `GUIDES/03_EXECUTION/technical/security.md` |
| QA, Testing, contrast & Lighthouse | `GUIDES/03_EXECUTION/technical/qa_testing.md` |
| Deployment & Git conventions | `GUIDES/03_EXECUTION/technical/deployment.md` |
| Form submit & Spam protection | `GUIDES/03_EXECUTION/technical/forms.md` |
| Automation & agent loops | `GUIDES/03_EXECUTION/technical/automation.md` |

---

## Re-entering a project

1. Read `MEMORY.md` (if exists) – compressed context from last session
2. Check `PLAN.md` (if exists) – open steps
3. Load only the guides listed in MEMORY.md

---

## Automation

```bash
./check.sh    # Pre-deploy checks (DSGVO, assets, a11y, legal)
./ralph.sh    # Start Ralph Loop (configure .ralph-config first)
```

---

*Brand & Web Framework – Stand Juni 2026*
