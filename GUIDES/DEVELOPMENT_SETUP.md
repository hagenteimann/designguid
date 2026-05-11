# Workflow: Development Environment Setup

**Für neue Developer & Agent-Initialization**

---

## Übersicht

Wie man eine lokale Entwicklungsumgebung aufbaut & die Website lokal entwickelt.

---

## 1. Voraussetzungen

### Erforderlich
- Git installiert? (`git --version`)
- Node.js ≥ 18 LTS? (`node --version`)
- npm oder yarn? (`npm --version`)
- Code Editor (VS Code empfohlen)

### Optional
- Docker (für komplexere Setups)
- SSH-Keys für Git (für Remote Push)

---

## 2. Projekt Klonen

```bash
git clone https://github.com/user/website.git
cd website
```

---

## 3. Dependencies installieren

```bash
npm install
# oder
yarn install
```

**Was passiert:**
- `node_modules/` Ordner wird erstellt
- Alle npm Packages werden installiert
- Lock-Datei wird aktualisiert

---

## 4. Environment Setup

### .env Datei erstellen

```bash
# Kopiere .env.example zu .env (NIEMALS INS GIT!)
cp .env.example .env

# Editiere .env mit lokalen Werten
# Beispiel:
# API_URL=http://localhost:3000
# DATABASE_URL=postgresql://localhost/website
# ANALYTICS_ID=xyz123
```

**Wichtig:**
- `.env` NIEMALS ins Git commtten!
- `.env.example` zeigt nötige Variables
- `.gitignore` muss `.env` enthalten

---

## 5. Build & Dev Server

### Development Server starten

```bash
npm run dev
# oder
yarn dev
```

**Erwartet:**
- Server läuft auf `http://localhost:3000` oder ähnlich
- Hot Reload aktiv (Änderungen sofort sichtbar)
- Error-Messages im Terminal sichtbar

### Production Build

```bash
npm run build
# oder
yarn build
```

**Erstellt:**
- `dist/` oder `build/` Ordner
- Minified HTML, CSS, JS
- Optimierte Assets

### Build in Browsern testen

```bash
npm run build
npm run preview
```

---

## 6. Dateistruktur verstehen

```
website/
├── public/           → Deployed Files (HTML, CSS, JS, Assets)
├── src/              → Source Code (nicht deployed)
│   ├── components/
│   ├── styles/
│   └── scripts/
├── .env.example      → Template für .env
├── .gitignore        → Sagt Git was ignorieren
├── package.json      → Dependencies & Scripts
├── .github/          → GitHub Actions (Workflows)
└── README.md         → Projekt-Info
```

---

## 7. Git Workflow

### Branches

```bash
# Hauptbranch (Production)
git checkout main

# Feature Branch erstellen
git checkout -b feature/my-feature

# Änderungen committen
git add .
git commit -m "Add my feature"

# Push zu Remote
git push origin feature/my-feature

# → PR erstellen & Merge
```

### Commits schreiben

```bash
# Gutes Commit-Format:
git commit -m "Add: Dark mode toggle

- Added CSS variables for dark theme
- Implemented localStorage persistence
- Updated CD-Manual"
```

---

## 8. NPM Scripts Übersicht

Typische Scripts in `package.json`:

```json
{
  "scripts": {
    "dev": "vite",                    // Dev Server
    "build": "vite build",             // Production Build
    "preview": "vite preview",         // Preview Build
    "lint": "eslint src/",             // Code Quality
    "test": "vitest",                  // Tests
    "format": "prettier --write ."     // Code Formatting
  }
}
```

**Typische Befehle:**
```bash
npm run dev        # Dev Server starten
npm run build      # Production bauen
npm run lint       # Code-Fehler prüfen
npm run test       # Tests laufen
npm run format     # Code automatisch formatieren
```

---

## 9. Debugging

### Browser DevTools
```
Chrome: F12 oder Ctrl+Shift+I
Firefox: F12 oder Ctrl+Shift+I
Safari: Cmd+Option+I
Edge: F12 oder Ctrl+Shift+I
```

### Terminal Output prüfen
```bash
npm run dev
# Fehler/Warnings erscheinen hier
```

### VS Code Debugger
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

---

## 10. Häufige Probleme

### "npm: command not found"
```bash
# Node.js nicht installiert
# Lösung: https://nodejs.org installieren
node --version  # Test
```

### "Port already in use"
```bash
# Dev Server Port ist belegt
# Option 1: Andere App beenden
# Option 2: Anderen Port verwenden
npm run dev -- --port 3001
```

### "Module not found"
```bash
# Dependencies nicht installiert
npm install
```

### ".env Datei fehlt"
```bash
# .env nicht vorhanden
cp .env.example .env
# Dann .env mit lokalen Werten bearbeiten
```

### "Build fehlgeschlagen"
```bash
# Prüfe Syntax-Fehler
npm run lint
npm run build  # Siehe Fehlermeldungen
```

---

## 11. Tipps für Developer

- Nutze VS Code Extensions:
  - **ESLint** – Code-Qualität
  - **Prettier** – Code-Formatierung
  - **Live Server** – Live-Reload
  - **Thunder Client** – API Testing

- Lese QUICK_START.md regelmäßig (Workflows ändern sich)
- Frag Agent wenn etwas unklar ist
- Dokumentiere Änderungen ins CD-Manual
- Teste lokal vor Deploy!

---

## 12. Checklist für Onboarding

- [ ] Git repo geklont?
- [ ] Node.js installiert?
- [ ] `npm install` durchgelaufen?
- [ ] `.env.example` zu `.env` kopiert?
- [ ] Dev Server läuft (`npm run dev`)?
- [ ] `http://localhost:3000` erreichbar?
- [ ] QUICK_START.md gelesen?
- [ ] DESIGN_SYSTEM.md gelesen?
- [ ] cd-manual/index.html geöffnet?
- [ ] Erste kleine Änderung lokal gemacht?
- [ ] Commit & Push durchgeführt?

---

*Development Setup – Push8 Web Agency – Stand Mai 2026*
