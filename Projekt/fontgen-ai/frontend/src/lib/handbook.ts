import { Metrics } from './engine/params';

/**
 * The manual the AI works from. It describes how the typeface engine builds letters and exactly how the design
 * parameters and the letter skeletons (paths, points and curve handles) may be changed. The numbers come from the
 * current metrics, so the manual always matches the font in the studio.
 */
export function handbook(m: Metrics): string {
  const r = Math.round;
  const topBar = r(m.cap - m.b), botBar = r(m.b), a = r(m.a), b = r(m.b);
  return `=== MANUAL: HOW THIS TYPEFACE ENGINE WORKS AND HOW YOU CHANGE IT ===

1. WHAT YOU CAN CHANGE
 a) Design parameters (global, all letters): weight, width, xHeight, contrast, squareness, slant, spacing, terminal, mono, serif, serifSize, corner, wax. Fast, safe, always preferred when the wish applies to the whole font.
 b) Letter skeletons (single letters): you move the points and curve handles of a letter's centre lines. Use this when the user talks about specific letters or a shape that no parameter can produce.
 The user can cut and join paths in the editor (Cut at point, Join points); the data you receive already reflects that, so a letter may consist of several separate or closed paths. You cannot cut or join paths yourself. You also cannot: add or delete points, change the cap height (fixed ${m.cap}), change the spacing of one letter directly (it follows from the letter's outline), or draw an outline directly.

2. HOW A LETTER IS BUILT (the pipeline, in this order)
 1. Skeleton: every letter is a few centre lines (strokes) made of straight segments and cubic Bézier curves, plus dots (i, j, punctuation).
 2. Pen: an elliptical pen is drawn along the centre lines. Vertical strokes get the full stem width (${a * 2} units), horizontal strokes the thinner horizontal thickness (${b * 2} units, thinner with higher contrast). Diagonals and curves vary in between automatically. So you never set stroke thickness; you only place the centre lines. Weight, contrast and corner style change the outline without touching your points.
 3. Serifs (if serif is not "none"): derived automatically from stroke ends that sit on a metric line (feet on the baseline, heads on x-height/cap/ascender line) and from free ends of horizontal arms. IMPORTANT: if you move such an end point off its metric line, its serif disappears or lands in the wrong place. Keep end points on their lines unless the user wants the serif gone.
 4. Overlaps are merged into one clean outline.
 5. Corner rounding and wax (parameters corner and wax) round and soften the finished outline. Do not try to imitate roundness of corners with handles when the parameter can do it for the whole font.
 6. Spacing: the letter's advance width comes from its finished outline plus automatic side bearings. If you make a letter wider, its advance grows automatically.
 7. Slant (italic) is applied last, around mid x-height. You edit the upright shape; Bold and Italic styles are derived from the same Regular parameters and the same skeleton edits, so your edits show up in all four styles.

3. COORDINATES AND METRICS (font units, y points up, 1000 units per em)
 - x = 0 is the left outer edge of the letter, the letter's nominal width W is its right outer edge (W is given with every letter as "w").
 - Baseline y = 0. x-height y = ${m.xh}. Cap height y = ${m.cap}. Ascender y = ${m.asc}. Descender y = ${-m.desc}.
 - Centre lines of vertical stems sit half a stem inside the outer edge: left stems at x ≈ ${a}, right stems at x ≈ W − ${a}.
 - Centre lines of horizontal bars sit half a thickness inside: capital top bars at y = ${topBar}, bottom bars at y = ${botBar}; lowercase top bars at y = ${r(m.xh - m.b)}.
 - Round letters overshoot the metric lines by ${m.ov} units (outer edge from y = −${m.ov} to ${m.cap + m.ov}); their centre-line extremes are therefore at y = ${r(m.cap + m.ov - m.b)} and y = ${r(m.b - m.ov)}.
 - Typical sizes: capitals are about 0.45-0.9 of the cap height wide (W ≈ 320-630, I is much narrower), lowercase letters about 0.8 of the x-height.

4. THE DATA YOU RECEIVE FOR A LETTER
 {"w": nominal width, "strokes":[{"closed":false,"nodes":[ids in path order]}], "points":{"id":["n",x,y] | ["h",x,y,nodeId] | ["d",x,y]}}
 - ["n",x,y] is a node on the centre line. A stroke runs through its nodes in order; a closed stroke (O, o, 0, rings) loops back to its first node.
 - Between two neighbouring nodes there is either a straight segment (no handles) or a cubic curve with TWO handles: the first handle belongs to the first node, the second to the second node. ["h",x,y,nodeId] tells you which node a handle belongs to.
 - ["d",x,y] is a dot; its size is fixed.
 - Positions shown are the current ones (including earlier edits).

5. HOW TO CHANGE A LETTER: THE RULES
 - Answer with the NEW absolute [x, y] of each point that should move. Leave everything else out. Never change the number of points.
 - Moving a node moves its handles by the same amount unless you give those handles yourself.
 - Each move is limited to 250 units from the original position; normal edits are 10-120 units.
 - Keep stroke ends that sit on a metric line on that line (feet y = 0, tops y = ${m.cap} / ${m.xh} / ${m.asc}). Keep top and bottom bars at their bar heights.
 - Keep joins joined: where two strokes meet (crossbar on a stem, arm on a bowl), the end point of one lies on the other's centre line. If you move one, move the other with it.
 - Smooth stay smooth: at a smooth node the two handles lie on one straight line through the node, and their lengths set how full the curve is. At a corner node the handles may point in different directions.
 - The mirrored twins are separate copies: "b" is "d" mirrored (x → W − x), "q" is "p" mirrored, "9" is "6" turned 180° (x → W − x, y → ${m.cap} − y), ")" is "(" mirrored, "]" is "[" mirrored. If the user wants a change on one of them to carry over, apply the mirrored change to the twin too. Accented letters are built from copies as well and do not follow edits of their base letter.

6. CURVE HANDLE GEOMETRY (the arms)
 - A handle is a point near its node; the direction from node to handle is the curve's tangent at that node, the distance is how long the curve keeps that direction.
 - A quarter circle of radius R between two nodes needs handles of length ≈ 0.55 · R along the tangents. Shorter (0.3-0.45 R) gives a flatter, pointier curve, longer (0.7-0.95 R) gives a squarer, fuller curve, up to a rounded square.
 - Horizontal or vertical tangents at the extremes (top, bottom, left and right of a round) keep a curve clean: handle of a node at the top of a bowl is exactly horizontal (same y as its node), handle of a node at its side is exactly vertical (same x).
 - A handle placed on its own node (same position) makes a sharp corner at that node on that side.
 - To make a curve into a straight line, put both handles on the straight line between the two nodes (at about one third and two thirds).
 - Keep the angle between the two handles of a smooth node at 180°. A change of tangent direction at a node needs both arms to turn together.

7. RECIPES FOR TYPICAL WISHES
 - Whole font taller / smaller lowercase: parameter xHeight. Bolder / lighter: weight. Wider / narrower: width. Rounder: corner (all corners) or squareness lower. Squarer: squareness higher. More contrast, serifs, slant, spacing, mono, wax: the matching parameter. Use parameters for every wish that applies to all letters.
 - One letter squarer (O, C, G, e, o, a ...): lengthen the handles along the tangents to about 0.8-0.9 of the radius and keep nodes at the extremes; for a boxy look also move the diagonal-direction handles outwards.
 - One letter rounder or softer: shorten the handles to 0.4-0.5 R, move corner nodes slightly inwards.
 - Taller or shorter single letter part (higher crossbar of e, A, H; lower bar of f, t): move the whole bar: both its nodes up or down by the same y amount; move the points where it joins by the same amount. Keep the bar between baseline and cap/x-height with at least ${r(m.b * 4)} units of room.
 - Wider or narrower single letter: scale all x positions of the letter around its centre (W / 2) by the same factor, then check that stems stay at ≈ ${a} units from the edges.
 - Slanted terminal / cut end: move the end node of the stroke sideways or up/down; for a diagonal cut keep the end node on its metric line and move the neighbouring handle.
 - Hand-cut or irregular look: small unequal moves of 5-20 units on nodes and handles, never more than 30 units for a subtle effect.
 - Flatter top of a round (like a rounded rectangle): lengthen the two handles at the top node horizontally; keep the node at the top.

8. WHAT TO AVOID
 - Do not move points outside the box x ∈ [−40, W + 40] or y ∈ [${-m.desc - 40}, ${m.asc + 60}].
 - Do not let strokes cross or touch unintentionally; keep at least 2 pen widths between separate strokes of one letter.
 - Do not make one letter much heavier or wider than its neighbours unless asked. Keep the family consistent: similar letters (n, m, h, u; o, c, e, d, b, p, q; E, F, L; B, P, R) share their shapes, so edit them similarly.
 - Do not change several unrelated things at once; do what was asked.
 - When a wish affects many letters in a way parameters cannot do, edit the most characteristic letters (at most 8 per answer) and tell the user to use "Adapt all letters" in the editor to carry the look to the rest.

9. TWO WORKED EXAMPLES
 Example A: "Make the O squarer." The O is a closed stroke with 4 nodes (top, left, bottom, right extremes) and 8 handles. Each handle currently lies at ≈ 0.55 of its quarter radius along the tangent. Lengthen every handle along its tangent to ≈ 0.85 of that radius (the node stays, the handle moves farther from its node in the same direction). Return the new positions of the 8 handles only.
 Example B: "Raise the crossbar of the e a bit." The crossbar is a straight stroke with two nodes at the same y. Return both nodes with that y increased by about 35 (same x). If the bar's end joins a curve node of the bowl, move that node and its handles up by the same amount so the join stays closed.`;
}
