# Build Plan – Service-Website mit Kontaktformular
# Template: 8 Steps | Ausgefüllt aus: PROJEKT_BRIEF.md
# Erstellt: [DATUM]

---

### Step 1 – Token-Setup & Global Styles
Task: CSS Custom Properties, Reset, globale Regeln

Done wenn:
- [ ] Alle Design Tokens aus DESIGN_SYSTEM.md Phase 3
- [ ] Primärfarbe aus PROJEKT_BRIEF.md (Zielgruppenanalyse!)
- [ ] Scrollbar ausgeblendet, Font selbst gehostet

Guides: GUIDES/DESIGN_SYSTEM.md
Dokumentieren: CD-Manual – Primärfarbe + Begründung aus Zielgruppenanalyse

---

### Step 2 – Navigation
Task: Sticky Nav, Hamburger, animierter Indikator

Done wenn:
- [ ] Hamburger unter 768px – Pflicht
- [ ] Scroll-Listener { passive: true }
- [ ] Animierter Indikator auf Desktop
- [ ] CTA-Button in Navigation sichtbar (Primärfarbe)

Guides: GUIDES/WORKFLOW_NAVIGATION.md

---

### Step 3 – Hero
Task: Parallax, Filter-Overlay, Paragraph-Reveal, primärer CTA

Done wenn:
- [ ] Parallax via matchMedia
- [ ] Paragraph-Reveal mit prefers-reduced-motion Guard
- [ ] Headline: Nutzen-orientiert (nicht "Wir sind...")
- [ ] Primary CTA direkt sichtbar + Trust-Signal darunter
- [ ] 100svh, Kein Stock-Foto

Guides: GUIDES/DESIGN_SYSTEM.md, GUIDES/FUNNEL_STRATEGIE.md
Dokumentieren: CD-Manual – Headline + CTA-Text

---

### Step 4 – Social Proof Strip
Task: Kunden-Logos oder Kennzahlen direkt nach Hero

Done wenn:
- [ ] Logos oder 3 Kennzahlen (z.B. "47 Projekte | 98% Weiterempfehlung")
- [ ] Kompakt, 1 Zeile, keine Ablenkung vom Funnel
- [ ] Logos: SVG, eigene Dateien (keine externen URLs)

Guides: GUIDES/FUNNEL_STRATEGIE.md

---

### Step 5 – Leistungen & Differenzierung
Task: 3-Column Bento-Grid, Leistungskacheln mit Icon + Text

Done wenn:
- [ ] 3-Column Grid Desktop, 1-Column Mobile
- [ ] Icons: Inline SVG, MIT-Lizenz (Heroicons/Lucide/Phosphor)
- [ ] Squircle auf Icon-Containern
- [ ] Jede Leistung: Icon + Titel + 2–3 Sätze + kleiner Beweis
- [ ] Empty States für alle Listen definiert

Guides: GUIDES/DESIGN_SYSTEM.md, GUIDES/FUNNEL_STRATEGIE.md, GUIDES/WORKFLOW_ASSETS.md
Dokumentieren: CD-Manual – Leistungs-Struktur

---

### Step 6 – Testimonials, Prozess, FAQ
Task: Vertrauen aufbauen, Einwände ausräumen

Done wenn:
- [ ] Testimonials: Name + Bild + Firma + Zitat (kein Anonymes Feedback)
- [ ] Prozess: 3–5 nummerierte Schritte mit Zeitangaben
- [ ] FAQ vor finalem CTA-Block
- [ ] Alle Bilder: WebP, max 200KB, alt-Attribut

Guides: GUIDES/FUNNEL_STRATEGIE.md

---

### Step 7 – Kontaktformular
Task: Genie CRM Formular einbinden

Done wenn:
- [ ] Supabase SDK lokal gehostet (kein CDN)
- [ ] org_id, SUPABASE_URL, SUPABASE_ANON_KEY konfiguriert
- [ ] Honeypot-Feld vorhanden
- [ ] form ohne novalidate, required auf Pflichtfeldern
- [ ] aria-live Status-Div für Erfolg/Fehler
- [ ] Formular in Datenschutzerklärung erwähnt

Guides: GUIDES/KONTAKTFORMULAR.md, GUIDES/RECHTLICHES.md
Dokumentieren: CD-Manual – Formular-Konfiguration (ohne Keys!)

Validator-Check:
- grep "supabase.min.js" public/js/
- grep "hp_field" index.html

---

### Step 8 – Rechtliches, QA, Deploy
Task: Impressum + Datenschutz, QA, Deploy

Done wenn:
- [ ] /impressum.html vollständig (§5 TMG)
- [ ] /datenschutz.html – Supabase/Genie CRM + alle Dienste erwähnt
- [ ] Footer: Impressum | Datenschutz Links
- [ ] ./check.sh: 0 Fehler
- [ ] Lighthouse ≥ 90, LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] Deploy: nur public/, Git-Tag, Changelog

Guides: GUIDES/RECHTLICHES.md, GUIDES/QA_TESTING.md, GUIDES/WORKFLOW_DEPLOYMENT.md

Validator-Check:
- ./check.sh
- Genie CRM: Testanfrage absenden und im Inbound-Tab prüfen
