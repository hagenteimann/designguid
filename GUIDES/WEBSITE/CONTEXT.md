# Projekt-Kontext für Agenten

Dieser Guide gibt KI-Agenten den notwendigen Kontext über Push8, die Arbeitsweise und die typischen Kundenprojekte. Vor dem ersten Code lesen.

---

## Was ist dieses Repo?

Dieses Repository ist der **zentrale Wissens-Hub** für alle Push8-Webprojekte. Es enthält:
- Verbindliche Design- und Code-Regeln
- Workflow-Anleitungen für wiederkehrende Aufgaben
- Checklisten für qualitaetssichere Deliverables
- Referenz-Beispiele und Templates

**Kein Code laeuft hier.** Das Repo ist eine Dokumentations- und Skill-Basis.

---

## Typische Kundenprojekte

### Wer sind Push8-Kunden?

| Typ | Beispiele | Hauptziel |
|---|---|---|
| Handwerker | Elektriker, Maurer, Schreiner | Kontaktanfragen generieren |
| Berater | Coaches, Steuerberater, Anwaelte | Vertrauen aufbauen, Termine buchen |
| Lokale Dienstleister | Hebammen, Therapeuten, Fitnessstudios | Reichweite lokal, Buchungen |
| Agenturen/Freelancer | Fotografen, Designer, Marketingagenturen | Portfolio, Neukundengewinnung |

### Typischer Projektumfang

- 1-Pager bis 5-Seiter (kein komplexes Backend)
- HTML/CSS/JS oder leichtes Framework (Astro, 11ty)
- Next.js fuer Content-heavy Projekte oder wenn der Kunde es verlangt
- Hosting: Webspace (FTP/rsync), Vercel, Netlify oder Hetzner VPS

---

## Arbeitsweise & Prinzipien

### Der Push8-Prozess

```
1. PROJEKT_BRIEF.md ausfuellen (Analyse vor Code)
2. Design-Tokens ableiten (keine Magic Numbers)
3. Sektionen-Reihenfolge bestätigen (kein Code ohne Freigabe)
4. Bauen (iterativ, mit Validator-Loop)
5. QA + Deploy (Checkliste abarbeiten)
```

### Qualitaetsstandards

- **Kein generisches AI-Slop:** Inter-Font + lila Gradient + weisse Cards = verboten.
- **Performance first:** Core Web Vitals müssen gruenln. LCP < 2.5s.
- **Mobile first:** Immer. Kein Desktop-Design das dann "responsive gemacht" wird.
- **DSGVO by default:** Kein CDN ohne Pruefung. Kein Google Fonts direkt. Kein Google Analytics ohne Consent.

---

## Wichtige Dateipfade in diesem Repo

| Datei | Inhalt |
|---|---|
| `GUIDES/DESIGN_SYSTEM.md` | Layout, Tokens, Farben, Components |
| `GUIDES/IDENTITY.md` | Push8-Markenidentität |
| `GUIDES/STYLE.md` | Code-Stil-Konventionen |
| `GUIDES/RULES.md` | Verbindliche Agenten-Regeln |
| `GUIDES/AWESOME_DESIGN.md` | Design-Referenzen und Inspirationen |
| `GUIDES/PROJEKT_BRIEF.md` | Template fuer Projektbriefing |
| `GUIDES/RALPH_LOOP.md` | Autonomer Zwei-Agenten-Build-Prozess |
| `CHECKLISTS/` | Schnell-Referenzen pro Workflow |
| `Beispiele/` | Fertige Design-System-Beispiele (HTML) |

---

## Technischer Stack – Defaults

```
HTML/CSS/JS:    Vanilla-first. Kein Framework-Overhead fuer einfache Sites.
CSS:            Custom Properties (Tokens), kein Tailwind in Produktion (ausser User wünscht es)
JS:             Vanilla ES6+. Kein jQuery. Alpine.js erlaubt fuer kleine Interaktivität.
Framework:      Astro (Static), Next.js (wenn SSR nötig)
Build:          Vite oder Parcel (kein Webpack ausser Zwang)
Icons:          Inline SVG (Heroicons, Lucide, Phosphor – MIT-Lizenz)
Fonts:          Self-hosted WOFF2
Bilder:         WebP, <200KB Desktop
```

---

## Was dieser Agent NICHT tut

- Keine Entscheidungen ohne Kontext treffen
- Keinen Code schreiben bevor der Projekt-Brief ausgefuellt ist
- Keine externen CDN-Requests ohne DSGVO-Pruefung einbauen
- Keine Magic Numbers – alles aus dem Token-System

---

*Push8 Agent Context – Stand Mai 2026*
