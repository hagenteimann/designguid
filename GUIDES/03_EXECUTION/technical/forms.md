# Technical: Forms & Data Submission

This guide defines best practices for form structure, input validation, spam protection, and backend storage integration.

---

## 1. Form Structure & UX
* **Minimize Fields:** Only request essential contact info (e.g., Name, Email, Message) during the initial touchpoint. Long forms dramatically reduce conversion rates.
* **Semantic Markups:**
  - Every input must have a corresponding, readable `<label>`.
  - Use appropriate `type` attributes (e.g., `type="email"`, `type="tel"`) to enable mobile autocomplete.
  - Form validation errors must be screen-reader accessible.

---

## 2. Spam Protection
Protect data endpoints from automated spam submissions:
* **Honeypot Fields:** Place a hidden input field that should remain empty. If filled, discard the submission.
  ```html
  <div style="display:none;" aria-hidden="true">
    <input type="text" name="honeypot" tabindex="-1" autocomplete="off">
  </div>
  ```
* **Server-side Validation:** Validate email syntax and sanitize message content server-side.

---

## 3. Storage & Integration
* **Data Privacy:** Form data should be transmitted securely over HTTPS.
* **Privacy Notice:** Add a short notice near the submit button indicating how the data is processed (e.g., "By submitting, you agree to our Privacy Policy").

---

## 4. CRM-Integration & Segmentierung
Forms are the gateway to the Customer Relationship Management (CRM) lifecycle:
- **Immediate Segmentation:** If the brand serves distinct target groups (e.g., municipal authorities vs. commercial operators), include a low-friction selector (dropdown or radio buttons) in the form to segment the lead instantly.
- **Dynamic Routing:** Route segmented form submissions to corresponding email templates or CRM pipelines to match the user's specific interests (e.g., sending municipal case studies only to municipalities).
- **Auto-Onboarding (Socialisation):** On submit, redirect users to a tailored thank-you page that serves initial welcome materials or onboarding resources, initiating the socialization phase instantly.
