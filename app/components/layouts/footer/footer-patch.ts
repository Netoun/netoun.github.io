import type { ServerPatchAccent } from "@/components/misc/server-unit/server-unit.component";

// One identity accent per contact link, shared by the rack's jacks and the ports: the email
// speaks in Kirby pink (the footer's contact voice), the others take gold, mint, violet in order.
const EMAIL_ACCENT: ServerPatchAccent = "kirby";
const LINK_ACCENTS = [
  "primary",
  "secondary",
  "tertiary",
] as const satisfies readonly ServerPatchAccent[];

export interface FooterPort {
  id: string;
  /** Port number printed on the plate and on the rack's jack (`01`…). */
  number: string;
  label: string;
  url: string;
  /** The address people read: the URL without its scheme, `www.` or trailing slash. */
  address: string;
  scheme: string;
  accent: ServerPatchAccent;
  external: boolean;
}

/** A file the plate hands over, under the Labs uplink: the résumé. */
export interface FooterFile {
  href: string;
  label: string;
  /** What its display reads (`A4`). */
  format: string;
  detail: string;
}

export interface FooterPortLink {
  label: string;
  url: string;
}

/** `https://www.linkedin.com/in/x/` → `linkedin.com/in/x`; `mailto:a@b.c` → `a@b.c`. */
export function linkAddress(url: string): string {
  if (url.startsWith("mailto:")) return url.slice("mailto:".length);
  const parsed = new URL(url);
  const host = parsed.hostname.replace(/^www\./, "");
  const path = parsed.pathname.replace(/\/+$/, "");
  return `${host}${path}`;
}

/** `https`, `mailto`… */
export function linkScheme(url: string): string {
  return url.slice(0, url.indexOf(":"));
}

export function toFooterPorts(links: readonly FooterPortLink[]): FooterPort[] {
  let linkIndex = 0;
  return links.map((link, index) => {
    const isEmail = link.url.startsWith("mailto:");
    const accent = isEmail ? EMAIL_ACCENT : LINK_ACCENTS[linkIndex++ % LINK_ACCENTS.length];
    return {
      id: `port-${index + 1}`,
      number: String(index + 1).padStart(2, "0"),
      label: link.label,
      url: link.url,
      address: linkAddress(link.url),
      scheme: linkScheme(link.url),
      accent,
      external: !isEmail,
    };
  });
}

/** At rest the cable sits in the email port — the one address a visitor can use as is. */
export function restPortId(ports: readonly FooterPort[]): string | null {
  return ports.find((port) => port.scheme === "mailto")?.id ?? null;
}

export interface CablePoint {
  x: number;
  y: number;
}

export interface CableGeometry {
  path: string;
  /** Strain-relief boot under the rack's plug. */
  rackBoot: string;
  /** Strain-relief boot on the left of the port's plug. */
  portBoot: string;
}

const BOOT_LENGTH = 12;

const round = (value: number) => Math.round(value * 10) / 10;
const point = (x: number, y: number) => `${round(x)} ${round(y)}`;

/**
 * A patch cable hanging from the bottom of the rack's jack (`from`) to the left edge of a
 * port's plug (`to`): it drops under the rack, sags past the port, and runs level into the
 * plug. Lower ports sag a little deeper so neighbouring cables never share a curve.
 */
export function cableGeometry(from: CablePoint, to: CablePoint, index: number): CableGeometry {
  const start = { x: from.x, y: from.y + BOOT_LENGTH - 4 };
  const end = { x: to.x - BOOT_LENGTH, y: to.y };
  const drop = Math.max(start.y + 200 + index * 14, end.y + 40);
  const reach = Math.min(170, 0.45 * (end.x - start.x));

  return {
    path: `M ${point(start.x, start.y)} C ${point(start.x + 6, drop)}, ${point(end.x - reach, end.y + 46)}, ${point(end.x, end.y)}`,
    rackBoot: `M ${point(from.x - 4, from.y - 1)} L ${point(from.x + 4, from.y - 1)} L ${point(from.x + 3, start.y + 1)} L ${point(from.x - 3, start.y + 1)} Z`,
    portBoot: `M ${point(end.x - 1, end.y - 3)} L ${point(to.x, end.y - 5)} L ${point(to.x, end.y + 5)} L ${point(end.x - 1, end.y + 3)} Z`,
  };
}
