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

Variablen anpassen und einfügen:

```html
<!-- Das Formular -->
<form id="genie-contact-form">
  <!-- Honeypot (Versteckt für Menschen) -->
  <div style="display:none;">
    <input type="text" name="hp_field" id="hp_field" tabindex="-1" autocomplete="off">
  </div>

  <!-- Sichtbare Felder -->
  <input type="text" name="name" placeholder="Dein Name *" required>
  <input type="email" name="email" placeholder="Deine E-Mail">
  <input type="text" name="company" placeholder="Firma">
  <textarea name="message" placeholder="Deine Nachricht"></textarea>

  <button type="submit" id="submit-btn">Anfrage senden</button>
</form>

<!-- Supabase SDK laden -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
  // --- CONFIGURATION ---
  const SUPABASE_URL = 'DEINE_SUPABASE_URL';
  const SUPABASE_ANON_KEY = 'DEIN_SUPABASE_ANON_KEY';
  const ORG_ID = 'DEINE_ORG_ID_UUID';
  // ---------------------

  const { createClient } = supabase;
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const form = document.getElementById('genie-contact-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.innerText = 'Wird gesendet...';

    const formData = new FormData(form);

    // 1. Honeypot Check
    if (formData.get('hp_field')) {
      console.warn('Bot detected.');
      return;
    }

    // 2. Daten vorbereiten
    const payload = {
      org_id: ORG_ID,
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company'),
      message: formData.get('message'),
      source: 'website'
    };

    // 3. An Genie senden
    const { data, error } = await supabaseClient
      .from('inbound_leads')
      .insert([payload]);

    if (error) {
      alert('Fehler beim Senden: ' + error.message);
      btn.disabled = false;
      btn.innerText = 'Anfrage senden';
    } else {
      alert('Vielen Dank! Deine Anfrage ist eingegangen.');
      form.reset();
      btn.innerText = 'Gesendet';
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
