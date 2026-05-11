import * as styles from "./welcome-hero-contact-hover-card-beam.css";

export function WelcomeHeroContactHoverCardBeam() {
  return (
    <svg
      aria-hidden="true"
      className={styles.beamStyles}
      viewBox="0 0 20 80"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="beam-a"
        d="M0,18 C5,18 7,28 10,28 C13,28 15,18 20,18"
        className={styles.beamWireStyles}
      />
      <path
        id="beam-b"
        d="M0,26 C5,26 7,32 10,32 C13,32 15,26 20,26"
        className={styles.beamWireDimStyles}
      />
      <path
        id="beam-c"
        d="M0,34 C6,34 8,38 10,38 C12,38 14,34 20,34"
        className={styles.beamWireDimStyles}
      />
      <path
        id="beam-d"
        d="M0,46 C6,46 8,42 10,42 C12,42 14,46 20,46"
        className={styles.beamWireDimStyles}
      />
      <path
        id="beam-e"
        d="M0,54 C5,54 7,48 10,48 C13,48 15,54 20,54"
        className={styles.beamWireDimStyles}
      />
      <path
        id="beam-f"
        d="M0,62 C5,62 7,52 10,52 C13,52 15,62 20,62"
        className={styles.beamWireStyles}
      />

      <g className={styles.beamPacketStyles}>
        <circle r="0.75">
          <animateMotion dur="1.4s" repeatCount="indefinite">
            <mpath href="#beam-a" />
          </animateMotion>
        </circle>

        <circle r="0.55">
          <animateMotion dur="1.1s" begin="0.25s" repeatCount="indefinite">
            <mpath href="#beam-b" />
          </animateMotion>
        </circle>

        <circle r="0.45">
          <animateMotion dur="0.9s" begin="0.45s" repeatCount="indefinite">
            <mpath href="#beam-c" />
          </animateMotion>
        </circle>

        <circle r="0.45">
          <animateMotion dur="0.95s" begin="0.15s" repeatCount="indefinite">
            <mpath href="#beam-d" />
          </animateMotion>
        </circle>

        <circle r="0.55">
          <animateMotion dur="1.15s" begin="0.35s" repeatCount="indefinite">
            <mpath href="#beam-e" />
          </animateMotion>
        </circle>

        <circle r="0.75">
          <animateMotion dur="1.5s" begin="0.2s" repeatCount="indefinite">
            <mpath href="#beam-f" />
          </animateMotion>
        </circle>
      </g>

      <ellipse cx="0" cy="40" rx="2.6" ry="1.2" className={styles.beamFlowPrimaryStyles} />

      <ellipse cx="0" cy="40" rx="1.7" ry="0.75" className={styles.beamFlowSecondaryStyles} />
    </svg>
  );
}
