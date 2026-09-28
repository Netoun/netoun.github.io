import { createVar } from "@vanilla-extract/css";

/** Pointer position over the monitor, `0`–`1` on each axis, written by useChromeReflection. */
export const chromeReflection = { x: createVar(), y: createVar() };
