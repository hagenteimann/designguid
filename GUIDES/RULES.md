# Verbindliche Agenten-Regeln – Push8

Diese Regeln gelten fuer alle KI-Agenten die mit Push8-Projekten arbeiten. Keine Ausnahmen ohne explizite Freigabe durch den User.

---

## Die 10 Gebote

### 1. Kein Code ohne Kontext

Vor dem ersten Keystroke muss bekannt sein:
- Branche des Kunden
- Primäre Conversion-Action (was soll der Besucher tun?)
- Stack (HTML/CSS/JS, Next.js, Astro?)
- Gibt es eine alte Website? Was wird behalten?

**Wenn unklar → fragen, nicht raten.**

---

### 2. Kein generisches Design

Verbotene Kombination: Inter-Font + lila/blauen Gradient + weisse abgerundete Cards + keine Animation.

Jedes Projekt bekommt eine spezifische visuell-Sprache. Ein charakterstarker Font. Eine begruendete Farbwahl. Typografische Persoenlichkeit.

---

### 3. Token-System ist heilig

Kein einziger hardcodierter Wert fuer Spacing, Farbe oder Radius in Production-Code.

```css
/* Einzige Ausnahme: 0 und 100% */
margin: 0;        /* OK */
width: 100%;      /* OK */
padding: 24px;    /* VERBOTEN → var(--space-400) */
```

---

### 4. Performance ist kein Bonus

Bilder muessen komprimiert sein **bevor** sie eingebaut werden. Kein PNG in Production. Kein Video > 2MB ohne Begruendung.

Lighthouse Performance-Score < 80 = Deploy blockiert.

---

### 5. DSGVO ist nicht verhandelbar

Kein CDN-Request ohne Pruefung:
- Google Fonts CDN: **verboten**
- Font Awesome CDN: **verboten**
- Google Analytics ohne Consent: **verboten**
- Inline SVG statt CDN-Icons: **Pflicht**

---

### 6. Accessibility ist Pflicht, kein Bonus

- Kontrast 4.5:1 minimum. Pruefung mit axe oder Lighthouse.
- Touch-Targets 48x48px minimum.
- Alle Bilder mit aussagekraeftigem alt-Attribut.
- Alle interaktiven Elemente per Tastatur erreichbar.
- `prefers-reduced-motion` immer respektieren.

---

### 7. Mobile First ist kein Wunsch

Design beginnt immer bei 375px Breite. Desktop ist die Erweiterung.

Kein Entwickeln auf Desktop und dann "responsiv machen" – das fuehrt immer zu schlechten Mobile-Ergebnissen.

---

### 8. Empty States sind UI-Elemente

Jede Liste, jeder Grid, jedes Dashboard braucht:
- First-Use State
- Empty/No-Results State
- Error State
- Loading State (Skeleton Screen)

---

### 9. Dokumentation bleibt aktuell

Wenn eine Design-Entscheidung getroffen wird (neue Farbe, neuer Font, neue Sektion) → CD-Manual aktualisieren.

Nicht: "ich mach das spaeter". Sofort.

---

### 10. Kein Deploy ohne Checkliste

Vor jedem Go-Live: `CHECKLISTS/deploy.checklist.md` abarbeiten. Vollstaendig. Kein Item ueberspringen.

---

## Entscheidungs-Hierarchie

Wenn Regeln in Konflikt stehen, gilt:

```
1. Explizite User-Anweisung (hoechste Prioritaet)
2. PROJEKT_BRIEF.md (projektspezifische Entscheidungen)
3. Diese RULES.md
4. DESIGN_SYSTEM.md
5. STYLE.md
6. Branchenstandards / Best Practices
```

---

## Was der Agent NICHT entscheidet

- Primärfarbe ohne Begruendung und Bestätigung
- Sektionen-Reihenfolge ohne Freigabe
- Deployment ohne explizite Anweisung
- CDN-Einbindung externer Dienste
- Entfernung bestehender Inhalte/Sektionen

---

## Fehler-Protokoll

Wenn etwas schieflaeuft:
1. **Nicht einfach weitermachen.** Stopp.
2. Fehler klar benennen (was ist passiert, was wurde erwartet).
3. Loesungsoptionen anbieten (mindestens 2).
4. User entscheiden lassen.

---

## Anti-Patterns – nie wieder

| Pattern | Warum verboten |
|---|---|
| `console.log` in Production-Code | Performance, Sicherheit |
| `!important` im CSS | Spezifitaets-Chaos |
| Inline-Styles im HTML | Nicht wartbar, kein Token-System |
| `position: absolute` fuer Layout | Bricht auf anderen Screens |
| `100vh` fuer Mobile-Hero | iOS Safari Bug → `100svh` |
| `font-weight: bold` | → `font-weight: 700` (explizit) |
| CDN-Scripts ohne SRI-Hash | Sicherheitsrisiko |

---

*Push8 Agent Rules – Stand Mai 2026*
