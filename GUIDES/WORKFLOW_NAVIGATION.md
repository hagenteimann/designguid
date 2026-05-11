# Workflow: Sections & Navigation

**Konsolidiert aus: NAVIGATION.md**

---

## Übersicht

Jede **Section auf der Seite** wird:
1. Mit einer **ID getaggt** (`id="section-xyz"`)
2. Mit **Data-Attributen** ausgestattet (`data-nav-label`, `data-nav-order`)
3. **Automatisch** in die Navigation aufgenommen
4. Mobile-First Hamburger Menu

---

## Section-Tagging

### HTML
```html
<section
  id="section-features"
  data-nav-label="Features"
  data-nav-order="2"
  data-nav-visible="true"
>
  <h2>Unsere Features</h2>
  <!-- Content -->
</section>
```

**Attribute:**
- `id="section-[name]"` – Eindeutige ID (kebab-case)
- `data-nav-label` – Text in Navigation (z.B. "Features")
- `data-nav-order` – Reihenfolge (1, 2, 3...)
- `data-nav-visible` – In Navigation zeigen? (true/false)

**Ausnahme: Nicht in Navigation**
```html
<section id="section-footer-info" data-nav-visible="false">
  <!-- Versteckt -->
</section>
```

---

## Auto-Navigation generieren

```javascript
// Auto-generate from sections
const sections = document.querySelectorAll('[data-nav-visible="true"]');
const navLinks = Array.from(sections)
  .sort((a, b) =>
    parseInt(a.dataset.navOrder) - parseInt(b.dataset.navOrder)
  )
  .map(section => ({
    label: section.dataset.navLabel,
    href: `#${section.id}`,
    id: section.id
  }));

// Render
const nav = document.querySelector('nav');
nav.innerHTML = navLinks
  .map(link => `<a href="${link.href}">${link.label}</a>`)
  .join('');
```

---

## Mobile-First Navigation

### Desktop (Sticky Horizontal)
```css
nav {
  display: flex;
  gap: var(--space-400);
  position: sticky;
  top: 0;
  background: var(--color-neutral-100);
  z-index: 100;
}

nav a {
  padding: var(--space-200) var(--space-300);
  border-radius: var(--space-100);
}

nav a[data-active="true"] {
  color: var(--color-primary-300);
  background: var(--color-neutral-200);
}
```

### Mobile (Hamburger)
```css
@media (max-width: 768px) {
  nav {
    display: none;
    position: fixed;
    top: 0;
    bottom: 0;
    flex-direction: column;
    background: var(--color-neutral-100);
    z-index: 1000;
  }

  nav[data-open="true"] {
    display: flex;
  }

  .nav-toggle {
    display: block;
    width: 48px;
    height: 48px;
    z-index: 1001;
    background: var(--color-primary-300);
  }
}

@media (min-width: 769px) {
  .nav-toggle {
    display: none;
  }
}
```

### HTML
```html
<header>
  <button class="nav-toggle" aria-label="Navigation öffnen">☰</button>
  <nav aria-label="Hauptnavigation" data-open="false"></nav>
</header>

<script>
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');

  // Toggle open/close
  toggle.addEventListener('click', () => {
    const isOpen = nav.dataset.open === 'true';
    nav.dataset.open = !isOpen;
    toggle.setAttribute('aria-expanded', !isOpen);
  });

  // Close on link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.dataset.open = false;
    });
  });

  // Active state based on scroll
  window.addEventListener('scroll', () => {
    document.querySelectorAll('[data-nav-visible="true"]').forEach(section => {
      const rect = section.getBoundingClientRect();
      const link = nav.querySelector(`a[href="#${section.id}"]`);
      if (link && rect.top < 150 && rect.bottom > 150) {
        link.dataset.active = true;
      } else if (link) {
        link.dataset.active = false;
      }
    });
  });
</script>
```

---

## Agent-Workflow: Neue Section hinzufügen

**User:** "Neue Section 'Testimonials'"

**Agent fragt:**
```
1. ✅ ID? → section-testimonials
2. ✅ Label? → Testimonials
3. ✅ Position? → 5
4. ✅ In Navigation zeigen? → ja (default)
5. ✅ CD-Manual updaten?
```

**Agent macht:**
```
1. Schreibe Section mit korrekten Attributen
2. Regeneriere Navigation automatisch (JavaScript lädt)
3. Teste Hamburger Menu auf Mobile
4. Teste Scroll-basierte Active States
5. Updaten Sie CD-Manual
```

---

## Testing Checklist

- [ ] Alle Section-IDs eindeutig?
- [ ] Data-Nav-Attribute vorhanden?
- [ ] Navigation Desktop: Horizontal, sticky?
- [ ] Navigation Mobile: Hamburger sichtbar?
- [ ] Hamburger öffnet/schließt?
- [ ] Menu schließt nach Link-Klick?
- [ ] Alle Links klickbar (48x48px mindestens)?
- [ ] Active State funktioniert beim Scrollen?
- [ ] Smooth Scroll funktioniert?
- [ ] Keyboard Navigation (Tab-Order)?
- [ ] Aria-Labels vorhanden?

---

## Smooth Scroll

```css
html {
  scroll-behavior: smooth;
}
```

## Focus Management

```javascript
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.hash);
    if (target) {
      setTimeout(() => target.focus(), 100);
    }
  });
});
```

---

## Keyboard Navigation

```html
<nav aria-label="Hauptnavigation">
  <a href="#section-hero" tabindex="1">Home</a>
  <a href="#section-features" tabindex="2">Features</a>
  <a href="#section-pricing" tabindex="3">Pricing</a>
  <a href="#section-contact" tabindex="4">Kontakt</a>
</nav>
```

---

## Spezialfälle

### Mega-Menu (viele Sections)
```html
<nav>
  <a href="#section-hero">Home</a>
  <details>
    <summary>Services</summary>
    <a href="#section-design">Design</a>
    <a href="#section-dev">Development</a>
  </details>
</nav>
```

### Breadcrumbs (zusätzlich)
```html
<nav aria-label="Breadcrumb">
  <a href="/">Home</a> > <span>Features</span>
</nav>
```

---

## Integration mit CD-Manual

**CD-Manual Eintrag:**
```
- Kategorie: Navigation & Struktur
- Sections: hero, features, pricing, testimonials, contact
- Mobile Breakpoint: 768px
- Navigation Typ: Sticky Horizontal (Desktop) + Hamburger (Mobile)
- Active State: Scroll-basiert
- Smooth Scroll: Aktiviert
```

---

*Workflow: Navigation – Push8 Web Agency – Stand Mai 2026*
