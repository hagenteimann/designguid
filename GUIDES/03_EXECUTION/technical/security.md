# Technical: Security Best Practices

This guide defines the critical security standards for web application development and hosting.

---

## 1. Transport Layer Security (HTTPS & HSTS)
* **Encryption:** Every connection must be encrypted via HTTPS using modern TLS 1.3 protocols. Disable TLS 1.0 and 1.1.
* **HSTS (HTTP Strict Transport Security):** Enforce HTTPS and prevent SSL-strip attacks by serving the HSTS header:
  ```
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  ```

---

## 2. Content Security Policy (CSP)
Protect against Cross-Site Scripting (XSS) and Clickjacking:
* **Default Deny:** Use `default-src 'none'` and explicitly whitelist safe resources.
* **Frame Ancestors:** Use `frame-ancestors 'none'` to block the site from being loaded inside iframes (replacing legacy `X-Frame-Options` headers).
* **Strict Script Source:** Restrict scripts to `'self'` or use cryptographic nonces/hashes for inline scripts.

---

## 3. Subresource Integrity (SRI)
* Avoid supply-chain vulnerabilities by verifying the integrity of third-party assets loaded via CDNs:
  ```html
  <script src="https://cdn.example.com/library.js" integrity="sha384-..." crossorigin="anonymous"></script>
  ```
* Prefer self-hosting key libraries to reduce dependencies.

---

## 4. Input & Form Security
* **Sanitization:** Treat all user inputs as untrusted. Strip HTML tags and dangerous characters on both client and server sides.
* **CSRF Protection:** Implement anti-CSRF tokens for all state-changing operations (POST, PUT, DELETE).
* **SameSite Cookies:** Always set session cookies with `SameSite=Strict` or `Lax` flags to prevent cross-site request forgery.

---

## 5. Security Headers hardening
Serve these hardening headers to modern browsers:
- `X-Content-Type-Options: nosniff` (Prevents MIME sniffing)
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` (Restricts browser APIs)
