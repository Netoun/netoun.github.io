import { setElementVars } from "@vanilla-extract/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  CYBERNETIC_GLYPH_GRID_DEFAULTS,
  CyberneticGlyphGrid,
  type GlyphAtlasEntry,
  type GlyphGridStats,
} from "@/components/misc/cybernetic-glyph-grid/cybernetic-glyph-grid.component";
import {
  LabsDemoLayout,
  useLabsXray,
} from "../../components/labs-experiment-frame/labs-experiment-frame.component";
import {
  ButtonGroupControl,
  ControlButton,
  ControlGroup,
  ControlPanel,
  ResetButton,
  SliderControl,
} from "../../components/labs-control/labs-control.component";
import {
  LabsReadout,
  ReadoutFigure,
  ReadoutLine,
  ReadoutRow,
  ReadoutRows,
  ReadoutSection,
} from "../../components/labs-readout/labs-readout.component";
import { LabsScreen } from "../../components/labs-screen/labs-screen.component";
import * as styles from "./cybernetic-glyph-grid.demo.css";

const STATES = ["paused", "running"] as const;
type PlayState = (typeof STATES)[number];

const DEFAULT_RATIO = CYBERNETIC_GLYPH_GRID_DEFAULTS.updateRatio * 100;
const ATLAS_WIDTH = 300;

/** Every cached bitmap laid out in rows, as the grid holds them. */
function GlyphAtlasSheet({ glyphs }: { glyphs: readonly GlyphAtlasEntry[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const scale = 0.4;
    // Pack left to right, wrapping at the sheet's width.
    const places: { glyph: GlyphAtlasEntry; x: number; y: number }[] = [];
    let x = 0;
    let y = 0;
    let rowHeight = 0;
    for (const glyph of glyphs) {
      const w = glyph.width * scale;
      const h = glyph.height * scale;
      if (x + w > ATLAS_WIDTH) {
        x = 0;
        y += rowHeight;
        rowHeight = 0;
      }
      places.push({ glyph, x, y });
      x += w;
      rowHeight = Math.max(rowHeight, h);
    }
    const height = Math.max(1, Math.ceil(y + rowHeight));
    canvas.width = ATLAS_WIDTH * dpr;
    canvas.height = height * dpr;
    setElementVars(canvas, { [styles.atlasAspect]: `${ATLAS_WIDTH} / ${height}` });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, ATLAS_WIDTH, height);
    for (const { glyph, x: gx, y: gy } of places) {
      ctx.drawImage(glyph.canvas, gx, gy, glyph.width * scale, glyph.height * scale);
    }
  }, [glyphs]);

  return (
    <div className={styles.atlasWindow}>
      <canvas ref={canvasRef} className={styles.atlas} aria-hidden="true" />
    </div>
  );
}

interface XrayReadoutProps {
  stats: GlyphGridStats | null;
  glyphs: readonly GlyphAtlasEntry[];
  tickMs: number;
}

function XrayReadout({ stats, glyphs, tickMs }: XrayReadoutProps) {
  const cells = stats?.cells ?? 0;
  return (
    <LabsReadout title="glyph atlas">
      <ReadoutFigure>tick {String(stats?.tick ?? 0).padStart(4, "0")}</ReadoutFigure>
      <ReadoutLine>
        every {tickMs} ms · {stats?.rewritten ?? 0} of {cells} rewritten · {stats?.cols ?? 0}×
        {stats?.rows ?? 0}
      </ReadoutLine>
      <ReadoutLine code>
        ({stats?.tick ?? 0}·11 + i·37 + 17) mod {cells}
      </ReadoutLine>
      <ReadoutRows>
        <ReadoutRow
          label="Rewritten this tick"
          value={stats?.rewritten ?? "—"}
          swatchClassName={styles.swatches.touched}
        />
        <ReadoutRow
          label="Glitching"
          value={stats?.glitching ?? "—"}
          rule={`(seed >>> 1) & 0x1f <= 2 · 3/32 · ${CYBERNETIC_GLYPH_GRID_DEFAULTS.glitchMs} ms`}
          swatchClassName={styles.swatches.glitching}
        />
        <ReadoutRow
          label="Accent"
          rule="((0x2f6a91c3 + i·13) >>> 2) & 0xf == 0 · fixed"
          swatchClassName={styles.swatches.accent}
        />
      </ReadoutRows>
      <ReadoutSection>
        <ReadoutRows>
          <ReadoutRow
            label="Bitmaps cached"
            value={stats?.atlas ?? glyphs.length}
            rule="key = value:tone:size:dpr · drawn once, then drawImage"
            swatchClassName={styles.swatches.atlas}
          />
        </ReadoutRows>
        <GlyphAtlasSheet glyphs={glyphs} />
      </ReadoutSection>
    </LabsReadout>
  );
}

export function CyberneticGlyphGridDemo() {
  const xray = useLabsXray();
  const [state, setState] = useState<PlayState>("running");
  const [tickMs, setTickMs] = useState<number>(CYBERNETIC_GLYPH_GRID_DEFAULTS.tickMs);
  const [ratio, setRatio] = useState(DEFAULT_RATIO);
  const [stepToken, setStepToken] = useState(0);
  const [stats, setStats] = useState<GlyphGridStats | null>(null);
  const [glyphs, setGlyphs] = useState<readonly GlyphAtlasEntry[]>([]);

  const running = state === "running";

  const reset = () => {
    setState("running");
    setTickMs(CYBERNETIC_GLYPH_GRID_DEFAULTS.tickMs);
    setRatio(DEFAULT_RATIO);
  };

  return (
    <LabsDemoLayout
      mounted={`<CyberneticGlyphGrid isAnimating={${running}} tickMs={${tickMs}} updateRatio={${(ratio / 100).toFixed(2)}} />`}
      stage={
        <div className={styles.stage}>
          <LabsScreen>
            <CyberneticGlyphGrid
              isAnimating={running}
              tickMs={tickMs}
              updateRatio={ratio / 100}
              xray={xray}
              stepToken={stepToken}
              // The readout listens only while it is on screen.
              onTick={xray ? setStats : undefined}
              onAtlas={xray ? setGlyphs : undefined}
            />
          </LabsScreen>
          {xray && <XrayReadout stats={stats} glyphs={glyphs} tickMs={tickMs} />}
        </div>
      }
      controls={
        <ControlPanel>
          <ControlGroup title="Animation">
            <ButtonGroupControl
              options={STATES}
              value={state}
              onChange={setState}
              formatOption={(option) => option[0].toUpperCase() + option.slice(1)}
            />
            <ControlButton onPress={() => setStepToken((token) => token + 1)} isDisabled={running}>
              {running ? "Pause to step" : "Step one tick"}
            </ControlButton>
          </ControlGroup>
          <ControlGroup title="Clock">
            <SliderControl
              label="Tick"
              value={tickMs}
              min={40}
              max={1000}
              step={10}
              onChange={setTickMs}
              format={(value) => `${value} ms`}
            />
            <SliderControl
              label="Rewrite"
              value={ratio}
              min={1}
              max={40}
              onChange={setRatio}
              format={(value) => `${value} %`}
            />
          </ControlGroup>
          <ResetButton onReset={reset} />
        </ControlPanel>
      }
    />
  );
}
