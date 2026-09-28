import { useId } from "react";
import { Tag, TagGroup, TagList } from "react-aria-components";
import type { Selection } from "react-aria-components";
import { formatReceipt } from "../../../../data/skill-fetch";
import type { StackDomain, StackGroup } from "../../../../data/skills-data.types";
import * as styles from "./skill-fetch-stack.css";

const DOMAIN_TITLES: Record<StackDomain, string> = {
  frontend: "Frontend",
  backend: "Backend",
  creative: "Creative",
  systems: "Systems & AI",
  tooling: "Tooling",
};

export interface SkillFetchStackProps {
  groups: StackGroup[];
  /** The tool whose receipt is printed, if any. */
  selectedTool: string | null;
  onSelectTool: (tool: string) => void;
  /** The domain being pointed at or focused, or null once the pointer or focus leaves. */
  onPointDomain: (domain: StackDomain | null) => void;
}

/**
 * The stack printed on the paper: one check per domain, an LED per tool, the tools as prose.
 * Pointing at a tool, focusing it or tapping it prints where it ships underneath.
 */
export function SkillFetchStack({
  groups,
  selectedTool,
  onSelectTool,
  onPointDomain,
}: SkillFetchStackProps) {
  const titleId = useId();
  const selected = groups
    .flatMap((group) => group.tools)
    .find((tool) => tool.name === selectedTool);

  const onSelectionChange = (keys: Selection) => {
    if (keys === "all") return;
    const [key] = keys;
    if (key !== undefined) onSelectTool(String(key));
  };

  return (
    <section
      className={styles.stackStyle}
      aria-labelledby={titleId}
      onPointerLeave={() => onPointDomain(null)}
    >
      <div className={styles.labelRowStyle}>
        <h3 id={titleId} className={styles.labelStyle}>
          STACK
        </h3>
        <p className={styles.labelNoteStyle}>FOUND IN THE PROJECTS, JOBS, LABS OR THIS SITE</p>
      </div>

      <ul className={styles.groupsStyle}>
        {groups.map((group) => {
          const title = DOMAIN_TITLES[group.domain];
          const holdsSelection = group.tools.some((tool) => tool.name === selectedTool);
          return (
            <li
              key={group.domain}
              // The four coloured domains fill the 2 × 2 grid; tooling runs as one line under it.
              className={group.domain === "tooling" ? styles.toolingGroupStyle : styles.groupStyle}
              onPointerEnter={() => onPointDomain(group.domain)}
            >
              <span className={styles.tickStyle({ domain: group.domain })} aria-hidden="true">
                ✓
              </span>
              <div className={styles.groupBodyStyle}>
                <div className={styles.groupHeadStyle}>
                  <h4 className={styles.groupTitleStyle}>{title}</h4>
                  <span className={styles.meterStyle} aria-hidden="true">
                    {group.tools.map((tool) => (
                      <span
                        key={tool.name}
                        className={styles.segmentStyle({ domain: group.domain })}
                      />
                    ))}
                  </span>
                  <span className={styles.countStyle}>
                    {String(group.tools.length).padStart(2, "0")}
                    <span className={styles.hiddenReceiptStyle}> tools</span>
                  </span>
                </div>
                <TagGroup
                  className={styles.toolGroupStyle}
                  aria-label={`${title} tools`}
                  selectionMode="single"
                  disallowEmptySelection
                  selectedKeys={holdsSelection && selectedTool ? [selectedTool] : []}
                  onSelectionChange={onSelectionChange}
                >
                  <TagList className={styles.toolsStyle}>
                    {group.tools.map((tool) => (
                      <Tag
                        key={tool.name}
                        id={tool.name}
                        // The row's accessible name: the tool, then where it ships.
                        textValue={`${tool.name}: ${formatReceipt(tool.receipt)}`}
                        className={styles.toolStyle({ domain: group.domain })}
                        onHoverStart={() => onSelectTool(tool.name)}
                        onFocus={() => {
                          onSelectTool(tool.name);
                          onPointDomain(group.domain);
                        }}
                        onBlur={() => onPointDomain(null)}
                      >
                        {tool.name}
                        <span className={styles.hiddenReceiptStyle}>
                          : {formatReceipt(tool.receipt)}
                        </span>
                      </Tag>
                    ))}
                  </TagList>
                </TagGroup>
              </div>
            </li>
          );
        })}
      </ul>

      <p className={styles.receiptStyle} aria-hidden="true">
        <span className={styles.receiptArrowStyle}>↳</span>
        <span className={styles.receiptTextStyle}>
          <span className={styles.receiptNameStyle}>
            {selected ? selected.name.toUpperCase() : "RECEIPTS"}
          </span>
          {selected
            ? formatReceipt(selected.receipt)
            : "Point at a tool, or tap it: where it ships prints here."}
        </span>
      </p>
    </section>
  );
}
