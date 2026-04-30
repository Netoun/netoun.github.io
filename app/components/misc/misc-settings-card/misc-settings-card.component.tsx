import type { ReactNode } from "react";
import { Button } from "@/components/primitives/button/button.component";
import {
  settingsCard,
  settingsCardContent,
  settingsCardHeader,
  settingsCardTitle,
} from "./misc-settings-card.css";

interface MiscSettingsCardProps {
  title?: string;
  onReset?: () => void;
  children?: ReactNode;
}

export function MiscSettingsCard({
  title = "Paramètres 3D",
  onReset,
  children,
}: MiscSettingsCardProps) {
  return (
    <div className={settingsCard}>
      {title && (
        <div className={settingsCardHeader}>
          <h2 className={settingsCardTitle}>{title}</h2>
        </div>
      )}

      <div className={settingsCardContent}>
        {children}
        {onReset && <Button onPress={onReset}>Reset</Button>}
      </div>
    </div>
  );
}
