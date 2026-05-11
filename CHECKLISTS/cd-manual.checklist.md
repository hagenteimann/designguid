# ✅ CD-Manual Checklist (1 Seite)

**Design-Entscheidungen dokumentieren**

---

## Bei jeder Design-Entscheidung

**Agent fragt:**
- [ ] Ist das bereits im CD-Manual dokumentiert?
- [ ] Soll ich das jetzt dokumentieren/ändern?
- [ ] User bestätigt ja/nein/später

---

## Entscheidung dokumentieren

```html
<section class="decision">
  <h3>Entscheidung: [Name]</h3>
  <p><strong>Kategorie:</strong> [Farbe|Typografie|Spacing|...]</p>
  <p><strong>Entscheidung:</strong> [Was wurde entschieden?]</p>
  <p><strong>Begründung:</strong> [Warum?]</p>
  <p><strong>Datum:</strong> [YYYY-MM-DD]</p>
  <p><strong>Anwendung:</strong> [Wo wird das verwendet?]</p>
</section>
```

- [ ] Kategorie richtig gewählt?
- [ ] Entscheidung klar formuliert?
- [ ] Begründung verständlich?
- [ ] Datum aktuell?
- [ ] Anwendungsbeispiele?

---

## Kategorien

- [ ] Farbpalette
- [ ] Typografie
- [ ] Spacing
- [ ] Komponenten
- [ ] Icons
- [ ] Responsive
- [ ] Accessibility
- [ ] UX-Patterns

---

## Verwandte Entscheidungen

```html
<details>
  <summary>Verwandte Entscheidungen</summary>
  <ul>
    <li><a href="#decision-xy">Entscheidung XY</a></li>
  </ul>
</details>
```

- [ ] Ähnliche Entscheidungen verlinkt?

---

## Nach Dokumentation

- [ ] CD-Manual regeneriert?
- [ ] HTML ist valide?
- [ ] Neue Version gespeichert? (versions/ Ordner)
- [ ] User benachrichtigt: ✅ CD-Manual aktualisiert?

---

## Versionierung

```
cd-manual/
├── index.html (aktuelle Version)
└── versions/
    ├── v1-2026-05-01.html
    ├── v2-2026-05-05.html
```

- [ ] Alte Versionen erhalten?
- [ ] Datum im Dateinamen?

---

**Detailinformationen:** [WORKFLOW_CD_MANUAL.md](../GUIDES/WORKFLOW_CD_MANUAL.md)
