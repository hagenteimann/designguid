# API Integration & External Services

---

## Übersicht

Wenn externe APIs/Services integriert werden (Payment, CRM, Analytics, etc.)

---

## Best Practices

### 1. API Keys Sicherheit
```javascript
// ❌ FALSCH
const API_KEY = "sk_live_xyz123";

// ✅ RICHTIG
const API_KEY = process.env.API_KEY;  // Aus .env
```

**Regeln:**
- API Keys NIEMALS im Code hardcoden
- `.env` Datei nutzen (nicht ins Git!)
- `.env.example` zeigt nötige Keys (ohne Werte)
- Production Keys ≠ Development Keys

### 2. Rate Limiting
```javascript
// Mit Verzögerung arbeiten
async function callAPI(endpoint, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${API_KEY}` }
      });
    } catch (error) {
      if (i < retries - 1) {
        await sleep(1000 * (i + 1)); // Exponential backoff
      }
    }
  }
}
```

### 3. Error Handling
```javascript
try {
  const response = await fetch(apiURL);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return await response.json();
} catch (error) {
  console.error("API Call failed:", error);
  // Fallback/Error UI zeigen
}
```

### 4. CORS (Cross-Origin)
```javascript
// Wenn externe API mit CORS Problem
fetch(externalAPI, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  mode: 'cors'  // Erlaubt Cross-Origin
})
```

---

## Payment Integration (Stripe, Paypal)

### Stripe Example
```html
<!-- Stripe Script laden -->
<script src="https://js.stripe.com/v3/"></script>

<script>
const stripe = Stripe(process.env.STRIPE_PUBLIC_KEY);
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

// Payment verarbeiten
async function processPayment() {
  const { paymentIntent } = await stripe.confirmCardPayment(
    clientSecret,
    { payment_method: { card: cardElement } }
  );
}
</script>
```

### Was dokumentieren:
- [ ] Welche Payment-Provider?
- [ ] Public vs. Secret Key getrennt?
- [ ] Error Handling?
- [ ] Test Mode vs. Live Mode?
- [ ] Webhooks konfiguriert?

---

## CRM Integration (Genie)

Siehe: `KONTAKTFORMULAR.md`

---

## Analytics Integration

Siehe: `ANALYTICS.md`

---

## Third-Party Scripts

**Wenn externe Scripts eingebunden werden:**

```html
<!-- ✅ Richtig: Asynchron laden, nicht blocking -->
<script async src="https://external.js"></script>

<!-- ❌ Falsch: Blocking, verlangsamt Seitenload -->
<script src="https://external.js"></script>
```

**Checkliste:**
- [ ] Script asynchron laden (async/defer)?
- [ ] Keine Sicherheitsrisiken (CSP kompatibel)?
- [ ] Performance Impact gemessen?
- [ ] Error Handling falls Script down?

---

## CORS & CSP Headers

### Content Security Policy (CSP)
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://js.stripe.com https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' https:;
  font-src 'self' https://fonts.googleapis.com;
">
```

**Externe APIs checken:**
- [ ] Domain im CSP whitelist?
- [ ] Subdomains erlaubt?
- [ ] Fallback falls API down?

---

## Webhook Handling

Wenn API Webhooks sendet (z.B. Payment Confirmation):

```javascript
// Express Example
app.post('/webhooks/stripe', (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Event verarbeiten
    if (event.type === 'payment_intent.succeeded') {
      handlePaymentSuccess(event.data.object);
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).send('Webhook error');
  }
});
```

---

## Integration Checklist

- [ ] API Key sicher in .env?
- [ ] Rate Limiting implementiert?
- [ ] Error Handling vorhanden?
- [ ] Timeout gesetzt (nicht unendlich warten)?
- [ ] CORS/CSP konfiguriert?
- [ ] Fallback falls API down?
- [ ] Webhooks getestet (falls relevant)?
- [ ] Dokumentiert im CD-Manual?
- [ ] Monitoring/Alerts eingebaut?

---

*API Integration – Push8 Web Agency – Stand Mai 2026*
