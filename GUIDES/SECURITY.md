# Security Best Practices – Stand Mai 2026

Diese Richtlinien beschreiben die aktuellen Sicherheitsstandards für die Entwicklung und den Betrieb von Webanwendungen im Jahr 2026.

## 1. Transport Layer Security (HTTPS & HSTS)
Verschlüsselung ist die absolute Basis für jede professionelle Website.
- **HSTS (HTTP Strict Transport Security):** Erzwingt HTTPS-Verbindungen und verhindert Downgrade-Attacken.
  - Implementiere den Header: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.
- **TLS 1.3:** Nutze ausschließlich moderne Verschlüsselungsprotokolle. Veraltete Versionen (TLS 1.0/1.1) müssen deaktiviert sein.

## 2. Content Security Policy (CSP)
Ein mächtiges Werkzeug gegen Cross-Site Scripting (XSS) und Clickjacking.
- **Strict CSP:** Verwende Nonces oder Hashes anstatt breiter Allow-Lists.
- **Directives:**
  - `default-src 'none'`: Alles verbieten, was nicht explizit erlaubt ist.
  - `frame-ancestors 'none'`: Verhindert, dass deine Seite in iFrames (Clickjacking) geladen wird.
  - `script-src 'self'`: Nur Skripte von der eigenen Domain erlauben (oder spezifische CDNs mit SRI).

## 3. Subresource Integrity (SRI)
Schutz vor Supply-Chain-Angriffen über Drittanbieter (CDNs).
- **Integritäts-Prüfung:** Jedes externe Skript (z.B. Tailwind, Google Fonts) muss einen kryptografischen Hash besitzen.
  - Beispiel: `<script src="..." integrity="sha384-..." crossorigin="anonymous"></script>`.
- **Lokales Hosting:** Hoste kritische Bibliotheken nach Möglichkeit selbst, um die Abhängigkeit von externen Infrastrukturen zu minimieren.

## 4. OWASP Top 10 – Fokus 2026
Die wichtigsten Bedrohungen laut aktuellem OWASP-Standard:
1. **Broken Access Control:** Stelle sicher, dass Benutzer nur auf Daten zugreifen können, für die sie eine Berechtigung haben.
2. **Software & Data Integrity Failures:** Schutz vor unautorisierten Code-Änderungen (Supply Chain Security).
3. **AI & Agentic Risks:** Bei der Integration von KI-Agenten müssen Eingaben (Prompt Injection) und Berechtigungen der KI (Tool Misuse) streng kontrolliert werden.

## 5. Sichere Formulare & Dateneingabe
- **Input Sanitization:** Vertraue niemals Benutzereingaben. Filtere HTML-Tags und verdächtige Zeichenketten serverseitig und clientseitig.
- **CSRF-Schutz:** Verwende Anti-CSRF-Tokens für alle zustandsverändernden Anfragen (POST/PUT/DELETE).
- **SameSite Cookies:** Setze Cookies auf `SameSite=Strict` oder `Lax`, um Cross-Site Request Forgery zu verhindern.

## 6. Security Hygiene
- **Minimalismus:** Entferne unnötigen Code, veraltete Plugins und Test-Dateien.
- **Header-Hardening:** Setze zusätzliche Security-Header:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---
*Erstellt am 05. Mai 2026 für A10 Media.*
