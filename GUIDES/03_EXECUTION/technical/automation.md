# Technical: Automation & Validation Loops

This guide defines how automated validation workflows (such as pre-deploy scripts and agent loops) ensure project quality.

---

## 1. Pre-Deploy Validator Script
The repository contains a pre-deploy check script (`check.sh`) that acts as a gatekeeper:
* **Scope:** It validates that there are no remote CDNs, that all images are optimized (WebP/AVIF), that alt attributes exist, that contrast targets are met, and that basic legal compliance is fulfilled.
* **Usage:** Execute this check before every Git commit or deployment push:
  ```bash
  ./check.sh
  ```

---

## 2. Automated Validation Loop
The repository supports automated developer cycles (e.g. Validator-Agent cycles):
* **Configuration:** Configuration profiles (like `.ralph-config`) dictate the autonomous code-fixing parameters.
* **Execution:** Initiating the autonomous cycle:
  ```bash
  ./ralph.sh
  ```
* **Process:** The loops automatically read code outputs, execute tests, run validators, and apply linting/formatting fixes in an isolated runtime loop until all validation gates are passed successfully.
