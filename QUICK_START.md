# 🚀 Quick Start für Agenten

**Lesen Sie diese Datei zuerst (5 Min).**

---

## Was ist das?

Push8 Website-Guide mit **6 Core Workflows** für KI-Agenten. Jeder Workflow hat:
- ✅ **Quick Checklist** (1 Seite, praktisch)
- 📖 **Detaildoku** (GUIDES/ Ordner, wenn Fragen)

> **Für komplette Website-Builds:** Ralph Loop verwenden – autonomer Zwei-Agenten-Prozess mit Plan, Validator und MEMORY.md-Konsolidierung. Spart 80–90% Kontext-Tokens gegenüber einem kontinuierlichen Loop. → [RALPH_LOOP.md](GUIDES/RALPH_LOOP.md)

---

## Die 6 Core Workflows

### 1️⃣ **Navigation & Sections hinzufügen**

**Was:** User sagt "Neue Section: Testimonials"

**Schnell:**
```
1. Frage: ID? (section-testimonials)
2. Frage: Label? (Testimonials)
3. Frage: Position? (z.B. 4)
4. Baue Section mit <section id="section-xyz" data-nav-label="...">
5. Navigation regenerieren automatisch
6. Mobile Hamburger testen
7. CD-Manual updaten?
```

**Siehe:**
- 📋 [Checklist](CHECKLISTS/navigation.checklist.md)
- 📖 [Detaildoku](GUIDES/WORKFLOW_NAVIGATION.md)

---

### 2️⃣ **Bilder & Videos komprimieren**

**Was:** User uploaded 25MB Video oder 5MB Bild

**Schnell:**
```
1. Prüfe Größe:
   - Bilder: max 200KB (Desktop), 100KB (Mobile)
   - Videos: max 2MB (Desktop), 1MB (Mobile)
2. Zu groß? → Komprimieren:
   - Bilder: WebP mit Sharp/ImageMagick
   - Videos: MP4 H.264 mit FFmpeg
3. Responsive Versionen generieren
4. Ins HTML mit <picture> oder <video>
5. CD-Manual updaten?
```

**Siehe:**
- 📋 [Checklist](CHECKLISTS/assets.checklist.md)
- 📖 [Detaildoku](GUIDES/WORKFLOW_ASSETS.md)

---

### 3️⃣ **Design-Entscheidungen dokumentieren**

**Was:** User trifft Design-Entscheidung ("Primary Color = #FF6B35")

**Schnell:**
```
1. Ist das im CD-Manual bereits dokumentiert?
2. Nein? → Frage: "Soll ich das neu dokumentieren?"
3. User bestätigt
4. CD-Manual aktualisieren (interaktive HTML)
5. Zeitstempel + Kontext hinzufügen
6. User benachrichtigen: ✅ CD-Manual aktualisiert
```

**Siehe:**
- 📋 [Checklist](CHECKLISTS/cd-manual.checklist.md)
- 📖 [Detaildoku](GUIDES/WORKFLOW_CD_MANUAL.md)

---

### 4️⃣ **Zu Webspace deployen + Git pushen**

**Was:** User sagt "Deploy zu example.com"

**Schnell:**
```
1. Prüfe Deployment-Credentials vorhanden?
2. Upload public/ zu Hosting (rsync/FTP)
3. Prüfe: .env, *.md NICHT dabei?
4. Wenn Git Repository vorhanden:
   - git add -A
   - git commit "Deploy: Version 1.2.0 – Features X"
   - git push origin main
   - git tag -a v1.2.0
   - CHANGELOG.md updaten
5. User benachrichtigen mit Links
```

**Siehe:**
- 📋 [Checklist](CHECKLISTS/deploy.checklist.md)
- 📖 [Detaildoku](GUIDES/WORKFLOW_DEPLOYMENT.md)

---

### 6️⃣ **Website neu bauen (Rebuild)**

**Was:** User gibt alte Website + Zielgruppe → neue Website soll entstehen

**Schnell – IMMER in dieser Reihenfolge:**
```
1. PROJEKT_BRIEF.md öffnen und Phase 0 ausfüllen
   → Alte Website analysieren (Schwächen, was behalten)
   → Zielgruppe dokumentieren (Persona, Entscheidungstreiber)
   → Design-Entscheidungen ableiten (Farbe, CTA, Sektionen)
   → Nur relevante Guides markieren (nicht alle laden!)

2. Token-Mapping: Analyseergebnisse → CSS Custom Properties
   → Primärfarbe begründet eintragen
   → Spacing/Radius aus Design System übernehmen

3. Sektionen-Reihenfolge vorlegen + bestätigen lassen
   → Kein Code vor Freigabe

4. Erst jetzt: HTML/CSS schreiben
   → Nur die in Phase 0 markierten Guides aktiv lesen
```

> ⚠️ **Ohne ausgefüllten Projekt-Brief kein Code.** Generische Guide-Regeln gelten erst nach der projektspezifischen Analyse.

**Siehe:**
- 📖 [PROJEKT_BRIEF.md](GUIDES/PROJEKT_BRIEF.md)
- 📖 [RALPH_LOOP.md](GUIDES/RALPH_LOOP.md) – für autonomen Build mit Validator-Agent

---

### 5️⃣ **Neue Developer onboarden**

**Was:** Neuer Developer kommt ins Projekt

**Schnell:**
```
1. README.md → Orientierung
2. QUICK_START.md → Was sind die 5 Workflows?
3. GUIDES/ → Detailliertes Wissen
4. cd-manual/index.html → Design kennenlernen
5. git log → Historien verstehen
```

**Siehe:**
- 📋 [Checklist](CHECKLISTS/vibe-coder.checklist.md)

---

## 📁 Ordnerstruktur verstehen

```
Push8 Website Guide/
├── README.md                  ← Projekt-Info
├── QUICK_START.md             ← Sie sind hier!
├── GUIDES/
│   ├── DESIGN_SYSTEM.md       (Tokens, Colors, Layouts)
│   ├── WORKFLOW_DEPLOYMENT.md (Deploy + Git)
│   ├── WORKFLOW_NAVIGATION.md (Sections + Navigation)
│   ├── WORKFLOW_ASSETS.md     (Bilder/Videos)
│   ├── WORKFLOW_CD_MANUAL.md  (Design-Entscheidungen)
│   ├── SEO.md, SECURITY.md, FUNNEL_STRATEGIE.md, etc.
├── CHECKLISTS/
│   ├── deploy.checklist.md
│   ├── navigation.checklist.md
│   ├── assets.checklist.md
│   ├── cd-manual.checklist.md
│   └── vibe-coder.checklist.md
├── cd-manual/                 (Design Manual - interaktive HTML)
└── docs/                      (Alle Guides waren hier, jetzt in GUIDES/)
```

---

## 🎯 Typisches Szenario

**User:** "Neue Section 'Testimonials' + optimize Hero-Video + Deploy"

**Agent:**
```
1. Navigation Workflow
   → Liest CHECKLISTS/navigation.checklist.md
   → Erstellt Section mit ID + Data-Attributes

2. Assets Workflow
   → Liest CHECKLISTS/assets.checklist.md
   → Komprimiert Video mit FFmpeg zu 1.8MB

3. Deployment Workflow
   → Liest CHECKLISTS/deploy.checklist.md
   → Upload public/ zu Hosting
   → git add, commit, push, tag

Fertig! ✅
```

---

## 🔗 Quick Links

### Core Workflows
| Workflow | Checklist | Details |
|----------|-----------|---------|
| Navigation | [Link](CHECKLISTS/navigation.checklist.md) | [Link](GUIDES/WORKFLOW_NAVIGATION.md) |
| Assets | [Link](CHECKLISTS/assets.checklist.md) | [Link](GUIDES/WORKFLOW_ASSETS.md) |
| CD-Manual | [Link](CHECKLISTS/cd-manual.checklist.md) | [Link](GUIDES/WORKFLOW_CD_MANUAL.md) |
| Deployment | [Link](CHECKLISTS/deploy.checklist.md) | [Link](GUIDES/WORKFLOW_DEPLOYMENT.md) |
| Onboarding | [Link](CHECKLISTS/vibe-coder.checklist.md) | — |
| Website Rebuild | — | [Link](GUIDES/PROJEKT_BRIEF.md) |
| Ralph Loop | — | [Link](GUIDES/RALPH_LOOP.md) |

### Alle Guides
| Topic | Link |
|-------|------|
| Design System | [Link](GUIDES/DESIGN_SYSTEM.md) |
| Rechtliches (Impressum, Datenschutz, AGB) | [Link](GUIDES/RECHTLICHES.md) |
| QA Testing & Performance | [Link](GUIDES/QA_TESTING.md) |
| Development Setup | [Link](GUIDES/DEVELOPMENT_SETUP.md) |
| Content Guidelines | [Link](GUIDES/CONTENT_GUIDELINES.md) |
| Browser Support | [Link](GUIDES/BROWSER_SUPPORT.md) |
| Error Handling | [Link](GUIDES/ERROR_HANDLING.md) |
| API Integration | [Link](GUIDES/API_INTEGRATION.md) |
| Analytics & Tracking | [Link](GUIDES/ANALYTICS.md) |
| Monitoring & Uptime | [Link](GUIDES/MONITORING.md) |
| Accessibility Testing | [Link](GUIDES/ACCESSIBILITY_TESTING.md) |
| Build Process | [Link](GUIDES/BUILD_PROCESS.md) |
| SEO | [Link](GUIDES/SEO.md) |
| Security | [Link](GUIDES/SECURITY.md) |
| Funnel Strategie | [Link](GUIDES/FUNNEL_STRATEGIE.md) |
| Kontaktformular | [Link](GUIDES/KONTAKTFORMULAR.md) |

---

## ⚡ TL;DR – Die wichtigsten Regeln

1. **Sections = IDs** → Automatisch in Navigation
2. **Assets komprimieren** → Bilder <200KB, Videos <2MB
3. **Design dokumentieren** → Ins CD-Manual, wenn neu
4. **Deploy = Webspace + Git** → Immer beide, wenn Git vorhanden
5. **Ordnerstruktur respektieren** → `public/` deployed, alles andere nicht

---

**Bereit zu starten? → Wählen Sie einen Workflow oben! 🚀**

*Push8 Website Guide – Stand Mai 2026*
