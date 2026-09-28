// The sections nav (welcome-sections-nav) docks across the foot of the screen below `md`.
// Anything else pinned to the bottom of the viewport there pads itself by `dockClearance`
// so the capsule never sits on top of it.

/** Capsule height on touch screens (a 44px target plus its frame). */
export const DOCK_HEIGHT = "3.25rem";

/** Gap between the capsule and the bottom edge (the safe area wins when it is larger). */
export const DOCK_OFFSET = "1rem";

export const dockClearance = `calc(${DOCK_HEIGHT} + ${DOCK_OFFSET} * 2)`;
