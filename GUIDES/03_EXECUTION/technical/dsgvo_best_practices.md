# Technical: GDPR / DSGVO Best Practices (Implementation)

Complements `legal.md` (required legal pages) with the **technical implementation**: how to *build* a privacy-compliant site. Stand 2026. **Not legal advice** — consult a lawyer for commercial projects.

> **The 10 hard rules**
> 1. Privacy by Design & Default (Art. 25) — privacy is the preset, not an opt-in.
> 2. Data minimization — collect only what you truly need.
> 3. Self-host everything (fonts, icons, scripts) — no third-party request before consent.
> 4. Consent is opt-in: freely given, granular, revocable, documented — "Reject" as easy as "Accept".
> 5. TDDDG §25: consent for *any* access to the device (cookies *and* localStorage) unless strictly necessary.
> 6. Load third-party scripts/embeds only *after* consent (blocking by default).
> 7. TLS/HTTPS everywhere (Art. 32); anonymize IPs in logs, short retention.
> 8. DPA (AVV) with every processor; US transfers only via DPF certification or SCCs.
> 9. Make data-subject rights actionable (access, erasure, portability).
> 10. Data breach → notify within 72h (Art. 33).

---

## 1. Privacy by Design & Default (Art. 25)
- Privacy is the **default state**, not something the user must enable.
- Before any feature ask: *do I really need this data?* If no → don't collect it.
- No tracking, no third-party, no non-essential cookie without active consent.

## 2. Data Minimization (Art. 5)
- Contact form: name, email, message only. No mandatory phone "just in case".
- No hidden fields collecting more than needed.
- Server logs: only what's needed for operation/security, with a short deletion window.

## 3. Self-host everything (no third-party without consent)
The most common GDPR breach on websites: external requests that silently send the user's IP to third-party (often US) servers.

| Resource | Correct |
|---|---|
| Fonts | **Self-hosted WOFF2** (`@font-face`), never a font CDN — enforced by `check.sh` |
| Icons | **Inline SVG**, never an icon CDN/icon-font — enforced by `check.sh` |
| CSS/JS libraries | **bundled locally**, never jsDelivr/unpkg/cdnjs in `<head>` |
| Analytics | cookieless & EU-hosted (see §7) |

## 4. Getting consent right
Valid consent under GDPR/TDDDG is **freely given, specific, informed, unambiguous** and must be:
- **Opt-in** — nothing pre-ticked, no "continued use = consent".
- **Equally rejectable** — "Essential only" as prominent as "Accept all" (no dark patterns, no greyed-out reject button).
- **Granular** — separable by purpose (analytics / marketing / embeds).
- **Revocable anytime** — a persistent "Cookie settings" link in the footer.
- **Documented** — store timestamp + scope of the consent as proof.

> Note: the basic banner in `legal.md` must be extended to satisfy these — equal-weight buttons, granular toggles, and a revoke link.

## 5. Load third-party only after consent (blocking by default)
Scripts that send data to third parties must not execute before consent. Pattern: neutralize the script, activate on consent.

```html
<!-- NOT executed until consent is granted -->
<script type="text/plain" data-consent="analytics" src="/js/analytics.js"></script>
```

```js
function activateConsented(category) {
  document.querySelectorAll(`script[type="text/plain"][data-consent="${category}"]`)
    .forEach(old => {
      const s = document.createElement('script');
      if (old.src) s.src = old.src; else s.textContent = old.textContent;
      document.head.appendChild(s);
    });
}
```

## 6. Embeds: click-to-load
YouTube, Google Maps, Instagram etc. track on load. Use a placeholder; load the real embed on click (after consent).
- YouTube: use `youtube-nocookie.com` — **and still** consent-gate it.
- Maps: static placeholder + "Load map" button; or OpenStreetMap (self-hosted tiles, no tracking).

## 7. Analytics — privacy-first

| Option | GDPR status |
|---|---|
| **Plausible / Fathom** (EU-hosted, cookieless) | ✅ often without consent |
| **Matomo self-hosted** (IP anonymization, cookieless mode) | ✅ often without consent |
| **GA4** | ⚠️ only after consent + Consent Mode v2; US transfer via DPF |
| Server-log analysis | ✅ if IP anonymized |

- Always anonymize IP (truncate last octet/segment).
- Respect **Do Not Track / Global Privacy Control (GPC)**.

## 8. Hosting, processing & transfers
- Prefer **EU/EEA hosting**.
- **DPA / AVV (Art. 28)** with *every* processor: hosting, CRM, mail, CDN, form backend.
- **US services** only if the provider is **EU-US Data Privacy Framework (DPF)**-certified, or with Standard Contractual Clauses (SCCs) + a Transfer Impact Assessment.
- Maintain a record of processing activities (Art. 30).

## 9. Security & data-subject rights
- **Force TLS/HTTPS** (HSTS), modern security headers (→ `security.md`, CSP).
- Operationalize **data-subject rights**: access (Art. 15), erasure (Art. 17), portability (Art. 20), objection (Art. 21) — a clear contact path + internal process.
- **Data breach**: notify the supervisory authority within **72h** (Art. 33); affected users on high risk.

---

## GDPR Go-Live Checklist (technical)
- [ ] No external requests in the network tab before consent (fonts/icons/scripts self-hosted)
- [ ] Consent banner: opt-in, granular, "Reject" equal-weight, revoke link in footer
- [ ] Third-party scripts `type="text/plain"` + consent activation (blocking by default)
- [ ] Embeds as click-to-load (YouTube-nocookie, Maps placeholder)
- [ ] Analytics cookieless/EU **or** consent-gated; IP anonymized; GPC/DNT respected
- [ ] Contact form: TLS, purpose-bound consent checkbox, honeypot, deletion window
- [ ] TLS/HSTS active, security headers set
- [ ] All services named in the Privacy Policy (→ `legal.md`)
- [ ] DPA with all processors; US transfers via DPF/SCC clarified
- [ ] `./check.sh` GDPR checks green

> Related: `legal.md` (required pages) · `security.md` (CSP/headers) · `forms.md`.

---

*GDPR Best Practices – Stand 2026. Not legal advice; consult a lawyer for commercial projects.*
