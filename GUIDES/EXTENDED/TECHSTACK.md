# Tech Stack & Skalierbarkeit

Verbindliche Stack-Entscheidungen fuer Webprojekte. Basiert auf Performance, DSGVO, Wartbarkeit und Agentur-Skalierung.

---

## Stack-Entscheidung: Schnell-Referenz

```
Landing Page (Standard):     Plain HTML + CSS + GSAP
Landing Page (mehrere Seiten): Astro + CSS + GSAP
Mit Kundenredaktion:         Astro + Sanity CMS
Web-App-Features:            SvelteKit
Wenn Kunde React fordert:    Next.js (nur dann)
```

**Regel:** Nimm das einfachste Tool das die Anforderungen erfuellt. Nicht das modernste.

---

## Layer 1: Plain HTML/CSS/JS

### Wann verwenden
- 1–2 Seiten, einmalig gebaut
- Kein wiederverwendbarer Komponenten-Bedarf
- Maximale Robustheit gewuenscht

### Vorteile
- Kein Build-Step, kein Framework, kein "funktioniert auf meinem Rechner"
- Fehler tauchen sofort auf, nicht beim Build
- Jeder Entwickler kann es anfassen
- Deploy: einfach Dateien auf FTP

### Nachteile
- Layouts und Komponenten werden copy-paste
- Kein automatisches Asset-Handling

---

## Layer 2: Astro

### Wann verwenden
- 3+ Seiten mit wiederverwendbaren Layouts
- Blog, Case Studies, mehrseitige Projekte
- Performance ist kritisch (Google-Ranking)

### Das Kern-Prinzip: Zero JS by default

Astro rendert alles zu statischem HTML. Im Browser landet kein JavaScript – ausser du willst es explizit.

```
Next.js Landing Page:    ~150–300 KB JS (React Runtime + Hydration)
Astro Landing Page:        0 KB JS (reines HTML/CSS)
```

### Vorteile
- Lighthouse Score 95–100 fast automatisch
- LCP unter 2s ohne Optimierungsarbeit
- Komponenten-Struktur ohne Framework-Overhead im Browser
- Partial Hydration: nur interaktive Teile laden JS
- Markdown + Content Collections fuer Blog/Case Studies
- Deploy als statische Dateien – kein Server noetig

### Bekannte Schwaechen
- Hydration-Fehler (client:load / client:visible) sind subtil und schwer zu debuggen
- Build-Fehler statt Runtime-Fehler – tauchen erst beim Build auf
- Oekosystem kleiner als Next.js (weniger Plugins, weniger Community-Antworten)
- TypeScript + Drittanbieter-Pakete hakt gelegentlich
- Config-Aenderungen erfordern manuellen Neustart

### Wann Astro NICHT nehmen
- Web-App mit Login, Datenbank, komplexem State → SvelteKit
- Wenn der Kunde explizit React fordert → Next.js
- Wenn plain HTML reicht → plain HTML

---

## Layer 3: SvelteKit

### Wann verwenden
- Web-App-Features (Login, Datenbank, API-Routen)
- Server-Side-Rendering noetig
- Projekt waechst ueber statische Site hinaus

### Warum SvelteKit statt Next.js
- Deutlich kleineres JS-Bundle
- Weniger "Magie", klarerer Code
- Bessere Performance fuer SSR ohne React-Overhead
- Kein Virtual DOM

### Wann Next.js
- Einziger Grund: Kunde fordert explizit React
- Grosses Team das React bereits kennt

---

## Animations-Stack: GSAP + ScrollTrigger

### Warum GSAP
- Industriestandard fuer Web-Animationen
- Praezise Timeline-Kontrolle
- Performant (requestAnimationFrame-basiert)
- Funktioniert mit jedem Framework oder plain HTML

### GSAP Module

| Modul | Lizenz | Verwendung |
|---|---|---|
| GSAP Core | Free | Basis-Animationen, Timelines, Easings |
| ScrollTrigger | Free | Scroll-basierte Trigger, Pinning, Scrubbing |
| SplitText | Club (99$/Jahr) | Text-Animationen Zeile/Buchstabe |
| Draggable | Free | Drag-Interaktionen |

### Pflicht-Animationen

**Hero-Animation (jede Seite):**
- Paragraph-Reveal: Ueberschrift + Text kommen nacheinander von unten
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- Optional: leichter Parallax auf Hero-Bild

**Reveal-System (jede Seite):**
```js
gsap.from(".reveal", {
  y: 40,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out",
  stagger: 0.1,
  scrollTrigger: { trigger: ".reveal", start: "top 85%" }
});
```

**Micro-Interactions (immer):**
- Button Hover: 120ms, ease-out
- Card Hover: translateY(-4px) + Shadow
- Formular-Feedback: Shake bei Fehler, Checkmark bei Erfolg

### Dauer-Referenz

| Element | Dauer | Easing |
|---|---|---|
| Button Hover | 120ms | ease-out |
| Modal oeffnen | 300ms | spring |
| Modal schliessen | 200ms | ease-in |
| Scroll-Reveal | 600–800ms | power3.out |
| Seitenwechsel | 500ms | ease-in-out |

### Niemals
- `transition: all` – immer spezifische Properties
- Animationen laenger als 1s fuer UI-Feedback
- Lineare Bewegung fuer Objekte
- Animationen ohne `prefers-reduced-motion` Fallback

---

## Warum nicht...

| Tool | Problem |
|---|---|
| **React/Next.js fuer Landing Pages** | JS-Bundle zu gross, LCP leidet, Overkill |
| **Framer Motion** | React-abhaengig, unnoetig fuer statische Sites |
| **AOS / Animate.css** | Zu generisch, kaum Kontrolle, KI-Slop-Feeling |
| **Lottie** | Grosse Dateien, Performance-Problem auf Mobile |
| **WordPress** | Template-Fabrik, Sicherheitsrisiko, Performance-Probleme |
| **Tailwind in Produktion** | Kein echtes Token-System, Utility-Class-Chaos, schlechte Wartbarkeit |
| **jQuery** | Ueberholt, unnoetig, Bloat |
| **Bootstrap** | Generisches Aussehen, schwer zu ueberschreiben |

---

## Skalierbarkeit

### 3 verschiedene Skalierbarkeitsprobleme

**1. Agentur-Skalierung** – Mehr Projekte pro Jahr bauen
**2. Projekt-Skalierung** – Kunde will aus 1-Pager eine 10-Seiten-Site
**3. Traffic-Skalierung** – Kunde wird viral

### Agentur-Skalierung

```
Astro + eigenes Component-System + Sanity CMS
```

- Einmal sauberes Astro-Komponenten-Set bauen (Hero, CTA, Cards, Nav, Footer)
- Fuer jeden Kunden nur Tokens + Inhalte austauschen
- Sanity als headless CMS → Kunde pflegt selbst, die Agentur baut schneller

**Die echten Skalierungs-Hebel:**

| Hebel | Warum |
|---|---|
| Token-System | Jedes Projekt nutzt dieselbe Struktur, nur andere Werte |
| Komponenten-Bibliothek | Hero, Nav, CTA einmal gebaut – 20x wiederverwendet |
| Klarer Brief-Prozess | Weniger Nacharbeit, schnellere Abnahme |
| CMS-Strategie | Kunde pflegt selbst → die Agentur spart Support-Zeit |

Nicht das Framework skaliert. Das System skaliert.

### Projekt-Skalierung

```
1–50 Seiten:   Astro + Content Collections
50+ Seiten:    Astro + Sanity CMS (strukturierte Inhalte)
Web-App:       SvelteKit
```

### Traffic-Skalierung

Kein Problem bei statischen Sites.

```
Statisches HTML auf CDN → skaliert auf 10 Millionen Besucher
Kein Server noetig. Vercel/Netlify Edge-CDN reicht.
```

---

## Roadmap Stack

```
Kurzfristig (0–2 Jahre):
  Plain HTML-Blueprint + Token-System
  → Schnell ausrollbar, kein Overhead

Mittelfristig (2–4 Jahre):
  Astro-Component-Library + Sanity CMS
  → Kunde kann selbst editieren
  → die Agentur baut schneller weil Komponenten fertig sind

Langfristig (4+ Jahre):
  SvelteKit wenn Web-App-Features gefragt sind
  → Next.js nur wenn Kunde explizit React fordert
```

---

## Vollstaendiger Default-Stack

```
Framework:    Astro (ab 3 Seiten) / Plain HTML (darunter)
CSS:          Custom Properties (Tokens), kein Tailwind
JS:           Vanilla ES6+, Alpine.js fuer kleine Interaktivitaet
Animationen:  GSAP + ScrollTrigger
Icons:        Inline SVG (Lucide / Phosphor – MIT-Lizenz)
Fonts:        Self-hosted WOFF2 (kein Google Fonts CDN)
Bilder:       WebP, <200KB Desktop, <picture> fuer Responsive
CMS:          Sanity (wenn Kundenredaktion gewuenscht)
Build:        Vite (in Astro integriert)
Hosting:      Vercel / Netlify / Hetzner VPS
```

---

*TechStack Guide – Stand Mai 2026*
