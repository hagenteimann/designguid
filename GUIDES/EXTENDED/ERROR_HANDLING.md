# Error Handling & Recovery

---

## Fehlertypen

### Entwicklung (Dev)
- **Syntax Error** – Code-Fehler
- **Runtime Error** – Fehler während Ausführung
- **Logic Error** – Code läuft, macht aber was Falsches

**Lösung:** Logs checken, Debugger nutzen

### Production (Live)
- **HTTP Errors** – 404, 500, etc.
- **Network Errors** – Server down, Timeout
- **Client Errors** – JS-Fehler im Browser

**Lösung:** Error Monitoring, Fallback-Seiten

---

## Error Pages (HTML)

### 404 – Not Found
```html
<!DOCTYPE html>
<html>
<head>
  <title>404 – Seite nicht gefunden</title>
</head>
<body>
  <h1>404 – Diese Seite existiert nicht</h1>
  <p>Die gesuchte Seite wurde nicht gefunden.</p>
  <a href="/">← Zur Startseite</a>
</body>
</html>
```

### 500 – Server Error
```html
<!DOCTYPE html>
<html>
<head>
  <title>500 – Fehler</title>
</head>
<body>
  <h1>500 – Fehler auf dem Server</h1>
  <p>Es ist ein unerwarteter Fehler aufgetreten.</p>
  <a href="/">← Zur Startseite</a>
</body>
</html>
```

**Alle Error Pages müssen:**
- Hilfreiche Botschaft geben
- Link zur Startseite
- Nicht zu technisch sein

---

## JavaScript Error Handling

### Try-Catch
```javascript
try {
  riskyFunction();
} catch (error) {
  console.error("Error:", error);
  // Graceful Fallback
  showFallbackUI();
}
```

### Fetch Error Handling
```javascript
fetch('/api/data')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return response.json();
  })
  .catch(error => {
    console.error("Fetch failed:", error);
    showOfflineMessage();
  });
```

---

## Deployment Rollback

### Wenn Deploy fehlschlägt:

**Option 1: Git Revert**
```bash
git revert COMMIT_HASH
git push origin main
```

**Option 2: Zu älterem Tag zurück**
```bash
git checkout v1.1.0
git push -f origin main
```

**Option 3: Webspace Manual Rollback**
- Hosting Provider Backup nutzen
- Ältere Dateien zurück-uploaden

### Rollback Checklist
- [ ] Fehler identifiziert?
- [ ] Rollback-Methode gewählt?
- [ ] Rollback durchgeführt?
- [ ] Live-Site getestet?
- [ ] User informiert?
- [ ] Fehler dokumentiert?

---

## Monitoring & Alerting

**Error Monitoring Tools:**
- Sentry (JS/Python/Node)
- Bugsnag (Universal)
- LogRocket (Frontend)
- Google Analytics (Custom Events)

**Setup:**
```javascript
// Sentry Beispiel
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
  environment: "production"
});

// Fehler werden automatisch captured
```

---

## Error Logging Best Practices

```javascript
console.error("User action failed", {
  action: "form_submit",
  userId: user.id,
  error: error.message,
  timestamp: new Date().toISOString()
});
```

**Was loggen:**
- Fehlermeldung
- Stack Trace
- User ID / Session ID
- Timestamp
- Browser Info
- Error Context

**Was NICHT loggen:**
- Passwörter
- API Keys
- Payment Info
- Personal Data

---

## Error Recovery Strategies

### Network Error
```javascript
// Retry mit Exponential Backoff
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000);
    }
  }
}
```

### API Timeout
```javascript
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error("Timeout")), 5000)
);

Promise.race([fetch(url), timeoutPromise])
  .catch(() => showOfflineUI());
```

### Graceful Degradation
```javascript
// Wenn Feature nicht funktioniert, fallback anbieten
if (!navigator.geolocation) {
  showManualLocationInput();
} else {
  getLocation();
}
```

---

## Post-Error Checklist

Nach jedem Error:
- [ ] Fehler dokumentiert (in CD-Manual)?
- [ ] Ursache analysiert?
- [ ] Fix implementiert?
- [ ] Re-deployed & getestet?
- [ ] User informiert?
- [ ] Monitoring eingebaut?

---

*Error Handling & Recovery – Push8 Web Agency – Stand Mai 2026*
