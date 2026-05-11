# Workflow: Deploy zu Webspace + Git Push

**Konsolidiert aus: ORDNERSTRUKTUR.md**

---

## Übersicht

Wenn Agent Zugang zu Hosting hat:
1. **Deploy zu Webspace** (nur `public/` Ordner)
2. **Git Push** (wenn Git Repository vorhanden)
3. **Tag + Changelog** (Versionierung)

---

## Projektstruktur

```
mein-projekt/
├── 📁 public/                    # ← DEPLOYED!
│   ├── *.html, css/, js/, images/, videos/, fonts/
├── 📁 src/                       # ← NICHT deployed
├── 📁 docs/                      # ← NICHT deployed
├── 📁 cd-manual/                 # ← NICHT deployed
├── 📁 analysis/                  # ← NICHT deployed
├── 🔧 .env                       # ← NICHT deployed (Secrets!)
├── 🔧 .gitignore
├── 🔧 package.json
└── README.md
```

**Deploy-Regel:** NUR `public/` hochladen. Alles andere bleibt lokal.

---

## Deploy-Prozess

### 1. Vor dem Deploy: Checklisten

```
✅ Hosting-Credentials vorhanden?
✅ Zielordner klar? (z.B. /var/www/html/)
✅ public/ saubering? (nur HTML + Assets)
✅ .env NICHT dabei?
✅ *.md NICHT dabei?
✅ docs/, cd-manual/, src/ NICHT dabei?
✅ Bilder/Videos komprimiert?
✅ robots.txt + sitemap.xml vorhanden?
```

Siehe: [Deploy Checklist](../CHECKLISTS/deploy.checklist.md)

---

### 2. Upload zu Webspace

#### Option A: rsync (empfohlen)
```bash
rsync -av \
  --exclude='.env' \
  --exclude='*.md' \
  --exclude='cd-manual/' \
  --exclude='analysis/' \
  --exclude='src/' \
  ./public/ user@example.com:/var/www/html/
```

#### Option B: SFTP
```bash
sftp user@example.com
cd /var/www/html/
put -r public/*
```

#### Option C: FTP (FileZilla)
```
Verbinde zu example.com
Lokaler Ordner: ./public
Remote Ordner: /public_html/
Ziehe public/* → Remote
```

---

### 3. Git Commit + Push (wenn Git vorhanden)

```bash
# 1. Alle Changes staging (außer .env, .gitignore beachtet)
git add -A

# 2. Commit mit Version-Info
git commit -m "Deploy: Version 1.2.0 – Features X, Y, Bug fixes Z"

# 3. Push zu Remote
git push origin main

# 4. Tag erstellen (Semantic Versioning)
git tag -a v1.2.0 -m "Production Release"
git push origin v1.2.0
```

**Commit Message Format:**
```
Deploy: Version X.Y.Z – [Zusammenfassung]

[Optional Details]
- Feature 1 implemented
- Bug X fixed
```

**Semantic Versioning:**
- v1.0.0 → Initial Release
- v1.0.1 → Bugfix
- v1.1.0 → Neue Feature
- v2.0.0 → Major/Breaking Change

---

### 4. Changelog + GitHub Release

```markdown
# CHANGELOG.md

## [1.2.0] – 2026-05-11

### Added
- Dark mode toggle
- Testimonials section
- Responsive video player

### Fixed
- Mobile navigation overlap
- Image lazy loading delay

### Deployed to
- Production: example.com
- Git Tag: v1.2.0
```

Optional: GitHub Release erstellen
```bash
gh release create v1.2.0 \
  --title "Version 1.2.0" \
  --notes "Dark mode + Testimonials"
```

---

## Agent-Output nach Deploy

```
✅ DEPLOYMENT + GIT ERFOLGREICH

🌐 Webspace Upload:
   - 15 HTML-Dateien
   - CSS/JS minified
   - 42 Bilder (WebP)
   - 3 Videos (MP4)
   → Deployed zu: example.com

💾 Git Commit:
   - Commit: abc1234d
   - Message: "Deploy: Version 1.2.0 – Dark mode, Testimonials"
   - Branch: main → origin/main ✅
   - Tag: v1.2.0 ✅

📊 Größe:
   - Webspace: 4.2 MB
   - CSS/JS: 165 KB (minified)
   - Assets: optimiert ✅

🔙 Rollback möglich:
   git checkout v1.1.0
   git push -f origin main
```

---

## Ordnerstruktur im Webspace

```
example.com/
├── index.html
├── about.html
├── contact.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── css/
│   ├── reset.css
│   └── style.css
├── js/
│   ├── main.js
│   └── navigation.js
├── images/
│   ├── hero-1920w.webp
│   ├── hero-768w.webp
│   └── icon-arrow.svg
├── videos/
│   ├── hero-desktop.mp4
│   └── hero-mobile.mp4
└── fonts/
    ├── inter-regular.woff2
    └── inter-bold.woff2
```

---

## .gitignore (wichtig!)

```gitignore
# Secrets
.env
.env.local

# Dependencies
node_modules/
package-lock.json

# Build
build/
dist/
.next/

# IDE
.vscode/
.idea/

# Dokumentation (optional)
docs/
cd-manual/
analysis/
design/

# Source (nur public/ deployed)
src/

# OS
.DS_Store
Thumbs.db
```

---

## Fehlerbehandlung

**Wenn Deploy fehlschlägt:**

```bash
# Option 1: Revert (neuer Commit mit Undo)
git revert abc1234
git push origin main

# Option 2: Zu älterem Tag zurückgehen
git checkout v1.1.0
git push -f origin main

# Option 3: Webspace-Backup (vom Provider)
# [Kontaktiere Hosting-Provider]
```

**Agent informiert User:**
```
⚠️ DEPLOYMENT FEHLER

Fehler: [Was schief gelaufen ist]

Option 1: Zu v1.1.0 zurück?
Option 2: Problem beheben + nochmal deployen?
```

---

## Spezialfälle

### Mehrsprachige Websites
```
public/
├── index.html (Standard: Deutsch)
├── de/index.html
├── en/index.html
└── fr/index.html
```

### Blog/Dynamische Inhalte
```
public/
├── blog/index.html
└── blog/artikel/erste-artikel/index.html
```

### Subdomains
```
Hosting:
├── example.com → public_html/
├── blog.example.com → blog.public_html/
```

---

## Integration mit CD-Manual

**CD-Manual Eintrag:**
```
- Kategorie: Deployment
- Deploy Ziel: example.com (Webspace)
- Git Repository: github.com/user/repo
- Versioning: Semantic v1.0.0
- rsync Command: [Command here]
- Deploy Frequency: [auf User-Bedarf]
```

---

## Vibe-Coder Orientierung

- `public/` = "Was live geht"
- `src/` = "Source Code (nicht live)"
- `.env` = "Secrets (niemals committen!)"
- `git tag` = "Welche Version ist live?"
- `CHANGELOG.md` = "Was hat sich geändert?"

---

*Workflow: Deployment – Push8 Web Agency – Stand Mai 2026*
