# Monitoring & Uptime Checking

---

## Health Check nach Deploy

**Unmittelbar nach Deploy:**

```bash
# Test 1: Ist Website erreichbar?
curl -I https://example.com
# Erwartet: HTTP 200

# Test 2: SSL Certificate gültig?
curl -v https://example.com
# Erwartet: SSL/TLS erfolgreich

# Test 3: Wichtige Seiten OK?
curl https://example.com/about
curl https://example.com/contact
# Erwartet: HTTP 200, Content geladen
```

**Checkliste:**
- [ ] Domain erreichbar (HTTP 200)?
- [ ] SSL funktioniert (HTTPS)?
- [ ] Wichtige Seiten laden?
- [ ] Keine Redirects zu falschen URLs?
- [ ] Performance OK (< 3s)?

---

## Uptime Monitoring Tools

### Kostenlos
- **Pingdom** (5 checks/monat kostenlos)
- **UptimeRobot** (50 monitors kostenlos)
- **Statuspages** (Statuspage.io)

### Kostenpflichtig
- Datadog (Comprehensive Monitoring)
- New Relic
- Sentry (JS Error Tracking)

### Setup (UptimeRobot Beispiel)
```
1. UptimeRobot → Create Monitor
2. Type: HTTP(S)
3. URL: https://example.com
4. Interval: 5 minutes
5. Notifications: Email bei Downtime
```

---

## Error Monitoring (Sentry)

```javascript
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://examplePublicKey@sentry.io/12345",
  environment: "production",
  tracesSampleRate: 0.1  // Nur 10% samplen (für Performance)
});

// Errors werden automatisch captured
// Manuell:
Sentry.captureException(error);
Sentry.captureMessage("Something interesting happened");
```

**Sentry Dashboard:**
- Alle JS-Fehler anzeigen
- Error-Trends
- Affected Users
- Stack Traces

---

## Performance Monitoring

### Lighthouse Continuous Monitoring
```javascript
// Nach Deploy Lighthouse Score prüfen
// Manual: PageSpeed Insights
// Automated: Lighthouse CI (GitHub Actions)
```

### Real User Monitoring (RUM)
```javascript
// Track Core Web Vitals
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

getCLS(console.log);  // Cumulative Layout Shift
getFID(console.log);  // First Input Delay
getFCP(console.log);  // First Contentful Paint
getLCP(console.log);  // Largest Contentful Paint
getTTFB(console.log); // Time to First Byte

// Zu Google Analytics senden
getCLS(metric => gtag('event', 'page_view', {
  'cls': metric.value
}));
```

---

## Server Monitoring

### If VPS/Dedicated Server

**Check:**
- CPU Usage < 80%
- Memory Usage < 80%
- Disk Usage < 80%
- No errors in server logs

**Tools:**
- htop (CPU/Memory)
- df -h (Disk Space)
- tail -f /var/log/apache2/error.log (Logs)

---

## Database Monitoring

If using database:

**Check:**
- [ ] Database accessible?
- [ ] Queries < 1s?
- [ ] No connection limits reached?
- [ ] Backups running?

**Tools:**
- phpMyAdmin (MySQL)
- pgAdmin (PostgreSQL)
- MongoDB Atlas (MongoDB)

---

## Monitoring Dashboard

**Tool: Grafana (kostenlos selbst-gehostet)**

```
Metrics zu tracken:
1. Website Uptime (%)
2. Response Time (ms)
3. Error Rate (%)
4. Traffic (Requests/min)
5. Core Web Vitals (LCP, FID, CLS)
```

---

## Alert Configuration

**E-Mail Alerts für:**
- Website down (HTTP 200 → nicht mehr erreichbar)
- High error rate (> 10% errors)
- Performance degradation (Response > 3s)
- SSL certificate expiring (< 30 days)

---

## Monthly Review Checklist

Jeden Monat checken:
- [ ] Uptime Report anschauen (Sollte > 99.5%)
- [ ] Top Errors in Sentry reviewen
- [ ] Performance Score (Lighthouse ≥ 90)
- [ ] Core Web Vitals OK?
- [ ] Traffic Trends normal?
- [ ] User complaints?

---

## Post-Incident Documentation

Nach jedem Downtime/Error:
- [ ] Root cause analyzed?
- [ ] Fix implemented?
- [ ] Monitoring alert improved?
- [ ] Preventive measures?
- [ ] Incident documented?

---

*Monitoring & Uptime – Push8 Web Agency – Stand Mai 2026*
