# Build Plan – Landing Page
# Template: 5 Steps | Ausgefüllt aus: PROJEKT_BRIEF.md
# Erstellt: [DATUM]

---

### Step 1 – Token-Setup & Global Styles
Task: CSS Custom Properties, Reset, globale Regeln einrichten

Done wenn:
- [ ] Alle Tokens aus DESIGN_SYSTEM.md Phase 3 definiert
- [ ] Primärfarbe aus PROJEKT_BRIEF.md eingetragen
- [ ] Scrollbar ausgeblendet (alle Browser)
- [ ] scroll-behavior smooth mit prefers-reduced-motion Guard
- [ ] Font selbst gehostet, @font-face definiert

Guides: GUIDES/DESIGN_SYSTEM.md
Dokumentieren: CD-Manual – Primärfarbe + Font-Entscheidung

Validator-Check:
- grep "scrollbar-width: none" css/style.css
- grep "prefers-reduced-motion" css/style.css
- grep "@font-face" css/style.css

---

### Step 2 – Navigation
Task: Sticky Nav mit Auto-Generation, Hamburger, animiertem Indikator

Done wenn:
- [ ] nav[data-open] vorhanden
- [ ] Hamburger-Button mit aria-label, 48×48px
- [ ] Scroll-Listener mit { passive: true }
- [ ] Animierter Indikator (sliding bar)
- [ ] Mobile: Hamburger Pflicht unter 768px

Guides: GUIDES/WORKFLOW_NAVIGATION.md
Dokumentieren: CD-Manual – Nav-Breakpoint + Indikator-Farbe

Validator-Check:
- grep "passive: true" js/navigation.js
- grep "nav-indicator" css/style.css

---

### Step 3 – Hero Section
Task: Hero mit Parallax-BG, Filter-Overlay, Paragraph-Reveal, CTA

Done wenn:
- [ ] <section id="section-hero"> mit data-nav-Attributen
- [ ] Parallax via matchMedia (prefers-reduced-motion geprüft)
- [ ] Paragraph-Reveal-Animation mit prefers-reduced-motion Guard
- [ ] Overlay mit Fallback-Farbe + @supports für relative color
- [ ] min-height: 100svh (nicht 100vh)
- [ ] Primary CTA Button vorhanden
- [ ] Trust-Signal unter CTA

Guides: GUIDES/DESIGN_SYSTEM.md, GUIDES/FUNNEL_STRATEGIE.md
Dokumentieren: CD-Manual – CTA-Text + Hero-Bildquelle (Lizenz!)

Validator-Check:
- grep "matchMedia" js/hero.js
- grep "100svh" css/style.css
- grep "prefers-reduced-motion" css/style.css

---

### Step 4 – Content Sections
Task: Funnel-Sektionen aus PROJEKT_BRIEF.md bauen

Done wenn:
- [ ] Alle Sektionen aus PROJEKT_BRIEF.md Phase 2 vorhanden
- [ ] Jede Section hat id="section-[name]" + data-nav-Attribute
- [ ] Social Proof direkt nach Hero
- [ ] 3-Column Grid auf Desktop, Single Column auf Mobile
- [ ] Alle Icons: Inline SVG, MIT-Lizenz
- [ ] Alle Bilder: WebP, max 200KB, alt-Attribut vorhanden

Guides: GUIDES/FUNNEL_STRATEGIE.md, GUIDES/DESIGN_SYSTEM.md, GUIDES/WORKFLOW_ASSETS.md
Dokumentieren: CD-Manual – Sektionsreihenfolge

Validator-Check:
- ./check.sh (PNG/JPG, alt-Attribute, Icon-CDN)

---

### Step 5 – Rechtliches, QA, Deploy
Task: Impressum + Datenschutz, QA-Checks, Deploy

Done wenn:
- [ ] /impressum.html mit allen Pflichtangaben
- [ ] /datenschutz.html mit allen externen Diensten
- [ ] Footer-Links: Impressum | Datenschutz
- [ ] ./check.sh: 0 Fehler
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 90
- [ ] LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] Deploy: nur public/ zu Webspace, Git-Tag erstellt

Guides: GUIDES/RECHTLICHES.md, GUIDES/QA_TESTING.md, GUIDES/WORKFLOW_DEPLOYMENT.md
Dokumentieren: CD-Manual – Deploy-Version + Datum

Validator-Check:
- ./check.sh
- grep "Impressum" public/index.html
- grep "Datenschutz" public/index.html
