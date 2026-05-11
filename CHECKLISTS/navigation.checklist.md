# ✅ Navigation Checklist (1 Seite)

**Neue Section hinzufügen**

---

## Agent fragt User

- [ ] ID? (z.B. `section-testimonials`)
- [ ] Nav-Label? (z.B. "Testimonials")
- [ ] Position? (z.B. 5)
- [ ] In Navigation zeigen? (default: ja)
- [ ] CD-Manual updaten?

---

## HTML Structure

```html
<section
  id="section-testimonials"
  data-nav-label="Testimonials"
  data-nav-order="5"
  data-nav-visible="true"
>
  <h2>Testimonials</h2>
  <!-- Content -->
</section>
```

- [ ] ID eindeutig? (keine Duplikate)
- [ ] data-nav-label gesetzt?
- [ ] data-nav-order gesetzt? (richtige Reihenfolge)
- [ ] data-nav-visible="true"?

---

## Navigation testen (Desktop + Mobile)

**Desktop:**
- [ ] Nav-Link erscheint in richtige Position?
- [ ] Hover-State funktioniert?
- [ ] Active State beim Scroll funktioniert?
- [ ] Sticky Position OK? (bleibt sichtbar beim Scroll)

**Mobile:**
- [ ] Hamburger-Button sichtbar (48x48px)?
- [ ] Menu öffnet/schließt?
- [ ] Alle Links in Menu?
- [ ] Menu schließt nach Link-Klick?
- [ ] Link ist klickbar (nicht überlappt)?

---

## Accessibility

- [ ] Aria-Labels vorhanden?
- [ ] Keyboard Navigation (Tab-Order)?
- [ ] Kontrast 4.5:1?
- [ ] Focus States sichtbar?

---

## CD-Manual

- [ ] Neue Section ins CD-Manual dokumentiert?
- [ ] Position/Reihenfolge aktuell?

---

**Detailinformationen:** [WORKFLOW_NAVIGATION.md](../GUIDES/WORKFLOW_NAVIGATION.md)
