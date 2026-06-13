# Push8 – Brand Identity

Verbindliche Markenidentität für Push8 Web Agency. Dieser Guide definiert, wer Push8 ist und wie es visuell und sprachlich auftritt.

---

## Wer ist Push8?

Push8 ist eine Web-Agentur, die handwerklich hochwertige Websites für kleine und mittelständische Unternehmen baut – Handwerker, Berater, lokale Dienstleister. Kein Agentur-Bullshit, keine Templates, keine Massenproduktion.

**Positionierung:** Premium-Qualität, direkte Kommunikation, echte Ergebnisse.

---

## Markenpersönlichkeit

| Eigenschaft | Beschreibung |
|---|---|
| **Direkt** | Kein Marketingsprech. Klare Aussagen, klare Preise. |
| **Handwerklich** | Jedes Detail sitzt. Code ist sauber, Design ist durchdacht. |
| **Vertrauenswürdig** | Was versprochen wird, wird geliefert. |
| **Modern ohne Arroganz** | Auf dem Stand der Zeit, aber nicht überheblich. |

---

## Tonalität (Voice & Tone)

### Schreibe so:
- Kurze Sätze. Aktiv. Direkt.
- "Wir bauen Websites, die Kunden gewinnen." – nicht "Wir entwickeln digitale Loesungen zur Kundengewinnung."
- Duzen ist Standard im Onboarding/UI – Siezen bei formellen Kunden auf Anfrage.
- Konkrete Zahlen statt vage Versprechen: "3 Tage" statt "schnell".

### Schreibe nicht so:
- Kein: "synergistisch", "ganzheitlich", "End-to-End-Loesungen"
- Kein passives Konstrukt ohne Grund
- Kein "lorem ipsum" oder Platzhaltertext in Deliverables

---

## Visuelles System

### Primärfarbe
Die Primärfarbe wird projekt-spezifisch gesetzt (siehe `PROJEKT_BRIEF.md`). Basis-Token:
```css
--color-primary-300: /* Markenfarbe des Kunden – BASE */
```

### Typografie-Philosophie
- **Display-Font:** Charakterstark, unterscheidbar – kein Inter, kein Roboto, kein Arial.
- **Body-Font:** Lesbar, harmoniert mit Display. Ideal: klassische Grotesque oder Serif-Hybrid.
- Fonts: immer self-hosted (DSGVO). Kein Google Fonts CDN.

### Form-Sprache
- Quintic Superellipsen (Squircle) für Icons, Cards, Badges – kein border-radius: 50% auf quadratischen Elementen.
- Klare Hierarchie: Groß → Mittel → Klein. Nie gleichwertig.
- Weißraum ist ein Design-Element, kein Fehler.

### Motion-Sprache
- Subtil. Zweckorientiert. Nie dekorativ ohne Funktion.
- Hero: Paragraph-Reveal + Parallax (Pflicht).
- `prefers-reduced-motion` immer respektieren.
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` – organisch, nicht mechanisch.

---

## Logo & Markenwort

- Schreibweise immer: **Push8** (P groß, 8 direkt angehängt, kein Leerzeichen)
- Nie: push8, PUSH8, Push 8
- Im Code: class-Namen, IDs und Dateinamen nutzen `push8-` als Prefix wenn noetig.

---

## Was Push8 NICHT ist

- Keine Template-Fabrik (kein Elementor, kein Wix, kein Squarespace)
- Keine SEO-Farm
- Kein "wir machen alles"-Anbieter – Fokus auf Web
- Keine Billig-Agentur – Qualitaet hat ihren Preis

---

*Push8 Brand Identity – Stand Mai 2026*
