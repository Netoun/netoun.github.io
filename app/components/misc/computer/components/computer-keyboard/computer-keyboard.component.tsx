import { memo } from 'react';
import * as styles from './computer-keyboard.css';

const computerKeyboardLayout = [
	'Esc 1 2 3 4 5 6 7 8 9 0 - = ⌫',
	'Tab q w e r t y u i o p [ ] Del',
	"Caps a s d f g h j k l ; ' Enter",
	'Shift z x c v b n m , . / Shift',
	'Ctrl ⌘ Alt Space Alt Fn1 Fn2 Ctrl',
];

export const ComputerKeyboard = memo(() => {
	return (
		<div className={styles.computerKeyboardStyle}>
			{computerKeyboardLayout.map((row) => {
				const rowKeys = row.split(' ').filter((key) => key.length > 0);
				return (
					<div key={row} className={styles.computerKeyboardRowStyle}>
						{rowKeys.map((key) => {
							return (
								<div
									key={key}
									data-key={key}
									className={styles.computerKeyboardKeyStyle}
								>
									{key}
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
});
