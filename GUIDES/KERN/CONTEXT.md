# Projekt-Kontext für Agenten

Dieser Guide gibt KI-Agenten den notwendigen Kontext über die Arbeitsweise und die typischen Kundenprojekte. Vor dem ersten Code lesen.

---

## Was ist dieses Repo?

Dieses Repository ist der **zentrale Wissens-Hub** für alle Webprojekte. Es enthält:
- Verbindliche Design- und Code-Regeln.
- Workflow-Anleitungen für wiederkehrende Aufgaben.
- Checklisten für qualitätssichere Deliverables.
- Referenz-Beispiele und Templates.

**Kein Code läuft hier.** Das Repo ist eine reine Dokumentations- und Skill-Basis.

---

## Typische Kundenprojekte

### Kundenstruktur

| Typ | Beispiele | Hauptziel |
|---|---|---|
| Handwerker | Elektriker, Maurer, Schreiner | Kontaktanfragen generieren |
| Berater | Coaches, Steuerberater, Anwälte | Vertrauen aufbauen, Termine buchen |
| Lokale Dienstleister | Hebammen, Therapeuten, Fitnessstudios | Reichweite lokal, Buchungen |
| Agenturen/Freelancer | Fotografen, Designer, Marketingagenturen | Portfolio, Neukundengewinnung |

### Typischer Projektumfang

- 1-Pager bis 5-Seiter (kein komplexes Backend).
- HTML/CSS/JS oder leichtes Framework (Astro, 11ty).
- Next.js für Content-heavy Projekte oder wenn explizit verlangt.
- Hosting: Webspace (FTP/rsync), Vercel, Netlify oder VPS.

---

## Arbeitsweise & Prinzipien

### Der Workflow-Prozess

```
1. PROJEKT_BRIEF.md ausfüllen (Analyse vor Code)
2. Design-Tokens ableiten (keine Magic Numbers)
3. Sektionen-Reihenfolge bestätigen (kein Code ohne Freigabe)
4. Bauen (iterativ, mit Validator-Loop)
5. QA + Deploy (Checkliste abarbeiten)
```

### Qualitätsstandards

- **Kein generisches AI-Slop:** Inter-Font + lila Gradient + weiße Cards = verboten.
- **Performance first:** Core Web Vitals müssen grün sein. LCP < 2.5s.
- **Mobile first:** Immer. Kein Desktop-Design, das dann "responsive gemacht" wird.
- **DSGVO by default:** Kein CDN ohne Prüfung. Kein Google Fonts direkt. Kein Google Analytics ohne Consent.

---

## Wichtige Dateipfade in diesem Repo

| Datei / Ordner | Inhalt |
|---|---|
| `GUIDES/01_STRATEGY/` | Strategische Analysen (Customer, Product, HR etc.) |
| `GUIDES/02_CONCEPT/` | Synthese (Design-Konzept, Form Follows Function) |
| `GUIDES/03_EXECUTION/` | Finale Deliverables (Logo, Typo, Colors, Components, Layout, Prompts, Voice, Motion) |
| `GUIDES/03_EXECUTION/technical/` | Technische Guides (SEO, Legal, Security, QA, Deploy, Forms, Automation) |
| `GUIDES/KERN/STYLE.md` | Code-Stil-Konventionen |
| `GUIDES/KERN/RULES.md` | Verbindliche Agenten-Regeln |
| `GUIDES/KERN/PROJEKT_BRIEF.md` | Template für das Projektbriefing |
| `CHECKLISTS/` | Schnell-Referenzen pro Workflow |

---

## Technischer Stack – Defaults

```
HTML/CSS/JS:    Vanilla-first. Kein Framework-Overhead für einfache Sites.
CSS:            Custom Properties (Tokens), kein Tailwind in Produktion (außer User wünscht es)
JS:             Vanilla ES6+. Kein jQuery. Alpine.js erlaubt für kleine Interaktivität.
Framework:      Astro (Static), Next.js (wenn SSR nötig)
Build:          Vite oder Parcel (kein Webpack außer Zwang)
Icons:          Inline SVG (Heroicons, Lucide, Phosphor – MIT-Lizenz)
Fonts:          Self-hosted WOFF2
Bilder:         WebP, <200KB Desktop
```

---

## Was dieser Agent NICHT tut

- Keine Entscheidungen ohne Kontext treffen.
- Keinen Code schreiben, bevor der Projektbrief ausgefüllt ist.
- Keine externen CDN-Requests ohne DSGVO-Prüfung einbauen.
- Keine Magic Numbers – alles aus dem Token-System.

---

*Agent Context – Stand Juni 2026*
