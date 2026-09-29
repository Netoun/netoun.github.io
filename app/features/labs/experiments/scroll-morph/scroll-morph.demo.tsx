import { assignInlineVars } from "@vanilla-extract/dynamic";
import { useRef, useState } from "react";
import {
  LabsDemoLayout,
  useLabsXray,
} from "../../components/labs-experiment-frame/labs-experiment-frame.component";
import {
  ControlGroup,
  ControlPanel,
  ResetButton,
  SliderControl,
} from "../../components/labs-control/labs-control.component";
import * as technique from "./scroll-morph.css";
import * as styles from "./scroll-morph.demo.css";

const DEFAULTS = { gutter: 28, range: 160, radius: 18 };
const SECTIONS = ["one", "two", "three", "four"];

interface MorphXrayProps {
  scrollTop: number;
  gutter: number;
  range: number;
}

/** What the timeline holds at this scroll, as the Lab reads it back. */
function MorphXray({ scrollTop, gutter, range }: MorphXrayProps) {
  const progress = Math.min(1, Math.max(0, scrollTop / range));
  return (
    <div className={styles.xray}>
      <p className={styles.kicker}>_xray / scroll timeline</p>
      <p className={styles.figure}>{progress.toFixed(2)}</p>
      <p className={styles.line}>
        scrollTop {Math.round(scrollTop)} px of a 0 → {range} px range
      </p>
      <code className={styles.code}>
        clip-path: inset(0 {(progress * gutter).toFixed(1)}px round {DEFAULTS.radius}px)
      </code>
      <p className={styles.line}>
        dashed gold: the frame before the clip · violet: the column it lands on · gold bar: the
        timeline, drawn by itself
      </p>
    </div>
  );
}

export function ScrollMorphDemo() {
  const xray = useLabsXray();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [gutter, setGutter] = useState(DEFAULTS.gutter);
  const [range, setRange] = useState(DEFAULTS.range);
  const [radius, setRadius] = useState(DEFAULTS.radius);
  const [scrollTop, setScrollTop] = useState(0);

  const reset = () => {
    setGutter(DEFAULTS.gutter);
    setRange(DEFAULTS.range);
    setRadius(DEFAULTS.radius);
    scrollerRef.current?.scrollTo({ top: 0 });
  };

  // Keyboard and touch can scrub too: the slider scrolls the page, the page drives the frame.
  const scrub = (percent: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTop = (percent / 100) * range;
  };

  return (
    <LabsDemoLayout
      mounted={`animation-timeline: --lab-morph · animation-range: 0 ${range}px · inset(0 → ${gutter}px)`}
      stage={
        <div className={styles.stage}>
          <div
            className={styles.page}
            style={assignInlineVars({
              [technique.morphGutter]: `${gutter}px`,
              [technique.morphRange]: `${range}px`,
              [technique.morphRadius]: `${radius}px`,
            })}
          >
            <div
              ref={scrollerRef}
              className={technique.scroller}
              // Browsers make a scroller keyboard-focusable on their own; Scrub drives it too.
              // The Lab's slider and readout follow the scroll; the frame never reads it.
              onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
            >
              <div className={technique.pin}>
                <div className={technique.frame}>
                  <div className={styles.hero}>
                    <p className={styles.heroLine}>_❯ scroll this page</p>
                    <p className={styles.heroNote}>The sides close in on the column.</p>
                  </div>
                </div>
                {xray && <span className={styles.ghost} aria-hidden="true" />}
              </div>
              <div className={styles.spacer} aria-hidden="true" />
              <div className={styles.sections} aria-hidden="true">
                {SECTIONS.map((section) => (
                  <div key={section} className={styles.section} />
                ))}
              </div>
            </div>
            {xray && (
              <>
                <span className={styles.column} data-side="left" aria-hidden="true" />
                <span className={styles.column} data-side="right" aria-hidden="true" />
              </>
            )}
            <span className={styles.timeline} aria-hidden="true">
              <span className={styles.timelineFill} />
            </span>
            <p className={styles.note}>
              No scroll-driven animations here (or reduced motion is on): the frame stays open, as
              the home's does.
            </p>
          </div>
          {xray && <MorphXray scrollTop={scrollTop} gutter={gutter} range={range} />}
        </div>
      }
      controls={
        <ControlPanel>
          <ControlGroup title="Frame">
            <SliderControl
              label="Gutter"
              value={gutter}
              min={0}
              max={64}
              onChange={setGutter}
              format={(value) => `${value} px`}
            />
            <SliderControl
              label="Radius"
              value={radius}
              min={0}
              max={32}
              onChange={setRadius}
              format={(value) => `${value} px`}
            />
          </ControlGroup>
          <ControlGroup title="Timeline">
            <SliderControl
              label="Range"
              value={range}
              min={40}
              max={320}
              step={10}
              onChange={setRange}
              format={(value) => `${value} px`}
            />
            <SliderControl
              label="Scrub"
              value={Math.round(Math.min(1, scrollTop / range) * 100)}
              min={0}
              max={100}
              onChange={scrub}
              format={(value) => `${value} %`}
            />
          </ControlGroup>
          <ResetButton onReset={reset} />
        </ControlPanel>
      }
    />
  );
}
