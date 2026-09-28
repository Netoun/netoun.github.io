import type { ExperimentSlug } from "@/features/labs/data/experiment-slugs";
import computer3d from "../assets/computer-3d.webp?no-inline";
import cyberneticGlyphGrid from "../assets/cybernetic-glyph-grid.webp?no-inline";
import fakeConsole from "../assets/fake-console.webp?no-inline";
import glitchSignalMap from "../assets/glitch-signal-map.webp?no-inline";
import grainShader from "../assets/grain-shader.webp?no-inline";
import meshBackground from "../assets/mesh-background.webp?no-inline";
import projectCard3d from "../assets/project-card-3d.webp?no-inline";
import scrollMorph from "../assets/scroll-morph.webp?no-inline";
import serverUnit3d from "../assets/server-unit-3d.webp?no-inline";
import systemMetrics from "../assets/system-metrics.webp?no-inline";
import computer3dThumb from "../assets/thumbs/computer-3d.webp?no-inline";
import cyberneticGlyphGridThumb from "../assets/thumbs/cybernetic-glyph-grid.webp?no-inline";
import fakeConsoleThumb from "../assets/thumbs/fake-console.webp?no-inline";
import glitchSignalMapThumb from "../assets/thumbs/glitch-signal-map.webp?no-inline";
import grainShaderThumb from "../assets/thumbs/grain-shader.webp?no-inline";
import meshBackgroundThumb from "../assets/thumbs/mesh-background.webp?no-inline";
import projectCard3dThumb from "../assets/thumbs/project-card-3d.webp?no-inline";
import scrollMorphThumb from "../assets/thumbs/scroll-morph.webp?no-inline";
import serverUnit3dThumb from "../assets/thumbs/server-unit-3d.webp?no-inline";
import systemMetricsThumb from "../assets/thumbs/system-metrics.webp?no-inline";

export interface LabImage {
  src: string;
  width: number;
  height: number;
}

export interface LabCapture extends LabImage {
  /** 128px wide, for the phone rows' 64px thumbnails (2x). */
  thumb: LabImage;
}

// Each experiment's stage, captured from its live demo (transparent WebP, see README › Labs).
// Imported `?no-inline`: Vite would inline the small thumbnails as base64 into the page's JS and
// its prerendered HTML, which then weighs more than the files themselves.
// The index shows them where the demo cannot run: without JS, under reduced motion, on touch.
export const labCaptures: Record<ExperimentSlug, LabCapture> = {
  "computer-3d": {
    src: computer3d,
    width: 686,
    height: 435,
    thumb: { src: computer3dThumb, width: 128, height: 82 },
  },
  "server-unit-3d": {
    src: serverUnit3d,
    width: 807,
    height: 963,
    thumb: { src: serverUnit3dThumb, width: 128, height: 153 },
  },
  "project-card-3d": {
    src: projectCard3d,
    width: 844,
    height: 954,
    thumb: { src: projectCard3dThumb, width: 128, height: 145 },
  },
  "glitch-signal-map": {
    src: glitchSignalMap,
    width: 640,
    height: 832,
    thumb: { src: glitchSignalMapThumb, width: 128, height: 167 },
  },
  "cybernetic-glyph-grid": {
    src: cyberneticGlyphGrid,
    width: 640,
    height: 832,
    thumb: { src: cyberneticGlyphGridThumb, width: 128, height: 167 },
  },
  "fake-console": {
    src: fakeConsole,
    width: 640,
    height: 832,
    thumb: { src: fakeConsoleThumb, width: 128, height: 167 },
  },
  "system-metrics": {
    src: systemMetrics,
    width: 640,
    height: 832,
    thumb: { src: systemMetricsThumb, width: 128, height: 167 },
  },
  "grain-shader": {
    src: grainShader,
    width: 1152,
    height: 704,
    thumb: { src: grainShaderThumb, width: 128, height: 79 },
  },
  "mesh-background": {
    src: meshBackground,
    width: 1200,
    height: 686,
    thumb: { src: meshBackgroundThumb, width: 128, height: 74 },
  },
  "scroll-morph": {
    src: scrollMorph,
    width: 704,
    height: 448,
    thumb: { src: scrollMorphThumb, width: 128, height: 82 },
  },
};
