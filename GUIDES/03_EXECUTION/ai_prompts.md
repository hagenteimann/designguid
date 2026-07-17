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
