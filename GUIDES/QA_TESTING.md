# Workflow: QA Testing & Performance vor Deploy

**Kritisch vor jedem Deploy!**

---

## Übersicht

Agent führt QA-Tests durch bevor Website deployed wird:
1. Browser-Kompatibilität
2. Mobile Testing
3. Lighthouse Check
4. Performance Metrics
5. Accessibility Audit

---

## 1. Browser-Kompatibilität

### Desktop Browser (Minimum Support)
- ✅ Chrome (aktuell + -1 Version)
- ✅ Firefox (aktuell + -1 Version)
- ✅ Safari (aktuell + -1 Version)
- ✅ Edge (aktuell + -1 Version)
- ❌ Internet Explorer (nicht unterstützt)

**Test auf:**
- Layout & Spacing OK?
- Fonts rendern korrekt?
- Farben OK?
- Animationen/Transitions funktionieren?
- Forms funktionieren?

**Tools:** Chrome DevTools, Firefox Developer Tools, Safari Web Inspector, BrowserStack

### Mobile Browser
- ✅ Chrome Mobile (Android)
- ✅ Safari Mobile (iOS)
- ✅ Samsung Internet
- ✅ Firefox Mobile

**Test auf:**
- Touch-Targets mind. 48x48px?
- Hamburger Menu funktioniert?
- Bilder responsive?
- Videos spielen ab?
- Forms am Mobile korrekt?

---

## 2. Mobile Device Testing

### Screen Sizes testen

```css
/* Breakpoints die getestet werden müssen */
320px   → iPhone SE, kleine Android
375px   → iPhone 12, Standard Android
430px   → Large Phone
768px   → iPad, Tablets
1024px  → iPad Pro
1200px  → Desktop
1920px  → Large Desktop
```

**Checkliste pro Breakpoint:**
- [ ] Layout funktioniert?
- [ ] Text lesbar?
- [ ] Bilder skaliert richtig?
- [ ] Navigation zugänglich?
- [ ] Keine Horizontal Scrollbar?
- [ ] Touch-Targets größer 48px?

**Tools:** Chrome DevTools Device Emulation, echtes Gerät wenn verfügbar

---

## 3. Lighthouse Audit

**Chrome DevTools → Lighthouse Tab**

```
Performance    ≥ 90
Accessibility  ≥ 90
Best Practices ≥ 90
SEO            ≥ 90
```

> FID wurde im März 2024 durch INP ersetzt. Lighthouse < v11 zeigt noch FID – immer aktuelle Version nutzen.

### Performance Metrics (Core Web Vitals)

| Metric | Target | Hinweis |
|--------|--------|---------|
| LCP (Largest Contentful Paint) | < 2.5s | Hero-Bild/Video optimieren |
| INP (Interaction to Next Paint) | < 200ms | FID-Nachfolger seit März 2024 |
| CLS (Cumulative Layout Shift) | < 0.1 | Bildgrößen immer definieren |

**Wenn nicht erfüllt:**
- Bilder optimieren? (GUIDES/WORKFLOW_ASSETS.md)
- CSS/JS minified?
- Lazy Loading aktiviert?
- Server Response Zeit OK?

### Accessibility Score

- [ ] Kontrast ≥ 4.5:1?
- [ ] Alt-Texte vorhanden?
- [ ] Focus Styles sichtbar?
- [ ] ARIA-Labels richtig?
- [ ] Heading-Hierarchie OK?
- [ ] Links aussagekräftig?

### Best Practices

- [ ] HTTPS aktiviert?
- [ ] No console errors?
- [ ] No mixed content (HTTP + HTTPS)?
- [ ] User-scalable nicht disabled?

### SEO Score

- [ ] Meta-Tags vorhanden?
- [ ] Viewport korrekt?
- [ ] Mobile-friendly?
- [ ] robots.txt vorhanden?
- [ ] sitemap.xml vorhanden?

---

## 4. Performance Checklist

**Vor Deploy prüfen:**

- [ ] LCP < 2.5s? (Lighthouse Check)
- [ ] INP < 200ms?
- [ ] CLS < 0.1?
- [ ] Bilder < Limits? (200KB Desktop, 100KB Mobile)
- [ ] Videos < Limits? (2MB Desktop, 1MB Mobile)
- [ ] CSS minified & bundled?
- [ ] JS minified & bundled?
- [ ] Lazy Loading für Bilder? (außer LCP)
- [ ] Fonts WOFF2 & gecacht?
- [ ] Caching Headers gesetzt? (Cache-Control, ETag)
- [ ] Gzip/Brotli Kompression aktiv?
- [ ] Keine große Requests? (alles unter 1MB)

**Tools:** Google PageSpeed Insights, Lighthouse (Chrome DevTools)

---

## 5. Accessibility (a11y) Full Audit

### WCAG 2.1 AA Compliance

**Checklist:**
- [ ] Kontrast 4.5:1 für Text? (1.4.3)
- [ ] Focus-Indicator sichtbar? (2.4.7)
- [ ] Keyboard Navigation vollständig? (2.1.1)
- [ ] Alt-Texte beschreibend? (1.1.1)
- [ ] Heading-Hierarchie logisch? (1.3.1)
- [ ] Labels für Form-Felder? (3.3.2)
- [ ] Error Messages klar? (3.3.1)
- [ ] Keine nur-Farbe Info? (1.4.1)
- [ ] Animationen nicht blinkend > 3Hz? (2.3.3)
- [ ] Sprache gesetzt? (3.1.1)
- [ ] Links unterscheidbar? (1.4.1)
- [ ] ARIA richtig verwendet?

**Tools:** axe DevTools, WAVE, Lighthouse Accessibility Score

**Fehler blockieren den Deploy.** Fix vor Deploy, dann Re-test.

---

## 6. Content & Funktionalität Check

- [ ] Alle Texte korrekt? (Typos, Grammatik)
- [ ] Links funktionieren? (keine 404er)
- [ ] Formulare absendbar?
- [ ] Emails kommen an? (bei Kontaktform)
- [ ] CTAs funktionieren?
- [ ] Video/Audio spielen?
- [ ] Keine Placeholder-Texte?
- [ ] Bilder laden?
- [ ] Responsive funktioniert?

---

## Agent-Workflow vor Deploy

```
User: "Deploy zu example.com"

Agent:
1. 🔍 QA Testing starten
2. ✅ Browser Compat: Chrome, Firefox, Safari, Edge
3. ✅ Mobile Testing: 375px, 768px, 1200px Breakpoints
4. ✅ Lighthouse Run:
   - Performance ≥ 90
   - Accessibility ≥ 90
   - SEO ≥ 90
5. ✅ Core Web Vitals:
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1
6. ✅ a11y Audit: WCAG AA
7. 🚀 Wenn alle OK → Deploy starten
8. ❌ Wenn Problem → Fehler dokumentieren, fixen, re-test
```

---

## Post-Deploy Testing

Nach Deploy zu Webspace:
- [ ] Website erreichbar?
- [ ] Kein SSL-Fehler?
- [ ] Lighthouse Score OK? (re-check auf Live)
- [ ] Mobile responsive noch OK?
- [ ] Formulare funktionieren?

---

## Testing-Tools Übersicht

| Tool | Funktion |
|------|----------|
| Chrome DevTools | Browser-Testing, Lighthouse |
| BrowserStack | Cross-Browser Testing (Cloud) |
| axe DevTools | Accessibility Audit |
| PageSpeed Insights | Performance + SEO |
| WebPageTest | Performance Details |
| WAVE | a11y Checker |
| Responsive Design Checker | Mobile Testing |

---

*QA Testing & Performance – Push8 Web Agency – Stand Mai 2026*
