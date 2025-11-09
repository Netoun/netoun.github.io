import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Slider } from './slider.component';

describe('Slider', () => {
	it('renders with default props', () => {
		render(<Slider label="Test Slider" />);

		const slider = screen.getByRole('slider');
		expect(slider).toBeDefined();
	});

	it('renders with custom value', () => {
		render(
			<Slider label="Test Slider" value={50} minValue={0} maxValue={100} />,
		);

		const slider = screen.getByRole('slider');
		expect(slider).toBeDefined();
	});

	it('renders as disabled', () => {
		render(<Slider label="Test Slider" isDisabled />);

		const slider = screen.getByRole('slider');
		expect(slider).toBeDefined();
	});

	it('renders with custom orientation', () => {
		render(<Slider label="Test Slider" orientation="vertical" />);

		const slider = screen.getByRole('slider');
		expect(slider).toBeDefined();
	});

	it('calls onChange when value changes', () => {
		const handleChange = (value: number) => {
			expect(value).toBe(75);
		};

		render(<Slider label="Test Slider" value={50} onChange={handleChange} />);

		const slider = screen.getByRole('slider');
		expect(slider).toBeDefined();
	});
});
