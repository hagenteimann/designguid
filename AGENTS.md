# Push8 Design System – Agent Instructions

> Universal entry point for all AI coding agents (Gemini, Codex, Cursor, Windsurf, etc.)
> Claude Code users: CLAUDE.md is also auto-loaded with the same rules.

---

## 5 Hard Rules

1. **No code without brief.** For every rebuild, fill out `GUIDES/PROJEKT_BRIEF.md` first.
2. **Never load all guides.** Use `guides-index.json` to load only what's relevant.
3. **No magic numbers.** All spacing, colors, radii from `GUIDES/design-tokens-mini.md` (always load this).
4. **No deploy without checklist.** Run `./check.sh` before every deploy.
5. **No asset without license.** Allowed sources in `GUIDES/DESIGN_SYSTEM.md` → "Erlaubte Quellen".

---

## Task → File

| Task | Read first |
|---|---|
| Website rebuild | `GUIDES/PROJEKT_BRIEF.md` |
| Autonomous build (Ralph Loop) | `GUIDES/RALPH_LOOP.md` |
| Token values (quick lookup) | `GUIDES/design-tokens-mini.md` |
| Design tokens, layout, colors (full) | `GUIDES/DESIGN_SYSTEM.md` |
| Navigation, hamburger, indicator | `GUIDES/WORKFLOW_NAVIGATION.md` |
| Images / videos / assets | `GUIDES/WORKFLOW_ASSETS.md` |
| Deploy + Git | `GUIDES/WORKFLOW_DEPLOYMENT.md` |
| Legal (Impressum, Datenschutz, AGB) | `GUIDES/RECHTLICHES.md` |
| Contact form → Genie CRM | `GUIDES/KONTAKTFORMULAR.md` |
| Funnel / CTA logic | `GUIDES/FUNNEL_STRATEGIE.md` |
| SEO | `GUIDES/SEO.md` |
| Security / CSP | `GUIDES/SECURITY.md` |
| QA before deploy | `GUIDES/QA_TESTING.md` |
| Copy / Tone of Voice | `GUIDES/CONTENT_GUIDELINES.md` |
| Document design decisions | `GUIDES/WORKFLOW_CD_MANUAL.md` |

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

*Push8 Web Agency – Stand Mai 2026*
