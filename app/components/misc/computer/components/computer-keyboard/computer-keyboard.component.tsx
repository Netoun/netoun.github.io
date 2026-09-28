import { memo } from "react";
import * as styles from "./computer-keyboard.css";

const computerKeyboardLayout = [
  "Esc 1 2 3 4 5 6 7 8 9 0 - = ⌫",
  "Tab q w e r t y u i o p [ ] Del",
  "Caps a s d f g h j k l ; ' Enter",
  "Shift z x c v b n m , . / Shift",
  "Ctrl ⌘ Alt Space Alt Fn1 Fn2 Ctrl",
];

// A row repeats some keys (Shift, Alt, Ctrl): the second one is keyed `Shift-2`.
const computerKeyboardRows = computerKeyboardLayout.map((row) => {
  const seen = new Map<string, number>();
  const keys = row
    .split(" ")
    .filter((label) => label.length > 0)
    .map((label) => {
      const occurrence = (seen.get(label) ?? 0) + 1;
      seen.set(label, occurrence);
      return { id: occurrence === 1 ? label : `${label}-${occurrence}`, label };
    });
  return { row, keys };
});

export const ComputerKeyboard = memo(() => {
  return (
    <div className={styles.computerKeyboardStyle}>
      {computerKeyboardRows.map(({ row, keys }) => (
        <div key={row} className={styles.computerKeyboardRowStyle}>
          {keys.map(({ id, label }) => (
            <div key={id} data-key={label} className={styles.computerKeyboardKeyStyle}>
              {label}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});
