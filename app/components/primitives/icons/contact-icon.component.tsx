import { useId } from "react";
import {
  iconGradientEndStopStyles,
  iconGradientMiddleStopStyles,
  iconGradientStartStopStyles,
} from "./contact-icon.css";

interface ContactIconProps {
  label: string;
}

interface GradientIconProps {
  path: string;
}

function GradientIcon({ path }: GradientIconProps) {
  const gradientId = useId();

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className={iconGradientStartStopStyles} />
          <stop offset="55%" className={iconGradientMiddleStopStyles} />
          <stop offset="100%" className={iconGradientEndStopStyles} />
        </linearGradient>
      </defs>
      <path fill={`url(#${gradientId})`} d={path} />
    </svg>
  );
}

export function ContactIcon({ label }: ContactIconProps) {
  if (label === "GitHub") {
    return (
      <GradientIcon path="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.07-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.72.08-.72 1.21.09 1.84 1.23 1.84 1.23 1.07 1.84 2.81 1.31 3.49 1 .11-.78.42-1.31.77-1.61-2.67-.3-5.47-1.33-5.47-5.9 0-1.3.46-2.36 1.22-3.19-.12-.3-.53-1.52.12-3.17 0 0 .99-.32 3.25 1.22a11.2 11.2 0 0 1 5.92 0c2.26-1.54 3.25-1.22 3.25-1.22.65 1.65.24 2.87.12 3.17.76.83 1.22 1.89 1.22 3.19 0 4.58-2.81 5.59-5.49 5.89.43.37.82 1.1.82 2.23 0 1.61-.01 2.9-.01 3.29 0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
    );
  }

  if (label === "LinkedIn") {
    return (
      <GradientIcon path="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.13 1.44-2.13 2.94v5.66H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77A1.77 1.77 0 0 0 0 1.77v20.46C0 23.2.8 24 1.77 24h20.46c.98 0 1.77-.8 1.77-1.77V1.77C24 .8 23.2 0 22.23 0Z" />
    );
  }

  if (label === "Twitter / X") {
    return (
      <GradientIcon path="M18.9 2H22l-6.78 7.75L23.2 22h-6.27l-4.91-6.42L6.41 22H3.3l7.25-8.28L.8 2h6.42l4.44 5.86L18.9 2Zm-1.1 18.12h1.74L6.28 3.78H4.42L17.8 20.12Z" />
    );
  }

  return (
    <GradientIcon path="M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13Zm2.15-.5 7.85 6.45L19.85 5h-15.7Zm15.85 2.58-6.9 5.67a1.73 1.73 0 0 1-2.2 0L4 7.58V18.5c0 .28.22.5.5.5h15a.5.5 0 0 0 .5-.5V7.58Z" />
  );
}
