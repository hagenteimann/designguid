import { buildDefs, GlyphDef } from './glyphs';
import { FontParams, Metrics, computeMetrics } from './params';
import { applyPaths } from './skeleton';

/** The skeletons of all letters for these parameters, with the user's cut / join operations applied (offsets are not). */
export function shapeDefs(p: FontParams): { m: Metrics; defs: Record<string, GlyphDef> } {
  const m = computeMetrics(p);
  const defs = buildDefs({ m, squareness: p.squareness });
  for (const ch of Object.keys(p.paths ?? {})) if (defs[ch]) defs[ch] = applyPaths(defs[ch], p.paths?.[ch]);
  return { m, defs };
}
