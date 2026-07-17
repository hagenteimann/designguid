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
