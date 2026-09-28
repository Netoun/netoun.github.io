import { useId } from "react";
import { Glyph } from "@/components/primitives/glyph/glyph.component";
import type { NotFoundGame } from "../../hooks/use-not-found-game.hook";
import { NotFoundGameConsole } from "./components/console/not-found-game-console.component";
import { NotFoundGameServer } from "./components/server/not-found-game-server.component";
import { NotFoundGameSpares } from "./components/spares/not-found-game-spares.component";
import * as styles from "./not-found-game.css";

export interface NotFoundGameSectionProps {
  game: NotFoundGame;
}

/**
 * Make it 404: plug the spares into RACK 404, left to right, press power, and read the run in
 * its console. The result is announced in words; the console is for the eye.
 */
export function NotFoundGameSection({ game }: NotFoundGameSectionProps) {
  const headingId = useId();
  const isBusy = game.phase === "running";

  return (
    <section className={styles.sectionStyle} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.headingStyle}>
        <Glyph className={styles.promptStyle}>_❯</Glyph>
        Make it 404
      </h2>
      <p className={styles.leadStyle}>
        Plug numbers and operators into the server, left to right: it computes as you plug. Get it
        to 404, then press power. Each number goes in once, an operator up to three times. After
        each run, the bays tell you how close you are to a solution.
      </p>
      <ul className={styles.legendStyle} aria-label="What the bays show">
        <li className={styles.legendItemStyle}>
          <span className={styles.swatchStyle} data-score="right" aria-hidden="true" />
          Right bay
        </li>
        <li className={styles.legendItemStyle}>
          <span className={styles.swatchStyle} data-score="elsewhere" aria-hidden="true" />
          In the solution, another bay
        </li>
        <li className={styles.legendItemStyle}>
          <span className={styles.swatchStyle} data-score="absent" aria-hidden="true" />
          Not in it
        </li>
      </ul>

      <div className={styles.serverStyle}>
        <NotFoundGameServer
          numbers={game.numbers}
          bays={game.bays}
          leds={game.leds}
          acc={game.acc}
          totals={game.totals}
          isReady={game.isReady}
          liveFault={game.liveFault}
          phase={game.phase}
          tries={game.tries}
          onEject={game.eject}
          onPower={game.power}
        />
      </div>

      <div className={styles.benchStyle}>
        <NotFoundGameSpares
          numbers={game.numbers}
          placedAt={game.placedAt}
          numberKnowledge={game.numberKnowledge}
          operatorKnowledge={game.operatorKnowledge}
          operatorsLeft={game.operatorsLeft}
          numbersFull={game.numbersFull}
          operatorsFull={game.operatorsFull}
          draw={game.draw}
          isBusy={isBusy}
          onPlugNumber={game.plugNumber}
          onPlugOperator={game.plugOperator}
          onEjectAll={game.ejectAll}
          onReroll={game.reroll}
        />
        <NotFoundGameConsole
          numbers={game.numbers}
          history={game.history}
          tries={game.tries}
          scores={game.scores}
          lines={game.lines}
          phase={game.phase}
          hasRun={game.hasRun}
          stale={game.stale}
        />
      </div>

      <p className={styles.liveStyle} aria-live="polite">
        {game.isReady ? "The bays make 404: press power." : game.result}
      </p>
    </section>
  );
}
