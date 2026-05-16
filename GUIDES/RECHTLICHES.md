# Rechtliches – AGB, Impressum, Datenschutz

Jede Push8-Website bekommt drei Pflicht-Seiten. Kein Deploy ohne alle drei.

---

## Pflicht-Seiten Übersicht

| Seite | Pflicht? | Gesetzliche Grundlage |
|---|---|---|
| Impressum | **Ja** – immer | §5 TMG (Deutschland) |
| Datenschutzerklärung | **Ja** – immer | DSGVO Art. 13/14 |
| AGB | Nein – nur bei Vertragsabschluss | BGB |
| Cookie-Hinweis | **Ja** – bei Tracking/Cookies | DSGVO + ePrivacy |

---

## 1. Impressum (§5 TMG)

**Pflichtangaben für Unternehmen:**

```
Name / Firma
Straße, Hausnummer
PLZ, Ort
Land

Telefon: +49 ...
E-Mail: ...@...

Handelsregister: HRB ... (Amtsgericht ...)
USt-IdNr.: DE...
Geschäftsführer: Vorname Nachname
```

**Pflichtangaben für Einzelpersonen / Freiberufler:**
```
Vor- und Nachname
Straße, Hausnummer
PLZ, Ort

Telefon: +49 ...
E-Mail: ...@...

(Berufsbezeichnung + zuständige Kammer, falls vorhanden)
```

### Platzierung

```html
<!-- Footer – immer sichtbar, immer erreichbar -->
<footer>
  <nav aria-label="Rechtliches">
    <a href="/impressum">Impressum</a>
    <a href="/datenschutz">Datenschutz</a>
    <a href="/agb">AGB</a>       <!-- nur wenn vorhanden -->
  </nav>
</footer>
```

**Regeln:**
- Impressum muss mit maximal 2 Klicks von jeder Seite erreichbar sein.
- Kein Impressum hinter Login oder Modal verstecken.
- Link-Text muss „Impressum" heißen – keine kreativen Alternativen.

---

## 2. Datenschutzerklärung (DSGVO)

**Pflicht-Abschnitte:**

```markdown
1. Verantwortlicher (Name, Adresse, Kontakt)
2. Welche Daten werden erhoben?
   - Kontaktformular: Name, E-Mail, Nachricht
   - Server-Logs: IP-Adresse (automatisch)
   - Cookies (falls vorhanden)
3. Zweck der Verarbeitung
4. Rechtsgrundlage (Art. 6 DSGVO)
5. Speicherdauer
6. Weitergabe an Dritte (Hosting-Anbieter, CRM etc.)
7. Rechte der Nutzer:
   - Auskunft (Art. 15)
   - Berichtigung (Art. 16)
   - Löschung (Art. 17)
   - Widerspruch (Art. 21)
8. Beschwerderecht bei Aufsichtsbehörde
9. Kontakt Datenschutzbeauftragter (falls Pflicht)
```

**Jede externe Ressource muss erwähnt werden:**

| Ressource | Eintrag nötig |
|---|---|
| Google Fonts (lokal) | Nein – kein externer Request |
| Google Fonts (CDN) | Ja – IP geht an Google |
| Supabase (eigene Instanz) | Ja – Auftragsverarbeitung |
| jsDelivr CDN | Ja – IP geht an US-Server |
| YouTube-Embed | Ja – Tracking durch Google |
| Google Maps | Ja – Tracking durch Google |

### Generatoren (als Ausgangspunkt, danach anwältig prüfen)

- **Datenschutz-Generator.de** – kostenlos, DSGVO-konform
- **e-recht24.de** – kostenlos Basis, kostenpflichtig Premium
- **Jura-Generator** – kostenlos

> ⚠️ Generierte Texte sind Ausgangspunkte, keine Rechtsberatung. Für kommerzielle Projekte Anwalt einschalten.

---

## 3. AGB (nur bei Vertragsabschluss)

AGB sind Pflicht wenn auf der Website:
- Produkte verkauft werden
- Dienstleistungen gebucht werden
- Abonnements abgeschlossen werden

**Nicht nötig** bei reinen Informations- oder Portfolio-Websites.

**Pflicht-Klauseln bei Online-Shop / Buchung:**

```markdown
1. Vertragspartner
2. Vertragsschluss (wie kommt der Vertrag zustande?)
3. Preise und Zahlung
4. Lieferung / Leistungserbringung
5. Widerrufsrecht (14 Tage, Muster-Widerrufsformular)
6. Gewährleistung
7. Haftungsbeschränkung
8. Streitbeilegung (OS-Plattform EU-Link Pflicht)
9. Anwendbares Recht
```

---

## 4. Cookie-Hinweis

**Wann nötig:**
- Bei jedem Cookie das nicht technisch notwendig ist (Analytics, Marketing, Embeds)
- Technisch notwendige Cookies (Session, CSRF) brauchen keinen Consent

**Technische Umsetzung:**

```html
<div id="cookie-banner" role="dialog" aria-label="Cookie-Einstellungen"
     style="position:fixed; bottom:0; width:100%; z-index:9999;">
  <p>Diese Website verwendet Cookies. Technisch notwendige Cookies sind immer aktiv.</p>
  <button id="cookie-accept">Alle akzeptieren</button>
  <button id="cookie-essential">Nur notwendige</button>
  <a href="/datenschutz">Mehr erfahren</a>
</div>

<script>
  const banner = document.getElementById('cookie-banner');
  if (localStorage.getItem('cookie-consent')) {
    banner.style.display = 'none';
  }
  document.getElementById('cookie-accept').addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'all');
    banner.style.display = 'none';
  });
  document.getElementById('cookie-essential').addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'essential');
    banner.style.display = 'none';
  });
</script>
```

---

## Agent-Workflow: Rechtliches anlegen

```
1. Impressum-Seite erstellen:
   - /impressum.html mit Pflichtangaben
   - Footer-Link hinzufügen

2. Datenschutz-Seite erstellen:
   - /datenschutz.html
   - Alle eingebundenen Dienste dokumentieren
   - Footer-Link hinzufügen

3. AGB prüfen:
   - Gibt es Vertragsabschlüsse auf der Seite? → /agb.html
   - Nur Infoseite? → nicht nötig

4. Cookie-Banner:
   - Gibt es nicht-notwendige Cookies oder Embeds? → Banner einbauen
   - Reine HTML-Seite ohne Tracking? → nicht nötig

5. Go-Live-Check:
   - [ ] Impressum von jeder Seite erreichbar (max. 2 Klicks)
   - [ ] Datenschutz vollständig (alle Dienste erwähnt)
   - [ ] Footer-Links vorhanden: Impressum | Datenschutz
   - [ ] AGB wenn nötig
   - [ ] Cookie-Banner wenn nötig
```

---

## Go-Live-Checkliste Rechtliches

- [ ] `/impressum.html` existiert mit allen Pflichtangaben
- [ ] `/datenschutz.html` existiert und nennt alle externen Dienste
- [ ] Footer enthält Links zu Impressum + Datenschutz
- [ ] AGB vorhanden (wenn Vertragsabschluss auf Seite)
- [ ] Cookie-Banner wenn nicht-notwendige Cookies vorhanden
- [ ] Keine Google Fonts / externe Ressourcen ohne Datenschutz-Eintrag
- [ ] Kontaktformular-Daten in Datenschutz erwähnt (Supabase / Genie CRM)

---

*Push8 Web Agency – Rechtliches Guide – Stand Mai 2026*
*Kein Ersatz für Rechtsberatung. Für kommerzielle Projekte Anwalt konsultieren.*
