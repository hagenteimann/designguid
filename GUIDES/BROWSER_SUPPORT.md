# Browser Support & Compatibility

---

## Support Matrix

### Desktop Browser (Standard Support)
```
Chrome    ≥ 90 (current + -1)
Firefox   ≥ 88 (current + -1)
Safari    ≥ 14 (current + -1)
Edge      ≥ 90 (current + -1)
```

### Mobile Browser (Standard Support)
```
Chrome Mobile    ≥ 90
Safari iOS       ≥ 14
Samsung Internet ≥ 14
Firefox Mobile   ≥ 88
```

### Legacy Browser (Kein Support)
```
❌ Internet Explorer (alle Versionen)
❌ Opera < 75
❌ Safari < 12
❌ Chrome < 90
```

---

## Polyfills & Fallbacks

### Wenn alte Browser unterstützt werden müssen:

```html
<!-- CSS Fallbacks -->
<style>
  /* Fallback für Grid */
  .container { display: flex; }
  @supports (display: grid) {
    .container { display: grid; }
  }
</style>

<!-- JS Polyfills -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
```

### Zu vermeiden (nicht browserkompatibel)
- ❌ CSS Grid ohne Fallback (für alte Browser)
- ❌ Flexbox ohne Prefix
- ❌ ES6+ ohne Transpiler
- ❌ CSS Variables ohne Fallback

---

## Testing für Kompatibilität

**Tools:**
- BrowserStack (Cloud)
- Local: Chrome DevTools (Device Emulation)
- caniuse.com (Feature Check)

**Vor Deploy checken:**
- [ ] Chrome Desktop & Mobile OK?
- [ ] Firefox Desktop & Mobile OK?
- [ ] Safari Desktop & Mobile OK?
- [ ] Edge OK?
- [ ] Keine JS-Fehler in Console?
- [ ] Responsive auf allen Geräten?

---

## CSS Prefix Policy

**Moderne Browser brauchen kein Prefix mehr:**

```css
/* ❌ Nicht nötig (2026) */
-webkit-transform: rotate(45deg);
-moz-transform: rotate(45deg);
transform: rotate(45deg);

/* ✅ Ausreichend */
transform: rotate(45deg);
```

**Ausnahmen:**
- Older iOS Safari (≤ 12): `-webkit-` Prefix noch nötig
- Wenn Support für alte Browser: Prefix tools wie Autoprefixer nutzen

---

## Responsive Design für alle Browser

```css
/* Mobile-First (alle Browser) */
.container {
  display: grid;
  grid-template-columns: 1fr;
}

/* Desktop */
@media (min-width: 768px) {
  .container {
    grid-template-columns: 1fr 1fr;
  }
}
```

---

## Dokumentation

**Im CD-Manual dokumentieren:**
- Min. Browser Versions
- Polyfills/Fallbacks
- Feature-Kompatibilität

---

*Browser Support – Push8 Web Agency – Stand Mai 2026*
