import { KeyboardEvent, PointerEvent, useMemo, useRef, useState } from 'react';
import { buildGlyphs } from '../lib/engine/build';
import { V } from '../lib/engine/geometry';
import { buildDefs } from '../lib/engine/glyphs';
import { FontParams, computeMetrics } from '../lib/engine/params';
import { Edits, MAX_EDIT_POINTS, applyEdits, editedPointCount, readOffsets, slotsOf, writeOffsets } from '../lib/engine/skeleton';

const CHARS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'];
const GRID = 5;
const SNAP_RANGE = 10;
const HIT = 40;

interface GlyphEditorProps {
  params: FontParams;
  onChange: (params: FontParams) => void;
}

const withEdit = (edits: Edits | undefined, ch: string, value: number[] | undefined): Edits | undefined => {
  const next: Edits = { ...(edits ?? {}) };
  if (value) next[ch] = value;
  else delete next[ch];
  return Object.keys(next).length ? next : undefined;
};

const btn =
  'px-3 min-h-[44px] rounded-md text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:opacity-40 disabled:hover:bg-neutral-100 transition-colors';

/**
 * Moves the skeleton points (centre lines) of one letter. The outline is drawn from them with the current
 * weight, contrast, serifs and so on, so every other setting keeps working on the edited letter.
 */
export function GlyphEditor({ params, onChange }: GlyphEditorProps) {
  const [ch, setCh] = useState('G');
  const [live, setLive] = useState<Map<number, V> | null>(null);
  const [focus, setFocus] = useState<number | null>(null);
  const [past, setPast] = useState<(Edits | undefined)[]>([]);
  const [future, setFuture] = useState<(Edits | undefined)[]>([]);
  const group = useRef<SVGGElement>(null);
  const drag = useRef<{ slot: number; grab: V; start: Map<number, V>; moved: boolean } | null>(null);

  const m = useMemo(() => computeMetrics(params), [params.weight, params.width, params.xHeight, params.contrast]); // eslint-disable-line react-hooks/exhaustive-deps
  const defs = useMemo(() => buildDefs({ m, squareness: params.squareness }), [m, params.squareness]);
  const base = defs[ch];
  const slots = useMemo(() => slotsOf(base), [base]);
  const offsets = live ?? readOffsets(base, params.edits?.[ch]);

  const stored = live ? writeOffsets(base, live) : params.edits?.[ch];
  const edited = useMemo(() => applyEdits(base, stored), [base, stored]);

  // Outline preview in skeleton space (upright, proportional) so a dragged point stays under the pointer
  const outline = useMemo(() => {
    const p: FontParams = { ...params, slant: 0, mono: false, edits: withEdit(params.edits, ch, stored) };
    const g = buildGlyphs(p, ch).glyphs[0];
    if (!g) return '';
    const X = (v: number) => Math.round((v - g.shift) * 10) / 10;
    let d = '';
    for (const c of g.contours) {
      d += `M${X(c.sx)} ${c.sy}`;
      for (const s of c.segs) d += s.t === 'L' ? `L${X(s.x)} ${s.y}` : `C${X(s.x1)} ${s.y1} ${X(s.x2)} ${s.y2} ${X(s.x)} ${s.y}`;
      d += 'Z';
    }
    return d;
  }, [params, ch, stored]);

  const pos = (i: number): V => {
    const o = offsets.get(i);
    return [slots[i].x + (o ? o[0] : 0), slots[i].y + (o ? o[1] : 0)];
  };

  const totalPoints = editedPointCount(withEdit(params.edits, ch, stored));
  const commit = (value: number[] | undefined) => {
    const next = withEdit(params.edits, ch, value);
    if (JSON.stringify(next) === JSON.stringify(params.edits)) return;
    setPast((p) => [...p.slice(-40), params.edits]);
    setFuture([]);
    onChange({ ...params, edits: next });
  };

  const toFont = (e: PointerEvent): V => {
    const g = group.current;
    const ctm = g?.getScreenCTM();
    if (!g || !ctm) return [0, 0];
    const pt = (g.ownerSVGElement as SVGSVGElement).createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const r = pt.matrixTransform(ctm.inverse());
    return [r.x, r.y];
  };

  const snap = (slot: number, x: number, y: number): V => {
    let sx = Math.round(x / GRID) * GRID, sy = Math.round(y / GRID) * GRID;
    if (slots[slot].kind !== 'handle') {
      for (const line of [0, m.xh, m.cap, m.asc, -m.desc, m.b, m.cap - m.b, m.xh - m.b]) if (Math.abs(sy - line) <= SNAP_RANGE) sy = line;
    }
    return [sx, sy];
  };

  /** Sets a point to an absolute position; its handles travel with it. */
  const moveTo = (start: Map<number, V>, slot: number, x: number, y: number): Map<number, V> => {
    const next = new Map(start);
    const [bx, by] = [slots[slot].x, slots[slot].y];
    const [nx, ny] = snap(slot, x, y);
    const old = start.get(slot) ?? [0, 0];
    const o: V = [Math.max(-250, Math.min(250, nx - bx)), Math.max(-250, Math.min(250, ny - by))];
    const inc: V = [o[0] - old[0], o[1] - old[1]];
    next.set(slot, o);
    if (slots[slot].kind === 'node') {
      slots.forEach((s, i) => {
        if (s.kind === 'handle' && s.anchor === slot) {
          const h = start.get(i) ?? [0, 0];
          next.set(i, [Math.max(-250, Math.min(250, h[0] + inc[0])), Math.max(-250, Math.min(250, h[1] + inc[1]))]);
        }
      });
    }
    return editedPointCount(withEdit(params.edits, ch, writeOffsets(base, next))) > MAX_EDIT_POINTS ? start : next;
  };

  const down = (slot: number) => (e: PointerEvent<SVGElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = pos(slot);
    const f = toFont(e);
    drag.current = { slot, grab: [f[0] - p[0], f[1] - p[1]], start: new Map(offsets), moved: false };
  };
  const move = (e: PointerEvent<SVGElement>) => {
    const d = drag.current;
    if (!d) return;
    const f = toFont(e);
    d.moved = true;
    setLive(moveTo(d.start, d.slot, f[0] - d.grab[0], f[1] - d.grab[1]));
  };
  const up = () => {
    const d = drag.current;
    drag.current = null;
    if (d && d.moved && live) commit(writeOffsets(base, live));
    setLive(null);
  };

  const key = (slot: number) => (e: KeyboardEvent<SVGElement>) => {
    const step = e.shiftKey ? 20 : GRID;
    const dx = e.key === 'ArrowRight' ? step : e.key === 'ArrowLeft' ? -step : 0;
    const dy = e.key === 'ArrowUp' ? step : e.key === 'ArrowDown' ? -step : 0;
    if (!dx && !dy) return;
    e.preventDefault();
    const p = pos(slot);
    commit(writeOffsets(base, moveTo(offsets, slot, p[0] + dx, p[1] + dy)));
  };

  const undo = () => {
    if (!past.length) return;
    const prev = past[past.length - 1];
    setPast(past.slice(0, -1));
    setFuture([params.edits, ...future]);
    onChange({ ...params, edits: prev });
  };
  const redo = () => {
    if (!future.length) return;
    const [next, ...rest] = future;
    setFuture(rest);
    setPast([...past, params.edits]);
    onChange({ ...params, edits: next });
  };
  const resetLetter = () => commit(undefined);
  const resetAll = () => {
    setPast((p) => [...p.slice(-40), params.edits]);
    setFuture([]);
    onChange({ ...params, edits: undefined });
  };

  const step = (n: number) => setCh(CHARS[(CHARS.indexOf(ch) + n + CHARS.length) % CHARS.length]);

  const pathOf = (s: { segs: { p: V[] }[]; closed?: boolean }) => {
    let d = '';
    s.segs.forEach((g, i) => {
      const [p0] = g.p;
      if (i === 0) d += `M${p0[0]} ${p0[1]}`;
      d += g.p.length === 2 ? `L${g.p[1][0]} ${g.p[1][1]}` : `C${g.p[1][0]} ${g.p[1][1]} ${g.p[2][0]} ${g.p[2][1]} ${g.p[3][0]} ${g.p[3][1]}`;
    });
    return d + (s.closed ? 'Z' : '');
  };

  const minX = -80, width = base.w + 160;
  const top = m.asc + 70, bottom = -m.desc - 70;
  const guides: [number, string][] = [[m.asc, 'asc'], [m.cap, 'cap'], [m.xh, 'x'], [0, '0'], [-m.desc, 'desc']];
  const editedChars = Object.keys(params.edits ?? {});

  return (
    <div className="space-y-3">
      <p className="text-xs text-neutral-500">
        Drag the round points to move the centre line of a letter. Squares are curve handles. The letter is drawn around the line with your current weight and style. Points snap to the guide lines; arrow keys also work.
      </p>

      <div className="flex items-center gap-2">
        <button type="button" onClick={() => step(-1)} className={btn} aria-label="Previous letter">◀</button>
        <select
          value={ch}
          onChange={(e) => setCh(e.target.value)}
          aria-label="Letter to edit"
          className="flex-1 min-h-[44px] px-3 border border-neutral-300 rounded-md bg-white text-base"
        >
          {CHARS.map((c) => (
            <option key={c} value={c}>{c}{params.edits?.[c] ? '  •  edited' : ''}</option>
          ))}
        </select>
        <button type="button" onClick={() => step(1)} className={btn} aria-label="Next letter">▶</button>
      </div>

      <svg
        viewBox={`${minX} ${-top} ${width} ${top - bottom}`}
        className="w-full max-h-[70vh] bg-white border border-neutral-200 rounded-md select-none"
        role="group"
        aria-label={`Skeleton of the letter ${ch}`}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <g ref={group} transform="scale(1 -1)">
          {guides.map(([y, label]) => (
            <g key={label}>
              <line x1={minX} x2={minX + width} y1={y} y2={y} stroke="#9ca3af" strokeWidth={1.5} strokeDasharray={y === 0 ? undefined : '6 6'} vectorEffect="non-scaling-stroke" />
              <text x={minX + 6} y={-y - 6} transform="scale(1 -1)" fontSize={22} fill="#9ca3af">{label}</text>
            </g>
          ))}
          <path d={outline} fill="rgba(100,100,120,0.22)" stroke="#6b7280" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          {edited.skel.strokes.map((s, i) => (
            <path key={i} d={pathOf(s)} fill="none" stroke="#2563eb" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          ))}
          {slots.map((s, i) => {
            if (s.kind !== 'handle') return null;
            const a = pos(s.anchor as number), h = pos(i);
            return <line key={`l${i}`} x1={a[0]} y1={a[1]} x2={h[0]} y2={h[1]} stroke="#93c5fd" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />;
          })}
          {slots.map((s, i) => {
            const [x, y] = pos(i);
            const moved = offsets.has(i);
            const label = `${s.kind === 'handle' ? 'Curve handle' : s.kind === 'dot' ? 'Dot' : 'Point'} ${i + 1}`;
            return (
              <g
                key={i}
                tabIndex={0}
                role="button"
                aria-label={label}
                onPointerDown={down(i)}
                onKeyDown={key(i)}
                onFocus={() => setFocus(i)}
                onBlur={() => setFocus((f) => (f === i ? null : f))}
                style={{ touchAction: 'none', cursor: 'grab', outline: 'none' }}
              >
                <circle cx={x} cy={y} r={HIT} fill="transparent" />
                <circle opacity={focus === i ? 1 : 0} cx={x} cy={y} r={22} fill="none" stroke="#2563eb" strokeWidth={2} vectorEffect="non-scaling-stroke" />
                {s.kind === 'handle' ? (
                  <rect x={x - 8} y={y - 8} width={16} height={16} fill="#fff" stroke="#2563eb" strokeWidth={2} vectorEffect="non-scaling-stroke" />
                ) : (
                  <circle cx={x} cy={y} r={11} fill={moved ? '#2563eb' : '#fff'} stroke="#2563eb" strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
                )}
              </g>
            );
          })}
        </g>
      </svg>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={undo} disabled={!past.length} className={btn}>Undo</button>
        <button type="button" onClick={redo} disabled={!future.length} className={btn}>Redo</button>
        <button type="button" onClick={resetLetter} disabled={!params.edits?.[ch]} className={btn}>Reset “{ch}”</button>
        {editedChars.length > 0 && (
          <button type="button" onClick={resetAll} className={btn}>Reset all ({editedChars.length})</button>
        )}
      </div>
      <p className="text-xs text-neutral-500">
        Edited points: {totalPoints} of {MAX_EDIT_POINTS}.{' '}
        Bold and Italic follow your edits. Accented letters and mirrored twins (b and d, p and q) are separate shapes and are not changed.
      </p>
    </div>
  );
}
