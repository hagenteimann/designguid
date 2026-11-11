# Browser Infrastructure for Web-Based AI Font Generator

## Secure patterns for storing API keys in the browser (localStorage, sessionStorage, IndexedDB)

### Takeaway
Browser-side storage APIs (localStorage, sessionStorage, IndexedDB) offer no meaningful security against XSS, malicious extensions, or determined attackers. The only viable approach for user-supplied keys is explicit user acknowledgment of risk, rate limiting, spend caps, and clear revocation paths—not encryption in storage.

### Cited Findings
- **localStorage and sessionStorage are script-accessible.** Neither API creates an XSS boundary; values can be viewed, copied, and manipulated using browser DevTools by any script running in the page's origin, regardless of encryption — [SSO Jet / CIAM QnA](https://ssojet.com/ciam-qna/api-token-storage-localstorage-sessionstorage-httpOnly-cookies)
- **Persistence difference doesn't add security.** localStorage persists across browser sessions; sessionStorage lasts one page session. Shorter lifetime does not increase resistance to script access — [The New Stack](https://thenewstack.io/best-practices-for-storing-access-tokens-in-the-browser/)
- **Client-side encryption is ineffective.** Encrypting keys in storage doesn't help because the decryption key must also live in the browser, allowing an attacker to extract both — [DEV Community](https://dev.to/backmesh/openai-api-key-safety-and-mistakes-in-client-side-code-3k2f)
- **IndexedDB has no built-in encryption.** Data written to IndexedDB lands on disk without encryption; wrappers using Web Crypto API can add a layer, but the same key-in-browser problem applies — [RxDB Docs](https://rxdb.info/articles/indexeddb/indexeddb-encryption.html)
- **Browser-held keys assume public exposure.** When BYOK (bring-your-own-key) is unavoidable, documentation should warn users to treat the key as public, enforce rate limiting, set spend caps, and enable easy revocation — [Canva Developer Docs](https://www.canva.dev/docs/apps/authenticating-users/alternative-auth-experiences/); [DEV Community](https://dev.to/abhinavsingwal/when-an-api-key-lives-in-local-storage-a-subtle-but-risky-pattern-3fn7)
- **Threat surface is large.** Keys can leak through XSS vulnerabilities, malicious browser extensions, console logs, query parameters, and tools that capture HTTP headers — [API Dog](https://apidog.com/blog/api-key-exposed-in-browser/); [Stadia Maps](https://docs.stadiamaps.com/guides/securing-your-integration/)
- **Backend proxy is the standard pattern.** For trusted services, keep the key server-side and have the browser call a proxied endpoint (e.g., POST /generateFont) rather than calling the API directly — [OpenAI Community Forum](https://community.openai.com/t/feature-request-restricted-byok-api-keys-for-client-side-applications/1392506)

### Inferences
- For a public font generator tool where users bring their own API keys, the best practice is: (1) require explicit informed consent before allowing key entry, (2) store only for the current session (sessionStorage or in-memory preferred over localStorage), (3) communicate that the key is exposed to the browser environment, (4) provide a one-click revocation flow, and (5) document rate-limiting and spend-cap configuration on the provider's side.
- If the tool will call its own backend (user has a server), use a backend proxy that holds keys server-side; this eliminates the client-side exposure entirely.
- Encryption in browser storage is security theater and should not be relied on.

### Gaps
- No sources provided detailed guidance on whether IndexedDB encryption libraries (e.g., RxDB, Couchbase Lite) meaningfully reduce risk in the BYOK scenario, or if they are still vulnerable to in-memory key extraction.
- No sources documented specific browser extension sandboxing or isolation mechanisms that might limit an extension's access to page storage.

---

## API key revocation and rotation management for user-supplied keys

### Takeaway
Revocation is straightforward (immediate invalidation) but may lag 5 minutes due to issuer caching. Rotation is complex because both old and new keys must coexist during a transition window. For user-supplied keys in a public tool, focus on revocation ease, not rotation automation, since users control their own key lifecycle.

### Cited Findings
- **Revocation can have a grace period.** If a key continues to authenticate after revocation, the issuer's cache has not expired; this is expected behavior and typically resolves within 5 minutes — [Okta Documentation](https://help.okta.com/oie/en-us/Content/topics/privileged-access/pam-manage-api-keys.htm)
- **Rotation requires dual-key coexistence.** Both old and new keys must work simultaneously long enough for every caller to switch over; immediately revoking the old key triggers 401 errors for laggards — [RoxyAPI](https://roxyapi.com/blogs/api-key-security-revocation-rotation-scraping-defense)
- **Keys in client code are a continuous leak.** A real production incident involved a developer tools panel that pre-filled a live API key into a "Try it" interface, exposing the key to anyone with browser DevTools — [RoxyAPI](https://roxyapi.com/blogs/api-key-security-revocation-rotation-scraping-defense)
- **Audit all lifecycle events.** Standard practice is to log every issuance, rotation, and revocation so incidents can be traced — [Gravitee / API Key Provisioning](https://gravitee.io/corpus/gen-2308/api-key/api-key-provisioning-rotation-and-revocation-best-practices.html)
- **Consider scheduled rotation cadence.** Vendor guidance suggests 90 days for sensitive keys and 365 days for less sensitive ones, though these are starting points, not standards — [CIAM Compass](https://guptadeepak.com/ciam-compass/best-practices/api-key-rotation/)
- **Split publishable and secret keys.** Providers can issue restricted keys for browser use (scoped by origin, with lower quota) separate from powerful backend keys — [RoxyAPI](https://roxyapi.com/blogs/api-key-security-revocation-rotation-scraping-defense)

### Inferences
- For a BYOK font generator tool, implement one-click revocation UI that instructs the user to visit their provider's console and revoke the key there, then clear it from the browser. Do not attempt to revoke keys server-side.
- Provide UI warnings that key rotation (creating a new key and keeping both active) is the user's responsibility and should be done through their provider's console.
- Log all key usage events (timestamps, request counts) locally in browser storage or IndexedDB for the user's own audit trail, since you cannot audit their key on the server.

### Gaps
- No sources provided guidance on how to handle key revocation UI for a BYOK tool where the user may revoke the key on the provider's side but forget to clear it from the browser.
- No clear data on how quickly different font generation APIs propagate revocation across their infrastructure (minutes vs. seconds).

---

## GitHub Pages constraints for hosting a generative tool

### Takeaway
GitHub Pages is static-only hosting: no backend code, no database, and no server-side request handling. Bandwidth is soft-capped at ~100GB/month; builds timeout after 10 minutes. CORS headers are fixed and permissive by default (allow-origin: *), so you cannot restrict origins. These constraints force client-side logic and direct API calls from the browser.

### Cited Findings
- **Static files only, no backend code.** GitHub Pages cannot execute PHP, Ruby, Python, or database queries; it serves only static HTML, CSS, JavaScript, and files — [GitHub Documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- **Size cap and build timeout.** Published sites are limited to 1 GB of content; deployments timeout if they exceed 10 minutes — [GitHub Documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- **Soft bandwidth limit.** An estimate of ~100 GB per month is cited as a soft limit, though this comes from secondary sources rather than official GitHub documentation — [How-To Geek](https://www.howtogeek.com/heres-why-github-pages-is-the-best-option-for-most-free-websites/)
- **Commercial use prohibited.** GitHub Pages is not intended for running an online business, e-commerce site, or paid web-hosting service — [GitHub Documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- **CORS headers are fixed and permissive.** GitHub Pages sends a default Access-Control-Allow-Origin header (likely *) that cannot be customized via configuration; the browser still enforces CORS on the API side when you make third-party calls — [GitHub Community Discussions](https://github.colasdn.workers.dev/orgs/community/discussions/157852); [enable-cors.org example](https://raw.githack.com/fbrusch/actam_2024/gh-pages/corsissues.html)
- **Outbound API calls work freely.** The browser's CORS enforcement applies to third-party API responses, not to GitHub Pages hosting the caller. A Pages site can call any API that permits cross-origin requests — [Free Code Camp Forum](https://forum.freecodecamp.org/t/where-can-i-host-a-project-where-i-can-make-post-requests/501060)

### Inferences
- Host the font generator as a static site on GitHub Pages: HTML/CSS/JS, service workers, fonts, and assets.
- The tool must do all generative work client-side (JavaScript) or via direct API calls from the browser to the font generation service.
- If you need a backend (e.g., to hold API keys, proxy requests, or validate input), you cannot run it on GitHub Pages; use a separate platform (Vercel, Netlify, Railway, etc.) or a proxy service.
- CORS restrictions cannot be configured on GitHub Pages. Rely on the font API's CORS headers and ensure your code handles CORS errors gracefully.

### Gaps
- No sources provided data on actual bandwidth consumption for a real generative tool or guidance on whether 100 GB/month is sufficient for active use.
- No documentation on how GitHub Pages behaves if you exceed the 1 GB site size (does it block deployment or truncate?).
- Unclear if the 10-minute build timeout applies to Pages rebuilds when you push changes, or only to the initial deployment.

---

## Browser caching mechanisms for generated fonts (disk cache, service workers, precaching)

### Takeaway
Browsers have two caching layers: the standard HTTP disk cache (configured via Cache-Control headers) and the Service Worker Cache API (manual control, survives browser cache clears). For fonts, cache-first strategy is appropriate because fonts are stable, versioned assets. Precaching at service worker install time ensures offline availability.

### Cited Findings
- **Service Worker Cache API vs. HTTP cache.** The Cache API lets a service worker store responses independently of the browser's HTTP cache; precaching happens at install time, while HTTP caching happens on-demand. Both can coexist — [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- **Cache-first is appropriate for fonts.** Fonts are stable, versioned assets, so cache-first (serve from cache, fall back to network if missing) with a long TTL minimizes re-downloads and is a standard performance optimization — [Google Web Dev](https://web.dev/learn/pwa/caching)
- **Selective caching by content type.** Best practice is to check Content-Type headers and cache only font/* responses, skipping errors (4xx, 5xx status codes) to avoid caching failure responses — [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- **Google Fonts redirects complicate caching.** Requests to fonts.googleapis.com may redirect to a CDN endpoint; caching both the initial request and the redirect target is necessary — [DEV Community](https://dev.to/nektro/efficient-way-to-cache-google-fonts-with-service-worker--32i4)
- **Opaque responses consume quota.** Cross-origin font files (when fetched with no-cors mode) count as ~7 MB against storage quota regardless of actual size, so caching many external fonts can quickly deplete the origin's quota — [Offline-First PWAs article](https://www.magicbell.com/blog/offline-first-pwas-service-worker-caching-strategies)
- **Storage limits and eviction.** Each browser caps an origin's total Cache storage (varies by browser, often tens to hundreds of MB). The browser may evict cache to manage disk space; a single origin usually relies on previously populated Cache objects but cannot guarantee indefinite persistence — [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- **Precaching the app shell.** A PWA should precache the application shell (HTML, core CSS/JS), offline fallback, fonts, and critical assets at service worker install time — [web.dev PWA guide](https://web.dev/learn/pwa/caching)
- **Stale-while-revalidate for content.** For documents and dynamic content, stale-while-revalidate (serve cached copy immediately, update in background) or network-first with cache fallback is more appropriate than cache-first — [Pixelfree Studio](https://blog.pixelfreestudio.com/?p=4359)

### Inferences
- Implement a service worker that precaches the app shell and core fonts at install time.
- Use a cache-first strategy for fonts (both local WOFF2 files and generated output): check the cache first, serve if found, otherwise fetch and cache.
- Generated fonts (the output of the API call) should also use cache-first since they are immutable (same input → same output).
- Monitor storage quota to avoid hitting browser limits; consider cache versioning and cleanup strategies if many fonts accumulate.
- For cross-origin fonts, be aware of the opaque response penalty (7 MB quota per file); prefer self-hosted fonts where possible.

### Gaps
- No sources provided a formula for estimating total cache quota consumed by N fonts of typical size.
- No data on how long a service worker's Cache objects persist across browser updates or garbage collection.
- Unclear if browser cache eviction is FIFO, LRU, or random, and how this affects font generator tools that want reliable offline access.

---

## Security headers and CSP policies for a generative tool that fetches external resources

### Takeaway
Content Security Policy (CSP) should be restrictive by default: allow only same-origin scripts, styles, and fonts, plus the specific API domain for the font generation service. Use report-only mode initially to test without blocking. CSP alone doesn't protect the server; pair it with input sanitization and authentication/authorization controls.

### Cited Findings
- **CSP restricts resource loading.** Content-Security-Policy is an HTTP header telling the browser which sources (origins) it may load scripts, styles, images, fonts, and other resources from. Violations can be reported or blocked — [Securitool CSP Generator](https://securitool.js.org/tools/policy-generator.html)
- **Report-only mode for testing.** Start with Content-Security-Policy-Report-Only (same directives but no blocking) to see violations in Reporting API calls without breaking the site. After fixing, switch to enforcement — [CSP Generator Tools](https://appsecsanta.com/tools/csp-generator)
- **Directive types include content and reporting.** Policies specify directives like script-src, style-src, font-src, connect-src (for APIs), img-src, and default-src as a fallback. report-uri or report-to directives send violation data to a server — [Securitool](https://securitool.js.org/tools/policy-generator.html)
- **CSP is one part of security headers.** Headers beyond CSP include HSTS (enforce HTTPS), X-Frame-Options (prevent clickjacking), X-Content-Type-Options (prevent MIME sniffing), and Permissions-Policy (control feature access like camera, microphone) — [CSP Generator](https://inventivehq.com/tools/csp-generator)
- **CSP does not protect the server.** CSP prevents client-side attacks (XSS, injection) but does not protect the API server from receiving unauthorized requests. The server still needs authentication, authorization, input validation, and rate limiting — [NHI Management Group](https://nhimg.org/articles/cors-errors-expose-the-browser-security-boundary-developers-miss/)
- **Browser support varies for reporting.** The report-to directive (newer, JSON-based reporting) is not yet supported in Firefox and Safari; some tools recommend report-uri as a fallback or in addition — [CSP Generator plugins](https://inventivehq.com/tools/csp-generator)

### Inferences
- Set a restrictive CSP like:
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' https://api.fontgenerator.example.com; img-src 'self' data:; report-uri /csp-report
  ```
  Adjust `connect-src` to include the actual font API domain.
- Use `'unsafe-inline'` for styles only if necessary (inline critical CSS); avoid it for scripts.
- Deploy report-only initially to catch violations before breaking the site.
- Combine CSP with X-Frame-Options, X-Content-Type-Options, and HSTS headers for a complete header suite.
- Document that CSP is a client-side defense; protect the API endpoint with its own rate limiting, authentication, and validation.

### Gaps
- No sources provided example CSP policies specifically for generative tools or provided tooling that accepts an API domain and outputs a starter policy.
- No data on typical CSP violation rates in production sites or how to distinguish between legitimate violations and attack attempts.
- Unclear how to handle CSP for third-party analytics or telemetry scripts (common in design tools).

---

## CORS considerations for calling font generation APIs from the browser

### Takeaway
CORS is enforced by the browser, not the server. It controls whether the browser allows page scripts to read responses from cross-origin API calls. The browser checks origin, method, and response headers (Access-Control-Allow-Origin, Access-Control-Allow-Methods) before sending requests and again when processing responses. CORS does not protect the server—proper authentication and authorization are still required.

### Cited Findings
- **CORS is a browser enforcement mechanism.** CORS (Cross-Origin Resource Sharing) blocks client-side reads of cross-origin responses by default unless the server explicitly allows the origin in its CORS headers. This is the same-origin policy in action — [Gravitee CORS and Browser Security](https://gravitee.io/corpus/gen-780/http/cors-and-browser-security.html)
- **The browser checks origin and headers.** For cross-origin requests, the browser first checks if the origin is allowed via the Access-Control-Allow-Origin header; for "complex" requests (POST, custom headers), it sends an OPTIONS preflight to check allowed methods and headers — [Azion](https://www.azion.com/en/learning/websec/what-is-cors/)
- **Users and developers cannot bypass CORS.** CORS cannot be disabled by end users or developers; it is a browser security boundary. To work around it, configure the server to send appropriate CORS headers or use a backend proxy — [Aembit](https://aembit.io/glossary/cors-cross-origin-resource-sharing/)
- **CORS only applies to browser requests.** When your backend server calls an API, there is no CORS enforcement; the call succeeds or fails based on the server's network and authentication — [NHI Management Group](https://nhimg.org/articles/cors-errors-expose-the-browser-security-boundary-developers-miss/)
- **Overly permissive policies are risky.** Allowing all origins (Access-Control-Allow-Origin: *) or wildcard subdomain patterns defeats the purpose of CORS. Misconfiguration is the main source of CORS security issues — [Hexnode Cybersecurity](https://www.hexnode.com/blogs/?p=45030)
- **CORS does not protect the server.** CORS controls browser-side read access; it does not prevent the server from receiving requests. The server must implement authentication, authorization, and input validation independently — [Gravitee CORS Basics](https://gravitee.io/cors-basics.html)

### Inferences
- The font API must configure CORS headers to allow requests from your GitHub Pages domain (e.g., `yourname.github.io`). If the API does not support CORS, you must use a backend proxy.
- Check the API's CORS setup: does it allow your origin? Does it support preflight requests (OPTIONS)? Does it allow the HTTP methods and headers you need (e.g., POST, Content-Type: application/json)?
- If the API is rate-limited or requires authentication, CORS does not provide that protection; the API's rate limiting and auth mechanisms still apply.
- For a public font generator, anticipate CORS errors if users call the tool from unexpected origins (e.g., localhost, other domains). Document the GitHub Pages domain or provide troubleshooting steps.

### Gaps
- No sources provided a checklist for configuring CORS on a custom font generation API.
- No data on how often CORS misconfiguration blocks legitimate font generator tools, or on common API CORS policies (allow-all, allow-specific-origin, etc.).
- Unclear how to handle CORS for advanced requests (with authentication headers, cookies, custom payloads).

---

## Abuse prevention for a free/public API-consuming tool

### Takeaway
Client-side rate limiting is a usability control, not a security boundary; attackers skip it and call the API directly. Server-side enforcement is essential: implement per-user or per-key limits, return 429 status on excess, include Retry-After headers, and enforce limits on the API provider's side. Public tools should also track usage, implement spend caps, and consider CAPTCHAs for suspicious patterns.

### Cited Findings
- **Client-side limits don't stop attackers.** When limits exist only in the user interface, attackers can call the backend API directly with scripted requests, bypassing the UI constraint entirely — [AppMaster](https://appmaster.io/blog/rate-limiting-abuse-prevention-public-apis)
- **Server-side enforcement is mandatory.** The API provider must check rate limits before processing each request, return HTTP 429 (Too Many Requests) when limits are exceeded, and include a Retry-After header so compliant clients can back off — [vibe-eval](https://vibe-eval.com/backend-security/api-abuse-protection/)
- **Scope limits by identity.** For public APIs, enforce per-IP rate limiting on login/signup endpoints and per-API-key limits on authenticated endpoints. Some providers limit per-user or per-account — [vibe-eval](https://vibe-eval.com/backend-security/api-abuse-protection/); [Axon Build](https://axonbuild.com/blog/rate-limiting-in-api/)
- **API keys in client code are a continuous leak vector.** Exposed keys in frontend repositories or browser DevTools are a common first step for attackers, allowing them to bypass per-user limits by exploiting the account's shared quota — [vibe-eval](https://vibe-eval.com/backend-security/api-abuse-protection/)
- **Combine client and server strategies.** Client-side throttling (exponential backoff, local request queues) reduces accidental overload from honest clients and improves UX, but it is never a substitute for server-side enforcement — [DiDit](https://didit.me/blog/api-security-rate-limiting/)
- **Monitor for anomalies.** Log request patterns, watch for sudden spikes or unusual payloads, and alert on suspicious activity such as concurrent requests from many IPs using the same key — [Traceable AI](https://traceable.ai/wp-content/uploads/2023/05/solutionsbrief-intelligent-rate-limiting.pdf)

### Inferences
- If building a BYOK font generator, the user's rate limits are controlled by their API key settings on the provider's side. Document that clearly (e.g., "Your rate limits are set in your API account").
- Implement client-side throttling: queue requests, show estimated wait time, prevent submission while requests are pending.
- If the tool has a backend, implement per-IP rate limiting on public endpoints (generation requests without authentication), and per-key limits if users bring their own keys.
- Add client-side validation to catch malformed inputs early, reducing wasted API calls.
- Log all API calls (timestamps, input, output) locally for the user to monitor their own usage and quota.
- If the tool is popular, expect abuse (automated generation, bulk requests, API key scraping); plan for rate limit sharing or alternative monetization (API credits, subscription) if the free model scales.

### Gaps
- No sources provided guidance on detecting or mitigating bot attacks vs. legitimate high-volume users.
- No data on typical abuse patterns for design/generation tools or recommended rate limit thresholds.
- Unclear how to implement client-side rate limiting that survives page reloads or multiple browser tabs without coordination.

---

## Additional Recommendations for Architecture

### Local-First Data Strategy
- Store generated fonts locally (IndexedDB or Cache API) so users can see their generation history and previous outputs even offline.
- Clear guidance in UI: "Your generated fonts are stored only in your browser. If you clear your browser cache, they will be deleted."

### Service Worker Versioning
- Include a version hash in the service worker file path (e.g., `sw-v1.0.js`) so browser cache doesn't serve outdated scripts.
- Use cache versioning (e.g., `cache.open('fonts-v1')`) to cleanly swap out old cached assets on updates.

### Security Checklist for GitHub Pages Hosting
- Self-host all fonts (WOFF2 format, no CDN).
- Inline critical CSS to avoid external stylesheet dependencies.
- Use HTTPS (enforced by GitHub Pages by default).
- Set strict CSP headers in a meta tag or via a build step that injects them.
- Document the security model for users who bring their own API keys.

### Monitoring and Telemetry
- Track successful/failed API calls, cache hit rates, and error frequency.
- Use client-side analytics (localStorage logging or beacons to a telemetry endpoint) only with user consent and CSP alignment.
- Never log API keys, user payloads, or personal data.

---

## Sources

- [SSO Jet / CIAM QnA - API Token Storage](https://ssojet.com/ciam-qna/api-token-storage-localstorage-sessionstorage-httpOnly-cookies)
- [The New Stack - Best Practices for Storing Access Tokens in the Browser](https://thenewstack.io/best-practices-for-storing-access-tokens-in-the-browser/)
- [DEV Community - OpenAI API Key Safety and Mistakes](https://dev.to/backmesh/openai-api-key-safety-and-mistakes-in-client-side-code-3k2j)
- [RxDB Docs - IndexedDB Encryption](https://rxdb.info/articles/indexeddb/indexeddb-encryption.html)
- [Canva Developer Docs - Alternative Authentication Experiences](https://www.canva.dev/docs/apps/authenticating-users/alternative-auth-experiences/)
- [DEV Community - When an API Key Lives in Local Storage](https://dev.to/abhinavsingwal/when-an-api-key-lives-in-local-storage-a-subtle-but-risky-pattern-3fn7)
- [API Dog - API Key Exposed in Browser](https://apidog.com/blog/api-key-exposed-in-browser/)
- [Stadia Maps - Securing Your Integration](https://docs.stadiamaps.com/guides/securing-your-integration/)
- [OpenAI Community Forum - Restricted BYOK API Keys for Client-Side Applications](https://community.openai.com/t/feature-request-restricted-byok-api-keys-for-client-side-applications/1392506)
- [Okta Documentation - Manage API Keys](https://help.okta.com/oie/en-us/Content/topics/privileged-access/pam-manage-api-keys.htm)
- [RoxyAPI - API Key Security: Revocation, Rotation, Scraping Defense](https://roxyapi.com/blogs/api-key-security-revocation-rotation-scraping-defense)
- [Gravitee - API Key Provisioning, Rotation, and Revocation Best Practices](https://gravitee.io/corpus/gen-2308/api-key/api-key-provisioning-rotation-and-revocation-best-practices.html)
- [CIAM Compass - API Key Rotation Best Practices](https://guptadeepak.com/ciam-compass/best-practices/api-key-rotation/)
- [GitHub Documentation - GitHub Pages Limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [How-To Geek - Why GitHub Pages is the Best Option for Most Free Websites](https://www.howtogeek.com/heres-why-github-pages-is-the-best-option-for-most-free-websites/)
- [GitHub Community Discussions - Serving Files Directly from GitHub](https://github.colasdn.workers.dev/orgs/community/discussions/157852)
- [enable-cors.org - CORS Example](https://raw.githack.com/fbrusch/actam_2024/gh-pages/corsissues.html)
- [Free Code Camp Forum - Where to Host a Project with POST Requests](https://forum.freecodecamp.org/t/where-can-i-host-a-project-where-i-can-make-post-requests/501060)
- [MDN Web Docs - Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [Google Web Dev - PWA Caching](https://web.dev/learn/pwa/caching)
- [DEV Community - Efficient Way to Cache Google Fonts with Service Worker](https://dev.to/nektro/efficient-way-to-cache-google-fonts-with-service-worker--32i4)
- [Offline-First PWAs Article - Service Worker Caching Strategies](https://www.magicbell.com/blog/offline-first-pwas-service-worker-caching-strategies)
- [Pixelfree Studio - Best Practices for PWA Offline Caching Strategies](https://blog.pixelfreestudio.com/?p=4359)
- [Securitool - CSP Generator](https://securitool.js.org/tools/policy-generator.html)
- [AppSecSanta - CSP Generator](https://appsecsanta.com/tools/csp-generator)
- [Inventive HQ - CSP Generator](https://inventivehq.com/tools/csp-generator)
- [NHI Management Group - CORS Errors Expose Browser Security Boundary](https://nhimg.org/articles/cors-errors-expose-the-browser-security-boundary-developers-miss/)
- [Gravitee - CORS and Browser Security](https://gravitee.io/corpus/gen-780/http/cors-and-browser-security.html)
- [Aembit - CORS Glossary](https://aembit.io/glossary/cors-cross-origin-resource-sharing/)
- [Azion - What is CORS](https://www.azion.com/en/learning/websec/what-is-cors/)
- [Hexnode - What is CORS](https://www.hexnode.com/blogs/?p=45030)
- [Gravitee - CORS Basics for APIs and Web Apps](https://gravitee.io/cors-basics.html)
- [AppMaster - Rate Limiting and Abuse Prevention for Public APIs](https://appmaster.io/blog/rate-limiting-abuse-prevention-public-apis)
- [vibe-eval - API Abuse & Bot Protection for SaaS Apps](https://vibe-eval.com/backend-security/api-abuse-protection/)
- [Axon Build - Rate Limiting in API](https://axonbuild.com/blog/rate-limiting-in-api/)
- [DiDit - API Security Rate Limiting](https://didit.me/blog/api-security-rate-limiting/)
- [Traceable AI - Intelligent Rate Limiting Solution Brief](https://traceable.ai/wp-content/uploads/2023/05/solutionsbrief-intelligent-rate-limiting.pdf)
