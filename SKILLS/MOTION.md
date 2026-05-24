# design-motion-principles – Kurzreferenz

Skill von kylezantos/kz-motion. Emil Kowalski / Jhey Tompkins Stil.

**Installation:**
```bash
git clone https://github.com/kylezantos/kz-motion /tmp/kz-motion
cp -r /tmp/kz-motion/skills/design-motion-principles ~/.agents/skills/
```

---

## Modi

### Create-Mode
Neue Animationen implementieren. Trigger:
```
Verwende design-motion-principles im Create-Mode
Baue eine Animation für [Element]
```

### Audit-Mode
Bestehende Animationen prüfen. Gibt HTML-Report aus. Trigger:
```
Verwende design-motion-principles im Audit-Mode
Prüfe alle Animationen auf dieser Seite
```

---

## Kern-Prinzipien

### Physikalische Korrektheit
- Bewegungen folgen Naturgesetzen (Trägheit, Reibung, Schwere)
- Easing: `cubic-bezier` statt `ease-in-out`
- Overshoot und Settle für lebendige Effekte

### Subtilität
- Dauer: 150–400ms für UI-Feedback
- Dauer: 400–800ms für Seitenübergänge
- Nie länger als nötig

### Zweck vor Dekoration
- Jede Animation kommuniziert etwas (Zustand, Hierarchie, Kausalität)
- Keine Animation nur um der Animation willen

### prefers-reduced-motion
```css
@media (prefers-reduced-motion: reduce) {
  /* Alle Animationen deaktivieren oder vereinfachen */
}
```

---

## Empfohlene Easing-Werte

```css
/* Einsteigen – schnell starten, langsam enden */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);

/* Aussteigen – langsam starten, schnell enden */
--ease-in: cubic-bezier(0.7, 0, 0.84, 0);

/* Beide Richtungen */
--ease-in-out: cubic-bezier(0.87, 0, 0.13, 1);

/* Overshoot / Spring */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## Typische Anwendungsfälle

| Element | Dauer | Easing |
|---|---|---|
| Button Hover | 120ms | ease-out |
| Modal öffnen | 300ms | ease-spring |
| Modal schließen | 200ms | ease-in |
| Tooltip | 150ms | ease-out |
| Seitenübergang | 500ms | ease-in-out |
| Skeleton → Content | 400ms | ease-out |
| Scroll-Animation | 600ms | ease-out |

---

## Anti-Patterns (niemals)

- `transition: all` – immer spezifische Properties
- `animation-duration: 1s` für UI-Feedback – viel zu lang
- Lineare Bewegung (`linear`) für Objekte – nur für Rotation/Progress
- Bounce-Effekte auf Navigations-Links
- Animationen ohne `prefers-reduced-motion` Fallback
