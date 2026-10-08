// Patch cables as Verlet ropes, apart from their looks: the panel's jacks, the cables' points,
// one step of the solver, and the smoothed path drawn through the points.

/** The stage's own coordinates (the SVG viewBox); the page scales it. */
export const STAGE = { width: 808, height: 460, floor: 448 } as const;

const SOCKET_HEIGHT = 44;
/** Strain-relief boot under a plugged plug: where the cable leaves it. */
export const BOOT = 14;
const PITCH = 66;
const FIRST_COL = 210;
export const COLS = 8;
const ROWS = [
  { id: "A", top: 59 },
  { id: "B", top: 155 },
] as const;

export interface Jack {
  id: string;
  row: number;
  col: number;
  x: number;
  /** Top of the socket. */
  top: number;
  /** Centre of the socket, where a plugged plug sits. */
  cy: number;
  /** Where a plugged cable leaves its boot. */
  anchorY: number;
}

export const JACKS: readonly Jack[] = ROWS.flatMap((row, rowIndex) =>
  Array.from({ length: COLS }, (_, col) => ({
    id: `${row.id}${col + 1}`,
    row: rowIndex,
    col,
    x: FIRST_COL + col * PITCH,
    top: row.top,
    cy: row.top + SOCKET_HEIGHT / 2,
    anchorY: row.top + SOCKET_HEIGHT + BOOT,
  })),
);

const JACK_BY_ID = new Map(JACKS.map((jack) => [jack.id, jack]));

export function jackById(id: string): Jack {
  const jack = JACK_BY_ID.get(id);
  if (!jack) throw new Error(`No jack ${id}`);
  return jack;
}

export interface VerletPoint {
  x: number;
  y: number;
  /** Where it was one step ago: its velocity is the difference. */
  px: number;
  py: number;
}

export interface Cable {
  /** The jack each end is plugged into, or null when it hangs free or is held. */
  ends: [string | null, string | null];
  points: VerletPoint[];
  /** Straight distance between its first two jacks: the rest length grows from it with slack. */
  base: number;
}

export interface SolverParams {
  /** Pixels per step² at 1. */
  gravity: number;
  /** Share of the velocity kept per step. */
  damping: number;
  /** Rest length over `base`, in percent. */
  slack: number;
  /** Constraint passes per step: more is stiffer. */
  passes: number;
}

export type Pin = { x: number; y: number } | null;

export const POINTS_PER_CABLE = 16;

/** A cable laid between two jacks, sagging, at rest after nothing yet. */
export function layCable(from: Jack, to: Jack, count = POINTS_PER_CABLE): Cable {
  const points = Array.from({ length: count }, (_, index) => {
    const t = index / (count - 1);
    const x = from.x + (to.x - from.x) * t;
    const y = from.anchorY + (to.anchorY - from.anchorY) * t + 400 * t * (1 - t);
    return { x, y, px: x, py: y };
  });
  return {
    ends: [from.id, to.id],
    points,
    base: Math.hypot(to.x - from.x, to.anchorY - from.anchorY),
  };
}

export function restLength(cable: Cable, slack: number): number {
  return cable.base * (1 + slack / 100);
}

/** Where an end is held: its jack's anchor, the pointer, or nowhere (it hangs). */
export function endPin(cable: Cable, end: 0 | 1): Pin {
  const id = cable.ends[end];
  if (!id) return null;
  const jack = jackById(id);
  return { x: jack.x, y: jack.anchorY };
}

/**
 * One step of one cable: integrate every free point (velocity × damping + gravity), pin the
 * held ends, then `passes` rounds of distance constraints pulling neighbours back to one link
 * length. Returns how far the fastest point moved, to know when the cable is at rest.
 */
export function stepCable(cable: Cable, pins: [Pin, Pin], params: SolverParams): number {
  const { points } = cable;
  const last = points.length - 1;
  const link = restLength(cable, params.slack) / last;
  const gravity = params.gravity * 0.9;
  const isPinned = (index: number) => (index === 0 && pins[0]) || (index === last && pins[1]);

  for (let index = 0; index <= last; index += 1) {
    if (isPinned(index)) continue;
    const point = points[index];
    const vx = (point.x - point.px) * params.damping;
    const vy = (point.y - point.py) * params.damping;
    point.px = point.x;
    point.py = point.y;
    point.x += vx;
    point.y += vy + gravity;
  }
  for (const [index, pin] of [
    [0, pins[0]],
    [last, pins[1]],
  ] as const) {
    if (!pin) continue;
    points[index].x = points[index].px = pin.x;
    points[index].y = points[index].py = pin.y;
  }

  for (let pass = 0; pass < params.passes; pass += 1) {
    for (let index = 0; index < last; index += 1) {
      const a = points[index];
      const b = points[index + 1];
      const wa = isPinned(index) ? 0 : 1;
      const wb = isPinned(index + 1) ? 0 : 1;
      if (!wa && !wb) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.hypot(dx, dy) || 0.0001;
      const share = (distance - link) / distance / (wa + wb);
      a.x += dx * share * wa;
      a.y += dy * share * wa;
      b.x -= dx * share * wb;
      b.y -= dy * share * wb;
    }
  }

  let moved = 0;
  for (let index = 0; index <= last; index += 1) {
    if (isPinned(index)) continue;
    const point = points[index];
    // A free plug rests above the floor; the cable itself lies on it.
    const floor = index === 0 || index === last ? STAGE.floor - 42 : STAGE.floor;
    if (point.y > floor) {
      point.y = floor;
      point.px = point.x - (point.x - point.px) * 0.6;
    }
    point.x = Math.min(STAGE.width - 8, Math.max(8, point.x));
    moved = Math.max(moved, Math.hypot(point.x - point.px, point.y - point.py));
  }
  return moved;
}

/** How much longer than its rest length the cable is drawn, in percent (constraints are soft). */
export function stretchPercent(cable: Cable, slack: number): number {
  let length = 0;
  for (let index = 1; index < cable.points.length; index += 1) {
    const a = cable.points[index - 1];
    const b = cable.points[index];
    length += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return (length / restLength(cable, slack) - 1) * 100;
}

const r1 = (value: number) => Math.round(value * 10) / 10;

/** The control points of each Bézier segment: Catmull-Rom tangents, a sixth of the chord. */
export function cableHandles(points: readonly { x: number; y: number }[]) {
  return points.slice(0, -1).map((p1, index) => {
    const p0 = points[index - 1] ?? p1;
    const p2 = points[index + 1];
    const p3 = points[index + 2] ?? p2;
    return {
      c1: { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 },
      c2: { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 },
      to: p2,
    };
  });
}

/** One smooth SVG path through every point of the cable. */
export function cablePath(points: readonly { x: number; y: number }[]): string {
  const start = `M ${r1(points[0].x)} ${r1(points[0].y)}`;
  return cableHandles(points).reduce(
    (path, { c1, c2, to }) =>
      `${path} C ${r1(c1.x)} ${r1(c1.y)}, ${r1(c2.x)} ${r1(c2.y)}, ${r1(to.x)} ${r1(to.y)}`,
    start,
  );
}

/** A jack that end can go into: no other plug in it, and within the cable's reach. */
export function isJackFree(
  cables: readonly Cable[],
  cableIndex: number,
  end: 0 | 1,
  jack: Jack,
  slack: number,
) {
  const taken = cables.some((cable, index) =>
    cable.ends.some((id, other) => id === jack.id && !(index === cableIndex && other === end)),
  );
  if (taken) return false;
  const anchor = endPin(cables[cableIndex], end === 0 ? 1 : 0);
  if (!anchor) return true;
  return (
    Math.hypot(jack.x - anchor.x, jack.anchorY - anchor.y) <=
    restLength(cables[cableIndex], slack) * 0.99
  );
}

/** The nearest free jack to a point, within `maxDistance`. */
export function nearestFreeJack(
  cables: readonly Cable[],
  cableIndex: number,
  end: 0 | 1,
  from: { x: number; y: number },
  slack: number,
  maxDistance = Number.POSITIVE_INFINITY,
): Jack | undefined {
  let best: Jack | undefined;
  let bestDistance = maxDistance;
  for (const jack of JACKS) {
    if (!isJackFree(cables, cableIndex, end, jack, slack)) continue;
    const distance = Math.hypot(from.x - jack.x, from.y - jack.cy);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = jack;
    }
  }
  return best;
}
