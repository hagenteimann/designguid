# ✅ Vibe-Coder Onboarding (1 Seite)

**Neuer Developer ins Projekt**

---

## Tag 1: Orientierung (30 Min)

**Lesen:**
- [ ] `README.md` → Projekt-Info
- [ ] `QUICK_START.md` → Die 5 Workflows
- [ ] Diese Datei

**Verstehen:**
- [ ] Was ist Push8 Website Guide?
- [ ] Was sind die 5 Core Workflows?
- [ ] Wo finde ich Detailinformationen? (GUIDES/ Ordner)

---

## Tag 1-2: Ordnerstruktur (15 Min)

```
Projekt/
├── 📁 public/           ← "Das ist die Live-Website"
├── 📁 src/              ← "Source Code (nicht live)"
├── 📁 docs/             ← "Dokumentation" (alt, siehe GUIDES/)
├── 📁 GUIDES/           ← "Detaillierte Guides"
├── 📁 CHECKLISTS/       ← "Quick Referenzen"
├── 📁 cd-manual/        ← "Design Manual"
├── 🔧 .env              ← "NIEMALS committen!"
└── 📖 QUICK_START.md    ← "Start hier"
```

- [ ] Struktur verstanden?
- [ ] public/ = Live-Website?
- [ ] src/ = Source (nicht deployed)?
- [ ] .env NICHT im Repo?

---

## Tag 2: Design System & Guides (1-2 Std)

**GUIDES/ durchblättern:**

1. **GUIDES/DESIGN_SYSTEM.md** (30 Min)
   - Tokens (Spacing, Farben)
   - Grid (3-Column, Mobile-First)
   - Components
   - [ ] Gelesen & verstanden?

2. **GUIDES/WORKFLOW_NAVIGATION.md** (20 Min)
   - Sections mit IDs
   - Auto-Navigation
   - Mobile Hamburger
   - [ ] Verstanden?

3. **GUIDES/WORKFLOW_ASSETS.md** (20 Min)
   - Bilder (WebP, komprimiert)
   - Videos (MP4, komprimiert)
   - Responsive Images
   - [ ] Verstanden?

4. **GUIDES/WORKFLOW_DEPLOYMENT.md** (20 Min)
   - Deploy zu Webspace
   - Git Push
   - Versionierung
   - [ ] Verstanden?

---

## Tag 2-3: CD-Manual & Git (1 Std)

**CD-Manual öffnen:**
```
cd-manual/index.html
```
- [ ] Geöffnet im Browser?
- [ ] Design-Entscheidungen sehen?
- [ ] Daten interpretiert?

**Git History anschauen:**
```bash
git log --oneline
git tag -l
git show v1.2.0
```
- [ ] Commits verstanden?
- [ ] Tags = Versions?
- [ ] Rollback-Prozess klar?

---

## Ready zu Code! (Checklists)

Wenn du Code schreibst, verwende diese Quick-Referenzen:

| Task | Checklist |
|------|-----------|
| Navigation/Sections | [navigation.checklist.md](navigation.checklist.md) |
| Bilder/Videos | [assets.checklist.md](assets.checklist.md) |
| Design dokumentieren | [cd-manual.checklist.md](cd-manual.checklist.md) |
| Deploy | [deploy.checklist.md](deploy.checklist.md) |

---

## Häufige Fragen

**"Wo sind die detaillierten Informationen?"**
→ GUIDES/ Ordner (WORKFLOW_*.md Dateien)

**"Was ist die CD-Manual?"**
→ Design-Entscheidungs-Dokumentation (cd-manual/index.html)

**"Wie deploye ich?"**
→ CHECKLISTS/deploy.checklist.md (1 Seite) oder GUIDES/WORKFLOW_DEPLOYMENT.md (Details)

**"Welche Bilder-Größe?"**
→ CHECKLISTS/assets.checklist.md (max 200KB Desktop, 100KB Mobile)

**"Welche Breakpoints?"**
→ DESIGN_SYSTEM.md (Mobile-First: 768px, 1200px)

---

## Wichtige Regeln

1. ✅ `public/` = deployed
2. ❌ `.env` = niemals committen
3. ❌ `*.md`, `cd-manual/` = nicht deployed
4. ✅ Bilder = WebP, komprimiert
5. ✅ Videos = MP4 H.264, komprimiert
6. ✅ Sections = mit ID + data-Attributen
7. ✅ Design-Entscheidung = ins CD-Manual
8. ✅ Deploy = Webspace + Git Push + Tag

---

## Hilf mit!

Wenn du etwas nicht verstehst:
1. Schau zuerst ins relevante Workflow GUIDE
2. Frag den Agent (für Erklärung)
3. Schlag vor, die Dokumentation zu verbessern!

---

**Willkommen im Team! 🚀**

*Viel Spaß beim Coding.*
