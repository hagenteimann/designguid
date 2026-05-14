# Genie CRM – Kontaktformular Integration

Dieser Guide erklärt, wie externe Website-Kontaktformulare an das **Genie CRM** angebunden werden, sodass Anfragen direkt im **Inbound-Tab** landen.

---

## Voraussetzungen

Damit das Formular Daten senden kann, werden folgende Informationen benötigt:

1. **Supabase URL:** Die Basis-URL des Projekts.
2. **Supabase Anon Key:** Der öffentliche API-Schlüssel für Browser-Zugriffe.
3. **Organisation ID (`org_id`):** Die UUID des Teams/der Organisation in Genie.

> **Wichtig:** Die `org_id` ist zwingend erforderlich, damit Genie weiß, zu welchem Workspace die Anfrage gehört.

---

## Datenstruktur (Table: `inbound_leads`)

Das Formular sendet folgende Felder an die Tabelle `inbound_leads`:

| Feld | Typ | Pflicht? | Beschreibung |
|---|---|---|---|
| `org_id` | UUID | **Ja** | Die ID der Organisation. |
| `name` | Text | **Ja** | Name des Absenders. |
| `email` | Text | Nein | E-Mail Adresse. |
| `company` | Text | Nein | Firmenname. |
| `website` | Text | Nein | Website URL. |
| `message` | Text | Nein | Die Nachricht. |
| `selected_packages` | JSONB | Nein | Array von gewählten Paketen (z.B. `[{"name": "Basis", "price": 500}]`). |
| `estimated_budget` | Numeric | Nein | Geschätztes Budget. |
| `source` | Text | Nein | Standardmäßig `website`. |

---

## Sicherheit & Best Practices

Da der `anon_key` öffentlich im HTML/JS steht, gelten folgende Sicherheitsmaßnahmen:

1. **Honeypot-Feld:** Ein verstecktes Feld, das für Menschen unsichtbar ist. Wenn ein Bot es ausfüllt, wird die Anfrage verworfen.
2. **Frontend-Validierung:** Verhindert leere oder falsch formatierte Anfragen.
3. **RLS (Row Level Security):** In der Datenbank ist eingestellt, dass über den `anon_key` nur *Inserts* erlaubt sind, aber kein Lesen oder Ändern vorhandener Daten.

---

## Implementierungs-Beispiel (HTML + JS)

Variablen anpassen und einfügen.

**Supabase SDK – Self-Hosting bevorzugen (DSGVO):**

CDN-Einbindung über jsDelivr sendet die IP des Nutzers an US-Server ohne Einwilligung.
Bevorzuge lokales Hosting:

```bash
npm install @supabase/supabase-js
# oder: Datei einmalig herunterladen und in js/ ablegen
curl -o js/supabase.min.js \
  https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.X.X/dist/umd/supabase.min.js
```

```html
<!-- ✅ Lokal gehostet – kein externer Request -->
<script src="/js/supabase.min.js"></script>
```

**Nur wenn CDN zwingend nötig:** fixe Version + SRI-Hash + Datenschutzerklärung anpassen:
```bash
curl -s https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.X.X/dist/umd/supabase.min.js \
  | openssl dgst -sha384 -binary | openssl base64 -A
```
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.X.X/dist/umd/supabase.min.js"
        integrity="sha384-GENERIERTER_HASH"
        crossorigin="anonymous"></script>
```

---

```html
<!-- Feedback-Element (oberhalb des Formulars) -->
<div id="form-status" role="status" aria-live="polite" style="display:none;"></div>

<!-- Das Formular -->
<form id="genie-contact-form" novalidate>
  <!-- Honeypot (versteckt für Menschen, sichtbar für Bots) -->
  <div style="position:absolute;left:-9999px;opacity:0;" aria-hidden="true">
    <input type="text" name="hp_field" id="hp_field" tabindex="-1" autocomplete="off">
  </div>

  <!-- Sichtbare Felder -->
  <label for="field-name">Name *</label>
  <input type="text" id="field-name" name="name" required autocomplete="name">

  <label for="field-email">E-Mail</label>
  <input type="email" id="field-email" name="email" autocomplete="email">

  <label for="field-company">Firma</label>
  <input type="text" id="field-company" name="company" autocomplete="organization">

  <label for="field-message">Nachricht</label>
  <textarea id="field-message" name="message" rows="4"></textarea>

  <button type="submit" id="submit-btn">Anfrage senden</button>
</form>

<style>
  #form-status {
    padding: var(--space-300);
    border-radius: var(--radius-squircle-sm);
    margin-bottom: var(--space-300);
  }
  #form-status.success {
    background: var(--color-primary-100);
    color: var(--color-primary-500);
  }
  #form-status.error {
    background: hsl(0, 80%, 95%);
    color: hsl(0, 80%, 35%);
  }
</style>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.X.X/dist/umd/supabase.min.js"
        integrity="sha384-GENERIERTER_HASH"
        crossorigin="anonymous"></script>

<script>
  const SUPABASE_URL    = 'DEINE_SUPABASE_URL';
  const SUPABASE_ANON_KEY = 'DEIN_SUPABASE_ANON_KEY';
  const ORG_ID          = 'DEINE_ORG_ID_UUID';

  const { createClient } = supabase;
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const form   = document.getElementById('genie-contact-form');
  const btn    = document.getElementById('submit-btn');
  const status = document.getElementById('form-status');

  function showStatus(message, type) {
    status.textContent = message;
    status.className = type;
    status.style.display = 'block';
    status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Wird gesendet…';

    const formData = new FormData(form);

    if (formData.get('hp_field')) return; // Bot – still, kein Feedback

    const payload = {
      org_id:  ORG_ID,
      name:    formData.get('name'),
      email:   formData.get('email'),
      company: formData.get('company'),
      message: formData.get('message'),
      source:  'website'
    };

    const { error } = await supabaseClient
      .from('inbound_leads')
      .insert([payload]);

    if (error) {
      showStatus('Fehler beim Senden – bitte versuche es erneut.', 'error');
      btn.disabled = false;
      btn.textContent = 'Anfrage senden';
    } else {
      showStatus('Vielen Dank! Deine Anfrage ist eingegangen.', 'success');
      form.reset();
      btn.textContent = 'Gesendet ✓';
    }
  });
</script>
```

---

## Testing

1. Formular auf der Website ausfüllen.
2. **Genie CRM** öffnen.
3. Tab **"Inbound"** navigieren.
4. Anfrage mit Label **"NEU"** erscheint in Echtzeit.

---

## Hinweis für den Coding-Agenten

- `org_id` des Kunden aus den Genie-Einstellungen holen.
- Sicherstellen, dass die `inbound_leads` Tabelle existiert (Migration: `migration_inbound_leads.sql`).
- Supabase SDK für eine saubere Integration nutzen.
- Für komplexere Anforderungen (reCAPTCHA, E-Mail-Bestätigung) eine Supabase Edge Function vorschalten.

---

*Push8 Web Agency – Stand Mai 2026*
