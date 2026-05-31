# Build Plan – Portfolio / Agentur-Website
# Template: 6 Steps | Ausgefüllt aus: PROJEKT_BRIEF.md
# Erstellt: [DATUM]

---

### Step 1 – Token-Setup & Global Styles
Task: CSS Custom Properties, Reset, globale Regeln

Done wenn:
- [ ] Alle Design Tokens aus DESIGN_SYSTEM.md Phase 3
- [ ] Primärfarbe aus PROJEKT_BRIEF.md
- [ ] Squircle-Tokens (--radius-squircle) definiert
- [ ] Scrollbar ausgeblendet
- [ ] Font selbst gehostet

Guides: GUIDES/DESIGN_SYSTEM.md
Dokumentieren: CD-Manual – Primärfarbe + Font

---

### Step 2 – Navigation
Task: Sticky Nav, Hamburger, animierter Indikator, Smooth Scroll

Done wenn:
- [ ] Hamburger unter 768px – Pflicht
- [ ] Scroll-Listener { passive: true }
- [ ] Animierter Indikator auf Desktop
- [ ] Smooth Scroll in prefers-reduced-motion Guard

Guides: GUIDES/WORKFLOW_NAVIGATION.md
Dokumentieren: CD-Manual – Nav-Typ

---

### Step 3 – Hero
Task: Parallax, Filter-Overlay, Paragraph-Reveal, CTA

Done wenn:
- [ ] Parallax via matchMedia
- [ ] 100svh, Paragraph-Reveal mit prefers-reduced-motion
- [ ] Primary CTA + Secondary CTA (Ghost-Button)
- [ ] Kein Stock-Foto – echte Projektbilder oder Illustrationen (Lizenz!)

Guides: GUIDES/DESIGN_SYSTEM.md, GUIDES/FUNNEL_STRATEGIE.md
Dokumentieren: CD-Manual – Hero-Bildquelle

---

### Step 4 – Referenzen / Portfolio Grid
Task: Projektgrid als 3-Column Bento, Squircle auf Kacheln

Done wenn:
- [ ] 3-Column Grid Desktop, 1-Column Mobile
- [ ] Bento-Ratios (aspect-ratio) aus DESIGN_SYSTEM.md
- [ ] Squircle auf Projekt-Thumbnails
- [ ] Alle Bilder: WebP, max 200KB, alt-Attribut
- [ ] Lazy Loading (außer erstes Bild)

Guides: GUIDES/DESIGN_SYSTEM.md, GUIDES/WORKFLOW_ASSETS.md
Dokumentieren: CD-Manual – Grid-Entscheidung

---

### Step 5 – Social Proof, Prozess, CTA
Task: Testimonials, Prozess-Schritte, Conversion-Section

Done wenn:
- [ ] Social Proof nach Hero platziert
- [ ] Testimonials: Name + Bild + Firma + Zitat
- [ ] Prozess: 3–5 Schritte, nummeriert
- [ ] Finale CTA-Section: kein neuer Content, nur CTA + Trust-Signal
- [ ] FAQ vor finalem CTA

Guides: GUIDES/FUNNEL_STRATEGIE.md
Dokumentieren: CD-Manual – CTA-Text

---

### Step 6 – Rechtliches, QA, Deploy
Task: Impressum + Datenschutz, QA, Deploy

Done wenn:
- [ ] /impressum.html vollständig
- [ ] /datenschutz.html – alle externen Dienste erwähnt
- [ ] ./check.sh: 0 Fehler
- [ ] Lighthouse ≥ 90 alle Kategorien
- [ ] Git-Tag erstellt, Changelog aktuell

Guides: GUIDES/RECHTLICHES.md, GUIDES/QA_TESTING.md, GUIDES/WORKFLOW_DEPLOYMENT.md
Dokumentieren: CD-Manual – Deploy-Version

Validator-Check:
- ./check.sh
