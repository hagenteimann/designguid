# MASTER GUIDE - Brand & Web Strategy-to-Execution Framework
This file contains the complete generic guidelines and code standards compiled from the repository guides. Use this file as a master prompt context for any AI coding assistant.

================================================================================
FILE: GUIDES/01_STRATEGY/customer.md
================================================================================

# Strategy: Customer (CX, CJ, TP & Funnel)

This guide defines the customer analysis, buying personas, customer experience (CX), customer journey (CJ), touchpoints (TP), and the conversion funnel logic.

---

## 1. Buying Personas
Before designing or coding, define the target user personas:
- **Demographics & Profile:** Who is the target user? (Industry, role, decision power).
- **Core Pain Points:** What problems do they need solved immediately?
- **Goals & Desires:** What is their definition of success?
- **Decision Drivers:** What triggers them to buy? What scares them off?

---

## 2. Customer Journey (CJ) & Touchpoints (TP)
Map the journey the user takes from first touch to conversion:
- **Awareness:** First touchpoint (Search, Ads, Social Media, Referrals).
- **Consideration:** Exploring options, comparing benefits, looking for proof.
- **Decision:** Selecting the solution, contacting, buying.
- **Retention:** Post-purchase support, newsletters, recommendations.

---

## 3. The Conversion Funnel
Every web page must act as a structured guide leading the user through the funnel:

### Step 1: Attention (Hero Section)
* **Goal:** Hook the user in under 3 seconds.
* **Must-Haves:**
  - Benefit-driven main headline (focus on the customer's gain).
  - Clear subline explaining how the benefit is delivered.
  - One primary, highly visible Call-to-Action (CTA).
  - High-trust proof element (e.g., stats, certifications) directly below or near the CTA.
  - Realistic visual representative (avoid cheesy stock photos).

### Step 2: Interest (Social Proof & Credibility)
* **Goal:** Build trust and validate the hero promise.
* **Must-Haves:**
  - Trusted client logos or trust badges.
  - Quantitative key stats (e.g., "150+ projects, 99% satisfaction").
  - Rich testimonials (name, photo, role, verified quote).

### Step 3: Consideration (Features, Benefits & Positioning)
* **Goal:** Explain the solution and why it is the best choice.
* **Must-Haves:**
  - Clear layout showcasing key services (e.g., Bento Grid).
  - Explanation of unique differentiation from competitors.

### Step 4: Conviction (Case Studies & Process)
* **Goal:** Address objections and explain the working relationship.
* **Must-Haves:**
  - Case Studies: Problem $\rightarrow$ Solution $\rightarrow$ Quantified Result.
  - Visual process roadmap showing 3–5 simple steps of collaboration.

### Step 5: Conversion (Final Call to Action)
* **Goal:** Close the deal with zero distraction.
* **Must-Haves:**
  - Repeated primary CTA with clear action-oriented copy.
  - Minimal friction form (e.g., Name + Email + Message).
  - Risk-reducer copy directly below the CTA (e.g., "Response in 24 hours, completely free").

---

## 4. Mobile Funnel Rules
- Primary CTAs must be easily reachable (within thumb range or sticky).
- Strict performance budget: LCP < 2.5s to avoid conversion drops.
- Focus on headers, bullet points, and concise text blocks.

---

## 5. Involvement-Grad & Kaufpsychologie
The level of user involvement determines the layout structure and the density of information required:

### High-Involvement Decisions (e.g., B2B services, complex consultancy, high-cost contracts)
- **User Behavior:** Analytical, risk-averse, needs substantial trust and proof. Long decision cycle.
- **UX Strategy:** 
  - Rich information density (longer descriptive text, detailed case studies).
  - Explicit explanation of methodology and workflow processes.
  - Deep validation (structured FAQs, expert team background, certifications).
  - Soft CTA targets (e.g., "Request free consultation" or "Book a 30-min audit") rather than aggressive direct sales.

### Low-Involvement Decisions (e.g., simple local services, standard retail/e-commerce, minor bookings)
- **User Behavior:** Spontaneous, emotionally driven, fast decision cycle. Low perceived risk.
- **UX Strategy:**
  - Minimalist layouts focusing on immediate visual clarity and speed.
  - Short bullet points, high readability, and large illustrative product images.
  - Simple, transparent pricing and single-click direct CTAs ("Book Now", "Buy Now").
  - Fast, recognizable trust badges (e.g., money-back guarantee, security seals).

---

## 6. Kundenbeziehungszyklus (CRM Lifecycle)
The website acts as a critical interface for the long-term customer relationship lifecycle, supporting different stages over time:

1. **Anbahnung (Initiation / Acquisition):**
   - *Website Touchpoint:* Low-barrier entries like landing pages, free audit tools, checklists, and contact forms.
2. **Sozialisation (Onboarding / Welcome):**
   - *Website Touchpoint:* Customized thank-you pages, download dashboards, and welcome resources. Sets the expectations.
3. **Wachstum (Growth / Expansion):**
   - *Website Touchpoint:* Customer portal areas, regular updates, newsletters, and cross-selling product matrices.
4. **Reife (Maturity / Retention):**
   - *Website Touchpoint:* Premium customer benefits, user-specific dashboards, and community portals.
5. **Gefährdung (Churn Risk / Churn prevention):**
   - *Website Touchpoint:* Automatic warnings via user activity logging. Offering specialized support access or custom retention/win-back banners.
6. **Auflösung (Termination / Win-back):**
   - *Website Touchpoint:* Frictionless cancellation flows combined with feedback surveys (exit interviews) and direct reactivation offers.

---

## 7. Mentale & Physische Verfügbarkeit (Byron Sharp)
Brand growth is driven by maximizing the brand's mental and physical availability:

### Mentale Verfügbarkeit (Mental Availability)
Ensure the brand is easily recalled by the consumer in a purchasing situation:
- **Category Entry Points (CEPs):** Identify the situational triggers (the "why" and "when") that lead users to search for the service. Examples:
  - *Symptom/Trigger:* "Leaking pipe under the sink" (CEP) $\rightarrow$ The plumber's site must show emergency support immediately.
  - *Symptom/Trigger:* "Need video for an Instagram launch next week" (CEP) $\rightarrow$ The video agency's site must show fast turnaround capabilities and direct contact paths.
  - Structure the website's copy and headlines to directly match these situational triggers (CEPs) instead of using abstract corporate jargon.
- **Distinctive Brand Assets (DBAs):** Consistently use and protect sensory anchors (logos, specific colors, characteristic fonts) across the entire user experience. Never let arbitrary design changes dilute these assets.

### Physische Verfügbarkeit (Physical Availability)
Ensure the brand is as easy to find and buy as possible on the web:
- **Web Presence:** The site must load instantly (LCP < 2.5s) on mobile networks. Slow load times make the brand "physically unavailable" to the user.
- **Low-Friction Access:** Eliminate all cognitive and technical barriers. Use clear call-to-actions, short contact forms, direct click-to-chat links (WhatsApp/phone), and fully responsive navigation.


================================================================================
FILE: GUIDES/01_STRATEGY/hr.md
================================================================================

# Strategy: HR (Demand & Incentives)

This guide defines the employer branding strategy, talent recruitment demand, and incentive mapping.

---

## 1. HR Demand & Recruitment
Define candidate personas and hiring goals:
- **Hiring Priorities:** Which roles are critical and require prominent showcases on the platform?
- **Candidate Profiles:** What qualifications, attitudes, and cultural values must candidates possess?
- **Recruitment Funnel:** Make the application process frictionless (e.g., Quick Apply in 60 seconds, no CV required for first step).

---

## 2. Incentives (Value Proposition)
Communicate why talented individuals should join:
- **Incentives List:** Quantifiable benefits (e.g., above-average salary, modern tools, flexible hours, team events).
- **Culture & Growth:** Document employee testimonials and showcases of day-to-day team dynamics.
- **Visual Credibility:** Avoid generic stock photos of people in suits. Use real pictures of the team, workspaces, and real projects.

---

## 3. Internal Branding & Brand Alignment
Employer branding is not just outward-facing; it must align with internal culture:
- **Brand Alignment:** Ensure that the recruitment messaging matches the true daily behavior and workplace environment of the company. Misalignment leads to high turnover.
- **Employee Ambassadors:** Showcase real employee stories, videos, and day-to-day work scenarios. Let the team represent the brand values.
- **Onboarding Alignment:** The recruitment user experience (smooth, fast, transparent) should mirror the actual onboarding experience of the employee.


================================================================================
FILE: GUIDES/01_STRATEGY/product_service.md
================================================================================

# Strategy: Service & Product (Competitors & Differentiation)

This guide defines the methodology for analyzing competitors and establishing unique product/service differentiation.

---

## 1. Competitor Analysis
Before designing a product/service showcase, analyze 3–5 direct competitors:
- **Feature Matrix:** What do they offer? What is missing?
- **Pricing & Packaging:** How do they structure their prices (flat rate, modular, subscriptions)?
- **Visual Stance:** What color schemes, typography, and image motifs do they use?
- **Friction Points:** Where do their customer experiences break down?

---

## 2. Differentiation (USP)
Define the unique value proposition (UVP) and how it is visually communicated:
- **Positioning Statement:** "Unlike [Competitors], we offer [Unique Benefit] for [Target Group] through [Our Methodology]."
- **Proof of Superiority:** Showcase quantified proofs (e.g., speed, materials, custom tools) early in the layout.
- **Value over Features:** Speak to the emotional and practical value of the service rather than just listing technical features.

---

## 3. SWOT-Analyse & Wettbewerbs-Matrix
Evaluate the positioning using a SWOT matrix during the research phase:
- **Strengths (Stärken):** Internal capabilities that deliver superior value (e.g., custom technology, fast lead time). Map these directly to the Hero section and primary benefits.
- **Weaknesses (Schwächen):** Internal gaps to be compensated for visually (e.g., lesser-known brand). Mitigate via heavy social proof (logos, certificates, testimonials).
- **Opportunities (Chancen):** External market gaps not addressed by competitors (e.g., competitors have poor mobile sites or lack transparent pricing).
- **Threats (Risiken):** External threats to counter (e.g., price wars). Counter by emphasizing craftsmanship, custom quality, and comprehensive warranties.

---

## 4. Pricing-Strategie & Wertkommunikation
How prices are structured and communicated determines trust and cognitive load:
- **Transparent Pricing:** Show pricing tables or clear starting points. Hiding prices creates user friction and reduces conversion rates.
- **Psychological Anchoring:** Highlight a "Most Popular" or "Recommended" option in the center to act as a cognitive value anchor.
- **Value Framing:**
  - Break down costs into digestible units (e.g., "starting at $X / month" or fixed project flat rates).
  - Explicitly frame the cost against the return on investment (ROI) or value gained (e.g., "Saves an average of 4 hours/week" or "equivalent to 1 client acquisition").


================================================================================
FILE: GUIDES/01_STRATEGY/shareholder.md
================================================================================

# Strategy: Shareholder (Communication & Distribution)

This guide defines the shareholder communication objectives and distribution strategies.

---

## 1. Communication Goals
Shareholder communication focuses on transparency, performance reporting, and long-term value creation:
- **Financial Performance:** Clear reporting of revenues, costs, margins, and growth.
- **Strategic Vision:** Keeping shareholders aligned on the company's roadmap and market opportunities.
- **Risk Management:** Communicating risk mitigation plans and resilience strategies.
- **Reporting Cadence:** Standardizing updates (monthly, quarterly, or annually).

---

## 2. Distribution Channels
How updates and strategic information are delivered to shareholders:
- **Investor Portal:** A secure, authenticated area on the corporate platform.
- **Annual Reports:** Structured, highly readable, downloadable PDF reports.
- **Direct Mailings / Newsletters:** Segmented communication channels for fast updates.
- **Meetings & Webcasts:** Layout and planning specifications for digital shareholder meetings and presentations.
- **Offline / Online Integration:** Ensure a seamless transition between printed shareholder invitations/reports (using verified QR codes) and the secure digital investor portal.


================================================================================
FILE: GUIDES/01_STRATEGY/stakeholder.md
================================================================================

# Strategy: Stakeholder (Communication & Distribution)

This guide defines the stakeholder mapping, communication expectations, and distribution paths.

---

## 1. Stakeholder Mapping
Stakeholders include everyone affected by or interested in the brand:
- **Internal Stakeholders:** Employees, management, board members.
- **External Stakeholders:** Partners, suppliers, local communities, government authorities, public interest groups.
- **Needs Analysis:** Assess the information needs and level of interest of each group.

---

## 2. Communication & Distribution
- **Transparency:** Building trust through regular, open communications.
- **Public Relations (PR):** Media-ready announcements and public press rooms.
- **Crisis Communication:** Prepared templates and channels for urgent notices.
- **Distribution Nodes:** Leveraging email, public portals, social channels, and official registers to reach stakeholders.
- **Omnichannel Distribution:** Integrate physical stakeholder newsletters, local press releases, and public community notices with the digital newsroom via clear scan-to-verify mechanisms.


================================================================================
FILE: GUIDES/02_CONCEPT/design_concept.md
================================================================================

# Synthesis: Design Concept

The Design Concept acts as the central synthesis bridge that translates the 5 Strategic Inputs (Customer, Shareholder, Stakeholder, Product, HR) into concrete visual assets.

---

## 1. Core Principle: Form Follows Function
Every visual decision must be justified by its functional purpose:
- **No Decoration without Function:** Do not add grids, lines, gradients, or animations unless they guide the user's attention, structure content, or enhance readability.
- **Cognitive Load Reduction:** Keep layouts clean, whitespace generous, and paths obvious.
- **Context-First Design:** Structure design hierarchies to match the primary conversion intent.

---

## 2. Synthesis Strategy
To create a unified Design Concept:
1. **Consolidate Inputs:** Read the brand strategy profiles. If the customer prioritizes "trust" and the product differentiation is "handcrafted quality", the design concept must project stability and precision.
2. **Translate to Mood & Style:** Match the consolidated inputs to a defined visual category (e.g., Monochrome Restraint, Warm Editorial, High-Contrast Brutalist, or Dark Premium).
3. **Establish Constraints:** Define the technical and physical limitations (accessibility targets, performance budgets, device responsiveness) before styling.


================================================================================
FILE: GUIDES/03_EXECUTION/ai_prompts.md
================================================================================

# Deliverables: AI Image Prompts

This guide defines the prompt engineering rules for generating consistent, high-quality, and brand-aligned photography using generative AI (e.g., Midjourney, Flux, Stable Diffusion), avoiding the sterile "AI slop" look.

---

## 1. Prompt Construction Flow
Every image prompt must be built systematically using three layers:

```
[Motif / Subject] + [CD Color Integration] + [Photographic Lens / Aesthetic Rules]
```

### Layer 1: The Motif (Subject)
* Clearly describe the main subject and scene composition.
* Focus on authentic, candid human actions or realistic details rather than metaphorical concepts.
* Use active verbs (e.g., "A carpenter sanding a solid oak tabletop in a sunlit workshop").

### Layer 2: CD Colors Integration
* Do not generate random bright colors. Direct the AI to include the brand's primary and neutral tones in the environment or clothing.
* Specify color accents (e.g., "The carpenter wears a dark charcoal apron with subtle primary orange stitching, warm wood tones dominate the background").

### Layer 3: Photographic Lens & Style (Anti-AI Slop)
* To avoid the typical shiny, plastic, hyper-realistic 3D render look, force a vintage or realistic analogue camera aesthetic.
* **Camera / Lens:** Specify real equipment (e.g., "shot on 35mm lens, f/1.8 depth of field").
* **Texture / Grain:** Add noise and organic texture (e.g., "analogue film grain, natural light, dust particles in the air").
* **Depth of Field:** Create separation (e.g., "soft background blur, shallow depth of field").

---

## 2. Default Style Prompt Template
Use this template as a base:

```
[Subject/Action], candid shot, shot on 35mm lens, f/1.8, warm natural side-lighting, organic film grain, soft background blur, color palette incorporating [Primary Color] accents and [Neutral Colors] tones, realistic textures, no plastic skin, authentic atmosphere.
```

---

## 3. Negative Prompts / Verbotene Begriffe
To keep images clean and authentic, avoid or exclude:
- "3D render", "unreal engine", "hyperrealistic", "perfect skin", "smooth plastic".
- Staged stock photo expressions (e.g., direct forced smiles looking at the camera).


================================================================================
FILE: GUIDES/03_EXECUTION/colors.md
================================================================================

# Deliverables: Colors & Design Tokens

This guide defines the color system, token structure, and HSL scale distribution rules.

---

## 1. HSL-Based Scaling Rules
Color scales are defined quantitatively using HSL values, ensuring that steps are mathematically proportional. 

### Primary Scale (300 = Base)
The base brand color is assigned to token `300`. Light and dark steps are scaled by modifying the HSL lightness (L) value in steps of roughly 10%–15%:
* `--color-primary-100`: `hsl(var(--hue), var(--sat), 95%)`  - Light background
* `--color-primary-200`: `hsl(var(--hue), var(--sat), 85%)`  - Borders, soft highlights
* **`--color-primary-300` (Base):** `hsl(var(--hue), var(--sat), 60%)` - Brand primary color
* `--color-primary-400`: `hsl(var(--hue), var(--sat), 45%)`  - Primary hover states, text
* `--color-primary-500`: `hsl(var(--hue), var(--sat), 30%)`  - Dark container backgrounds
* `--color-primary-600`: `hsl(var(--hue), var(--sat), 20%)`  - Dark accents
* `--color-primary-700`: `hsl(var(--hue), var(--sat), 10%)`  - Deep shadows, dark text

### Neutral Scale (Grayscale)
Neutrals use H=0 and S=0% for pure contrast distribution:
* `--color-neutral-100`: `hsl(0, 0%, 97%)` - Pure light background
* `--color-neutral-200`: `hsl(0, 0%, 90%)` - Light UI borders
* `--color-neutral-300`: `hsl(0, 0%, 70%)` - Muted text / borders
* `--color-neutral-400`: `hsl(0, 0%, 50%)` - Muted utility text
* `--color-neutral-500`: `hsl(0, 0%, 30%)` - Dark borders / elements
* `--color-neutral-600`: `hsl(0, 0%, 15%)` - Dark card background
* `--color-neutral-700`: `hsl(0, 0%, 5%)`  - Dark mode page background

---

## 2. Color Harmonies
Use calculated HSL offsets to maintain harmony across secondary and accent colors:
- **Analogous (Harmonious):** Offset base hue by $+30^\circ$ and $-30^\circ$.
- **Split-Complementary (Tension):** Base color + complementary color offset by $+30^\circ$ and $-30^\circ$ (e.g., Hue 220 + 35 + 5).

---

## 3. Contrast Requirements (WCAG)
* **Minimum contrast ratio:** **4.5:1** (WCAG AA) for standard text.
* Check contrast programmatically for all background/foreground combinations using tools like Lighthouse or Axe prior to deployment.

---

## 4. Color as a Distinctive Brand Asset (DBA)
Color is one of the most powerful Distinctive Brand Assets (DBAs):
- **Chrominence & Consistency:** Ensure the primary brand hue (`--color-primary-300`) is prominent and consistent across all pages. Do not let agents introduce arbitrary auxiliary colors (such as default framework blues/indigos or random gradients) that dilute the brand identity.
- **Accented Micro-interactions:** Limit color shifts on interactive states (e.g., hover, focus) to the pre-calculated HSL scale steps (e.g., transitioning from `300` to `400`).

---

## 5. State of the Art 2026 (OKLCH, P3, APCA)
Prefer modern color engineering over legacy HSL where support allows:
- **OKLCH / OKLab working space:** perceptually uniform — equal lightness steps *look* equal, avoiding the washed-out mid-tones HSL produces. Define scales in `oklch(L C H)` for even, predictable ramps.
- **Wide-gamut P3:** richer, more accurate color on modern displays; always keep an sRGB fallback.
- **Modern CSS color:** derive scales and themes from few base values via `color-mix()`, relative color syntax, and `light-dark()` (auto light/dark theming).
- **APCA contrast (WCAG 3 draft):** for perceptually accurate legibility beyond the flat 4.5:1 of WCAG 2 — especially for large/thin type and dark mode. Keep 4.5:1 (WCAG AA) as the hard minimum, use APCA to fine-tune.

```css
:root {
  /* even, perceptual ramp */
  --color-primary-300: oklch(0.62 0.17 264);
  --color-primary-400: oklch(0.52 0.17 264);
}
```


================================================================================
FILE: GUIDES/03_EXECUTION/components.md
================================================================================

# Deliverables: Components & Assets

This guide defines coding standards for reusable components, performance limits for assets, licensing constraints, and state management (skeleton/empty states).

---

## 1. Component Rules & Reuse
* **Component-Zwang:** Code must never be redundant. Extract common patterns (buttons, cards, banners) into modular components.
* **No Magic Numbers:** All margins, paddings, border-radii, and colors must reference HSL/Space tokens.
* **BEM-Lite CSS Class Structure:** 
  - Block: `.card`
  - Element: `.card__title`
  - Modifier: `.card--featured`

---

## 2. Asset Performance Budgets
* **Images:** Must be WebP format. Desktop images < 200KB, mobile images < 100KB. No PNGs or JPGs allowed in production.
* **Videos:** Must be MP4 (H.264). Max 2MB on desktop, 1MB on mobile.
* **Lazy Loading:** Add `loading="lazy"` on all offscreen images (keep it off for LCP hero images).
* **Responsive Images:** Use `<picture>` with `srcset` to match device width.

---

## 3. Allowed Asset Sources
* **Icons:** Must be **Inline SVGs** under open-source licenses (MIT, Apache, ISC).
  - Allowed: Lucide, Heroicons, Phosphor Icons, Tabler Icons, Bootstrap Icons — copied in as inline SVG markup.
  - **Hard rule – no external icons, any host:** loading icons from *any* external source is strictly forbidden — icon CDNs (FontAwesome, Material Icons, Iconify, Boxicons, Remixicon …) and icon-fonts alike, due to GDPR IP-leaks. Enforced by `./check.sh` (blocks deploy).
* **Images:** Must have checked licensing.
  - Allowed: Unsplash, Pexels, Pixabay, Undraw.
  - Forbidden: Adobe Stock, Shutterstock, Getty without active licenses.

---

## 4. UI States (Empty & Loading)
Every dynamic or list component must implement 4 states:
1. **First-Use:** Onboarding guiding text + CTA.
2. **No Results:** Search/Filter empty screen + Reset CTA.
3. **Error:** Load errors + Try Again button.
4. **Cleared:** Content cleared by user + Next Step CTA.

### Skeleton Shimmer Pattern
Always show skeleton screens during loading rather than white flashes. Example skeleton implementation:

```css
.skeleton {
  background: var(--color-neutral-200);
  border-radius: var(--radius-md);
}
@media (prefers-reduced-motion: no-preference) {
  .skeleton {
    background: linear-gradient(
      90deg,
      var(--color-neutral-200) 25%,
      var(--color-neutral-100) 50%,
      var(--color-neutral-200) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s infinite;
  }
}
@keyframes skeleton-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 5. Squircles & Continuous Curvature (G2 Continuity)
Traditional CSS `border-radius` creates a G1-continuous curve (a circular arc meeting a straight line). This causes a sudden jump in curvature, which looks visually sharp and cheap. To match premium aesthetics (Apple's hardware/software design language), implement **G2-continuous curvature (Squircles or Superellipses)**, where the transition is completely organic and smooth.

### Implementation Methods:
1. **Figma Export (Recommended for Icons & Custom Badges):**
   - Design components in Figma using **Corner Smoothing** (set to 60%–100% for iOS-like squircle curves).
   - Export the shapes directly as SVGs to preserve the exact bezier curvature.
2. **CSS Percentage Approximation (For Standard Containers & Cards):**
   - For fluid containers, use percentage-based radii instead of absolute pixels to approximate the superellipse curve:
     ```css
     .card {
       border-radius: var(--radius-squircle); /* 28% */
     }
     .badge {
       border-radius: var(--radius-squircle-sm); /* 20% */
     }
     ```
3. **SVG Clip-Path (For Exact Lamé/Superellipse Curves):**
   - Use inline SVG clip-paths to mask HTML containers mathematically:
     ```css
     .premium-wrapper {
       clip-path: url(#squircle-mask);
     }
     ```

---

## 6. Interaction State Matrix
Every interactive element must design its **full** state set — never leave states to the browser default:
`default` · `hover` · `focus-visible` · `active` · `disabled` · `loading` · `error` · (`selected`).
- **`:focus-visible`** for keyboard focus (visible ring, ≥ 2px, contrast ≥ 3:1); never `outline: none` without a replacement.
- **`@media (hover: hover)`** — only apply hover effects on devices that actually hover (don't confuse touch).
- **`:has()`** enables parent-level state without JS.
- Drive states via data attributes/tokens (`[data-state="loading"]`) for consistency across buttons, inputs, cards.

## 7. Depth & Elevation System
- **One consistent light source** (usually top) — all shadows follow it.
- **Elevation tokens** (`--elevation-1…5`): higher = closer, defined by a **layered, slightly tinted** shadow (not a single neutral drop-shadow) *and* surface contrast.
- **Dark-mode elevation via surface lightness** (higher layers get lighter), not heavier shadows.
- **Glass/blur** (`backdrop-filter`) only as a deliberate layer, sparingly, with a fallback. `z-index` is a documented system, not random `9999`.


================================================================================
FILE: GUIDES/03_EXECUTION/layouting.md
================================================================================

# Deliverables: Layouting & Grids

This guide defines layout patterns, full-width design principles, responsive mobile-first setups, and Bento ratios.

---

## 1. Grid Systems (3-Column & Bento-Grid)
* **3-Column Grid:** Standard desktop layout utilizes a flexible 3-column layout (ideal for grid/card layouts).
* **Full-Width Layout:** Always design edge-to-edge. Avoid rigid, narrow fixed-width content containers.
* **Bento Ratios:** Elements inside a Bento Grid must use standard aspect ratios:
  - **Square (`1:1`):** Ideal for icons, avatars, profile photos, or small detail metrics.
  - **Widescreen (`16:9`):** Ideal for videos, hero backdrops, or wide features.
  - **Portrait (`4:5`):** Ideal for mobile-hero cards or vertical social/content.
  - **Landscape (`3:2`):** Ideal for blog post cards or project thumbnails.

```css
/* Bento aspect-ratios */
.bento-square   { aspect-ratio: 1 / 1; }
.bento-wide     { aspect-ratio: 16 / 9; }
.bento-portrait { aspect-ratio: 4 / 5; }
.bento-card     { aspect-ratio: 3 / 2; }
```

---

## 2. Mobile-First Approach
* Design layouts starting at **375px viewport width** (single column vertical stack).
* Use responsive properties (like flexbox, grid, and CSS variables) to scale smoothly into tablet and desktop formats (3-column layout) without abrupt layout jumps.

```css
/* Mobile-first base */
.grid-3col {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-400);
}

/* Desktop expansion */
@media (min-width: 768px) {
  .grid-3col {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 3. Lesefluss & Visuelle Hierarchie (Reading Flow)
Structure content using proven cognitive and mathematical patterns to guide the eye naturally:
- **Z- & F-Lesemuster:** 
  - **Z-Muster:** Use for visual landing pages. The eye travels: Left-to-Right (Header/Nav) $\rightarrow$ Diagonal Down-Left $\rightarrow$ Right (CTA/Hero Action). Place the primary CTA at the terminals of the Z.
  - **F-Muster:** Use for text-heavy pages (documentation, blogs). Place the most critical information in the first two paragraphs and along the left margin.
- **Der Goldene Schnitt (Golden Ratio):**
  - **Spalten-Proportionen (Asymmetrie):** For split-screen layouts or content-sidebar grids, use the golden ratio approximation of **$62\% \mathbin{/} 38\%$** (CSS `grid-template-columns: 1.618fr 1fr;`) instead of symmetric $50\% \mathbin{/} 50\%$ splits. This creates organic balance and tension.
  - **Text- & Raum-Proportionen:** Apply the golden multiplier ($1.618$) to determine font size steps or spatial relationships to guarantee mathematical harmony.
- **Weißraum (Negative Space):** White space is a functional layout element, not empty space. Use large section padding (e.g., `padding: var(--space-section) 0;`) to prevent cognitive overload and clearly isolate distinct thoughts.
- **Visual Anchor Points:** Guide the eye from large display titles (`h1`/`h2`) down to small details. Never place two adjacent elements of the same visual weight unless they are peers in a grid.

---

## 4. Episodische Touchpoints & Retention-Elemente
To support recurring customer engagement (the episodic lifecycle), structure layout modules that highlight dynamic, timed, or routine content:
- **Seasonal Touchpoint Slots:** Dedicated visual blocks for annual reports, seasonal trade fair/event calendars, or dynamic campaigns.
- **Actionable Routines:** Layout structures for recurring seminar schedules, advisory workshops, or customer newsletter signups.
- **Dynamic Content Modules:** Use flexible grid modules (e.g., Bento boxes) that can be easily updated to show current notices or regulatory changes without breaking the page's structural hierarchy.

---

## 5. State of the Art 2026 (Intrinsic & Fluid Layout)
Move beyond fixed viewport breakpoints toward context-aware, fluid layouts:
- **Container Queries (`@container`):** components respond to *their own container's* width, not the global viewport — true, reusable components that work in any slot.
- **Subgrid:** nested grids align cleanly to the parent track lines (`grid-template-columns: subgrid`) for consistent rhythm across cards/rows.
- **Fluid sizing:** `min()` / `max()` / `clamp()` for widths, gaps and type; `aspect-ratio` instead of padding hacks.
- **Logical properties by default** (`margin-inline`, `padding-block`, `inset`) for i18n/RTL robustness.
- **`:has()`** enables content-driven layout decisions (e.g. a card with a media child lays out differently) without JS.

```css
.card-host { container-type: inline-size; }
@container (min-width: 30rem) {
  .card { grid-template-columns: 1fr 2fr; }
}
```

---

## 6. Spacing System & Whitespace Rhythm
Spacing is a system on three levels — never guessed:

**a) Scale (the allowed values).** The 8pt grid tokens `--space-100 … --space-800` for component-level padding/gaps. Use tokens only, no magic numbers.

**b) Section spacing (fluid).** Vertical rhythm *between* sections uses dedicated fluid tokens (defined in `design-tokens-mini.md`), so sections breathe more on desktop and tighten on mobile — one value, no breakpoint jumps:
```css
section { padding-block: var(--space-section); }        /* 64 → 120px */
.section--hero  { padding-block: var(--space-section-lg); } /* 96 → 176px */
.section--tight { padding-block: var(--space-section-sm); } /* 40 → 64px  */
```

**c) Relational rule (Gestalt — the pro lever).** Space communicates grouping. Space *between* independent groups must be clearly larger than *within* one — target **≈ 2×**. Element→label tight, card→card medium, section→section large. This creates structure **without** divider lines.

**Mechanics:**
- **`gap` for rhythm** (flex *and* grid) — no margin-collapsing, no "last child" special cases. Margins only as an exception, and then one-directional (`margin-block-start`).
- **The Stack primitive** for consistent vertical spacing:
  ```css
  .stack { display: flex; flex-direction: column; gap: var(--space-500); }
  ```
- **Content frame** for side whitespace: cap width, center, fluid gutters; keep body text at a readable measure.
  ```css
  .wrap { max-inline-size: var(--content-max); margin-inline: auto;
          padding-inline: var(--gutter-inline); }
  .prose { max-inline-size: var(--measure); }   /* 45–75 chars */
  ```
- **Logical properties** (`padding-block`, `margin-inline`) for i18n/RTL by default.

**Optics over math:** the grid is the base, not the law — large headlines need more space above than below; the last section before the footer needs extra breathing room. Optical adjustment is the final 10 % that separates senior from mid.


================================================================================
FILE: GUIDES/03_EXECUTION/logo.md
================================================================================

# Deliverables: Logo

This guide defines the design execution and optimization flow for logos.

---

## 1. Form Language (Formsprache)
Establish the geometric base of the logo:
- **Geometry & Alignment:** Align the logo's geometry with the brand's core concept (e.g., sharp brutalist geometry vs. organic rounded shapes).
- **Squircles & Radien:** Ensure the border-radius or clip-path matches the brand's token specifications if using rounded badge shapes (28% Squircle approximation).
- **Responsive Scales:** The logo must be legible and crisp at any width (from a favicon up to a large hero element).

---

## 2. Association
Ensure the visual shapes trigger the desired brand associations:
- **Immediate Concept:** What does the viewer see in the first 2 seconds? Does it represent the core brand?
- **Ambiguity Prevention:** Avoid shapes that could be misinterpreted or carry negative connotations.

---

## 3. Reduction (Minimalism)
Refine the logo down to its bare essentials:
- **Simplicity:** Remove unnecessary lines, shadows, or secondary marks.
- **Silhouette Test:** The logo must remain recognizable even as a solid black or solid white silhouette.
- **Technical Export:** SVG only, optimized, inlineable, with zero absolute pixel constraints inside the markup where possible.

---

## 4. Distinctive Brand Assets (DBA)
The logo is the primary Distinctive Brand Asset (DBA) of the company:
- **Visual Consistency:** Keep the logo mark unchanged across all touchpoints (header, footer, favicons, loading screens).
- **Embedded Representation:** When staging preloader animations or scroll indicators, use abstract components of the logo's geometry to reinforce memory anchors.


================================================================================
FILE: GUIDES/03_EXECUTION/motion_interaction.md
================================================================================

# Deliverables: Motion & Interaction

This guide defines motion principles, scroll-reveal mechanics, interactive hover states, and performance constraints.

---

## 1. Motion Principles
* **Purpose-Driven:** Movement must guide the eye or provide visual feedback. Never animate purely for decoration.
* **Organic Easing:** Standard transitions use a custom cubic-bezier curves mimicking physical momentum rather than linear mechanical speed:
  - Default curve: `cubic-bezier(0.22, 1, 0.36, 1)` (organisch / out-quint)
  - Spring curve: `cubic-bezier(0.34, 1.56, 0.64, 1)` (für Button clicks)

---

## 2. Scroll-Reveal Pattern
All major content elements (headings, cards, grids) should slide or scale smoothly into view as the user scrolls.

### CSS Reveal States
```css
/* Base hidden state */
[data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Revealed state */
[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered load delays for lists */
[data-reveal]:nth-child(1) { transition-delay: 0ms; }
[data-reveal]:nth-child(2) { transition-delay: 80ms; }
[data-reveal]:nth-child(3) { transition-delay: 160ms; }
```

### JavaScript Observer (High Performance)
Do not use standard scroll listeners for animations. Use `IntersectionObserver`:

```js
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target); // Animates once
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  }
);

document.querySelectorAll('[data-reveal]').forEach((el) => {
  revealObserver.observe(el);
});
```

---

## 3. Parallax Hero Background
* Backgrounds move at a slower speed than the page content.
* Always enforce GPU-rendering using `will-change: transform`.
* Ensure a dark/gradient overlay is placed on top of the image to ensure clear contrast for hero text.

---

## 4. UX Verification Checklist
- [ ] Motion is completely disabled if the user prefers reduced motion.
  ```css
  @media (prefers-reduced-motion: reduce) {
    [data-reveal] {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
  ```
- [ ] No animations trigger layout shifts (CLS) that hurt performance scores.
- [ ] Interactive elements (buttons, links) have active press-scaling states (`transform: scale(0.96)`) for immediate physical feedback.

---

## 5. State of the Art 2026 (View Transitions & Scroll-driven)
Modern, GPU-friendly motion without heavy JS:
- **View Transitions API:** animate state/route changes so shared elements move *through* the transition instead of hard-cutting (`document.startViewTransition(...)`; cross-document transitions via `@view-transition`). This is the primary tool for premium page-level continuity.
- **Scroll-driven animations (CSS):** use `animation-timeline: view()` / `scroll()` for reveal and parallax instead of `IntersectionObserver`/scroll listeners where supported — runs off the main thread.
- **Spring / physics easing** as a brand signature curve, shared as a token.
- **Always** guard everything behind `prefers-reduced-motion: reduce` — the signature must still work reduced.

```css
@media (prefers-reduced-motion: no-preference) {
  [data-reveal] {
    animation: reveal linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 30%;
  }
}
```


================================================================================
FILE: GUIDES/03_EXECUTION/tone_of_voice.md
================================================================================

# Deliverables: Tone of Voice & Content

This guide defines the brand's verbal identity, copywriting rules, target address conventions, and behavioral attitudes.

---

## 1. Verbal Identity & Tone
* **Direct & Human:** Avoid corporate buzzwords and marketing filler (e.g., do not use terms like "synergistic", "end-to-end", or "holistic solutions").
* **Active Writing:** Write in active voice. Short sentences, clear propositions.
  - *Do:* "We build websites that win customers."
  - *Don't:* "We develop digital solutions optimized for customer acquisition."
* **Concreteness:** Provide exact facts and timelines instead of vague promises (e.g., "Ready in 14 days" instead of "Quick turnaround").

---

## 2. Customer Address (Anrede)
* Define the default customer address strategy based on the brand's profile:
  - **Duzen (Informal):** Standard for creative, modern service providers, digital agencies, and startup brands. Builds immediate connection.
  - **Siezen (Formal):** Standard for traditional B2B companies, legal, medical, or high-budget financial advisory. Builds professional distance and safety.
* Maintain absolute consistency. Do not mix informal and formal addresses on the same page.

---

## 3. Position against Antagonists
* Define the "antagonist" or pain point the brand fights against.
* Positioning against an industry enemy clarifies the brand's stance:
  - *Example:* Fighting against "overpriced templates" or "agency overhead".
* Explain *how* the brand solves this antagonist's problems (e.g., "No overhead, direct contact with developer").

---

## 4. Behavior, Attitude & Lifestyle
* **Behavior:** How does the brand act during contact? (e.g., transparent pricing, direct WhatsApp channel, no long sales pitches).
* **Attitude:** What does the brand stand for? (e.g., pragmatism, craftsmanship, premium quality).
* **Lifestyle/Identity:** How does the brand fit into the customer's daily life?


================================================================================
FILE: GUIDES/03_EXECUTION/typography.md
================================================================================

# Deliverables: Typography & Scales

This guide defines typography guidelines, font pairing rules, and technical font-loading specifications.

---

## 1. Typography Pairings & Personality
Avoid generic font pairings. Select combinations that reflect the brand's concept:
- **Elegant & Editorial:** Playfair Display + Source Serif 4
- **Warm & Personal:** Fraunces + Lato
- **Modern-Classic:** DM Serif Display + DM Sans
- **Tech & Creative:** Syne + Inter
- **Contemporary:** Clash Display + Cabinet Grotesk
- **Bold Impact:** Bebas Neue + Open Sans
- **Luxury & Premium:** Cormorant Garamond + Jost

---

## 2. Fluid Scale (Desktop & Mobile)
Always use responsive scales via `clamp()` to interpolate sizes smoothly between viewport boundaries:

```css
:root {
  --font-base: 'Inter', system-ui, sans-serif;
  
  --text-xs:   clamp(0.688rem, 1vw,   0.75rem);   /* 11px → 12px */
  --text-sm:   clamp(0.813rem, 1.2vw, 0.875rem);  /* 13px → 14px */
  --text-md:   clamp(0.938rem, 1.5vw, 1rem);      /* 15px → 16px */
  --text-lg:   clamp(1.063rem, 1.8vw, 1.25rem);   /* 17px → 20px */
  --text-xl:   clamp(1.188rem, 2.5vw, 1.5rem);    /* 19px → 24px */
  --text-2xl:  clamp(1.375rem, 3.5vw, 2rem);      /* 22px → 32px */
  --text-3xl:  clamp(1.625rem, 5vw,   2.5rem);    /* 26px → 40px */
  --text-4xl:  clamp(2rem,     7vw,   3.5rem);    /* 32px → 56px */
}
```

---

## 3. Element Mappings & Line-Heights
- **h1:** `font-size: var(--text-4xl); line-height: var(--leading-tight); font-weight: var(--weight-bold);`
- **h2:** `font-size: var(--text-3xl); line-height: var(--leading-tight); font-weight: var(--weight-bold);`
- **h3:** `font-size: var(--text-2xl); line-height: var(--leading-tight); font-weight: var(--weight-bold);`
- **h4:** `font-size: var(--text-xl); line-height: var(--leading-snug); font-weight: var(--weight-medium);`
- **h5:** `font-size: var(--text-lg); line-height: var(--leading-relaxed); font-weight: var(--weight-medium);`
- **h6:** `font-size: var(--text-md); line-height: var(--leading-relaxed); font-weight: var(--weight-bold); text-transform: uppercase;`
- **body_l (Lead):** `font-size: var(--text-lg); line-height: var(--leading-body);`
- **body_m (Standard):** `font-size: var(--text-md); line-height: var(--leading-body);`
- **body_s (Cards/UI):** `font-size: var(--text-sm); line-height: var(--leading-body);`
- **body_xs (Meta/Tags):** `font-size: var(--text-xs); line-height: var(--leading-tight);`

---

## 4. Technical Rules (Self-Hosting)
* **Hard rule – no external fonts, any host:** Loading fonts from *any* external source is **strictly forbidden** — not just Google Fonts, but every provider (Typekit, Bunny, cdnfonts …) and any `@font-face` whose `src` points to an absolute/protocol-relative URL. It leaks user IPs (GDPR) and is enforced by `./check.sh` (blocks deploy).
* **Implementation:** Always download `.woff2` files and define them locally with a relative path:

```css
@font-face {
  font-family: 'Space Grotesk';
  src: url('/fonts/space-grotesk-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

---

## 5. Typography as a Distinctive Brand Asset (DBA)
The pairing of display and body fonts serves as a primary visual signature of the brand:
- **Consistent Hierarchy:** Do not let agents substitute custom display fonts with generic system fallbacks or default web fonts. If the brand has a bold, charakterstarker display font, protect it across all titles.
- **Font Availability:** Preload the main variable font files (e.g., in `.woff2` format) to ensure zero visual layout shift (CLS) during page loading.

---

## 6. State of the Art 2026 (Rhythm & Modern Type)
Separate professional typesetting from amateur sizing:
- **Variable fonts:** ship one self-hosted `.woff2` with weight and optical-size (`opsz`) axes instead of many static cuts — lighter payload, finer control. Never faux-bold/italic; use real axes/cuts.
- **Measure 45–75 characters** per line for body copy (`max-width: 65ch`); readability drops sharply beyond that.
- **Modular scale:** derive sizes from one ratio (e.g. 1.25) rather than arbitrary values (aligns with the golden-ratio rule in `layouting.md`).
- **`text-wrap: balance`** for headlines (even line lengths), **`text-wrap: pretty`** for body (no orphans/runts).
- **Logical properties & `lang`** awareness (`margin-inline`, `padding-block`) so type holds up for longer languages and RTL.

```css
.body-copy { max-width: 65ch; text-wrap: pretty; }
h1, h2     { text-wrap: balance; }
```


================================================================================
FILE: GUIDES/03_EXECUTION/technical/automation.md
================================================================================

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


================================================================================
FILE: GUIDES/03_EXECUTION/technical/deployment.md
================================================================================

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


================================================================================
FILE: GUIDES/03_EXECUTION/technical/dsgvo_best_practices.md
================================================================================

# Technical: GDPR / DSGVO Best Practices (Implementation)

Complements `legal.md` (required legal pages) with the **technical implementation**: how to *build* a privacy-compliant site. Stand 2026. **Not legal advice** — consult a lawyer for commercial projects.

> **The 10 hard rules**
> 1. Privacy by Design & Default (Art. 25) — privacy is the preset, not an opt-in.
> 2. Data minimization — collect only what you truly need.
> 3. Self-host everything (fonts, icons, scripts) — no third-party request before consent.
> 4. Consent is opt-in: freely given, granular, revocable, documented — "Reject" as easy as "Accept".
> 5. TDDDG §25: consent for *any* access to the device (cookies *and* localStorage) unless strictly necessary.
> 6. Load third-party scripts/embeds only *after* consent (blocking by default).
> 7. TLS/HTTPS everywhere (Art. 32); anonymize IPs in logs, short retention.
> 8. DPA (AVV) with every processor; US transfers only via DPF certification or SCCs.
> 9. Make data-subject rights actionable (access, erasure, portability).
> 10. Data breach → notify within 72h (Art. 33).

---

## 1. Privacy by Design & Default (Art. 25)
- Privacy is the **default state**, not something the user must enable.
- Before any feature ask: *do I really need this data?* If no → don't collect it.
- No tracking, no third-party, no non-essential cookie without active consent.

## 2. Data Minimization (Art. 5)
- Contact form: name, email, message only. No mandatory phone "just in case".
- No hidden fields collecting more than needed.
- Server logs: only what's needed for operation/security, with a short deletion window.

## 3. Self-host everything (no third-party without consent)
The most common GDPR breach on websites: external requests that silently send the user's IP to third-party (often US) servers.

| Resource | Correct |
|---|---|
| Fonts | **Self-hosted WOFF2** (`@font-face`), never a font CDN — enforced by `check.sh` |
| Icons | **Inline SVG**, never an icon CDN/icon-font — enforced by `check.sh` |
| CSS/JS libraries | **bundled locally**, never jsDelivr/unpkg/cdnjs in `<head>` |
| Analytics | cookieless & EU-hosted (see §7) |

## 4. Getting consent right
Valid consent under GDPR/TDDDG is **freely given, specific, informed, unambiguous** and must be:
- **Opt-in** — nothing pre-ticked, no "continued use = consent".
- **Equally rejectable** — "Essential only" as prominent as "Accept all" (no dark patterns, no greyed-out reject button).
- **Granular** — separable by purpose (analytics / marketing / embeds).
- **Revocable anytime** — a persistent "Cookie settings" link in the footer.
- **Documented** — store timestamp + scope of the consent as proof.

> Note: the basic banner in `legal.md` must be extended to satisfy these — equal-weight buttons, granular toggles, and a revoke link.

## 5. Load third-party only after consent (blocking by default)
Scripts that send data to third parties must not execute before consent. Pattern: neutralize the script, activate on consent.

```html
<!-- NOT executed until consent is granted -->
<script type="text/plain" data-consent="analytics" src="/js/analytics.js"></script>
```

```js
function activateConsented(category) {
  document.querySelectorAll(`script[type="text/plain"][data-consent="${category}"]`)
    .forEach(old => {
      const s = document.createElement('script');
      if (old.src) s.src = old.src; else s.textContent = old.textContent;
      document.head.appendChild(s);
    });
}
```

## 6. Embeds: click-to-load
YouTube, Google Maps, Instagram etc. track on load. Use a placeholder; load the real embed on click (after consent).
- YouTube: use `youtube-nocookie.com` — **and still** consent-gate it.
- Maps: static placeholder + "Load map" button; or OpenStreetMap (self-hosted tiles, no tracking).

## 7. Analytics — privacy-first

| Option | GDPR status |
|---|---|
| **Plausible / Fathom** (EU-hosted, cookieless) | ✅ often without consent |
| **Matomo self-hosted** (IP anonymization, cookieless mode) | ✅ often without consent |
| **GA4** | ⚠️ only after consent + Consent Mode v2; US transfer via DPF |
| Server-log analysis | ✅ if IP anonymized |

- Always anonymize IP (truncate last octet/segment).
- Respect **Do Not Track / Global Privacy Control (GPC)**.

## 8. Hosting, processing & transfers
- Prefer **EU/EEA hosting**.
- **DPA / AVV (Art. 28)** with *every* processor: hosting, CRM, mail, CDN, form backend.
- **US services** only if the provider is **EU-US Data Privacy Framework (DPF)**-certified, or with Standard Contractual Clauses (SCCs) + a Transfer Impact Assessment.
- Maintain a record of processing activities (Art. 30).

## 9. Security & data-subject rights
- **Force TLS/HTTPS** (HSTS), modern security headers (→ `security.md`, CSP).
- Operationalize **data-subject rights**: access (Art. 15), erasure (Art. 17), portability (Art. 20), objection (Art. 21) — a clear contact path + internal process.
- **Data breach**: notify the supervisory authority within **72h** (Art. 33); affected users on high risk.

---

## GDPR Go-Live Checklist (technical)
- [ ] No external requests in the network tab before consent (fonts/icons/scripts self-hosted)
- [ ] Consent banner: opt-in, granular, "Reject" equal-weight, revoke link in footer
- [ ] Third-party scripts `type="text/plain"` + consent activation (blocking by default)
- [ ] Embeds as click-to-load (YouTube-nocookie, Maps placeholder)
- [ ] Analytics cookieless/EU **or** consent-gated; IP anonymized; GPC/DNT respected
- [ ] Contact form: TLS, purpose-bound consent checkbox, honeypot, deletion window
- [ ] TLS/HSTS active, security headers set
- [ ] All services named in the Privacy Policy (→ `legal.md`)
- [ ] DPA with all processors; US transfers via DPF/SCC clarified
- [ ] `./check.sh` GDPR checks green

> Related: `legal.md` (required pages) · `security.md` (CSP/headers) · `forms.md`.

---

*GDPR Best Practices – Stand 2026. Not legal advice; consult a lawyer for commercial projects.*


================================================================================
FILE: GUIDES/03_EXECUTION/technical/forms.md
================================================================================

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

---

## 5. State of the Art 2026 (Validation & Autofill)
- **Native constraint validation** + **`:user-invalid` / `:user-valid`:** show errors only *after* the user has interacted (on blur/submit), never red on first render.
- **Errors at the field**, concrete and solution-oriented, wired via `aria-describedby`; status via `aria-live="polite"`.
- **Forgiving input:** tolerate formatting (spaces in phone/IBAN) instead of rejecting it.
- **Autofill & mobile:** correct `autocomplete="…"` tokens, `inputmode`, and input `type`s; support **passkeys** and `autocomplete="one-time-code"` to cut friction.
- **Newsletter:** double opt-in.

```css
input:user-invalid { border-color: var(--color-error, #9c4a48); }
input:user-valid   { border-color: var(--color-success, #546e58); }
```


================================================================================
FILE: GUIDES/03_EXECUTION/technical/legal.md
================================================================================

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


================================================================================
FILE: GUIDES/03_EXECUTION/technical/qa_testing.md
================================================================================

# Technical: QA & Testing Checklist

This guide defines the Quality Assurance (QA) workflow and testing criteria before going live.

---

## 1. Performance Testing (Lighthouse)
* **Target:** Minimum performance score of **80** (target 90+).
* **Checks:**
  - Asset optimization: Verify WebP compression, lazy loading, and dimension definitions.
  - Render Blocking: Check that CSS is optimized and critical, and JS is deferred.
  - Layout Shifts: Minimize Cumulative Layout Shift (CLS) during load.

---

## 2. Accessibility Testing (WCAG 2.2 AA)
* **Contrast:** Ensure text-to-background contrast ratio is at least 4.5:1.
* **Keyboard Navigation:** Verify that all interactive elements can be focused and triggered using only the keyboard. Focus styles must be visible.
* **Semantic Structure:** Verify screen-reader compatibility (appropriate ARIA attributes, semantic landmarks like `<header>`, `<main>`, `<footer>`).

---

## 3. Compatibility & Responsiveness
* **Cross-Browser:** Validate page layouts in Google Chrome, Safari, and Firefox.
* **Cross-Device:** Test layouts on desktop viewports down to 320px mobile screens. Verify there is no horizontal scroll overflow.

---

## 4. Launch QA Checklist
- [ ] No debugger or `console.log` statements in production files.
- [ ] All images have descriptive `alt` tags.
- [ ] Every form input is associated with a semantic `<label>`.
- [ ] OpenGraph image and metadata verified.
- [ ] Broken link audit complete.


================================================================================
FILE: GUIDES/03_EXECUTION/technical/security.md
================================================================================

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


================================================================================
FILE: GUIDES/03_EXECUTION/technical/seo.md
================================================================================

# Technical: SEO Best Practices

This guide defines the search engine optimization criteria focusing on Generative Search Engines (AI), search intent, and technical speed.

---

## 1. Generative Search Optimization (GEO / ASO)
As search engines transition into AI-driven answers (SGE / AI Overviews), optimize for AI crawlers:
- **Answer Engine Optimization (AEO):** Structure content with concise, direct answers to common questions so they can be easily extracted as quotes by AI models (e.g. Google Gemini, OpenAI Search).
- **Structured Data (JSON-LD):** Fully implement Schema.org microdata (e.g., Organization, ProfessionalService, FAQ, Product) to mark the site as a verified source.
- **Citations & Brand Authority:** Real, authoritative mentions across digital publications are highly valued by AI indexers.

---

## 2. E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
Search engines prioritize authentic human experience over generic AI-generated text:
- **First-Hand Experience:** Show real project photos, detailed case studies, and unique video content.
- **Transparency:** Provide clearly accessible legal links (Impressum, Privacy Policy) and clear contact details to act as trust signals.

---

## 3. Technical Core Web Vitals
Speed and responsiveness are direct ranking factors:
- **Interaction to Next Paint (INP):** Keep interaction delays under **200ms**.
- **Mobile-First Indexing:** Layouts must load flawlessly on mobile viewports.
- **Accessibility (WCAG):** Proper contrast ratios and semantic HTML are valued as positive search signals.

---

## 4. Semantic Content Optimization
- **Topic Clusters:** Cover entire subject domains thoroughly instead of targeting single keyword variations.
- **Conversational Queries:** Align copywriting with natural speech patterns (e.g., questions users ask voice search assistants).
- **Visual SEO:** Always add descriptive `alt` tags (max 125 characters) to WebP/AVIF images.

---

## 5. Go-Live Checklist
- [ ] Canonical tags implemented on all pages.
- [ ] JSON-LD schema (Organization/Service) embedded.
- [ ] Exactly one semantic `h1` per page containing the primary keyword.
- [ ] All images have descriptive `alt` tags.
- [ ] OpenGraph metadata tags fully populated.
- [ ] Sitemap.xml and robots.txt configured in the root directory.


================================================================================
FILE: GUIDES/EXTENDED/ACCESSIBILITY_TESTING.md
================================================================================

# Accessibility Testing Checklist (WCAG 2.1 AA)

---

## Automatische Tests (Tools)

### Browser Extensions
1. **axe DevTools**
   - Chrome/Firefox Extension
   - Scannt für a11y Issues
   - Gibt Severity & Fix-Vorschläge

2. **WAVE**
   - Wave.webaim.org
   - Visuelle a11y Fehler markieren

3. **Lighthouse**
   - Chrome DevTools → Lighthouse Tab
   - Accessibility Score ≥ 90

### Automatische Test Tools
- Axe Accessibility Checker
- Lighthouse CI (GitHub Actions)
- Jest Accessibility Plugin

---

## Manuelle Tests (Checkliste)

### 1. Keyboard Navigation
- [ ] Alle interactive Elemente mit TAB erreichbar?
- [ ] Tab-Order logisch (links→rechts, oben→unten)?
- [ ] Focus-Indicator sichtbar?
- [ ] Keine "keyboard trap" (kommt nicht raus)?
- [ ] Links mit Enter aktivierbar?
- [ ] Buttons mit Space & Enter aktivierbar?

**Test:**
```bash
# Mit nur Tastatur navigieren
TAB → Alle Buttons/Links erreichen
Shift+TAB → Rückwärts navigieren
Enter → Aktivieren
Space → Checkboxes, Buttons
Escape → Modals schließen
```

### 2. Screen Reader Testing

**Tools:**
- NVDA (Windows kostenlos)
- JAWS (Windows, kostenpflichtig)
- VoiceOver (Mac, kostenlos)

**Test Prozess:**
1. Screen Reader starten
2. Website durchnavigieren (ohne sehen!)
3. Alle Inhalte verständlich?
4. Links beschreibend? (nicht "klick hier")
5. Alt-Texte sinnvoll?
6. Form Labels vorhanden?

**Checkliste:**
- [ ] Alle Inhalte werden vorgelesen?
- [ ] Links sind distinguishable?
- [ ] Form Labels vorhanden?
- [ ] Alt-Texte aussagekräftig?
- [ ] Headings Struktur OK?

### 3. Kontrast Check

```
Erforderlich:
- Normal Text: 4.5:1
- Large Text (18px+): 3:1
- UI Components: 3:1
```

**Tools:**
- Color Contrast Analyzer
- WebAIM Contrast Checker
- Chrome DevTools (Inspector → Computed Styles)

**Test:**
```css
/* Prüfe diese Kombinationen: */
Text Color #333 on Background #fff = 12.6:1 ✅
Text Color #666 on Background #fff = 4.5:1 ✅
Text Color #999 on Background #fff = 2.9:1 ❌
```

### 4. Zoom & Responsive

- [ ] Website 200% zoom-bar? (große User)
- [ ] Responsive < 320px? (small phones)
- [ ] Text wrapping OK bei zoom?
- [ ] Keine horizontal scroll bei zoom?

**Test:**
```
Browser Zoom: Ctrl+Plus (mehrmals)
Prüfe: Text lesbar, Layout OK, nichts überlappt
```

### 5. Color Blindness

- [ ] Info nicht NUR über Farbe? (auch Icon/Text)
- [ ] Charts: Kontrast, nicht nur Farbe unterscheidbar
- [ ] Links nicht nur blau (auch underline, etc.)

**Tools:**
- Chrome Extension: "Color Blindness Simulator"
- Testen mit: Deuteranopia, Protanopia, Tritanopia

### 6. Focus Styles

```css
/* Muss sichtbar sein! */
:focus {
  outline: 2px solid #007bff;  /* Blauer Outline */
  outline-offset: 2px;
}

/* NICHT: */
:focus {
  outline: none;  /* ❌ FALSCH! */
}
```

- [ ] Focus-Indicator mindestens 2px?
- [ ] Kontrast ≥ 3:1 zu Hintergrund?
- [ ] Deutlich sichtbar, nicht dünn?

### 7. Forms & Error Messages

- [ ] Labels für alle Inputs?
- [ ] Error Messages klar?
- [ ] Error Farbe + Text (nicht nur rot)?
- [ ] Required Fields markiert?
- [ ] Placeholder NICHT statt Label?

```html
<!-- ✅ Richtig -->
<label for="email">Email</label>
<input id="email" type="email" required>

<!-- ❌ Falsch -->
<input placeholder="Email">
```

### 8. Headings Struktur

- [ ] H1 genau 1x pro Seite?
- [ ] Headings nicht übersprungen? (H1 → H2 → H3, nicht H1 → H3)
- [ ] Headings beschreibend?

```html
<!-- ✅ Richtig -->
<h1>Unsere Services</h1>
  <h2>Web Design</h2>
  <h2>Development</h2>
    <h3>Frontend</h3>
    <h3>Backend</h3>

<!-- ❌ Falsch -->
<h1>Title</h1>
<h3>Subheading</h3> <!-- Übersprungen H2! -->
```

### 9. Images & Alt Text

- [ ] Alle Bilder haben alt-Attribute?
- [ ] Alt-Text beschreibend (nicht "image.jpg")?
- [ ] Decorative Images: alt=""?
- [ ] Complex Images: Longdesc oder caption?

```html
<!-- ✅ Richtig -->
<img src="chart.png" alt="Sales trend 2025: +25% growth">

<!-- ❌ Falsch -->
<img src="chart.png" alt="chart">
```

### 10. Links

- [ ] Link Text aussagekräftig? (nicht "click here")
- [ ] Links unterscheidbar von normal text?
- [ ] External Links markiert? (Icon oder Text)
- [ ] Links mit Enter + nicht nur onclick?

```html
<!-- ✅ Richtig -->
<a href="/about">Über uns</a>

<!-- ❌ Falsch -->
<a href="/about">Klick hier</a>
```

---

## WCAG 2.1 AA Kritische Punkte

| Kriterium | Requirement |
|-----------|------------|
| 1.1.1 Text Alternatives | Alt-Texte auf Bildern |
| 1.4.3 Contrast | 4.5:1 für Normal Text |
| 2.1.1 Keyboard | Alle Features mit Tastatur erreichbar |
| 2.4.3 Focus Order | Logische Tab-Order |
| 2.4.7 Focus Visible | Focus-Indicator sichtbar |
| 3.3.1 Error Identification | Error Messages klar |
| 4.1.2 Name, Role, Value | ARIA korrekt |

---

## Automatisierte Testing Integration

### GitHub Actions (CI/CD)
```yaml
name: a11y Test
on: [push]
jobs:
  axe:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test:a11y  # Custom script
```

### Package.json
```json
{
  "scripts": {
    "test:a11y": "axe http://localhost:3000"
  }
}
```

---

## Vor Deploy Checklist

- [ ] Lighthouse Accessibility Score ≥ 90
- [ ] axe DevTools: Keine Critical Issues
- [ ] Keyboard Navigation getestet
- [ ] Kontrast ≥ 4.5:1 überall
- [ ] Focus-Indicators sichtbar
- [ ] Alt-Texte vorhanden & aussagekräftig
- [ ] Heading Struktur OK
- [ ] Form Labels vorhanden
- [ ] Screen Reader (NVDA/VoiceOver) getestet

---

*Accessibility Testing – Stand Mai 2026*


================================================================================
FILE: GUIDES/EXTENDED/ANALYTICS.md
================================================================================

# Analytics & Tracking (Google Analytics, Events, GDPR)

---

## Google Analytics Setup

### GA4 Script
```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Ersetze `G-XXXXXXXXXX` mit deiner GA4 Property ID**

### Im CD-Manual dokumentieren
```
- Kategorie: Analytics
- GA4 Property ID: G-XXXXXXXXXX
- Domain: example.com
- Users eingebunden?
- Events tracking aktiviert?
```

---

## Event Tracking

### Page Views (automatisch)
GA4 trackt automatisch alle Page Views

### Custom Events
```javascript
// Tracking Button Click
document.getElementById('cta-button').addEventListener('click', () => {
  gtag('event', 'click_cta', {
    'button_name': 'Schedule Demo'
  });
});

// Tracking Form Submit
document.getElementById('contact-form').addEventListener('submit', () => {
  gtag('event', 'contact_form_submit', {
    'form_name': 'Contact'
  });
});

// Tracking Video Play
videoElement.addEventListener('play', () => {
  gtag('event', 'video_play', {
    'video_title': 'Product Demo'
  });
});
```

### Wichtige Events tracken
- CTA Clicks (Calls-to-Action)
- Form Submissions
- Video Plays
- File Downloads
- External Links
- Scroll Depth (wie weit User scrollt)

---

## GDPR & Privacy Compliance

### Consent Banner (erforderlich in EU)
```html
<div id="consent-banner">
  <p>Wir nutzen Cookies für Analytics. <a href="/privacy">Datenschutz</a></p>
  <button id="consent-accept">Akzeptieren</button>
  <button id="consent-reject">Ablehnen</button>
</div>

<script>
document.getElementById('consent-accept').addEventListener('click', () => {
  localStorage.setItem('consent', 'accepted');
  // Google Analytics laden
  loadGoogleAnalytics();
});

document.getElementById('consent-reject').addEventListener('click', () => {
  localStorage.setItem('consent', 'rejected');
  // Google Analytics NICHT laden
});

// Beim Laden checken
if (localStorage.getItem('consent') === 'accepted') {
  loadGoogleAnalytics();
}
</script>
```

### Datenschutzerklärung
- Welche Daten tracken wir?
- Warum tracken wir?
- Wie lange speichern wir?
- Wie können User opt-out?
- Link zur Datenschutz-Seite in Footer!

### Google Analytics Datenschutz Einstellungen
```
Settings → Admin → Data Settings
✅ Enable data-driven attribution
✅ Create audiences based on analytics data
✅ Data retention: 14 months (default)
```

---

## User Privacy Settings

### Do-Not-Track Header
```javascript
if (navigator.doNotTrack === '1') {
  // User hat "Do Not Track" aktiviert
  // Analytics NICHT laden
} else {
  loadGoogleAnalytics();
}
```

### Opt-Out Link
```html
<a href="javascript:gtag('consent', 'update', {'analytics_storage': 'denied'});">
  Analytics Opt-Out
</a>
```

---

## Data Anonymization

### Anonymize IPs
```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'anonymize_ip': true  // Anonymisiert User-IPs
});
```

### Exclude Own Traffic
```
Settings → Admin → Data Filters
Create Filter:
- Filter Type: Exclude
- Include/Exclude: Exclude
- Filter Field: IP Address
- Filter Value: 192.168.1.1  // Deine IP
```

---

## Tracking Best Practices

**Checkliste:**
- [ ] GA4 installiert & funktioniert?
- [ ] Consent Banner vorhanden?
- [ ] Wichtige Events getrackt?
- [ ] Datenschutzerklärung aktuell?
- [ ] Do-Not-Track unterstützt?
- [ ] IPs anonymisiert?
- [ ] Eigener Traffic ausgeschlossen?
- [ ] GDPR kompatibel?

**Was NICHT tracken:**
- ❌ Passwörter
- ❌ Payment Info
- ❌ Personal Data (ohne Consent)
- ❌ Sensitive Health Info

---

## Analytics Reports

### Wichtige Metriken
1. **Users** – Wieviele Besucher?
2. **Sessions** – Wie viele Sitzungen?
3. **Bounce Rate** – Wieviele verlassen sofort?
4. **Pages/Session** – Durchschnitt Seiten pro Besuch
5. **Avg Duration** – Wie lange bleiben sie?
6. **Conversions** – Wie viele konvertieren? (CTA Click, Form Submit, etc.)

### Conversion Tracking
```javascript
gtag('event', 'purchase', {
  'value': 99.99,
  'currency': 'EUR',
  'transaction_id': '12345'
});
```

---

## Monitoring & Alerts

**Regelmäßig prüfen:**
- [ ] Ist GA4 noch aktiv?
- [ ] Tracken wir noch Daten?
- [ ] Keine unerwarteten Ausfälle?

**Alerts setzen:**
```
Analytics → Admin → Custom Alerts
Alert Name: Traffic Drop Alert
Condition: Sessions decrease by 50%
Notification: Email
```

---

*Analytics & Tracking – Stand Mai 2026*


================================================================================
FILE: GUIDES/EXTENDED/API_INTEGRATION.md
================================================================================

# API Integration & External Services

---

## Übersicht

Wenn externe APIs/Services integriert werden (Payment, CRM, Analytics, etc.)

---

## Best Practices

### 1. API Keys Sicherheit
```javascript
// ❌ FALSCH
const API_KEY = "sk_live_xyz123";

// ✅ RICHTIG
const API_KEY = process.env.API_KEY;  // Aus .env
```

**Regeln:**
- API Keys NIEMALS im Code hardcoden
- `.env` Datei nutzen (nicht ins Git!)
- `.env.example` zeigt nötige Keys (ohne Werte)
- Production Keys ≠ Development Keys

### 2. Rate Limiting
```javascript
// Mit Verzögerung arbeiten
async function callAPI(endpoint, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${API_KEY}` }
      });
    } catch (error) {
      if (i < retries - 1) {
        await sleep(1000 * (i + 1)); // Exponential backoff
      }
    }
  }
}
```

### 3. Error Handling
```javascript
try {
  const response = await fetch(apiURL);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return await response.json();
} catch (error) {
  console.error("API Call failed:", error);
  // Fallback/Error UI zeigen
}
```

### 4. CORS (Cross-Origin)
```javascript
// Wenn externe API mit CORS Problem
fetch(externalAPI, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  mode: 'cors'  // Erlaubt Cross-Origin
})
```

---

## Payment Integration (Stripe, Paypal)

### Stripe Example
```html
<!-- Stripe Script laden -->
<script src="https://js.stripe.com/v3/"></script>

<script>
const stripe = Stripe(process.env.STRIPE_PUBLIC_KEY);
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

// Payment verarbeiten
async function processPayment() {
  const { paymentIntent } = await stripe.confirmCardPayment(
    clientSecret,
    { payment_method: { card: cardElement } }
  );
}
</script>
```

### Was dokumentieren:
- [ ] Welche Payment-Provider?
- [ ] Public vs. Secret Key getrennt?
- [ ] Error Handling?
- [ ] Test Mode vs. Live Mode?
- [ ] Webhooks konfiguriert?

---

## CRM Integration

Siehe: `KONTAKTFORMULAR.md`

---

## Analytics Integration

Siehe: `ANALYTICS.md`

---

## Third-Party Scripts

**Wenn externe Scripts eingebunden werden:**

```html
<!-- ✅ Richtig: Asynchron laden, nicht blocking -->
<script async src="https://external.js"></script>

<!-- ❌ Falsch: Blocking, verlangsamt Seitenload -->
<script src="https://external.js"></script>
```

**Checkliste:**
- [ ] Script asynchron laden (async/defer)?
- [ ] Keine Sicherheitsrisiken (CSP kompatibel)?
- [ ] Performance Impact gemessen?
- [ ] Error Handling falls Script down?

---

## CORS & CSP Headers

### Content Security Policy (CSP)
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://js.stripe.com https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' https:;
  font-src 'self' https://fonts.googleapis.com;
">
```

**Externe APIs checken:**
- [ ] Domain im CSP whitelist?
- [ ] Subdomains erlaubt?
- [ ] Fallback falls API down?

---

## Webhook Handling

Wenn API Webhooks sendet (z.B. Payment Confirmation):

```javascript
// Express Example
app.post('/webhooks/stripe', (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Event verarbeiten
    if (event.type === 'payment_intent.succeeded') {
      handlePaymentSuccess(event.data.object);
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).send('Webhook error');
  }
});
```

---

## Integration Checklist

- [ ] API Key sicher in .env?
- [ ] Rate Limiting implementiert?
- [ ] Error Handling vorhanden?
- [ ] Timeout gesetzt (nicht unendlich warten)?
- [ ] CORS/CSP konfiguriert?
- [ ] Fallback falls API down?
- [ ] Webhooks getestet (falls relevant)?
- [ ] Dokumentiert im CD-Manual?
- [ ] Monitoring/Alerts eingebaut?

---

*API Integration – Stand Mai 2026*


================================================================================
FILE: GUIDES/EXTENDED/BROWSER_SUPPORT.md
================================================================================

# Browser Support & Compatibility

---

## Support Matrix

### Desktop Browser (Standard Support)
```
Chrome    ≥ 90 (current + -1)
Firefox   ≥ 88 (current + -1)
Safari    ≥ 14 (current + -1)
Edge      ≥ 90 (current + -1)
```

### Mobile Browser (Standard Support)
```
Chrome Mobile    ≥ 90
Safari iOS       ≥ 14
Samsung Internet ≥ 14
Firefox Mobile   ≥ 88
```

### Legacy Browser (Kein Support)
```
❌ Internet Explorer (alle Versionen)
❌ Opera < 75
❌ Safari < 12
❌ Chrome < 90
```

---

## Polyfills & Fallbacks

### Wenn alte Browser unterstützt werden müssen:

```html
<!-- CSS Fallbacks -->
<style>
  /* Fallback für Grid */
  .container { display: flex; }
  @supports (display: grid) {
    .container { display: grid; }
  }
</style>

<!-- JS Polyfills -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
```

### Zu vermeiden (nicht browserkompatibel)
- ❌ CSS Grid ohne Fallback (für alte Browser)
- ❌ Flexbox ohne Prefix
- ❌ ES6+ ohne Transpiler
- ❌ CSS Variables ohne Fallback

---

## Testing für Kompatibilität

**Tools:**
- BrowserStack (Cloud)
- Local: Chrome DevTools (Device Emulation)
- caniuse.com (Feature Check)

**Vor Deploy checken:**
- [ ] Chrome Desktop & Mobile OK?
- [ ] Firefox Desktop & Mobile OK?
- [ ] Safari Desktop & Mobile OK?
- [ ] Edge OK?
- [ ] Keine JS-Fehler in Console?
- [ ] Responsive auf allen Geräten?

---

## CSS Prefix Policy

**Moderne Browser brauchen kein Prefix mehr:**

```css
/* ❌ Nicht nötig (2026) */
-webkit-transform: rotate(45deg);
-moz-transform: rotate(45deg);
transform: rotate(45deg);

/* ✅ Ausreichend */
transform: rotate(45deg);
```

**Ausnahmen:**
- Older iOS Safari (≤ 12): `-webkit-` Prefix noch nötig
- Wenn Support für alte Browser: Prefix tools wie Autoprefixer nutzen

---

## Responsive Design für alle Browser

```css
/* Mobile-First (alle Browser) */
.container {
  display: grid;
  grid-template-columns: 1fr;
}

/* Desktop */
@media (min-width: 768px) {
  .container {
    grid-template-columns: 1fr 1fr;
  }
}
```

---

## Dokumentation

**Im CD-Manual dokumentieren:**
- Min. Browser Versions
- Polyfills/Fallbacks
- Feature-Kompatibilität

---

*Browser Support – Stand Mai 2026*


================================================================================
FILE: GUIDES/EXTENDED/BUILD_PROCESS.md
================================================================================

# Build Process & Bundling

---

## Übersicht

Wie Quellcode (src/) zu Production-Code (public/) wird.

---

## Build Tools

### Moderne Build Tools (2026)
1. **Vite** (Modern, Fast) – empfohlen
2. **Webpack** (Traditionell, Flexibel)
3. **Parcel** (Zero-Config)
4. **esbuild** (Super-Schnell)

### Setup im package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

---

## Build Prozess (mit Vite)

```bash
npm run dev      # Development (mit Hot Reload)
npm run build    # Production (minified)
npm run preview  # Preview des Builds
```

### Development Mode
```
src/
├── App.tsx      (nicht minified)
├── styles/
└── components/

→ http://localhost:5173 (mit Auto-Reload)
```

### Production Build
```
src/ → npm run build → public/
dist/
├── index.html   (minified, Assets verlinkt)
├── js/
│   └── index-ABC123.js  (minified, hash)
├── css/
│   └── style-DEF456.css (minified, hash)
└── assets/
    └── image.webp
```

**Was passiert:**
- JavaScript minified & bundled
- CSS minified & bundled
- Assets optimiert & gehashed
- Source Maps erstellt (für Debugging)

---

## Optimization Flags

### CSS Minification
```javascript
// vite.config.js
export default {
  build: {
    minify: 'terser',  // JS Minifier
    cssMinify: true    // CSS Minifier
  }
}
```

### Tree Shaking (Unbenutzer Code entfernen)
```javascript
// Nur benutzte Funktionen bundeln
import { usedFunction } from './utils';  // ✅ Wird bundelt
// unusedFunction wird entfernt
```

### Code Splitting (Separate Bundles)
```javascript
// Dynamic Import
const modal = await import('./modal.js');  // Separat geladen
```

---

## Bundle Analysis

### Welche Libs größer sind?

```bash
npm install webpack-bundle-analyzer --save-dev
```

### Bundle Size reduzieren

**Checkliste:**
- [ ] Tree Shaking aktiv?
- [ ] Lazy Loading für große Components?
- [ ] Polyfills minimal?
- [ ] Minimale Dependencies?
- [ ] CSS nicht dupliziert?

**Tools:**
- Bundlephobia (Lib-Größe checken)
- Webpack Bundle Analyzer
- Lighthouse (Bundle Size Check)

---

## Pre-Deploy Build Checklist

Vor jedem Deploy:

```bash
npm run lint      # Code-Qualität
npm run test      # Unit Tests
npm run build     # Production Build
npm run preview   # Test Build lokal
```

**Checks:**
- [ ] Build erfolgreich (0 Errors)?
- [ ] No warnings/deprecated code?
- [ ] CSS/JS minified?
- [ ] Source Maps erstellt?
- [ ] Assets optimiert?
- [ ] Bundle Size OK? (< 500KB JS ideal)

---

## CI/CD Build Pipeline (GitHub Actions)

```yaml
name: Build & Deploy

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm install
      - run: npm run lint
      - run: npm run test
      - run: npm run build

      - name: Deploy
        if: github.ref == 'refs/heads/main'
        run: ./deploy.sh
```

---

## Build Artefakte

Nach `npm run build`:

```
dist/
├── index.html           (Entry Point)
├── js/
│   ├── index-HASH.js   (Minified, Hashed)
│   └── vendor-HASH.js  (Vendor libs)
├── css/
│   └── style-HASH.css  (Minified, Hashed)
└── assets/
    ├── image.webp
    ├── icon.svg
    └── fonts/
```

**Was zu deployen:**
- ✅ Alles im dist/ Ordner
- ❌ node_modules/ (nicht deployen!)
- ❌ src/ (nicht deployen!)

---

## Versioning mit Hash

```
index-ABC123.js  ← Hash ändert sich bei Änderungen
index-DEF456.js  ← Neue Version

Browsers können alte Version cachen:
- Wenn Hash gleich → Cache nutzen
- Wenn Hash unterschiedlich → Neu laden
```

→ Ermöglicht lange-term caching!

---

## Production Server Config

### .htaccess (Apache)
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

→ Single Page Apps funktionieren korrekt

### nginx Config
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## Cache Headers

Damit Browser alte Versionen cachen:

```apache
# .htaccess
<FilesMatch "\.js$|\.css$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

<FilesMatch "\.html$">
  Header set Cache-Control "public, max-age=0, must-revalidate"
</FilesMatch>
```

→ JS/CSS werden 1 Jahr gecacht (wegen Hash)
→ HTML wird immer neu geladen

---

## Debugging Production Build

```bash
npm run preview   # Testet Production Build lokal

http://localhost:4173  # Preview öffnen
```

**Wenn Problem im Production Build aber nicht Dev:**
- Check Source Maps
- Chrome DevTools → Sources Tab
- Suche nach Minified Code
- Verwende Source Maps zum Debuggen

---

## Build Troubleshooting

### "Build failed"
```bash
npm run build 2>&1 | head -20  # Erste 20 Fehler
```

### "Module not found"
```bash
# Dependency vergessen
npm install missing-package
```

### "Memory limit exceeded"
```bash
# Erhöhe Node Memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

---

*Build Process & Bundling – Stand Mai 2026*


================================================================================
FILE: GUIDES/EXTENDED/DEVELOPMENT_SETUP.md
================================================================================

# Workflow: Development Environment Setup

**Für neue Developer & Agent-Initialization**

---

## Übersicht

Wie man eine lokale Entwicklungsumgebung aufbaut & die Website lokal entwickelt.

---

## 1. Voraussetzungen

### Erforderlich
- Git installiert? (`git --version`)
- Node.js ≥ 18 LTS? (`node --version`)
- npm oder yarn? (`npm --version`)
- Code Editor (VS Code empfohlen)

### Optional
- Docker (für komplexere Setups)
- SSH-Keys für Git (für Remote Push)

---

## 2. Projekt Klonen

```bash
git clone https://github.com/user/website.git
cd website
```

---

## 3. Dependencies installieren

```bash
npm install
# oder
yarn install
```

**Was passiert:**
- `node_modules/` Ordner wird erstellt
- Alle npm Packages werden installiert
- Lock-Datei wird aktualisiert

---

## 4. Environment Setup

### .env Datei erstellen

```bash
# Kopiere .env.example zu .env (NIEMALS INS GIT!)
cp .env.example .env

# Editiere .env mit lokalen Werten
# Beispiel:
# API_URL=http://localhost:3000
# DATABASE_URL=postgresql://localhost/website
# ANALYTICS_ID=xyz123
```

**Wichtig:**
- `.env` NIEMALS ins Git commtten!
- `.env.example` zeigt nötige Variables
- `.gitignore` muss `.env` enthalten

---

## 5. Build & Dev Server

### Development Server starten

```bash
npm run dev
# oder
yarn dev
```

**Erwartet:**
- Server läuft auf `http://localhost:3000` oder ähnlich
- Hot Reload aktiv (Änderungen sofort sichtbar)
- Error-Messages im Terminal sichtbar

### Production Build

```bash
npm run build
# oder
yarn build
```

**Erstellt:**
- `dist/` oder `build/` Ordner
- Minified HTML, CSS, JS
- Optimierte Assets

### Build in Browsern testen

```bash
npm run build
npm run preview
```

---

## 6. Dateistruktur verstehen

```
website/
├── public/           → Deployed Files (HTML, CSS, JS, Assets)
├── src/              → Source Code (nicht deployed)
│   ├── components/
│   ├── styles/
│   └── scripts/
├── .env.example      → Template für .env
├── .gitignore        → Sagt Git was ignorieren
├── package.json      → Dependencies & Scripts
├── .github/          → GitHub Actions (Workflows)
└── README.md         → Projekt-Info
```

---

## 7. Git Workflow

### Branches

```bash
# Hauptbranch (Production)
git checkout main

# Feature Branch erstellen
git checkout -b feature/my-feature

# Änderungen committen
git add .
git commit -m "Add my feature"

# Push zu Remote
git push origin feature/my-feature

# → PR erstellen & Merge
```

### Commits schreiben

```bash
# Gutes Commit-Format:
git commit -m "Add: Dark mode toggle

- Added CSS variables for dark theme
- Implemented localStorage persistence
- Updated CD-Manual"
```

---

## 8. NPM Scripts Übersicht

Typische Scripts in `package.json`:

```json
{
  "scripts": {
    "dev": "vite",                    // Dev Server
    "build": "vite build",             // Production Build
    "preview": "vite preview",         // Preview Build
    "lint": "eslint src/",             // Code Quality
    "test": "vitest",                  // Tests
    "format": "prettier --write ."     // Code Formatting
  }
}
```

**Typische Befehle:**
```bash
npm run dev        # Dev Server starten
npm run build      # Production bauen
npm run lint       # Code-Fehler prüfen
npm run test       # Tests laufen
npm run format     # Code automatisch formatieren
```

---

## 9. Debugging

### Browser DevTools
```
Chrome: F12 oder Ctrl+Shift+I
Firefox: F12 oder Ctrl+Shift+I
Safari: Cmd+Option+I
Edge: F12 oder Ctrl+Shift+I
```

### Terminal Output prüfen
```bash
npm run dev
# Fehler/Warnings erscheinen hier
```

### VS Code Debugger
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

---

## 10. Häufige Probleme

### "npm: command not found"
```bash
# Node.js nicht installiert
# Lösung: https://nodejs.org installieren
node --version  # Test
```

### "Port already in use"
```bash
# Dev Server Port ist belegt
# Option 1: Andere App beenden
# Option 2: Anderen Port verwenden
npm run dev -- --port 3001
```

### "Module not found"
```bash
# Dependencies nicht installiert
npm install
```

### ".env Datei fehlt"
```bash
# .env nicht vorhanden
cp .env.example .env
# Dann .env mit lokalen Werten bearbeiten
```

### "Build fehlgeschlagen"
```bash
# Prüfe Syntax-Fehler
npm run lint
npm run build  # Siehe Fehlermeldungen
```

---

## 11. Tipps für Developer

- Nutze VS Code Extensions:
  - **ESLint** – Code-Qualität
  - **Prettier** – Code-Formatierung
  - **Live Server** – Live-Reload
  - **Thunder Client** – API Testing

- Lese QUICK_START.md regelmäßig (Workflows ändern sich)
- Frag Agent wenn etwas unklar ist
- Dokumentiere Änderungen ins CD-Manual
- Teste lokal vor Deploy!

---

## 12. Checklist für Onboarding

- [ ] Git repo geklont?
- [ ] Node.js installiert?
- [ ] `npm install` durchgelaufen?
- [ ] `.env.example` zu `.env` kopiert?
- [ ] Dev Server läuft (`npm run dev`)?
- [ ] `http://localhost:3000` erreichbar?
- [ ] QUICK_START.md gelesen?
- [ ] DESIGN_SYSTEM.md gelesen?
- [ ] cd-manual/index.html geöffnet?
- [ ] Erste kleine Änderung lokal gemacht?
- [ ] Commit & Push durchgeführt?

---

*Development Setup – Stand Mai 2026*


================================================================================
FILE: GUIDES/EXTENDED/ERROR_HANDLING.md
================================================================================

# Error Handling & Recovery

---

## Fehlertypen

### Entwicklung (Dev)
- **Syntax Error** – Code-Fehler
- **Runtime Error** – Fehler während Ausführung
- **Logic Error** – Code läuft, macht aber was Falsches

**Lösung:** Logs checken, Debugger nutzen

### Production (Live)
- **HTTP Errors** – 404, 500, etc.
- **Network Errors** – Server down, Timeout
- **Client Errors** – JS-Fehler im Browser

**Lösung:** Error Monitoring, Fallback-Seiten

---

## Error Pages (HTML)

### 404 – Not Found
```html
<!DOCTYPE html>
<html>
<head>
  <title>404 – Seite nicht gefunden</title>
</head>
<body>
  <h1>404 – Diese Seite existiert nicht</h1>
  <p>Die gesuchte Seite wurde nicht gefunden.</p>
  <a href="/">← Zur Startseite</a>
</body>
</html>
```

### 500 – Server Error
```html
<!DOCTYPE html>
<html>
<head>
  <title>500 – Fehler</title>
</head>
<body>
  <h1>500 – Fehler auf dem Server</h1>
  <p>Es ist ein unerwarteter Fehler aufgetreten.</p>
  <a href="/">← Zur Startseite</a>
</body>
</html>
```

**Alle Error Pages müssen:**
- Hilfreiche Botschaft geben
- Link zur Startseite
- Nicht zu technisch sein

---

## JavaScript Error Handling

### Try-Catch
```javascript
try {
  riskyFunction();
} catch (error) {
  console.error("Error:", error);
  // Graceful Fallback
  showFallbackUI();
}
```

### Fetch Error Handling
```javascript
fetch('/api/data')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return response.json();
  })
  .catch(error => {
    console.error("Fetch failed:", error);
    showOfflineMessage();
  });
```

---

## Deployment Rollback

### Wenn Deploy fehlschlägt:

**Option 1: Git Revert**
```bash
git revert COMMIT_HASH
git push origin main
```

**Option 2: Zu älterem Tag zurück**
```bash
git checkout v1.1.0
git push -f origin main
```

**Option 3: Webspace Manual Rollback**
- Hosting Provider Backup nutzen
- Ältere Dateien zurück-uploaden

### Rollback Checklist
- [ ] Fehler identifiziert?
- [ ] Rollback-Methode gewählt?
- [ ] Rollback durchgeführt?
- [ ] Live-Site getestet?
- [ ] User informiert?
- [ ] Fehler dokumentiert?

---

## Monitoring & Alerting

**Error Monitoring Tools:**
- Sentry (JS/Python/Node)
- Bugsnag (Universal)
- LogRocket (Frontend)
- Google Analytics (Custom Events)

**Setup:**
```javascript
// Sentry Beispiel
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
  environment: "production"
});

// Fehler werden automatisch captured
```

---

## Error Logging Best Practices

```javascript
console.error("User action failed", {
  action: "form_submit",
  userId: user.id,
  error: error.message,
  timestamp: new Date().toISOString()
});
```

**Was loggen:**
- Fehlermeldung
- Stack Trace
- User ID / Session ID
- Timestamp
- Browser Info
- Error Context

**Was NICHT loggen:**
- Passwörter
- API Keys
- Payment Info
- Personal Data

---

## Error Recovery Strategies

### Network Error
```javascript
// Retry mit Exponential Backoff
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000);
    }
  }
}
```

### API Timeout
```javascript
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error("Timeout")), 5000)
);

Promise.race([fetch(url), timeoutPromise])
  .catch(() => showOfflineUI());
```

### Graceful Degradation
```javascript
// Wenn Feature nicht funktioniert, fallback anbieten
if (!navigator.geolocation) {
  showManualLocationInput();
} else {
  getLocation();
}
```

---

## Post-Error Checklist

Nach jedem Error:
- [ ] Fehler dokumentiert (in CD-Manual)?
- [ ] Ursache analysiert?
- [ ] Fix implementiert?
- [ ] Re-deployed & getestet?
- [ ] User informiert?
- [ ] Monitoring eingebaut?

---

*Error Handling & Recovery – Stand Mai 2026*


================================================================================
FILE: GUIDES/EXTENDED/MONITORING.md
================================================================================

# Monitoring & Uptime Checking

---

## Health Check nach Deploy

**Unmittelbar nach Deploy:**

```bash
# Test 1: Ist Website erreichbar?
curl -I https://example.com
# Erwartet: HTTP 200

# Test 2: SSL Certificate gültig?
curl -v https://example.com
# Erwartet: SSL/TLS erfolgreich

# Test 3: Wichtige Seiten OK?
curl https://example.com/about
curl https://example.com/contact
# Erwartet: HTTP 200, Content geladen
```

**Checkliste:**
- [ ] Domain erreichbar (HTTP 200)?
- [ ] SSL funktioniert (HTTPS)?
- [ ] Wichtige Seiten laden?
- [ ] Keine Redirects zu falschen URLs?
- [ ] Performance OK (< 3s)?

---

## Uptime Monitoring Tools

### Kostenlos
- **Pingdom** (5 checks/monat kostenlos)
- **UptimeRobot** (50 monitors kostenlos)
- **Statuspages** (Statuspage.io)

### Kostenpflichtig
- Datadog (Comprehensive Monitoring)
- New Relic
- Sentry (JS Error Tracking)

### Setup (UptimeRobot Beispiel)
```
1. UptimeRobot → Create Monitor
2. Type: HTTP(S)
3. URL: https://example.com
4. Interval: 5 minutes
5. Notifications: Email bei Downtime
```

---

## Error Monitoring (Sentry)

```javascript
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://examplePublicKey@sentry.io/12345",
  environment: "production",
  tracesSampleRate: 0.1  // Nur 10% samplen (für Performance)
});

// Errors werden automatisch captured
// Manuell:
Sentry.captureException(error);
Sentry.captureMessage("Something interesting happened");
```

**Sentry Dashboard:**
- Alle JS-Fehler anzeigen
- Error-Trends
- Affected Users
- Stack Traces

---

## Performance Monitoring

### Lighthouse Continuous Monitoring
```javascript
// Nach Deploy Lighthouse Score prüfen
// Manual: PageSpeed Insights
// Automated: Lighthouse CI (GitHub Actions)
```

### Real User Monitoring (RUM)
```javascript
// Track Core Web Vitals
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

getCLS(console.log);  // Cumulative Layout Shift
getFID(console.log);  // First Input Delay
getFCP(console.log);  // First Contentful Paint
getLCP(console.log);  // Largest Contentful Paint
getTTFB(console.log); // Time to First Byte

// Zu Google Analytics senden
getCLS(metric => gtag('event', 'page_view', {
  'cls': metric.value
}));
```

---

## Server Monitoring

### If VPS/Dedicated Server

**Check:**
- CPU Usage < 80%
- Memory Usage < 80%
- Disk Usage < 80%
- No errors in server logs

**Tools:**
- htop (CPU/Memory)
- df -h (Disk Space)
- tail -f /var/log/apache2/error.log (Logs)

---

## Database Monitoring

If using database:

**Check:**
- [ ] Database accessible?
- [ ] Queries < 1s?
- [ ] No connection limits reached?
- [ ] Backups running?

**Tools:**
- phpMyAdmin (MySQL)
- pgAdmin (PostgreSQL)
- MongoDB Atlas (MongoDB)

---

## Monitoring Dashboard

**Tool: Grafana (kostenlos selbst-gehostet)**

```
Metrics zu tracken:
1. Website Uptime (%)
2. Response Time (ms)
3. Error Rate (%)
4. Traffic (Requests/min)
5. Core Web Vitals (LCP, FID, CLS)
```

---

## Alert Configuration

**E-Mail Alerts für:**
- Website down (HTTP 200 → nicht mehr erreichbar)
- High error rate (> 10% errors)
- Performance degradation (Response > 3s)
- SSL certificate expiring (< 30 days)

---

## Monthly Review Checklist

Jeden Monat checken:
- [ ] Uptime Report anschauen (Sollte > 99.5%)
- [ ] Top Errors in Sentry reviewen
- [ ] Performance Score (Lighthouse ≥ 90)
- [ ] Core Web Vitals OK?
- [ ] Traffic Trends normal?
- [ ] User complaints?

---

## Post-Incident Documentation

Nach jedem Downtime/Error:
- [ ] Root cause analyzed?
- [ ] Fix implemented?
- [ ] Monitoring alert improved?
- [ ] Preventive measures?
- [ ] Incident documented?

---

*Monitoring & Uptime – Stand Mai 2026*


================================================================================
FILE: GUIDES/EXTENDED/TECHSTACK.md
================================================================================

# Tech Stack & Skalierbarkeit

Verbindliche Stack-Entscheidungen fuer Webprojekte. Basiert auf Performance, DSGVO, Wartbarkeit und Agentur-Skalierung.

---

## Stack-Entscheidung: Schnell-Referenz

```
Landing Page (Standard):     Plain HTML + CSS + GSAP
Landing Page (mehrere Seiten): Astro + CSS + GSAP
Mit Kundenredaktion:         Astro + Sanity CMS
Web-App-Features:            SvelteKit
Wenn Kunde React fordert:    Next.js (nur dann)
```

**Regel:** Nimm das einfachste Tool das die Anforderungen erfuellt. Nicht das modernste.

---

## Layer 1: Plain HTML/CSS/JS

### Wann verwenden
- 1–2 Seiten, einmalig gebaut
- Kein wiederverwendbarer Komponenten-Bedarf
- Maximale Robustheit gewuenscht

### Vorteile
- Kein Build-Step, kein Framework, kein "funktioniert auf meinem Rechner"
- Fehler tauchen sofort auf, nicht beim Build
- Jeder Entwickler kann es anfassen
- Deploy: einfach Dateien auf FTP

### Nachteile
- Layouts und Komponenten werden copy-paste
- Kein automatisches Asset-Handling

---

## Layer 2: Astro

### Wann verwenden
- 3+ Seiten mit wiederverwendbaren Layouts
- Blog, Case Studies, mehrseitige Projekte
- Performance ist kritisch (Google-Ranking)

### Das Kern-Prinzip: Zero JS by default

Astro rendert alles zu statischem HTML. Im Browser landet kein JavaScript – ausser du willst es explizit.

```
Next.js Landing Page:    ~150–300 KB JS (React Runtime + Hydration)
Astro Landing Page:        0 KB JS (reines HTML/CSS)
```

### Vorteile
- Lighthouse Score 95–100 fast automatisch
- LCP unter 2s ohne Optimierungsarbeit
- Komponenten-Struktur ohne Framework-Overhead im Browser
- Partial Hydration: nur interaktive Teile laden JS
- Markdown + Content Collections fuer Blog/Case Studies
- Deploy als statische Dateien – kein Server noetig

### Bekannte Schwaechen
- Hydration-Fehler (client:load / client:visible) sind subtil und schwer zu debuggen
- Build-Fehler statt Runtime-Fehler – tauchen erst beim Build auf
- Oekosystem kleiner als Next.js (weniger Plugins, weniger Community-Antworten)
- TypeScript + Drittanbieter-Pakete hakt gelegentlich
- Config-Aenderungen erfordern manuellen Neustart

### Wann Astro NICHT nehmen
- Web-App mit Login, Datenbank, komplexem State → SvelteKit
- Wenn der Kunde explizit React fordert → Next.js
- Wenn plain HTML reicht → plain HTML

---

## Layer 3: SvelteKit

### Wann verwenden
- Web-App-Features (Login, Datenbank, API-Routen)
- Server-Side-Rendering noetig
- Projekt waechst ueber statische Site hinaus

### Warum SvelteKit statt Next.js
- Deutlich kleineres JS-Bundle
- Weniger "Magie", klarerer Code
- Bessere Performance fuer SSR ohne React-Overhead
- Kein Virtual DOM

### Wann Next.js
- Einziger Grund: Kunde fordert explizit React
- Grosses Team das React bereits kennt

---

## Animations-Stack: GSAP + ScrollTrigger

### Warum GSAP
- Industriestandard fuer Web-Animationen
- Praezise Timeline-Kontrolle
- Performant (requestAnimationFrame-basiert)
- Funktioniert mit jedem Framework oder plain HTML

### GSAP Module

| Modul | Lizenz | Verwendung |
|---|---|---|
| GSAP Core | Free | Basis-Animationen, Timelines, Easings |
| ScrollTrigger | Free | Scroll-basierte Trigger, Pinning, Scrubbing |
| SplitText | Club (99$/Jahr) | Text-Animationen Zeile/Buchstabe |
| Draggable | Free | Drag-Interaktionen |

### Pflicht-Animationen

**Hero-Animation (jede Seite):**
- Paragraph-Reveal: Ueberschrift + Text kommen nacheinander von unten
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- Optional: leichter Parallax auf Hero-Bild

**Reveal-System (jede Seite):**
```js
gsap.from(".reveal", {
  y: 40,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out",
  stagger: 0.1,
  scrollTrigger: { trigger: ".reveal", start: "top 85%" }
});
```

**Micro-Interactions (immer):**
- Button Hover: 120ms, ease-out
- Card Hover: translateY(-4px) + Shadow
- Formular-Feedback: Shake bei Fehler, Checkmark bei Erfolg

### Dauer-Referenz

| Element | Dauer | Easing |
|---|---|---|
| Button Hover | 120ms | ease-out |
| Modal oeffnen | 300ms | spring |
| Modal schliessen | 200ms | ease-in |
| Scroll-Reveal | 600–800ms | power3.out |
| Seitenwechsel | 500ms | ease-in-out |

### Niemals
- `transition: all` – immer spezifische Properties
- Animationen laenger als 1s fuer UI-Feedback
- Lineare Bewegung fuer Objekte
- Animationen ohne `prefers-reduced-motion` Fallback

---

## Warum nicht...

| Tool | Problem |
|---|---|
| **React/Next.js fuer Landing Pages** | JS-Bundle zu gross, LCP leidet, Overkill |
| **Framer Motion** | React-abhaengig, unnoetig fuer statische Sites |
| **AOS / Animate.css** | Zu generisch, kaum Kontrolle, KI-Slop-Feeling |
| **Lottie** | Grosse Dateien, Performance-Problem auf Mobile |
| **WordPress** | Template-Fabrik, Sicherheitsrisiko, Performance-Probleme |
| **Tailwind in Produktion** | Kein echtes Token-System, Utility-Class-Chaos, schlechte Wartbarkeit |
| **jQuery** | Ueberholt, unnoetig, Bloat |
| **Bootstrap** | Generisches Aussehen, schwer zu ueberschreiben |

---

## Skalierbarkeit

### 3 verschiedene Skalierbarkeitsprobleme

**1. Agentur-Skalierung** – Mehr Projekte pro Jahr bauen
**2. Projekt-Skalierung** – Kunde will aus 1-Pager eine 10-Seiten-Site
**3. Traffic-Skalierung** – Kunde wird viral

### Agentur-Skalierung

```
Astro + eigenes Component-System + Sanity CMS
```

- Einmal sauberes Astro-Komponenten-Set bauen (Hero, CTA, Cards, Nav, Footer)
- Fuer jeden Kunden nur Tokens + Inhalte austauschen
- Sanity als headless CMS → Kunde pflegt selbst, die Agentur baut schneller

**Die echten Skalierungs-Hebel:**

| Hebel | Warum |
|---|---|
| Token-System | Jedes Projekt nutzt dieselbe Struktur, nur andere Werte |
| Komponenten-Bibliothek | Hero, Nav, CTA einmal gebaut – 20x wiederverwendet |
| Klarer Brief-Prozess | Weniger Nacharbeit, schnellere Abnahme |
| CMS-Strategie | Kunde pflegt selbst → die Agentur spart Support-Zeit |

Nicht das Framework skaliert. Das System skaliert.

### Projekt-Skalierung

```
1–50 Seiten:   Astro + Content Collections
50+ Seiten:    Astro + Sanity CMS (strukturierte Inhalte)
Web-App:       SvelteKit
```

### Traffic-Skalierung

Kein Problem bei statischen Sites.

```
Statisches HTML auf CDN → skaliert auf 10 Millionen Besucher
Kein Server noetig. Vercel/Netlify Edge-CDN reicht.
```

---

## Roadmap Stack

```
Kurzfristig (0–2 Jahre):
  Plain HTML-Blueprint + Token-System
  → Schnell ausrollbar, kein Overhead

Mittelfristig (2–4 Jahre):
  Astro-Component-Library + Sanity CMS
  → Kunde kann selbst editieren
  → die Agentur baut schneller weil Komponenten fertig sind

Langfristig (4+ Jahre):
  SvelteKit wenn Web-App-Features gefragt sind
  → Next.js nur wenn Kunde explizit React fordert
```

---

## Vollstaendiger Default-Stack

```
Framework:    Astro (ab 3 Seiten) / Plain HTML (darunter)
CSS:          Custom Properties (Tokens), kein Tailwind
JS:           Vanilla ES6+, Alpine.js fuer kleine Interaktivitaet
Animationen:  GSAP + ScrollTrigger
Icons:        Inline SVG (Lucide / Phosphor – MIT-Lizenz)
Fonts:        Self-hosted WOFF2 (kein Google Fonts CDN)
Bilder:       WebP, <200KB Desktop, <picture> fuer Responsive
CMS:          Sanity (wenn Kundenredaktion gewuenscht)
Build:        Vite (in Astro integriert)
Hosting:      Vercel / Netlify / Hetzner VPS
```

---

*TechStack Guide – Stand Mai 2026*


================================================================================
FILE: GUIDES/KERN/CONTEXT.md
================================================================================

# Projekt-Kontext für Agenten

Dieser Guide gibt KI-Agenten den notwendigen Kontext über die Arbeitsweise und die typischen Kundenprojekte. Vor dem ersten Code lesen.

---

## Was ist dieses Repo?

Dieses Repository ist der **zentrale Wissens-Hub** für alle Webprojekte. Es enthält:
- Verbindliche Design- und Code-Regeln.
- Workflow-Anleitungen für wiederkehrende Aufgaben.
- Checklisten für qualitätssichere Deliverables.
- Referenz-Beispiele und Templates.

**Kein Code läuft hier.** Das Repo ist eine reine Dokumentations- und Skill-Basis.

---

## Typische Kundenprojekte

### Kundenstruktur

| Typ | Beispiele | Hauptziel |
|---|---|---|
| Handwerker | Elektriker, Maurer, Schreiner | Kontaktanfragen generieren |
| Berater | Coaches, Steuerberater, Anwälte | Vertrauen aufbauen, Termine buchen |
| Lokale Dienstleister | Hebammen, Therapeuten, Fitnessstudios | Reichweite lokal, Buchungen |
| Agenturen/Freelancer | Fotografen, Designer, Marketingagenturen | Portfolio, Neukundengewinnung |

### Typischer Projektumfang

- 1-Pager bis 5-Seiter (kein komplexes Backend).
- HTML/CSS/JS oder leichtes Framework (Astro, 11ty).
- Next.js für Content-heavy Projekte oder wenn explizit verlangt.
- Hosting: Webspace (FTP/rsync), Vercel, Netlify oder VPS.

---

## Arbeitsweise & Prinzipien

### Der Workflow-Prozess

```
1. PROJEKT_BRIEF.md ausfüllen (Analyse vor Code)
2. Design-Tokens ableiten (keine Magic Numbers)
3. Sektionen-Reihenfolge bestätigen (kein Code ohne Freigabe)
4. Bauen (iterativ, mit Validator-Loop)
5. QA + Deploy (Checkliste abarbeiten)
```

### Qualitätsstandards

- **Kein generisches AI-Slop:** Inter-Font + lila Gradient + weiße Cards = verboten.
- **Performance first:** Core Web Vitals müssen grün sein. LCP < 2.5s.
- **Mobile first:** Immer. Kein Desktop-Design, das dann "responsive gemacht" wird.
- **DSGVO by default:** Kein CDN ohne Prüfung. Kein Google Fonts direkt. Kein Google Analytics ohne Consent.

---

## Wichtige Dateipfade in diesem Repo

| Datei / Ordner | Inhalt |
|---|---|
| `GUIDES/01_STRATEGY/` | Strategische Analysen (Customer, Product, HR etc.) |
| `GUIDES/02_CONCEPT/` | Synthese (Design-Konzept, Form Follows Function) |
| `GUIDES/03_EXECUTION/` | Finale Deliverables (Logo, Typo, Colors, Components, Layout, Prompts, Voice, Motion) |
| `GUIDES/03_EXECUTION/technical/` | Technische Guides (SEO, Legal, Security, QA, Deploy, Forms, Automation) |
| `GUIDES/KERN/STYLE.md` | Code-Stil-Konventionen |
| `GUIDES/KERN/RULES.md` | Verbindliche Agenten-Regeln |
| `GUIDES/KERN/PROJEKT_BRIEF.md` | Template für das Projektbriefing |
| `CHECKLISTS/` | Schnell-Referenzen pro Workflow |

---

## Technischer Stack – Defaults

```
HTML/CSS/JS:    Vanilla-first. Kein Framework-Overhead für einfache Sites.
CSS:            Custom Properties (Tokens), kein Tailwind in Produktion (außer User wünscht es)
JS:             Vanilla ES6+. Kein jQuery. Alpine.js erlaubt für kleine Interaktivität.
Framework:      Astro (Static), Next.js (wenn SSR nötig)
Build:          Vite oder Parcel (kein Webpack außer Zwang)
Icons:          Inline SVG (Heroicons, Lucide, Phosphor – MIT-Lizenz)
Fonts:          Self-hosted WOFF2
Bilder:         WebP, <200KB Desktop
```

---

## Was dieser Agent NICHT tut

- Keine Entscheidungen ohne Kontext treffen.
- Keinen Code schreiben, bevor der Projektbrief ausgefüllt ist.
- Keine externen CDN-Requests ohne DSGVO-Prüfung einbauen.
- Keine Magic Numbers – alles aus dem Token-System.

---

*Agent Context – Stand Juni 2026*


================================================================================
FILE: GUIDES/KERN/PROJEKT_BRIEF.md
================================================================================

# Projekt-Brief – Website Rebuild Workflow

Dieser Guide regelt den Prozess, wenn eine bestehende Website neu gebaut werden soll.
**Der Agent füllt diesen Brief aus, bevor er einen einzigen Guide liest oder Code schreibt.**

> **TL;DR**
> - Phase 0 zuerst: alte Website analysieren → Zielgruppe ableiten → Entscheidungen dokumentieren
> - Danach: Token-Mapping, Sektionen bestätigen lassen, dann erst Code
> - Projekt schlägt Generic-Guide – Zielgruppe entscheidet, nicht das Template
> - Anschließend PLAN.md aus `TEMPLATES/` auswählen und anpassen

---

## Warum dieser Brief zuerst?

Generische Design-Regeln (Token-System, Grid, Komponenten) sind Werkzeuge – kein Ziel.
Ohne Projekt-Brief konkurrieren sie mit dem, was die alte Website zeigt und was die Zielgruppe braucht.
Erst wenn dieser Brief vollständig ist, ist klar, welche Regeln gelten und welche angepasst werden.

---

## Phase 0: Brief ausfüllen (vor allem anderen)

### 0.1 – Alte Website analysieren

Agent untersucht die alte Website und dokumentiert:

```
ALTE WEBSITE
─────────────────────────────────────────────
URL / Dateipfad:
Primäre Schwächen:
  - [ ] Kein klarer CTA
  - [ ] Veraltetes Layout
  - [ ] Schlechte Mobile-Darstellung
  - [ ] Unklare Zielgruppenansprache
  - [ ] Zu langsam (Performance)
  - [ ] Sonstiges: ___

Was funktioniert / behalten:
  - Farbe/Branding:
  - Vertrauenselemente (Logos, Zertifikate, Testimonials):
  - Inhalte die gut performen:

Vorhandene Farbcodes:
  Primär:    #______
  Sekundär:  #______
  Hintergrund: #______
```

### 0.2 – Zielgruppe ableiten

Agent analysiert oder fragt nach Zielgruppe und dokumentiert:

```
ZIELGRUPPE
─────────────────────────────────────────────
Persona (kurz):
Alter / technische Affinität:
Entscheidungstreiber (sortiert nach Priorität):
  1.
  2.
  3.
Primäres Gerät: [ ] Desktop  [ ] Mobile  [ ] Beides
Sprache / Ton der Ansprache: [ ] Sachlich  [ ] Emotional  [ ] Premium  [ ] Locker
Größter Einwand vor dem Kauf/Kontakt:
```

### 0.3 – Design-Entscheidungen ableiten

Drei Felder – mehr nicht. Alles andere ergibt sich aus dem Projekt-Typ-Bundle oder ist Standard.

```
DESIGN-ENTSCHEIDUNGEN
─────────────────────────────────────────────
Projekt-Typ:
  [ ] local-service   [ ] portfolio   [ ] ecommerce   [ ] saas   [ ] corporate

TON (leer = "Klar, authentisch, aktiv"):
  ________________________________  Grund: ________________________________

PRIMÄRFARBE (leer = aus Kontext ableiten):
  #______  Grund: ________________________________

MOTION (leer = Standard):
  [ ] Standard (Parallax + Reveal)  [ ] Subtil (kein Parallax)  [ ] Keine

ABOVE-THE-FOLD-ZIEL:   ________________________________
PRIMÄRER CTA:          ________________________________  →  ________________________________
VERTRAUENSELEMENTE:    1. ________  2. ________  3. ________

SEKTIONEN:  1. Hero  2.________  3.________  4.________  5.________
```

**Regel:** Accessibility / Security / Legal nie überschreibbar. Alles andere mit Begründung änderbar.

### 0.4 – Guides automatisch auswählen

Projekt-Typ aus 0.3 → Bundle aus `guides-index.json` `project-types` laden. Dann ergänzen:

```
GUIDES FÜR DIESES PROJEKT
─────────────────────────────────────────────
Bundle (Projekt-Typ):   _______________ (aus guides-index.json)
Enthält automatisch:    _______________

Zusätzlich laden:
[ ] tone_of_voice.md        – wenn Texte miterstellt werden
[ ] components.md           – wenn Video/Bild-Optimierung nötig
[ ] qa_testing.md           – bei erhöhter A11y-Anforderung
[ ] Sonstiges: ___
```

**Alle anderen Guides werden nicht geladen** – sie stehen bei Bedarf zur Verfügung, belasten aber nicht den Kontext.

---

## Phase 1: Token-Mapping (alte Website → neues System)

Vor dem Coding werden die Werte aus 0.3 direkt in CSS-Token übertragen:

```css
:root {
  /* Abgeleitet aus Zielgruppenanalyse, nicht aus Standard-Template */
  --color-primary-300: /* Primärfarbe aus 0.3 */;

  /* Aus alter Website übernommen / angepasst */
  --color-brand-trust: /* Vertrauensfarbe, wenn vorhanden */;

  /* Spacing & Radius nach Design System – keine Anpassung nötig */
  --space-300: 16px;
  --radius-squircle: 28%;
}
```

Erst wenn das Token-Mapping dokumentiert ist, beginnt der erste HTML/CSS-Block.

---

## Phase 2: Sektionen-Reihenfolge bestätigen

Agent legt Sektionen-Reihenfolge aus 0.3 vor und wartet auf Bestätigung:

```
Geplante Sektionen:
1. Hero – [CTA-Text] → [Ziel]
2. Problem / Schmerz der Zielgruppe
3. Lösung / Leistungen
4. Vertrauen (Logos, Testimonials)
5. CTA / Kontakt

Bestätigung abwarten bevor mit Coding begonnen wird.
```

---

## Regeln für den gesamten Rebuild-Prozess

1. **Brief vor Code.** Kein HTML ohne ausgefüllte Phase 0.
2. **Projekt schlägt Guide.** Wenn die Zielgruppe sachliche Ansprache braucht, gilt das – auch wenn ein Generic-Template etwas anderes zeigt.
3. **Minimal-Guides.** Nur die in 0.4 markierten Guides werden aktiv gelesen.
4. **Token-Mapping dokumentieren.** Jede Farbentscheidung braucht eine Begründung aus 0.1 or 0.2.
5. **Sektionen bestätigen lassen.** Reihenfolge vor dem Coding freigeben lassen.
6. **Keine parallelen Entscheidungen.** Entweder altes Design weiterverwenden oder neu ableiten – nicht beides gleichzeitig.

---

## Verbindung zur Automation

Dieser Brief ist die Pflichtbasis für jeden automatisierten Build. Nach Phase 2 (Sektionen bestätigt) wird aus dem Brief direkt der **PLAN.md** generiert:

- Jede Section aus 0.3 → ein Step im PLAN.md
- Token-Mapping aus Phase 1 → Step 1 im PLAN.md
- Relevante Guides aus 0.4 → werden pro Step geladen, nicht alle auf einmal

→ Wie PLAN.md strukturiert sein muss: **[automation.md](../03_EXECUTION/technical/automation.md)**

---

*Website Guide – Stand Mai 2026*


================================================================================
FILE: GUIDES/KERN/RULES.md
================================================================================

# Verbindliche Agenten-Regeln

Diese Regeln gelten für alle KI-Agenten, die in diesem Projekt arbeiten. Keine Ausnahmen ohne explizite Freigabe durch den User.

---

## Die 10 Gebote

### 1. Kein Code ohne Kontext

Vor dem ersten Keystroke muss bekannt sein:
- Branche des Kunden
- Primäre Conversion-Action (was soll der Besucher tun?)
- Stack (HTML/CSS/JS, Next.js, Astro?)
- Gibt es eine alte Website? Was wird behalten?

**Wenn unklar → fragen, nicht raten.**

---

### 2. Kein generisches Design

Verbotene Kombination: Inter-Font + lila/blauen Gradient + weisse abgerundete Cards + keine Animation.

Jedes Projekt bekommt eine spezifische visuell-Sprache. Ein charakterstarker Font. Eine begruendete Farbwahl. Typografische Persoenlichkeit.

---

### 3. Token-System ist heilig

Kein einziger hardcodierter Wert fuer Spacing, Farbe oder Radius in Production-Code.

```css
/* Einzige Ausnahme: 0 und 100% */
margin: 0;        /* OK */
width: 100%;      /* OK */
padding: 24px;    /* VERBOTEN → var(--space-400) */
```

---

### 4. Performance ist kein Bonus

Bilder muessen komprimiert sein **bevor** sie eingebaut werden. Kein PNG in Production. Kein Video > 2MB ohne Begruendung.

Lighthouse Performance-Score < 80 = Deploy blockiert.

---

### 5. DSGVO ist nicht verhandelbar

Externe Fonts und Icons: **grundsaetzlich verboten** – egal welcher Host.
- Jeder externe Font (Google Fonts, Typekit, Bunny, cdnfonts, externes `@font-face src` …): **verboten** → Fonts immer lokal als WOFF2.
- Jede externe Icon-Quelle (Font Awesome, Lucide/Feather/Material/Iconify/Boxicons-CDN, Icon-Fonts …): **verboten** → Icons immer Inline-SVG.
- Google Analytics ohne Consent: **verboten**
- `./check.sh` blockiert externe Font-/Icon-Requests automatisch (kein Deploy).

---

### 6. Accessibility ist Pflicht, kein Bonus

- Kontrast 4.5:1 minimum. Pruefung mit axe oder Lighthouse.
- Touch-Targets 48x48px minimum.
- Alle Bilder mit aussagekraeftigem alt-Attribut.
- Alle interaktiven Elemente per Tastatur erreichbar.
- `prefers-reduced-motion` immer respektieren.

---

### 7. Mobile First ist kein Wunsch

Design beginnt immer bei 375px Breite. Desktop ist die Erweiterung.

Kein Entwickeln auf Desktop und dann "responsiv machen" – das fuehrt immer zu schlechten Mobile-Ergebnissen.

---

### 8. Empty States sind UI-Elemente

Jede Liste, jeder Grid, jedes Dashboard braucht:
- First-Use State
- Empty/No-Results State
- Error State
- Loading State (Skeleton Screen)

---

### 9. Dokumentation bleibt aktuell

Wenn eine Design-Entscheidung getroffen wird (neue Farbe, neuer Font, neue Sektion) → CD-Manual aktualisieren.

Nicht: "ich mach das spaeter". Sofort.

---

### 10. Kein Deploy ohne Checkliste

Vor jedem Go-Live: `CHECKLISTS/deploy.checklist.md` abarbeiten. Vollstaendig. Kein Item ueberspringen.

---

## Entscheidungs-Hierarchie

Wenn Regeln in Konflikt stehen, gilt:

```
1. Explizite User-Anweisung (hoechste Prioritaet)
2. PROJEKT_BRIEF.md (projektspezifische Entscheidungen)
3. Diese RULES.md
4. DESIGN_SYSTEM.md
5. STYLE.md
6. Branchenstandards / Best Practices
```

---

## Was der Agent NICHT entscheidet

- Primärfarbe ohne Begruendung und Bestätigung
- Sektionen-Reihenfolge ohne Freigabe
- Deployment ohne explizite Anweisung
- CDN-Einbindung externer Dienste
- Entfernung bestehender Inhalte/Sektionen

---

## Fehler-Protokoll

Wenn etwas schieflaeuft:
1. **Nicht einfach weitermachen.** Stopp.
2. Fehler klar benennen (was ist passiert, was wurde erwartet).
3. Loesungsoptionen anbieten (mindestens 2).
4. User entscheiden lassen.

---

## Anti-Patterns – nie wieder

| Pattern | Warum verboten |
|---|---|
| `console.log` in Production-Code | Performance, Sicherheit |
| `!important` im CSS | Spezifitaets-Chaos |
| Inline-Styles im HTML | Nicht wartbar, kein Token-System |
| `position: absolute` fuer Layout | Bricht auf anderen Screens |
| `100vh` fuer Mobile-Hero | iOS Safari Bug → `100svh` |
| `font-weight: bold` | → `font-weight: 700` (explizit) |
| CDN-Scripts ohne SRI-Hash | Sicherheitsrisiko |

---

*Agent Rules – Stand Mai 2026*


================================================================================
FILE: GUIDES/KERN/STYLE.md
================================================================================

# Code Style Guide

Verbindliche Code-Konventionen für Webprojekte. KI-Agenten halten sich daran ohne Ausnahme.

---

## HTML

### Struktur & Semantik

```html
<!-- Sections: immer mit ID + data-Attributen fuer Navigation -->
<section id="section-leistungen" data-nav-label="Leistungen" data-nav-order="2">
  <div class="container">
    <!-- Inhalt -->
  </div>
</section>

<!-- Bilder: immer picture + srcset + lazy (ausser LCP) -->
<picture>
  <source srcset="bild-800.webp 800w, bild-400.webp 400w" type="image/webp">
  <img src="bild-800.webp" alt="Beschreibung des Bildes" loading="lazy" width="800" height="600">
</picture>

<!-- Icons: immer Inline SVG, nie CDN -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path d="..."/>
</svg>
```

### Verboten in HTML

```html
<!-- Kein: CDN-Scripts ohne DSGVO-Pruefung -->
<script src="https://unpkg.com/..."></script>

<!-- Kein: leere alt-Attribute ausser rein dekorativen Elementen -->
<img src="..." alt="">  <!-- NUR fuer rein dekorative Bilder -->

<!-- Kein: onclick in HTML -->
<button onclick="doSomething()">  <!-- Stattdessen: addEventListener -->
```

---

## CSS

### Dateistruktur

```css
/* 1. Custom Properties (Tokens) */
:root { ... }

/* 2. Reset / Globals */
*, *::before, *::after { box-sizing: border-box; }

/* 3. Typografie */
body { ... }
h1, h2, h3 { ... }

/* 4. Layout-Utilities */
.container { ... }
.grid-3col { ... }

/* 5. Komponenten (alphabetisch) */
.btn { ... }
.card { ... }
.hero { ... }

/* 6. Sections */
#section-hero { ... }
#section-leistungen { ... }

/* 7. Media Queries (am Ende) */
@media (max-width: 768px) { ... }
```

### Naming Convention: BEM-Lite

```css
/* Block */
.card { ... }

/* Element */
.card__title { ... }
.card__body { ... }
.card__footer { ... }

/* Modifier */
.card--featured { ... }
.card--dark { ... }

/* States */
.btn.is-loading { ... }
.nav.is-open { ... }
```

### Token-Pflicht

```css
/* Korrekt: aus Token-System */
padding: var(--space-400);
color: var(--color-primary-300);
border-radius: var(--radius-squircle);

/* Verboten: Magic Numbers */
padding: 24px;        /* Nein */
color: #3B82F6;       /* Nein */
border-radius: 12px;  /* Nein */
```

### Fluid Values

```css
/* Fluid Spacing mit clamp() */
padding: clamp(var(--space-500), 5vw, var(--space-800));

/* Fluid Typografie */
font-size: clamp(1rem, 2.5vw, 1.25rem);
```

---

## JavaScript

### Allgemein

```js
// Vanilla ES6+ bevorzugen
// Kein jQuery
// Kein globaler State ohne Begruendung

// DOM-Selektion
const nav = document.getElementById('main-nav');
const cards = document.querySelectorAll('.card');

// Events: addEventListener, nie onclick in HTML
btn.addEventListener('click', handleClick);

// Scroll-Events: immer passive
window.addEventListener('scroll', onScroll, { passive: true });

// Intersection Observer fuer Scroll-Animationen (kein scroll-Event dafuer)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.1 });
```

### Motion: immer prefers-reduced-motion pruefen

```js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // Animationen initialisieren
}
```

### Verboten in JS

```js
// Kein: eval()
// Kein: document.write()
// Kein: innerHTML fuer User-Input (XSS)
// Kein: var (nur const/let)
// Kein: unbehandelte Promises ohne .catch()
```

---

## Dateinamen & Ordnerstruktur

```
project/
├── index.html
├── public/              ← was deployed wird
│   ├── css/
│   │   └── style.css   ← eine Haupt-CSS-Datei (oder kompiliert)
│   ├── js/
│   │   └── main.js
│   ├── fonts/           ← self-hosted WOFF2
│   └── img/             ← WebP-Bilder
├── src/                 ← Quellcode (nicht deployed)
└── docs/                ← Dokumentation
```

**Dateinamen:** immer kebab-case. Kein camelCase, kein snake_case fuer Dateien.
- `hero-background.webp` ✅
- `heroBackground.webp` ❌
- `hero_background.webp` ❌

---

## Git Commit-Style

```
feat: Hero-Section mit Paragraph-Reveal hinzugefuegt
fix: Mobile Navigation Overflow behoben
style: Spacing-Token in Card-Komponente vereinheitlicht
docs: CD-Manual mit Primärfarbe aktualisiert
perf: Hero-Video auf 1.8MB komprimiert
```

Format: `type: kurze Beschreibung (Imperativ, Deutsch)`

---

*Code Style Guide – Stand Mai 2026*


================================================================================
FILE: GUIDES/KERN/design-tokens-mini.md
================================================================================

# Design Tokens – Kurzreferenz

> Nur Token-Werte. Keine Erklärungen. Für Details → GUIDES/03_EXECUTION/

---

## Spacing (8pt Grid)

```css
--space-100:  4px;
--space-200:  8px;
--space-300: 16px;
--space-400: 24px;
--space-500: 32px;
--space-600: 48px;
--space-700: 64px;
--space-800: 96px;
```

### Section-Spacing (fluid – vertikaler Rhythmus zwischen Sektionen)

```css
--space-section-sm: clamp(2.5rem,  6vw,  4rem);   /* 40 → 64px  – enge Sektionen  */
--space-section:    clamp(4rem,    9vw,  7.5rem); /* 64 → 120px – Standard        */
--space-section-lg: clamp(6rem,   12vw, 11rem);   /* 96 → 176px – Hero/großzügig  */
```

### Content-Rahmen (Whitespace an den Seiten)

```css
--content-max:   72rem;                     /* ~1152px Inhaltsbreite        */
--measure:       65ch;                      /* Textspalte: 45–75 Zeichen    */
--gutter-inline: clamp(1rem, 4vw, 2.5rem);  /* Seiten-Padding mobil→desktop */
```

> Rhythmus-Regel: Abstand **zwischen** Sektionen ≈ **2×** der größte Abstand **innerhalb** (Gestalt-Nähe). Innen `--space-500/600`, außen `--space-section`.

## Farbskala (300 = Base)

```css
--color-primary-100: hsl(H, S%, 95%);
--color-primary-200: hsl(H, S%, 85%);
--color-primary-300: hsl(H, S%, 60%);  /* BASE – aus PROJEKT_BRIEF */
--color-primary-400: hsl(H, S%, 45%);
--color-primary-500: hsl(H, S%, 30%);
--color-primary-600: hsl(H, S%, 20%);
--color-primary-700: hsl(H, S%, 10%);

--color-neutral-100: hsl(0, 0%, 97%);
--color-neutral-200: hsl(0, 0%, 90%);
--color-neutral-300: hsl(0, 0%, 70%);
--color-neutral-400: hsl(0, 0%, 50%);
--color-neutral-500: hsl(0, 0%, 30%);
--color-neutral-600: hsl(0, 0%, 15%);
--color-neutral-700: hsl(0, 0%,  5%);
```

## Radien

```css
--radius-squircle:    28%;   /* quintic superellipse approx */
--radius-squircle-sm: 20%;
--radius-pill:       999px;
--radius-sm:           4px;
--radius-md:           8px;
--radius-lg:          16px;
```

## Typografie

```css
--font-base: 'Inter', system-ui, sans-serif;
--text-xs:   0.75rem;   /*  12px */
--text-sm:   0.875rem;  /*  14px */
--text-md:   1rem;      /*  16px */
--text-lg:   1.25rem;   /*  20px */
--text-xl:   1.5rem;    /*  24px */
--text-2xl:  2rem;      /*  32px */
--text-3xl:  2.5rem;    /*  40px */
--text-4xl:  3.5rem;    /*  56px */

--leading-tight:  1.2;
--leading-body:   1.6;
--weight-regular: 400;
--weight-medium:  500;
--weight-bold:    700;
```

## Breakpoints

```css
--bp-mobile:  768px;
--bp-tablet:  1024px;
--bp-desktop: 1280px;
```

## Bento-Ratios

```css
.bento-square   { aspect-ratio: 1 / 1; }
.bento-wide     { aspect-ratio: 16 / 9; }
.bento-portrait { aspect-ratio: 4 / 5; }
.bento-card     { aspect-ratio: 3 / 2; }
```

## Kern-Regeln (nicht verhandelbar)

- Kein Magic Number – immer Token verwenden
- Spacing: `gap` für Rhythmus, Margins nur als Ausnahme (einseitig, `margin-block-start`)
- Section-Abstand ≈ 2× größter Innen-Abstand (Gestalt-Gruppierung ohne Trennlinien)
- Textspalte max `65ch`; Sektionen fluid via `--space-section`
- Mobile-First: Single Column → 3-Column Grid
- Kontrast min 4.5:1 (WCAG AA)
- Touch-Targets min 48×48px
- Inline SVG für Icons – nie CDN
- Fonts lokal hosten – nie Google Fonts CDN
- `100svh` statt `100vh` (iOS Safari)

---

*Für Muster, Komponenten, Motion, Go-Live-Checkliste → GUIDES/03_EXECUTION/

