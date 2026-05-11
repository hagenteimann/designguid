# ✅ Deploy Checklist (1 Seite)

**Vor JEDEM Deployment zu Webspace + Git**

---

## Pre-Deploy Checks (5 Min)

- [ ] FTP/SSH Credentials?
- [ ] Zielordner klar? (z.B. `/var/www/html/`)
- [ ] `.env` NICHT in Upload-Liste? (git status check)
- [ ] `*.md` NICHT dabei?
- [ ] `cd-manual/`, `analysis/`, `src/` NICHT dabei?
- [ ] `robots.txt` vorhanden?
- [ ] `sitemap.xml` vorhanden?
- [ ] `404.html` vorhanden?

---

## Deploy zu Webspace (5 Min)

```bash
# Option 1: rsync (empfohlen)
rsync -av --exclude='.env' --exclude='*.md' ./public/ user@example.com:/var/www/html/

# Option 2: SFTP
sftp user@example.com
put -r public/*

# Option 3: FTP (FileZilla)
Drag public/* to Remote
```

- [ ] Upload erfolgreich?
- [ ] Keine Fehler in Upload-Log?

---

## Git Push (wenn Git vorhanden)

```bash
git add -A
git commit -m "Deploy: Version 1.2.0 – [Features/Fixes]"
git push origin main
git tag -a v1.2.0 -m "Production Release"
git push origin v1.2.0
```

- [ ] .env NICHT im Staging? (`git status`)
- [ ] Commit Message aussagekräftig?
- [ ] Git Push erfolgreich?
- [ ] Tag erstellt und gepusht?

---

## Post-Deploy

- [ ] CHANGELOG.md aktualisiert?
- [ ] CD-Manual mit Deploy-Info aktualisiert?
- [ ] User benachrichtigt mit Link?
- [ ] Webspace erreichbar + funktioniert? (testet 1 Seite)

---

## Rollback Plan (falls Problem)

```bash
# Revert letzten Commit
git revert abc1234
git push origin main

# ODER zu älterem Tag
git checkout v1.1.0
git push -f origin main
```

---

**Detailinformationen:** [WORKFLOW_DEPLOYMENT.md](../GUIDES/WORKFLOW_DEPLOYMENT.md)
