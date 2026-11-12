import { KeyboardEvent as ReactKeyboardEvent, PointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import { buildGlyphs } from '../lib/engine/build';
import { V } from '../lib/engine/geometry';
import { buildDefs } from '../lib/engine/glyphs';
import { FontParams, computeMetrics } from '../lib/engine/params';
import { ApiProvider } from '../lib/llm';
import { adaptToStyle } from '../lib/styleTransfer';
import {
  Edits, MAX_EDIT_POINTS, MAX_PATH_OPS, MAX_TOTAL_PATH_OPS, OP_CUT, OP_JOIN, OP_MERGE, Paths,
  adjacencyOf, applyEdits, applyPathOp, applyPaths, editedPointCount, nodeRole, readOffsets, slotsOf, writeOffsets
} from '../lib/engine/skeleton';

const CHARS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'];
const GRID = 5;
const SNAP_RANGE = 10;
const HIT = 40;
const DOUBLE_TAP_MS = 350;
const DRAG_THRESHOLD = 6;

/** Constrains a vector to the nearest multiple of 45 degrees (exact integer components). */
const lock45 = (v: V): V => {
  const len = Math.hypot(v[0], v[1]);
  const a = Math.round(Math.atan2(v[1], v[0]) / (Math.PI / 4));
  const diag = a % 2 !== 0;
  const c = diag ? Math.round(len / Math.SQRT2) : Math.round(len);
  const dir: V = [Math.round(Math.cos((a * Math.PI) / 4)), Math.round(Math.sin((a * Math.PI) / 4))];
  return [dir[0] * c, dir[1] * c];
};

const sign = (n: number) => (n > 0 ? 1 : n < 0 ? -1 : 0);

export interface AiAccess {
  apiKey: string;
  provider: ApiProvider;
  model: string;
}

interface GlyphEditorProps {
  params: FontParams;
  onChange: (params: FontParams) => void;
  /** the user's own AI key, if connected */
  ai: AiAccess | null;
  onConnect: () => void;
}

const withEdit = (edits: Edits | undefined, ch: string, value: number[] | undefined): Edits | undefined => {
  const next: Edits = { ...(edits ?? {}) };
  if (value) next[ch] = value;
  else delete next[ch];
  return Object.keys(next).length ? next : undefined;
};

interface Snapshot {
  edits?: Edits;
  paths?: Paths;
}
const snapshotOf = (p: FontParams): Snapshot => ({ edits: p.edits, paths: p.paths });
const withSnapshot = (p: FontParams, s: Snapshot): FontParams => {
  const next: FontParams = { ...p, edits: s.edits, paths: s.paths };
  if (!next.edits) delete next.edits;
  if (!next.paths) delete next.paths;
  return next;
};
const withPaths = (paths: Paths | undefined, ch: string, value: number[] | undefined): Paths | undefined => {
  const next: Paths = { ...(paths ?? {}) };
  if (value && value.length) next[ch] = value;
  else delete next[ch];
  return Object.keys(next).length ? next : undefined;
};
const OPEN_END = '#ea580c';

const btn =
  'px-3 min-h-[44px] rounded-md text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:opacity-40 disabled:hover:bg-neutral-100 transition-colors';

/**
 * Moves the skeleton points (centre lines) of one letter. The outline is drawn from them with the current
 * weight, contrast, serifs and so on, so every other setting keeps working on the edited letter.
 */
export function GlyphEditor({ params, onChange, ai, onConnect }: GlyphEditorProps) {
  const [ch, setCh] = useState('G');
  const [live, setLive] = useState<Map<number, V> | null>(null);
  const [focus, setFocus] = useState<number | null>(null);
  const [past, setPast] = useState<Snapshot[]>([]);
  const [future, setFuture] = useState<Snapshot[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [joinFrom, setJoinFrom] = useState<number | null>(null);
  const [pathNote, setPathNote] = useState<string | null>(null);
  const [manual, setManual] = useState<Set<string>>(new Set());
  const [hint, setHint] = useState('');
  const [busy, setBusy] = useState<{ done: number; total: number } | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const latest = useRef(params);
  useEffect(() => { latest.current = params; }, [params]);
  const group = useRef<SVGGElement>(null);
  const drag = useRef<{ slot: number; grab: V; start: Map<number, V>; from: V; moved: boolean } | null>(null);
  const lastTap = useRef<{ slot: number; t: number } | null>(null);

  const m = useMemo(() => computeMetrics(params), [params.weight, params.width, params.xHeight, params.contrast]); // eslint-disable-line react-hooks/exhaustive-deps
  const defs = useMemo(() => buildDefs({ m, squareness: params.squareness }), [m, params.squareness]);
  const letterOps = params.paths?.[ch];
  const base = useMemo(() => applyPaths(defs[ch], letterOps), [defs, ch, letterOps]);
  const roles = useMemo(() => slotsOf(base).map((_, i) => nodeRole(base, i)), [base]);
  const slots = useMemo(() => slotsOf(base), [base]);
  const adjacency = useMemo(() => adjacencyOf(base), [base]);
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
    setPast((p) => [...p.slice(-100), snapshotOf(params)]);
    setFuture([]);
    setManual((set) => {
      const n = new Set(set);
      if (value) n.add(ch); else n.delete(ch);
      return n;
    });
    onChange({ ...params, edits: next });
  };

  const adapt = async () => {
    if (!ai) { onConnect(); return; }
    const reference = [...new Set([ch, ...manual])].filter((c) => params.edits?.[c]);
    const targets = CHARS.filter((c) => !reference.includes(c));
    setBusy({ done: 0, total: targets.length });
    setMessage(null);
    try {
      const r = await adaptToStyle({ params, reference, targets, hint, ...ai, onProgress: (done, total) => setBusy({ done, total }) });
      const current = latest.current;
      const next: Edits = {};
      for (const c of reference) if (current.edits?.[c]) next[c] = current.edits[c];
      Object.assign(next, r.edits);
      setPast((p) => [...p.slice(-100), snapshotOf(current)]);
      setFuture([]);
      onChange({ ...current, edits: Object.keys(next).length ? next : undefined });
      setMessage({
        ok: true,
        text: `Adapted ${r.adapted} letters to the style of ${reference.join(', ')}.${r.failed ? ` ${r.failed} letters failed (${r.firstError}).` : ''} Use Undo to go back.`
      });
    } catch (e) {
      setMessage({ ok: false, text: `${e instanceof Error ? e.message : 'Adapting failed'}. Check your key, model and spending limit.` });
    } finally {
      setBusy(null);
    }
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

  const snap = (slot: number, x: number, y: number, free = false): V => {
    if (free) return [Math.round(x), Math.round(y)];
    let sx = Math.round(x / GRID) * GRID, sy = Math.round(y / GRID) * GRID;
    if (slots[slot].kind !== 'handle') {
      for (const line of [0, m.xh, m.cap, m.asc, -m.desc, m.b, m.cap - m.b, m.xh - m.b]) if (Math.abs(sy - line) <= SNAP_RANGE) sy = line;
    }
    return [sx, sy];
  };

  /** Sets a point to an absolute position; its handles travel with it. */
  const moveTo = (start: Map<number, V>, slot: number, x: number, y: number, free = false): Map<number, V> => {
    const next = new Map(start);
    const [bx, by] = [slots[slot].x, slots[slot].y];
    const [nx, ny] = snap(slot, x, y, free);
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
    e.stopPropagation();
    if (joinFrom !== null) {
      if (slot !== joinFrom && roles[slot] === 'end') { joinWith(slot); return; }
      setJoinFrom(null);
    }
    if (slots[slot].kind === 'node') { setSel(slot); setPathNote(null); }
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = pos(slot);
    const f = toFont(e);
    drag.current = { slot, grab: [f[0] - p[0], f[1] - p[1]], start: new Map(offsets), from: f, moved: false };
  };
  const move = (e: PointerEvent<SVGElement>) => {
    const d = drag.current;
    if (!d) return;
    const f = toFont(e);
    if (!d.moved && Math.hypot(f[0] - d.from[0], f[1] - d.from[1]) < DRAG_THRESHOLD) return;
    d.moved = true;
    let tx = f[0] - d.grab[0], ty = f[1] - d.grab[1];
    let free = false;
    if (e.shiftKey) {
      // Shift: a handle turns around its node, a node moves away from where it started, in 45 degree steps
      const s = slots[d.slot];
      const origin: V = s.kind === 'handle'
        ? (() => { const a = d.start.get(s.anchor as number) ?? [0, 0]; return [slots[s.anchor as number].x + a[0], slots[s.anchor as number].y + a[1]] as V; })()
        : (() => { const o = d.start.get(d.slot) ?? [0, 0]; return [s.x + o[0], s.y + o[1]] as V; })();
      const v = lock45([tx - origin[0], ty - origin[1]]);
      tx = origin[0] + v[0];
      ty = origin[1] + v[1];
      free = true;
    }
    setLive(moveTo(d.start, d.slot, tx, ty, free));
  };
  const up = () => {
    const d = drag.current;
    drag.current = null;
    if (d && d.moved && live) {
      commit(writeOffsets(base, live));
      lastTap.current = null;
    } else if (d) {
      // a click without dragging: two quick clicks on the same node make its line horizontal or vertical
      const now = Date.now(), last = lastTap.current;
      if (last && last.slot === d.slot && now - last.t < DOUBLE_TAP_MS) {
        lastTap.current = null;
        alignPoint(d.slot);
      } else lastTap.current = { slot: d.slot, t: now };
    }
    setLive(null);
  };

  /** Double click on a node: its curve handles (or, for a straight line, the line itself) become horizontal; once horizontal, vertical. */
  const alignPoint = (slot: number) => {
    if (slots[slot].kind !== 'node') return;
    const adj = adjacency.get(slot) ?? [];
    const handles = adj.map((a) => a.handle).filter((h): h is number => h !== undefined);
    const np = pos(slot);
    const next = new Map(offsets);
    const place = (i: number, target: V) => next.set(i, [Math.round(target[0] - slots[i].x), Math.round(target[1] - slots[i].y)]);
    const pickAxis = (vs: V[], through: V): 0 | 1 => {
      const nearest: 0 | 1 = Math.abs(through[0]) >= Math.abs(through[1]) ? 0 : 1;
      const aligned = vs.every((v) => Math.abs(v[1 - nearest]) < 0.6);
      return aligned ? ((1 - nearest) as 0 | 1) : nearest;
    };

    if (handles.length) {
      const vs: V[] = handles.map((h) => { const q = pos(h); return [q[0] - np[0], q[1] - np[1]]; });
      const through: V = vs.length === 2 ? [vs[0][0] - vs[1][0], vs[0][1] - vs[1][1]] : vs[0];
      const axis = pickAxis(vs, through);
      handles.forEach((h, i) => {
        const len = Math.hypot(vs[i][0], vs[i][1]);
        if (len < 0.5) return;
        const dir = vs.length === 2 ? (i === 0 ? 1 : -1) * (sign(through[axis]) || sign(vs[0][axis]) || 1) : sign(vs[i][axis]) || sign(vs[i][1 - axis]) || 1;
        place(h, [np[0] + (axis === 0 ? dir * len : 0), np[1] + (axis === 1 ? dir * len : 0)]);
      });
    } else if (adj.length) {
      const cands = adj.map((a) => { const o = pos(a.other); const v: V = [np[0] - o[0], np[1] - o[1]]; return { o, v, dev: Math.min(Math.abs(v[0]), Math.abs(v[1])) }; });
      const c = cands.sort((x, y) => x.dev - y.dev)[0];
      const axis = pickAxis([c.v], c.v);
      const len = Math.hypot(c.v[0], c.v[1]);
      if (len < 0.5) return;
      const dir = sign(c.v[axis]) || sign(c.v[1 - axis]) || 1;
      place(slot, [c.o[0] + (axis === 0 ? dir * len : 0), c.o[1] + (axis === 1 ? dir * len : 0)]);
    } else return;
    commit(writeOffsets(base, next));
  };

  const key = (slot: number) => (e: ReactKeyboardEvent<SVGElement>) => {
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
    setFuture([snapshotOf(params), ...future]);
    setSel(null);
    setJoinFrom(null);
    onChange(withSnapshot(params, prev));
  };
  const redo = () => {
    if (!future.length) return;
    const [next, ...rest] = future;
    setFuture(rest);
    setPast([...past, snapshotOf(params)]);
    setSel(null);
    setJoinFrom(null);
    onChange(withSnapshot(params, next));
  };
  // Ctrl/Cmd+Z undoes one step, Ctrl+Y or Ctrl+Shift+Z redoes (not while typing in a text field)
  const undoRef = useRef(undo), redoRef = useRef(redo);
  undoRef.current = undo;
  redoRef.current = redo;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      const k = e.key.toLowerCase();
      if (k === 'z' && !e.shiftKey) { e.preventDefault(); undoRef.current(); }
      else if (k === 'y' || (k === 'z' && e.shiftKey)) { e.preventDefault(); redoRef.current(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const resetLetter = () => {
    setPast((p) => [...p.slice(-100), snapshotOf(params)]);
    setFuture([]);
    setSel(null);
    setJoinFrom(null);
    setPathNote(null);
    onChange(withSnapshot(params, { edits: withEdit(params.edits, ch, undefined), paths: withPaths(params.paths, ch, undefined) }));
  };
  const resetAll = () => {
    setPast((p) => [...p.slice(-100), snapshotOf(params)]);
    setFuture([]);
    setSel(null);
    setJoinFrom(null);
    setPathNote(null);
    onChange(withSnapshot(params, {}));
  };

  /** Cut or join: changes the structure of the letter; offsets already made are carried over to the new points. */
  const structural = (code: number, a: number, b = 0) => {
    const ops = params.paths?.[ch] ?? [];
    const total = Object.values(params.paths ?? {}).reduce((n, v) => n + v.length / 3, 0);
    if (ops.length / 3 >= MAX_PATH_OPS || total >= MAX_TOTAL_PATH_OPS) {
      setPathNote('The limit of cut and join steps for this letter is reached. Reset the letter to start over.');
      return;
    }
    const r = applyPathOp(base, code, a, b);
    if (!r) {
      setPathNote(code === OP_CUT ? 'This point cannot be cut here (it is already an open end).' : 'These two points cannot be joined.');
      return;
    }
    const old = readOffsets(base, params.edits?.[ch]);
    const carried = new Map<number, V>();
    r.map.forEach((from, i) => {
      const o = from >= 0 ? old.get(from) : undefined;
      if (o) carried.set(i, [o[0], o[1]]);
    });
    setPast((p) => [...p.slice(-100), snapshotOf(params)]);
    setFuture([]);
    setManual((set) => new Set(set).add(ch));
    setSel(null);
    setJoinFrom(null);
    setPathNote(null);
    onChange(withSnapshot(params, { edits: withEdit(params.edits, ch, writeOffsets(r.def, carried)), paths: withPaths(params.paths, ch, [...ops, code, a, b]) }));
  };

  const selRole = sel !== null ? roles[sel] : null;
  const canCut = selRole === 'inner' || selRole === 'ring';
  const canJoin = selRole === 'end';
  const joinWith = (target: number) => {
    if (joinFrom === null) return;
    const a = pos(joinFrom), b = pos(target);
    structural(Math.hypot(a[0] - b[0], a[1] - b[1]) < 2.5 ? OP_MERGE : OP_JOIN, joinFrom, target);
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
  const editedChars = [...new Set([...Object.keys(params.edits ?? {}), ...Object.keys(params.paths ?? {})])];

  return (
    <div className="space-y-3">
      <p className="text-xs text-neutral-500">
        Drag the round points to move the centre line of a letter. Squares are curve handles. Orange points are open ends. Click a point to select it, then cut the line there or join it with another open end. The letter is drawn around the line with your current weight and style. Points snap to the guide lines. Double-click a point to make its line horizontal, again for vertical. Hold Shift while dragging to move in 45° steps. Ctrl + Z undoes the last step; arrow keys also move a selected point.
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
            <option key={c} value={c}>{c}{params.edits?.[c] || params.paths?.[c] ? '  •  edited' : ''}</option>
          ))}
        </select>
        <button type="button" onClick={() => step(1)} className={btn} aria-label="Next letter">▶</button>
      </div>

      <svg
        viewBox={`${minX} ${-top} ${width} ${top - bottom}`}
        className="w-full max-h-[70vh] bg-white border border-neutral-200 rounded-md select-none"
        role="group"
        aria-label={`Skeleton of the letter ${ch}`}
        onPointerDown={() => { setSel(null); setJoinFrom(null); }}
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
          {/* handles first, so a node on top of a nearby handle is the one you grab */}
          {slots.map((s, i) => ({ s, i })).sort((u, v) => (u.s.kind === 'node' ? 1 : 0) - (v.s.kind === 'node' ? 1 : 0)).map(({ s, i }) => {
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
                <circle opacity={focus === i || sel === i ? 1 : 0} cx={x} cy={y} r={22} fill="none" stroke="#2563eb" strokeWidth={sel === i ? 3 : 2} vectorEffect="non-scaling-stroke" />
                {joinFrom !== null && roles[i] === 'end' && i !== joinFrom && (
                  <circle cx={x} cy={y} r={28} fill="none" stroke={OPEN_END} strokeWidth={2.5} strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />
                )}
                {s.kind === 'handle' ? (
                  <rect x={x - 8} y={y - 8} width={16} height={16} fill="#fff" stroke="#2563eb" strokeWidth={2} vectorEffect="non-scaling-stroke" />
                ) : (
                  <circle cx={x} cy={y} r={11} fill={moved ? '#2563eb' : '#fff'} stroke={roles[i] === 'end' ? OPEN_END : '#2563eb'} strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
                )}
              </g>
            );
          })}
        </g>
      </svg>

      <div className="flex flex-wrap items-center gap-2" aria-label="Path tools">
        <button type="button" onClick={() => sel !== null && structural(OP_CUT, sel)} disabled={!canCut} className={btn} title="Split the line at the selected point">
          Cut at point
        </button>
        <button
          type="button"
          onClick={() => setJoinFrom(joinFrom === null ? sel : null)}
          disabled={!canJoin && joinFrom === null}
          aria-pressed={joinFrom !== null}
          className={`${btn} ${joinFrom !== null ? 'ring-2 ring-orange-500' : ''}`}
          title="Connect the selected open end with another open end"
        >
          {joinFrom !== null ? 'Cancel join' : 'Join points'}
        </button>
        <span className="text-xs text-neutral-500" role="status">
          {joinFrom !== null
            ? 'Now click another open end (orange, dashed ring) to connect it.'
            : sel === null
              ? 'Select a point to cut or join.'
              : canCut
                ? 'Selected: a point on a line. You can cut here.'
                : canJoin
                  ? 'Selected: an open end. You can join it.'
                  : ''}
        </span>
      </div>
      {pathNote && <p className="text-xs text-red-700" role="alert">{pathNote}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={undo} disabled={!past.length} className={btn}>Undo</button>
        <button type="button" onClick={redo} disabled={!future.length} className={btn}>Redo</button>
        <button type="button" onClick={resetLetter} disabled={!params.edits?.[ch] && !params.paths?.[ch]} className={btn}>Reset “{ch}”</button>
        {editedChars.length > 0 && (
          <button type="button" onClick={resetAll} className={btn}>Reset all ({editedChars.length})</button>
        )}
      </div>
      <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 space-y-2">
        <p className="text-sm font-medium text-neutral-800">Adapt all letters with AI</p>
        <p className="text-xs text-neutral-500">
          Edit one letter the way you like (for example a squared G), then let the AI carry that look over to the other letters. Letters you edited by hand are kept. You can undo it.
        </p>
        <input
          value={hint}
          maxLength={300}
          onChange={(e) => setHint(e.target.value)}
          placeholder="Optional: describe the look, e.g. hand-cut, square corners"
          aria-label="Describe the look"
          className="w-full px-3 py-2.5 border border-neutral-300 rounded-md bg-white"
        />
        <button
          type="button"
          onClick={adapt}
          disabled={!!busy || (!!ai && !params.edits?.[ch])}
          className="w-full bg-primary-300 hover:bg-primary-400 disabled:bg-neutral-300 text-white font-medium py-3 px-4 rounded-md transition-colors"
        >
          {busy ? `Adapting… ${busy.done} of ${busy.total} letters` : !ai ? 'Connect AI to adapt all letters' : `Adapt all other letters to “${ch}”`}
        </button>
        {ai && !params.edits?.[ch] && !busy && <p className="text-xs text-neutral-500">Edit “{ch}” first, then this button becomes available.</p>}
        {message && (
          <p className={`text-sm rounded-md p-3 border ${message.ok ? 'text-green-800 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200'}`} role={message.ok ? 'status' : 'alert'}>
            {message.text}
          </p>
        )}
      </div>

      <p className="text-xs text-neutral-500">
        Edited points: {totalPoints} of {MAX_EDIT_POINTS}.{' '}
        Bold and Italic follow your edits. Accented letters and mirrored twins (b and d, p and q) are separate shapes and are not changed.
      </p>
    </div>
  );
}
