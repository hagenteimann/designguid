# Technical: Deployment & Git Workflow

This guide defines the Git branching strategy and deployment procedures.

---

## 1. Git Workflow
Maintain a clean repository history:
* **Branching:** Major changes should be developed on feature branches and merged into `main` via Pull Requests.
* **Commit Conventions:** Follow structured commit types:
  - `feat: [Description]` for new features.
  - `fix: [Description]` for bug fixes.
  - `style: [Description]` for design/styling adjustments.
  - `perf: [Description]` for performance optimizations.
  - `docs: [Description]` for documentation updates.
* **Exclusions:** Never commit environment configuration files (`.env`, `.env.local`) or large uncompressed raw assets.

---

## 2. Pre-Deploy Validation
* **Validation Script:** Run the `./check.sh` validation suite locally before pushing or triggering a deployment.
* **Verify Assets:** Double-check that no PNG/JPG formats exist in production assets and that SVGs are embedded inline.

---

## 3. Server Configuration
* **HTTPS Redirect:** Configure the web server (Nginx, Apache, or hosting platform) to redirect all HTTP traffic to HTTPS.
* **Security Headers:** Set security response headers (CSP, HSTS, X-Content-Type-Options) in the server configuration.
