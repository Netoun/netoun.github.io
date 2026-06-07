import type { ReactElement } from "react";
import * as styles from "./labs-iso-icon.css";

// Isometric icon generator — ported from the Labs design prototype.
// Faces are filled with `currentColor` (tinted by the parent's accent color);
// inset detail uses a fixed dark ink for contrast.
const ISO_K = 0.8660254;
const ISO_DARK = "#16140d";

interface BuiltIcon {
  viewBox: string;
  elements: ReactElement[];
}

function buildIsoIcon(slug: string, scale: number): BuiltIcon {
  const s = scale;
  const pts: [number, number][] = [];
  const elements: ReactElement[] = [];
  let key = 0;

  // Project iso (x,y,z) → screen, recording the point for bounds.
  const P = (x: number, y: number, z: number): string => {
    const sx = (x - y) * ISO_K * s;
    const sy = (x + y) * 0.5 * s - z * s;
    pts.push([sx, sy]);
    return `${sx.toFixed(2)},${sy.toFixed(2)}`;
  };
  // Project without recording (caller registers bounds explicitly).
  const R = (x: number, y: number, z: number): [number, number] => [
    (x - y) * ISO_K * s,
    (x + y) * 0.5 * s - z * s,
  ];
  const reg = (x: number, y: number) => pts.push([x, y]);

  const poly = (points: string[], fill: string, opacity: number) => {
    elements.push(
      <polygon key={key++} points={points.join(" ")} fill={fill} fillOpacity={opacity} />,
    );
  };

  function box(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, topOp = 1) {
    const t = [
      P(ox, oy, oz + dz),
      P(ox + dx, oy, oz + dz),
      P(ox + dx, oy + dy, oz + dz),
      P(ox, oy + dy, oz + dz),
    ];
    const r = [
      P(ox + dx, oy, oz),
      P(ox + dx, oy + dy, oz),
      P(ox + dx, oy + dy, oz + dz),
      P(ox + dx, oy, oz + dz),
    ];
    const l = [
      P(ox, oy + dy, oz),
      P(ox + dx, oy + dy, oz),
      P(ox + dx, oy + dy, oz + dz),
      P(ox, oy + dy, oz + dz),
    ];
    poly(l, "currentColor", 0.3);
    poly(r, "currentColor", 0.56);
    poly(t, "currentColor", topOp);
  }

  function topInset(
    ox: number,
    oy: number,
    z: number,
    dx: number,
    dy: number,
    a: number,
    fill = ISO_DARK,
    op = 1,
  ) {
    const q = [
      P(ox + a, oy + a, z),
      P(ox + dx - a, oy + a, z),
      P(ox + dx - a, oy + dy - a, z),
      P(ox + a, oy + dy - a, z),
    ];
    poly(q, fill, op);
  }

  function dot(x: number, y: number, z: number, r: number, fill = ISO_DARK, op = 1) {
    const [cx, cy] = R(x, y, z);
    reg(cx - r, cy - r);
    reg(cx + r, cy + r);
    elements.push(
      <circle
        key={key++}
        cx={cx.toFixed(2)}
        cy={cy.toFixed(2)}
        r={r}
        fill={fill}
        fillOpacity={op}
      />,
    );
  }

  function seg(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
    w = 1,
    stroke = ISO_DARK,
    op = 1,
  ) {
    const [a, b] = R(x1, y1, z1);
    const [c, d] = R(x2, y2, z2);
    elements.push(
      <line
        key={key++}
        x1={a.toFixed(2)}
        y1={b.toFixed(2)}
        x2={c.toFixed(2)}
        y2={d.toFixed(2)}
        stroke={stroke}
        strokeWidth={w}
        strokeLinecap="round"
        strokeOpacity={op}
      />,
    );
  }

  switch (slug) {
    case "computer-3d":
      box(0, 0, 0, 1.6, 1.6, 1.0);
      topInset(0, 0, 1.0, 1.6, 1.6, 0.34, ISO_DARK, 1);
      break;
    case "server-unit-3d":
      box(0, 0, 0, 1.1, 1.1, 2.0);
      seg(1.1, 0, 0.66, 1.1, 1.1, 0.66, 1, ISO_DARK, 0.9);
      seg(1.1, 0, 1.33, 1.1, 1.1, 1.33, 1, ISO_DARK, 0.9);
      dot(1.1, 0.28, 0.34, 1.0);
      dot(1.1, 0.28, 1.0, 1.0);
      dot(1.1, 0.28, 1.66, 1.0);
      break;
    case "project-card-3d":
      box(0, 0, 0, 1.7, 1.7, 0.18, 0.78);
      seg(0.2, 1.5, 0.18, 1.5, 0.2, 0.18, 1.4, "currentColor", 0.95);
      break;
    case "glitch-signal-map":
      box(0, 0, 0, 1.7, 1.7, 0.26);
      [0.5, 1.2].forEach((u) => [0.5, 1.2].forEach((v) => dot(u, v, 0.26, 0.95)));
      break;
    case "cybernetic-glyph-grid":
      box(0, 0, 0, 1.7, 1.7, 0.26);
      [0.57, 1.13].forEach((u) => seg(u, 0.1, 0.26, u, 1.6, 0.26, 0.8, ISO_DARK, 0.9));
      [0.57, 1.13].forEach((v) => seg(0.1, v, 0.26, 1.6, v, 0.26, 0.8, ISO_DARK, 0.9));
      break;
    case "fake-console":
      box(0, 0, 0, 1.6, 1.6, 0.8);
      seg(0.35, 0.55, 0.8, 1.15, 0.55, 0.8, 1.2, ISO_DARK, 0.9);
      seg(0.35, 0.95, 0.8, 0.95, 0.95, 0.8, 1.2, ISO_DARK, 0.9);
      break;
    case "system-metrics":
      box(0, 0, 0, 1.7, 1.7, 0.2, 0.6);
      box(0.35, 0.85, 0.2, 0.32, 0.32, 0.5);
      box(0.85, 0.85, 0.2, 0.32, 0.32, 0.95);
      box(1.35, 0.85, 0.2, 0.32, 0.32, 0.7);
      break;
    case "grain-shader":
      box(0, 0, 0, 1.7, 1.7, 0.22, 0.85);
      (
        [
          [0.4, 0.5],
          [0.9, 0.35],
          [1.3, 0.7],
          [0.6, 1.1],
          [1.15, 1.2],
          [0.95, 0.85],
        ] as const
      ).forEach(([u, v]) => dot(u, v, 0.22, 0.7));
      break;
    case "mesh-background":
      box(0, 0, 0, 1.7, 1.7, 0.22, 0.45);
      dot(0.85, 0.85, 0.22, 3.4, "currentColor", 1);
      break;
    case "scroll-morph":
      box(0, 0, 0, 1.7, 1.7, 0.2, 0.5);
      box(0.45, 0.45, 0.62, 0.95, 0.95, 0.2, 1);
      break;
    default:
      box(0, 0, 0, 1.6, 1.6, 0.6);
      break;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of pts) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  const pad = 2.5;
  const viewBox = `${(minX - pad).toFixed(2)} ${(minY - pad).toFixed(2)} ${(maxX - minX + pad * 2).toFixed(2)} ${(maxY - minY + pad * 2).toFixed(2)}`;

  return { viewBox, elements };
}

export interface LabsIsoIconProps {
  /** Experiment slug — selects which isometric shape to draw. */
  slug: string;
  /** Geometry scale (default 7). Larger values render finer relative detail. */
  scale?: number;
}

/** Deterministic isometric icon for a Labs experiment, tinted via `currentColor`. */
export function LabsIsoIcon({ slug, scale = 7 }: LabsIsoIconProps) {
  const { viewBox, elements } = buildIsoIcon(slug, scale);
  return (
    <svg
      className={styles.icon}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {elements}
    </svg>
  );
}
