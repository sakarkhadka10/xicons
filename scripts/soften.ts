/**
 * XIcons signature: soft corners. Every sharp line-to-line corner in a path becomes a small
 * quadratic curve, so arrows, chevrons, checks, stars and polygons share one gentle geometry.
 */
type Pt = [number, number];
type Seg =
  | { cmd: "L"; to: Pt }
  | { cmd: "Q"; args: number[]; to: Pt }
  | { cmd: "C" | "S" | "T" | "A"; args: number[]; to: Pt };
interface Sub {
  start: Pt;
  segs: Seg[];
  closed: boolean;
}

const ARGS: Record<string, number> = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  T: 2,
  A: 7,
  Z: 0,
};
const NUM = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/y;

/** Parses path data into absolute subpaths (handles implicit commands, compact numbers and arc flags). */
export function parsePath(d: string): Sub[] {
  const subs: Sub[] = [];
  let i = 0;
  let cmd = "";
  let cur: Pt = [0, 0];
  let sub: Sub | undefined;

  const skip = () => {
    while (i < d.length && /[\s,]/.test(d[i]!)) i++;
  };
  const num = () => {
    skip();
    NUM.lastIndex = i;
    const m = NUM.exec(d);
    if (!m) throw new Error(`bad path data near "${d.slice(i, i + 12)}"`);
    i = NUM.lastIndex;
    return Number(m[0]);
  };
  const flag = () => {
    skip();
    const c = d[i++];
    if (c !== "0" && c !== "1") throw new Error(`bad arc flag in "${d}"`);
    return Number(c);
  };
  const push = (seg: Seg) => {
    if (!sub) throw new Error(`path must start with M: "${d}"`);
    sub.segs.push(seg);
    cur = seg.to;
  };

  for (skip(); i < d.length; skip()) {
    if (/[a-zA-Z]/.test(d[i]!)) cmd = d[i++]!;
    else if (!cmd) throw new Error(`bad path data "${d}"`);
    const up = cmd.toUpperCase();
    if (!(up in ARGS)) throw new Error(`unknown path command ${cmd}`);
    const rel = cmd !== up;
    const [ox, oy] = rel ? cur : [0, 0];

    if (up === "Z") {
      if (sub) sub.closed = true;
      cur = sub ? sub.start : cur;
      cmd = "";
      continue;
    }
    if (up === "M") {
      cur = [ox + num(), oy + num()];
      sub = { start: cur, segs: [], closed: false };
      subs.push(sub);
      cmd = rel ? "l" : "L"; // implicit pairs after M are line-tos
      continue;
    }
    if (up === "L") push({ cmd: "L", to: [ox + num(), oy + num()] });
    else if (up === "H") push({ cmd: "L", to: [(rel ? cur[0] : 0) + num(), cur[1]] });
    else if (up === "V") push({ cmd: "L", to: [cur[0], (rel ? cur[1] : 0) + num()] });
    else if (up === "A") {
      const args = [num(), num(), num(), flag(), flag()];
      const to: Pt = [ox + num(), oy + num()];
      push({ cmd: "A", args, to });
    } else {
      const n = ARGS[up]!;
      const args: number[] = [];
      for (let k = 0; k < n; k += 2) args.push(ox + num(), oy + num());
      const to: Pt = [args[n - 2]!, args[n - 1]!];
      push({ cmd: up as "C" | "S" | "Q" | "T", args: args.slice(0, -2), to });
    }
  }
  return subs;
}

const fmt = (n: number) => String(Math.round(n * 1000) / 1000);
const pt = (p: Pt) => `${fmt(p[0])} ${fmt(p[1])}`;

export function stringifyPath(subs: Sub[]): string {
  return subs
    .map(
      (s) =>
        `M${pt(s.start)}` +
        s.segs
          .map((g) =>
            g.cmd === "L" ? `L${pt(g.to)}` : `${g.cmd}${g.args.map(fmt).join(" ")} ${pt(g.to)}`,
          )
          .join("") +
        (s.closed ? "Z" : ""),
    )
    .join("");
}

/** Rounds line-line corners with radius up to `r`, never eating more than a third of either segment. */
export function softenPath(d: string, r: number): string {
  const subs = parsePath(d);
  for (const sub of subs) {
    const segs = sub.segs;
    const near = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-6;
    const last = segs.at(-1);
    if (sub.closed && last && !near(last.to, sub.start)) segs.push({ cmd: "L", to: sub.start });

    // Vertex k sits between segs[k-1] and segs[k]; for closed paths vertex 0 (the start) wraps around.
    const n = segs.length;
    const from = (k: number): Pt => (k === 0 ? sub.start : segs[k - 1]!.to);
    const corners: { k: number; a: Pt; b: Pt; ra: number }[] = [];
    for (let k = sub.closed ? 0 : 1; k < n; k++) {
      const inSeg = k === 0 ? segs[n - 1] : segs[k - 1];
      const outSeg = segs[k];
      if (inSeg?.cmd !== "L" || outSeg?.cmd !== "L") continue;
      const v = from(k);
      const a = k === 0 ? from(n - 1) : from(k - 1);
      const b = outSeg.to;
      const l1 = Math.hypot(v[0] - a[0], v[1] - a[1]);
      const l2 = Math.hypot(b[0] - v[0], b[1] - v[1]);
      if (l1 < 1e-6 || l2 < 1e-6) continue;
      const u1: Pt = [(v[0] - a[0]) / l1, (v[1] - a[1]) / l1];
      const u2: Pt = [(b[0] - v[0]) / l2, (b[1] - v[1]) / l2];
      const dot = u1[0] * u2[0] + u1[1] * u2[1];
      if (Math.abs(dot) > 0.996) continue; // straight line or a U-turn back along itself: not a corner
      const ra = Math.min(r, l1 / 3, l2 / 3);
      if (ra < 0.05) continue;
      corners.push({
        k,
        a: [v[0] - u1[0] * ra, v[1] - u1[1] * ra],
        b: [v[0] + u2[0] * ra, v[1] + u2[1] * ra],
        ra,
      });
    }

    // Apply from the end so earlier indexes stay valid.
    for (const { k, a, b } of corners.reverse()) {
      const v = from(k);
      if (k === 0) {
        segs.at(-1)!.to = a; // insertions only ever land before the original last segment
        segs.push({ cmd: "Q", args: [v[0], v[1]], to: b });
        sub.start = b;
      } else {
        segs[k - 1]!.to = a;
        segs.splice(k, 0, { cmd: "Q", args: [v[0], v[1]], to: b });
      }
    }
  }
  return stringifyPath(subs);
}
