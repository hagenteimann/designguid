# 🎯 Design System Blueprint — Vollständige Vorlage

**Status:** Ready-to-Use Master Template für alle neuen Projekte

---

## 📋 Was ist das?

Ein **universelles HTML/CSS Skeleton** für Design-System-Dokumentationen. Enthält:

✅ **Alle möglichen Dokumentations-Abschnitte** (nicht nur einige)
✅ **Alle Component-Typen** (Buttons, Forms, Cards, Tables, etc.)
✅ **Skeleton Loading mit Shimmer-Animation**
✅ **Responsive Design**
✅ **Dark Mode Support**
✅ **WCAG AA Accessibility**
✅ **Square & Circle Rule** (Superellipsen)
✅ **4pt Grid System** (4pt Token-Base, 8pt Layout-Minimum)

---

## 🚀 Wie man den Blueprint nutzt

### Option 1: Für ein neues Projekt kopieren
```bash
cp BLUEPRINT-design-system-template.html [PROJEKT]-design-system.html
cp blueprint-styles.css [PROJEKT]-styles.css
```

### Option 2: Im Browser öffnen (direkt nutzen)
```bash
# Öffne BLUEPRINT-design-system-template.html im Browser
```

---

## 📁 Dateistruktur

```
Beispiele/
├── BLUEPRINT-design-system-template.html    ← Master-HTML (alle Sections)
├── blueprint-styles.css                     ← Alle Design-Tokens & Styles
├── BLUEPRINT-README.md                      ← Diese Datei
│
├── creativelab.de-design-system.html        ← Beispiel 1: Fashion/Lifestyle
├── Hebamme Hannah-design-system.html        ← Beispiel 2: Healthcare
├── Genie-design-system.html                 ← Beispiel 3: B2B SaaS/CRM
```

---

## 📖 Blueprint-Struktur (14 Abschnitte)

| # | Abschnitt | Inhalt | Placeholder |
|---|-----------|--------|-------------|
| 01 | **Brand Vision & Strategy** | Mission, Philosophie, 60-30-10 | ✏️ [PROJECT NAME] |
| 02 | **Logo & Branding** | Logo specs, Clearspace, Varianten | ✏️ Logo Asset |
| 03 | **Foundations** | Grid, 4pt/8pt, Square/Circle Rule, Breakpoints | ✓ Komplett |
| 04 | **Design Tokens** | Spacing, Radius, Shadows, Transitions | ✓ Komplett |
| 05 | **Typography** | Font Families, Scale, Weights, Line Heights | ✓ Inter + Plus Jakarta |
| 06 | **Colors** | Palettes, Status Colors, Contrast | ✓ Komplett |
| 07 | **Components** | 15+ Komponenten (Buttons, Forms, Cards, etc.) | ✓ Komplett |
| 08 | **Loading States** | Skeleton, Shimmer, Spinners | ✓ Mit Animation |
| 09 | **Motion & Animation** | Timing, Duration, Easing | ✓ Komplett |
| 10 | **Icons** | Grid, Sizing, Stroke, Usage | ✏️ Icon Examples |
| 11 | **Accessibility** | WCAG AA, Contrast, Focus, Keyboard | ✓ Komplett |
| 12 | **Voice & Tone** | Brand Attributes, Microcopy, Tone | ✏️ Brand Voice |
| 13 | **Responsive Design** | Breakpoints, Mobile-First, Fluid Spacing | ✓ Komplett |
| 14 | **Design Decisions** | Rationale für Major Choices | ✏️ Add Your Decisions |

✓ = Komplett, bereit zum Einsatz
✏️ = Muss projektspezifisch angepasst werden

---

## 🎨 Design-Tokens (alle vorbeigefüllt)

### Spacing (4pt Base)
```css
--space-1: 4px      /* Micro-Details */
--space-2: 8px      /* Component Internal */
--space-4: 16px     /* Standard Padding */
--space-6: 24px     /* Section Spacing */
--space-8: 32px     /* Large Component */
--space-12: 48px    /* Page Section */
```

### Border Radius
```css
--radius-sm: 4px    /* Small components */
--radius-md: 8px    /* Standard */
--radius-lg: 12px   /* Large */
--radius-full: 100% /* Circles */
```

### Typography
```css
--font-primary: Inter          /* Body & UI */
--font-accent: Plus Jakarta    /* Headlines */

--text-display: 48px           /* H1 */
--text-heading: 36px           /* H2 */
--text-lg: 28px                /* H3 */
--text-base: 18px              /* Large Body */
```

### Colors (Vollständige Palette)
```css
Neutral:     #000 → #fff (10 Steps)
Primary:     Blue (50–900)
Status:      Success, Warning, Error, Info
Semantic:    bg-main, text-main, border, etc.
```

---

## 🎬 Shimmer Loading Animation

Eingebaut und bereit zum Einsatz:

```html
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-image"></div>
<div class="skeleton skeleton-avatar"></div>
```

**Animation:** Smooth gradient sweep von links nach rechts (1.5s)

---

## ✨ Responsive & Accessibility

### Breakpoints
- **Mobile:** 0–640px
- **Tablet:** 641–1024px
- **Desktop:** 1025–1440px
- **Wide:** 1441px+

### WCAG AA Compliance
- ✅ 4.5:1 Text Contrast
- ✅ Visible Focus States
- ✅ Semantic HTML
- ✅ Reduced Motion Support
- ✅ Keyboard Navigation

---

## 🔧 Wie man den Blueprint anpasst

### Schritt 1: Projekt-Info ersetzen
Suche nach `[PROJECT NAME]` und ersetze mit deinem Projekt.

### Schritt 2: Logo einbinden
```html
<img src="image/LOGO_C.svg" alt="Logo" class="bp-logo-icon">
```

### Schritt 3: Farben anpassen
Ändere diese Variablen in `blueprint-styles.css`:
```css
--clr-primary-500: #YOUR-BRAND-COLOR;
--clr-accent-500: #YOUR-ACCENT-COLOR;
```

### Schritt 4: Fonts anpassen (optional)
```css
--font-primary: 'Your Font', sans-serif;
--font-accent: 'Your Headline Font', sans-serif;
```

### Schritt 5: Spezifische Abschnitte füllen
- **Section 02 (Logo):** Ersetze Logo-Placeholders
- **Section 12 (Voice & Tone):** Deine Brand-Attribute
- **Section 14 (Decisions):** Deine Design-Entscheidungen

---

## 📊 Vergleich: Blueprint vs. Beispiele

| Feature | Blueprint | creativelab | Hannah | Genie |
|---------|-----------|-------------|--------|-------|
| **Komplettheit** | 100% (14/14) | 12/14 | 10/14 | 11/14 |
| **Shimmer Loading** | ✅ | ❌ | ❌ | ❌ |
| **Square/Circle Rule** | ✅ | ❌ | ❌ | ❌ |
| **4pt Grid Explained** | ✅ | ❌ | ❌ | ❌ |
| **Responsive Design** | ✅ | ❌ | ✅ | ✅ |
| **Dark Mode** | ✅ | ❌ | ❌ | ✅ |
| **15+ Components** | ✅ | 8 | 6 | 10 |

**Blueprint = Superset aller Konzepte**

---

## 🎯 Use Cases

### Use Case 1: Neues Projekt starten
1. `cp BLUEPRINT-design-system-template.html my-project-design-system.html`
2. Ersetze `[PROJECT NAME]`
3. Füge Logo, Farben, Voice ein
4. Veröffentliche als CD-Manual für dein Projekt

### Use Case 2: Fehlendes Konzept hinzufügen
Dein creativelab-Manual braucht Loading States?
→ Kopiere Section 08 aus Blueprint

### Use Case 3: Neue Agent-Entwickler
Zeige ihnen den Blueprint statt einzelner Beispiele
→ Sie sehen sofort, welche Abschnitte es gibt

### Use Case 4: Audit aller Beispiele
Checke, welche Sections jedes Projekt hat
→ Identifiziere Lücken
→ Nutze Blueprint als Vorlage zum Auffüllen

---

## 🚨 Wichtige Hinweise

### Vor der Veröffentlichung
- [ ] Logo & Branding-Assets ersetzen
- [ ] Farben an Brand anpassen
- [ ] Voice & Tone ausarbeiten
- [ ] Design Decisions dokumentieren
- [ ] Icon-Beispiele mit echten Icons ersetzen
- [ ] Links im Navigation überprüfen

### Technisch
- [ ] CSS-Fonts einbinden (Google Fonts)
- [ ] Logo-Pfade korrekt setzen
- [ ] Dark Mode bei Bedarf aktivieren
- [ ] Mobile-Ansicht testen
- [ ] Accessibility-Check durchführen

---

## 📚 Blueprint-Versionsgeschichte

| Version | Datum | Änderungen |
|---------|-------|-----------|
| **1.0** | Mai 2026 | Initial Blueprint mit 14 Abschnitten, Shimmer, Square/Circle, responsive |

---

## 🤔 FAQ

**F: Kann ich Abschnitte rauslöschen?**
A: Ja, aber nur wenn nicht nötig. Blueprint ist ein Superset – nicht alle Projekte brauchen alles.

**F: Soll jedes Projekt alle 14 Abschnitte haben?**
A: Ideal: Ja. Minimum: Die 10 wichtigsten (01-10). Weniger = Lücken im System.

**F: Kann ich CSS kopieren ohne HTML zu kopieren?**
A: Ja! `blueprint-styles.css` ist modular und kann in andere Projekte integriert werden.

**F: Wie halte ich Blueprint aktuell?**
A: Wenn ein neues Konzept bei einem Projekt genutzt wird (z.B. Animation Patterns), füge es ins Blueprint ein.

---

## 📞 Nächste Schritte

1. **Blueprint testen:** Öffne HTML im Browser
2. **Für Projekt kopieren:** Nutze als Basis für Genie/Hannah/creativelab
3. **Bestehende Projekte upgraden:** Füge fehlende Abschnitte hinzu
4. **In Push8-Guide integrieren:** Blueprint sollte in GUIDES/ oder Beispiele-Dokumentation

---

*Blueprint v1.0 – Master Template für alle Push8-Design-System-Dokumentationen*
*Stand: Mai 2026*
