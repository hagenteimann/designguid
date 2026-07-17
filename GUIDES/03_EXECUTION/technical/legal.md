# Technical: Legal & Compliance (DSGVO)

This guide defines the requirements for standard legal pages, GDPR compliance, and cookie consent mechanisms.

> **Technical implementation** (valid opt-in consent, self-hosting, blocking-by-default, click-to-load embeds, privacy-first analytics, DPF transfers): → `dsgvo_best_practices.md`

---

## 1. Required Legal Pages
Every professional website requires at least two legal pages, accessible within a maximum of 2 clicks from any page:
- **Impressum (Legal Notice / Contact Information):** Required by German law (§5 TMG). Must contain company name, address, contact numbers, email, register numbers (HRB), VAT ID (USt-IdNr), and managing directors.
- **Datenschutzerklärung (Privacy Policy):** Required under GDPR (Art. 13/14). Must specify data controller contact details, processed data categories (e.g., server logs, contact forms), processing purposes, storage durations, and user rights (access, deletion, objection).

---

## 2. GDPR / DSGVO Compliance Rules
* **No external CDN requests without consent:** Loading resources (like Google Fonts or FontAwesome) via external CDNs exposes user IP addresses to third parties. These resources **must be self-hosted locally**.
* **Database & Hosting AVV:** If utilizing third-party hosting, database, or backend systems, an active Data Processing Agreement (AVV / DPA) is required.
* **Document all integrations:** Any external widget or service (e.g., YouTube embeds, Google Maps, tracking scripts) must be detailed in the Privacy Policy.

---

## 3. Cookie Consent Banner
* **Technical Cookies:** Strictly necessary cookies (e.g., CSRF protection, session identifiers) do not require consent.
* **Marketing & Analytics Cookies:** Any non-essential tracking or analytics cookies require active user consent **before** they are loaded.

### Implementation Template
```html
<div id="cookie-banner" role="dialog" aria-label="Cookie Settings" style="position:fixed; bottom:0; width:100%; z-index:9999; display:none;">
  <p>We use cookies. Essential cookies are active by default.</p>
  <button id="cookie-accept">Accept All</button>
  <button id="cookie-essential">Essential Only</button>
  <a href="/datenschutz">Learn More</a>
</div>

<script>
  const banner = document.getElementById('cookie-banner');
  if (!localStorage.getItem('cookie-consent')) {
    banner.style.display = 'block';
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

## 4. Legal Checklist
- [ ] Legal Notice (Impressum) page exists with complete contact details.
- [ ] Privacy Policy (Datenschutzerklärung) page covers all active services.
- [ ] Footer contains direct links to Legal Notice and Privacy Policy.
- [ ] No remote fonts or scripts loaded from external CDNs.
- [ ] Contact form submission maps to a privacy notice statement.
