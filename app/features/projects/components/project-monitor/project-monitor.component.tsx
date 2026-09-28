import { useEffect, useMemo, useRef, useState } from "react";
import { Button, GridList, GridListItem, Toolbar } from "react-aria-components";
import type { Key, Selection } from "react-aria-components";
import { Link } from "react-router";
import {
  countDomains,
  DEFAULT_SORT,
  monitorStats,
  nextSort,
  sortProcesses,
  toProcesses,
} from "../../data/project-processes";
import type { ProcessSort, ProcessSortKey } from "../../data/project-processes";
import { useChromeReflection } from "../../hooks/use-chrome-reflection.hook";
import type { Project } from "../../data/projects-data.types";
import { ProjectMonitorBox } from "./components/project-monitor-box/project-monitor-box.component";
import { ProjectMonitorCapture } from "./components/project-monitor-capture/project-monitor-capture.component";
import { ProjectMonitorDetail } from "./components/project-monitor-detail/project-monitor-detail.component";
import { ProjectMonitorKeycap } from "./components/project-monitor-keycap/project-monitor-keycap.component";
import { ProjectMonitorMeters } from "./components/project-monitor-meters/project-monitor-meters.component";
import { ProjectMonitorUptime } from "./components/project-monitor-uptime/project-monitor-uptime.component";
import * as styles from "./project-monitor.css";
import { Glyph } from "@/components/primitives/glyph/glyph.component";

const STATUS_LABEL = { live: "LIVE", source: "SRC" } as const;
const SORTABLE: ProcessSortKey[] = ["name", "status", "date"];

type HeldKey = "up" | "down" | "enter";
// Keys the grid answers to, mirrored on the key bar's keycaps while held.
const HELD_KEYS: Partial<Record<string, HeldKey>> = {
  ArrowUp: "up",
  ArrowDown: "down",
  Enter: "enter",
};

const pad = (value: number) => String(value).padStart(2, "0");

export interface ProjectMonitorProps {
  projects: Project[];
  /** The section is on screen: the uptime ticks. */
  isOnScreen: boolean;
}

/**
 * The projects as a light-mode process monitor. A click or a tap on a row (or the arrow
 * keys) selects it and fills the detail pane; Enter or a double click opens it, the name is
 * a link. Hover selects nothing: the pointer crosses rows on its way to the pane.
 */
export function ProjectMonitor({ projects, isOnScreen }: ProjectMonitorProps) {
  const processes = useMemo(() => toProcesses(projects), [projects]);
  const meters = useMemo(() => countDomains(projects), [projects]);
  const stats = useMemo(() => monitorStats(processes), [processes]);
  const [sort, setSort] = useState<ProcessSort>(DEFAULT_SORT);
  const [hasSorted, setHasSorted] = useState(false);
  const rows = useMemo(() => sortProcesses(processes, sort), [processes, sort]);
  const [selectedId, setSelectedId] = useState(() => rows[0]?.id);
  const [heldKey, setHeldKey] = useState<HeldKey | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  // How the last row press started: React Aria runs the row action on a tap.
  const pointerTypeRef = useRef<string>("mouse");

  useChromeReflection(windowRef, isOnScreen);

  // Listens on the grid itself (never the document): only keys typed in the projects count.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const onKeyDown = (event: KeyboardEvent) => {
      pointerTypeRef.current = "keyboard";
      const key = HELD_KEYS[event.key];
      if (key) setHeldKey(key);
    };
    const onPointerDown = (event: PointerEvent) => {
      pointerTypeRef.current = event.pointerType;
    };
    const release = () => setHeldKey(null);
    grid.addEventListener("keydown", onKeyDown);
    grid.addEventListener("pointerdown", onPointerDown, { capture: true });
    grid.addEventListener("keyup", release);
    grid.addEventListener("focusout", release);
    return () => {
      grid.removeEventListener("keydown", onKeyDown);
      grid.removeEventListener("pointerdown", onPointerDown, { capture: true });
      grid.removeEventListener("keyup", release);
      grid.removeEventListener("focusout", release);
    };
  }, []);

  const selectedIndex = Math.max(
    0,
    rows.findIndex((row) => row.id === selectedId),
  );
  const selected = rows[selectedIndex];
  if (!selected) return null;

  const selectAt = (index: number) => {
    setSelectedId(rows[(index + rows.length) % rows.length].id);
  };

  const sortBy = (key: ProcessSortKey) => {
    setSort((current) => nextSort(current, key));
    setHasSorted(true);
  };

  const onSelectionChange = (keys: Selection) => {
    if (keys === "all") return;
    const [key] = keys;
    if (key !== undefined) setSelectedId(String(key));
  };

  // A tap selects like a click; opening a new tab takes the name link or the OPEN key.
  const openRow = (key: Key) => {
    const row = rows.find((candidate) => candidate.id === key);
    if (!row) return;
    if (pointerTypeRef.current === "touch" || pointerTypeRef.current === "pen") {
      setSelectedId(row.id);
      return;
    }
    window.open(row.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div ref={windowRef} className={styles.windowStyle} data-sorted={hasSorted ? "" : undefined}>
      <div className={styles.commandBarStyle} aria-hidden="true">
        <span className={styles.commandStyle}>
          <span className={styles.commandTextStyle}>_❯ netoun ps --projects</span>
          <span className={styles.cursorStyle}>▐</span>
        </span>
        <ProjectMonitorUptime isTicking={isOnScreen} />
      </div>

      <div className={styles.summaryStyle}>
        <ProjectMonitorMeters meters={meters} />
        <dl className={styles.statsStyle}>
          <div className={styles.statRowStyle}>
            <dt className={styles.statTermStyle}>TASKS</dt>
            <dd className={styles.statValueStyle}>
              {pad(stats.total)}{" "}
              <span className={styles.statNoteStyle}>
                · {pad(stats.live)} live, {pad(stats.source)} source
              </span>
            </dd>
          </div>
          <div className={styles.statRowStyle}>
            <dt className={styles.statTermStyle}>SINCE</dt>
            <dd className={styles.statValueStyle}>{stats.since}</dd>
          </div>
          <div className={styles.statRowStyle}>
            <dt className={styles.statTermStyle}>LATEST</dt>
            <dd className={styles.statValueStyle}>{stats.latest}</dd>
          </div>
        </dl>
      </div>

      <Toolbar className={styles.columnsStyle} aria-label="Sort projects">
        <span className={styles.sortLabelStyle} aria-hidden="true">
          SORT
        </span>
        <span className={styles.columnLabelStyle({ column: "id" })} aria-hidden="true">
          ID
        </span>
        {SORTABLE.map((key) => {
          const active = sort.key === key;
          return (
            <Button
              key={key}
              className={styles.sortButtonStyle({ column: key })}
              onPress={() => sortBy(key)}
              aria-label={active ? `Sort by ${key}, ${sort.direction}` : `Sort by ${key}`}
            >
              {key.toUpperCase()}
              <span aria-hidden="true" className={styles.sortIndicatorStyle({ active })}>
                {active && sort.direction === "ascending" ? "↑" : "↓"}
              </span>
            </Button>
          );
        })}
        <span className={styles.columnLabelStyle({ column: "host" })} aria-hidden="true">
          HOST
        </span>
        <span className={styles.columnLabelStyle({ column: "stack" })} aria-hidden="true">
          STACK
        </span>
      </Toolbar>

      <GridList
        ref={gridRef}
        aria-label="Projects"
        items={rows}
        selectionMode="single"
        selectionBehavior="replace"
        disallowEmptySelection
        selectedKeys={[selected.id]}
        onSelectionChange={onSelectionChange}
        onAction={openRow}
        className={styles.listStyle}
      >
        {(row) => (
          <GridListItem id={row.id} textValue={row.title} className={styles.rowStyle}>
            <span className={styles.cellIdStyle}>
              <Glyph className={styles.caretStyle}>❯</Glyph>
              {row.pid}
            </span>
            <a
              href={row.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cellNameStyle}
            >
              {row.title}
            </a>
            <span className={styles.cellStatusStyle}>
              <ProjectMonitorBox
                kind={row.status === "live" ? "server" : "cube"}
                tone={row.status === "live" ? "graphite" : "violet"}
                className={styles.statusBoxStyle}
              />
              {STATUS_LABEL[row.status]}
            </span>
            <span className={styles.cellHostStyle}>{row.address}</span>
            <span className={styles.cellStackStyle}>{row.stack}</span>
            <span className={styles.cellDateStyle}>{row.yearMonth}</span>
            <ProjectMonitorCapture src={row.image} className={styles.cellMediaStyle} />
            <p className={styles.cellDescriptionStyle}>{row.description}</p>
          </GridListItem>
        )}
      </GridList>

      <ProjectMonitorDetail process={selected} />

      <div className={styles.keysStyle}>
        <Button
          className={styles.keyStyle}
          onPress={() => selectAt(selectedIndex - 1)}
          aria-label="Previous project"
        >
          <ProjectMonitorKeycap label="↑" isDown={heldKey === "up"} />
          PREV
        </Button>
        <Button
          className={styles.keyStyle}
          onPress={() => selectAt(selectedIndex + 1)}
          aria-label="Next project"
        >
          <ProjectMonitorKeycap label="↓" isDown={heldKey === "down"} />
          NEXT
        </Button>
        <a
          href={selected.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.keyStyle}
          aria-label={`Open ${selected.title}`}
        >
          <ProjectMonitorKeycap label="⏎" wide isDown={heldKey === "enter"} />
          OPEN
        </a>
        <span className={styles.keysSpacerStyle} />
        <Link to="/labs/" className={styles.keyStyle}>
          LABS →
        </Link>
      </div>
    </div>
  );
}
