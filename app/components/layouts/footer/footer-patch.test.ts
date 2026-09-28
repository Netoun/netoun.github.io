import { describe, expect, it } from "vitest";
import { cableGeometry, linkAddress, linkScheme, restPortId, toFooterPorts } from "./footer-patch";

const LINKS = [
  { label: "GitHub", url: "https://github.com/netoun" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/nicolas-coulonnier-66416813b/" },
  { label: "Twitter / X", url: "https://x.com/netoun" },
  { label: "Email", url: "mailto:netoun@proton.me" },
];

describe("linkAddress", () => {
  it("drops the scheme, www. and the trailing slash", () => {
    expect(linkAddress("https://www.linkedin.com/in/nicolas-coulonnier-66416813b/")).toBe(
      "linkedin.com/in/nicolas-coulonnier-66416813b",
    );
    expect(linkAddress("https://github.com/netoun")).toBe("github.com/netoun");
  });

  it("prints a mailto link as the bare address", () => {
    expect(linkAddress("mailto:netoun@proton.me")).toBe("netoun@proton.me");
  });
});

describe("linkScheme", () => {
  it("reads the scheme before the colon", () => {
    expect(linkScheme("https://x.com/netoun")).toBe("https");
    expect(linkScheme("mailto:netoun@proton.me")).toBe("mailto");
  });
});

describe("toFooterPorts", () => {
  it("numbers the ports and gives each link its accent in order", () => {
    const ports = toFooterPorts(LINKS);
    expect(ports.map((port) => port.number)).toEqual(["01", "02", "03", "04"]);
    expect(ports.map((port) => port.accent)).toEqual(["primary", "secondary", "tertiary", "kirby"]);
    expect(ports.map((port) => port.external)).toEqual([true, true, true, false]);
  });

  it("keeps the email in Kirby pink whatever its position", () => {
    const ports = toFooterPorts([LINKS[0], LINKS[1], LINKS[3]]);
    expect(ports.map((port) => port.accent)).toEqual(["primary", "secondary", "kirby"]);
  });
});

describe("restPortId", () => {
  it("rests on the email port", () => {
    expect(restPortId(toFooterPorts(LINKS))).toBe("port-4");
  });

  it("rests on nothing when there is no email", () => {
    expect(restPortId(toFooterPorts(LINKS.slice(0, 3)))).toBeNull();
  });
});

describe("cableGeometry", () => {
  it("starts under the rack's plug and ends at the port's boot", () => {
    const { path, rackBoot, portBoot } = cableGeometry({ x: 120, y: 130 }, { x: 560, y: 380 }, 3);
    expect(path.startsWith("M 120 138 C")).toBe(true);
    expect(path.endsWith("548 380")).toBe(true);
    expect(rackBoot.startsWith("M 116 129")).toBe(true);
    expect(portBoot).toContain("560 375");
  });

  it("sags below the lower end", () => {
    const { path } = cableGeometry({ x: 120, y: 130 }, { x: 560, y: 380 }, 0);
    const firstControlY = Number(path.split(" C ")[1].split(",")[0].split(" ")[1]);
    expect(firstControlY).toBeGreaterThan(380);
  });
});
