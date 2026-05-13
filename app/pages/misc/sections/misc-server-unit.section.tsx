import clsx from "clsx";
import { useState } from "react";
import { ServerUnitRack } from "@/components/misc/server-unit/server-unit.component";
import { MiscSettingsCard } from "@/components/misc/settings-card/settings-card.component";
import { Slider } from "@/components/primitives/slider/slider.component";
import {
  serverUnitSection,
  serverUnitSettingsInput,
  serverUnitSettingsLabel,
  serverUnitSettingsLabelTitle,
  serverUnitSettingsSection,
  serverUnitSizeButton,
  serverUnitSizeButtonActive,
  serverUnitSizeRow,
  serverUnitSettingsValue,
  serverUnitWrapper3D,
  serverUnitWrapperBase,
} from "./misc-server-unit.css";

type ServerUnitSize = "xs" | "sm" | "md" | "lg";

export function ServerUnitSection() {
  const [rotate, setRotate] = useState({ x: 4, y: -24, z: 0 });
  const [scale, setScale] = useState(1);
  const [seed, setSeed] = useState(42);
  const [size, setSize] = useState<ServerUnitSize>("md");

  const resetTransform = () => {
    setRotate({ x: 4, y: -24, z: 0 });
    setScale(1);
    setSeed(42);
    setSize("md");
  };

  const sizeOptions: ServerUnitSize[] = ["xs", "sm", "md", "lg"];

  const settingsGroups = [
    {
      title: "Rotation",
      controls: [
        {
          label: "X",
          value: rotate.x,
          min: -180,
          max: 180,
          onChange: (value: number) => setRotate((prev) => ({ ...prev, x: value })),
          formatValue: (value: number) => `${value}°`,
          step: 1,
        },
        {
          label: "Y",
          value: rotate.y,
          min: -180,
          max: 180,
          onChange: (value: number) => setRotate((prev) => ({ ...prev, y: value })),
          formatValue: (value: number) => `${value}°`,
          step: 1,
        },
        {
          label: "Z",
          value: rotate.z,
          min: -180,
          max: 180,
          onChange: (value: number) => setRotate((prev) => ({ ...prev, z: value })),
          formatValue: (value: number) => `${value}°`,
          step: 1,
        },
      ],
    },
    {
      title: "Échelle",
      controls: [
        {
          label: "Scale",
          value: scale,
          min: 0.1,
          max: 3,
          onChange: setScale,
          formatValue: (value: number) => `${value.toFixed(2)}x`,
          step: 0.1,
        },
      ],
    },
    {
      title: "LEDs",
      controls: [
        {
          label: "Seed",
          value: seed,
          min: 0,
          max: 100,
          onChange: (value: number) => setSeed(value),
          formatValue: (value: number) => `#${value}`,
          step: 1,
        },
      ],
    },
  ];

  return (
    <section className={serverUnitSection}>
      <div
        className={serverUnitWrapperBase}
        style={{ transform: `scale(${scale})` }}
      >
        <div
          className={serverUnitWrapper3D}
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) rotateZ(${rotate.z}deg)`,
          }}
        >
          <ServerUnitRack seed={seed} size={size} />
        </div>
      </div>

      <MiscSettingsCard title="Paramètres 3D" onReset={resetTransform}>
        <div className={serverUnitSettingsSection}>
          <h3>Taille</h3>
          <div className={serverUnitSizeRow}>
            {sizeOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={clsx(serverUnitSizeButton, size === option && serverUnitSizeButtonActive)}
                onClick={() => setSize(option)}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {settingsGroups.map((group) => (
          <div className={serverUnitSettingsSection} key={group.title}>
            <h3>{group.title}</h3>
            {group.controls.map((control) => (
              <div className={serverUnitSettingsLabel} key={control.label}>
                <span className={serverUnitSettingsLabelTitle}>
                  {control.label}
                </span>
                <Slider
                  className={serverUnitSettingsInput}
                  minValue={control.min}
                  maxValue={control.max}
                  step={control.step}
                  value={control.value}
                  onChange={(e) => control.onChange(e)}
                />
                <span className={serverUnitSettingsValue}>
                  {control.formatValue(control.value)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </MiscSettingsCard>
    </section>
  );
}
