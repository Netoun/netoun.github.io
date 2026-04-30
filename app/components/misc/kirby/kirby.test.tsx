import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Kirby } from './kirby.component';

test('Kirby component renders', () => {
	const { container } = render(<Kirby />);
	expect(container.querySelector('svg')).toBeTruthy();
});
