# Analytics & Tracking (Google Analytics, Events, GDPR)

---

## Google Analytics Setup

### GA4 Script
```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Ersetze `G-XXXXXXXXXX` mit deiner GA4 Property ID**

### Im CD-Manual dokumentieren
```
- Kategorie: Analytics
- GA4 Property ID: G-XXXXXXXXXX
- Domain: example.com
- Users eingebunden?
- Events tracking aktiviert?
```

---

## Event Tracking

### Page Views (automatisch)
GA4 trackt automatisch alle Page Views

### Custom Events
```javascript
// Tracking Button Click
document.getElementById('cta-button').addEventListener('click', () => {
  gtag('event', 'click_cta', {
    'button_name': 'Schedule Demo'
  });
});

// Tracking Form Submit
document.getElementById('contact-form').addEventListener('submit', () => {
  gtag('event', 'contact_form_submit', {
    'form_name': 'Contact'
  });
});

// Tracking Video Play
videoElement.addEventListener('play', () => {
  gtag('event', 'video_play', {
    'video_title': 'Product Demo'
  });
});
```

### Wichtige Events tracken
- CTA Clicks (Calls-to-Action)
- Form Submissions
- Video Plays
- File Downloads
- External Links
- Scroll Depth (wie weit User scrollt)

---

## GDPR & Privacy Compliance

### Consent Banner (erforderlich in EU)
```html
<div id="consent-banner">
  <p>Wir nutzen Cookies für Analytics. <a href="/privacy">Datenschutz</a></p>
  <button id="consent-accept">Akzeptieren</button>
  <button id="consent-reject">Ablehnen</button>
</div>

<script>
document.getElementById('consent-accept').addEventListener('click', () => {
  localStorage.setItem('consent', 'accepted');
  // Google Analytics laden
  loadGoogleAnalytics();
});

document.getElementById('consent-reject').addEventListener('click', () => {
  localStorage.setItem('consent', 'rejected');
  // Google Analytics NICHT laden
});

// Beim Laden checken
if (localStorage.getItem('consent') === 'accepted') {
  loadGoogleAnalytics();
}
</script>
```

### Datenschutzerklärung
- Welche Daten tracken wir?
- Warum tracken wir?
- Wie lange speichern wir?
- Wie können User opt-out?
- Link zur Datenschutz-Seite in Footer!

### Google Analytics Datenschutz Einstellungen
```
Settings → Admin → Data Settings
✅ Enable data-driven attribution
✅ Create audiences based on analytics data
✅ Data retention: 14 months (default)
```

---

## User Privacy Settings

### Do-Not-Track Header
```javascript
if (navigator.doNotTrack === '1') {
  // User hat "Do Not Track" aktiviert
  // Analytics NICHT laden
} else {
  loadGoogleAnalytics();
}
```

### Opt-Out Link
```html
<a href="javascript:gtag('consent', 'update', {'analytics_storage': 'denied'});">
  Analytics Opt-Out
</a>
```

---

## Data Anonymization

### Anonymize IPs
```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'anonymize_ip': true  // Anonymisiert User-IPs
});
```

### Exclude Own Traffic
```
Settings → Admin → Data Filters
Create Filter:
- Filter Type: Exclude
- Include/Exclude: Exclude
- Filter Field: IP Address
- Filter Value: 192.168.1.1  // Deine IP
```

---

## Tracking Best Practices

**Checkliste:**
- [ ] GA4 installiert & funktioniert?
- [ ] Consent Banner vorhanden?
- [ ] Wichtige Events getrackt?
- [ ] Datenschutzerklärung aktuell?
- [ ] Do-Not-Track unterstützt?
- [ ] IPs anonymisiert?
- [ ] Eigener Traffic ausgeschlossen?
- [ ] GDPR kompatibel?

**Was NICHT tracken:**
- ❌ Passwörter
- ❌ Payment Info
- ❌ Personal Data (ohne Consent)
- ❌ Sensitive Health Info

---

## Analytics Reports

### Wichtige Metriken
1. **Users** – Wieviele Besucher?
2. **Sessions** – Wie viele Sitzungen?
3. **Bounce Rate** – Wieviele verlassen sofort?
4. **Pages/Session** – Durchschnitt Seiten pro Besuch
5. **Avg Duration** – Wie lange bleiben sie?
6. **Conversions** – Wie viele konvertieren? (CTA Click, Form Submit, etc.)

### Conversion Tracking
```javascript
gtag('event', 'purchase', {
  'value': 99.99,
  'currency': 'EUR',
  'transaction_id': '12345'
});
```

---

## Monitoring & Alerts

**Regelmäßig prüfen:**
- [ ] Ist GA4 noch aktiv?
- [ ] Tracken wir noch Daten?
- [ ] Keine unerwarteten Ausfälle?

**Alerts setzen:**
```
Analytics → Admin → Custom Alerts
Alert Name: Traffic Drop Alert
Condition: Sessions decrease by 50%
Notification: Email
```

---

*Analytics & Tracking – Push8 Web Agency – Stand Mai 2026*
