import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Kirby } from './kirby.component';

test('Kirby component renders without loading', () => {
	const { container } = render(<Kirby />);
	expect(container.querySelector('svg')).toBeTruthy();
});

test('Kirby component renders with 0% loading', () => {
	const { container } = render(<Kirby loading={0} />);
	const fillRect = container.querySelector('rect');
	expect(fillRect).toBeTruthy();
	expect(fillRect?.getAttribute('height')).toBe('0%');
});

test('Kirby component renders with 50% loading', () => {
	const { container } = render(<Kirby loading={50} />);
	const fillRect = container.querySelector('rect');
	expect(fillRect).toBeTruthy();
	expect(fillRect?.getAttribute('height')).toBe('50%');
	expect(fillRect?.getAttribute('y')).toBe('50%');
});

test('Kirby component renders with 100% loading', () => {
	const { container } = render(<Kirby loading={100} />);
	const fillRect = container.querySelector('rect');
	expect(fillRect).toBeTruthy();
	expect(fillRect?.getAttribute('height')).toBe('100%');
	expect(fillRect?.getAttribute('y')).toBe('0%');
});

test('Kirby component clamps loading values', () => {
	const { container: containerNegative } = render(<Kirby loading={-10} />);
	const { container: containerOver } = render(<Kirby loading={150} />);

	const fillRectNegative = containerNegative.querySelector('rect');
	const fillRectOver = containerOver.querySelector('rect');

	expect(fillRectNegative?.getAttribute('height')).toBe('0%');
	expect(fillRectOver?.getAttribute('height')).toBe('100%');
});
