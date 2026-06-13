# Accessibility Testing Checklist (WCAG 2.1 AA)

---

## Automatische Tests (Tools)

### Browser Extensions
1. **axe DevTools**
   - Chrome/Firefox Extension
   - Scannt für a11y Issues
   - Gibt Severity & Fix-Vorschläge

2. **WAVE**
   - Wave.webaim.org
   - Visuelle a11y Fehler markieren

3. **Lighthouse**
   - Chrome DevTools → Lighthouse Tab
   - Accessibility Score ≥ 90

### Automatische Test Tools
- Axe Accessibility Checker
- Lighthouse CI (GitHub Actions)
- Jest Accessibility Plugin

---

## Manuelle Tests (Checkliste)

### 1. Keyboard Navigation
- [ ] Alle interactive Elemente mit TAB erreichbar?
- [ ] Tab-Order logisch (links→rechts, oben→unten)?
- [ ] Focus-Indicator sichtbar?
- [ ] Keine "keyboard trap" (kommt nicht raus)?
- [ ] Links mit Enter aktivierbar?
- [ ] Buttons mit Space & Enter aktivierbar?

**Test:**
```bash
# Mit nur Tastatur navigieren
TAB → Alle Buttons/Links erreichen
Shift+TAB → Rückwärts navigieren
Enter → Aktivieren
Space → Checkboxes, Buttons
Escape → Modals schließen
```

### 2. Screen Reader Testing

**Tools:**
- NVDA (Windows kostenlos)
- JAWS (Windows, kostenpflichtig)
- VoiceOver (Mac, kostenlos)

**Test Prozess:**
1. Screen Reader starten
2. Website durchnavigieren (ohne sehen!)
3. Alle Inhalte verständlich?
4. Links beschreibend? (nicht "klick hier")
5. Alt-Texte sinnvoll?
6. Form Labels vorhanden?

**Checkliste:**
- [ ] Alle Inhalte werden vorgelesen?
- [ ] Links sind distinguishable?
- [ ] Form Labels vorhanden?
- [ ] Alt-Texte aussagekräftig?
- [ ] Headings Struktur OK?

### 3. Kontrast Check

```
Erforderlich:
- Normal Text: 4.5:1
- Large Text (18px+): 3:1
- UI Components: 3:1
```

**Tools:**
- Color Contrast Analyzer
- WebAIM Contrast Checker
- Chrome DevTools (Inspector → Computed Styles)

**Test:**
```css
/* Prüfe diese Kombinationen: */
Text Color #333 on Background #fff = 12.6:1 ✅
Text Color #666 on Background #fff = 4.5:1 ✅
Text Color #999 on Background #fff = 2.9:1 ❌
```

### 4. Zoom & Responsive

- [ ] Website 200% zoom-bar? (große User)
- [ ] Responsive < 320px? (small phones)
- [ ] Text wrapping OK bei zoom?
- [ ] Keine horizontal scroll bei zoom?

**Test:**
```
Browser Zoom: Ctrl+Plus (mehrmals)
Prüfe: Text lesbar, Layout OK, nichts überlappt
```

### 5. Color Blindness

- [ ] Info nicht NUR über Farbe? (auch Icon/Text)
- [ ] Charts: Kontrast, nicht nur Farbe unterscheidbar
- [ ] Links nicht nur blau (auch underline, etc.)

**Tools:**
- Chrome Extension: "Color Blindness Simulator"
- Testen mit: Deuteranopia, Protanopia, Tritanopia

### 6. Focus Styles

```css
/* Muss sichtbar sein! */
:focus {
  outline: 2px solid #007bff;  /* Blauer Outline */
  outline-offset: 2px;
}

/* NICHT: */
:focus {
  outline: none;  /* ❌ FALSCH! */
}
```

- [ ] Focus-Indicator mindestens 2px?
- [ ] Kontrast ≥ 3:1 zu Hintergrund?
- [ ] Deutlich sichtbar, nicht dünn?

### 7. Forms & Error Messages

- [ ] Labels für alle Inputs?
- [ ] Error Messages klar?
- [ ] Error Farbe + Text (nicht nur rot)?
- [ ] Required Fields markiert?
- [ ] Placeholder NICHT statt Label?

```html
<!-- ✅ Richtig -->
<label for="email">Email</label>
<input id="email" type="email" required>

<!-- ❌ Falsch -->
<input placeholder="Email">
```

### 8. Headings Struktur

- [ ] H1 genau 1x pro Seite?
- [ ] Headings nicht übersprungen? (H1 → H2 → H3, nicht H1 → H3)
- [ ] Headings beschreibend?

```html
<!-- ✅ Richtig -->
<h1>Unsere Services</h1>
  <h2>Web Design</h2>
  <h2>Development</h2>
    <h3>Frontend</h3>
    <h3>Backend</h3>

<!-- ❌ Falsch -->
<h1>Title</h1>
<h3>Subheading</h3> <!-- Übersprungen H2! -->
```

### 9. Images & Alt Text

- [ ] Alle Bilder haben alt-Attribute?
- [ ] Alt-Text beschreibend (nicht "image.jpg")?
- [ ] Decorative Images: alt=""?
- [ ] Complex Images: Longdesc oder caption?

```html
<!-- ✅ Richtig -->
<img src="chart.png" alt="Sales trend 2025: +25% growth">

<!-- ❌ Falsch -->
<img src="chart.png" alt="chart">
```

### 10. Links

- [ ] Link Text aussagekräftig? (nicht "click here")
- [ ] Links unterscheidbar von normal text?
- [ ] External Links markiert? (Icon oder Text)
- [ ] Links mit Enter + nicht nur onclick?

```html
<!-- ✅ Richtig -->
<a href="/about">Über uns</a>

<!-- ❌ Falsch -->
<a href="/about">Klick hier</a>
```

---

## WCAG 2.1 AA Kritische Punkte

| Kriterium | Requirement |
|-----------|------------|
| 1.1.1 Text Alternatives | Alt-Texte auf Bildern |
| 1.4.3 Contrast | 4.5:1 für Normal Text |
| 2.1.1 Keyboard | Alle Features mit Tastatur erreichbar |
| 2.4.3 Focus Order | Logische Tab-Order |
| 2.4.7 Focus Visible | Focus-Indicator sichtbar |
| 3.3.1 Error Identification | Error Messages klar |
| 4.1.2 Name, Role, Value | ARIA korrekt |

---

## Automatisierte Testing Integration

### GitHub Actions (CI/CD)
```yaml
name: a11y Test
on: [push]
jobs:
  axe:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test:a11y  # Custom script
```

### Package.json
```json
{
  "scripts": {
    "test:a11y": "axe http://localhost:3000"
  }
}
```

---

## Vor Deploy Checklist

- [ ] Lighthouse Accessibility Score ≥ 90
- [ ] axe DevTools: Keine Critical Issues
- [ ] Keyboard Navigation getestet
- [ ] Kontrast ≥ 4.5:1 überall
- [ ] Focus-Indicators sichtbar
- [ ] Alt-Texte vorhanden & aussagekräftig
- [ ] Heading Struktur OK
- [ ] Form Labels vorhanden
- [ ] Screen Reader (NVDA/VoiceOver) getestet

---

*Accessibility Testing – Push8 Web Agency – Stand Mai 2026*
