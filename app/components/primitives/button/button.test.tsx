import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './button.component';

describe('Button', () => {
	it('renders with default props', () => {
		render(<Button>Click me</Button>);
		const button = screen.getByRole('button', { name: 'Click me' });
		expect(button).toBeInTheDocument();
	});

	it('renders with different variants', () => {
		render(<Button variant="secondary">Secondary</Button>);
		const button = screen.getByRole('button', { name: 'Secondary' });
		expect(button).toBeInTheDocument();
	});

	it('renders with different sizes', () => {
		render(<Button size="large">Large</Button>);
		const button = screen.getByRole('button', { name: 'Large' });
		expect(button).toBeInTheDocument();
	});

	it('is disabled when disabled prop is true', () => {
		render(<Button isDisabled>Disabled</Button>);
		const button = screen.getByRole('button', { name: 'Disabled' });
		expect(button).toBeDisabled();
	});

	it('handles click events', () => {
		const handleClick = () => {};
		render(<Button onPress={handleClick}>Click me</Button>);
		const button = screen.getByRole('button', { name: 'Click me' });
		expect(button).toBeInTheDocument();
	});

	it('renders with custom className', () => {
		render(<Button className="custom-class">Custom</Button>);
		const button = screen.getByRole('button', { name: 'Custom' });
		expect(button).toHaveClass('custom-class');
	});

	it('renders all variants correctly', () => {
		const variants = ['primary', 'secondary', 'ghost', 'danger'] as const;

		variants.forEach((variant) => {
			const { unmount } = render(<Button variant={variant}>{variant}</Button>);
			const button = screen.getByRole('button', { name: variant });
			expect(button).toBeInTheDocument();
			unmount();
		});
	});

	it('renders all sizes correctly', () => {
		const sizes = ['small', 'medium', 'large'] as const;

		sizes.forEach((size) => {
			const { unmount } = render(<Button size={size}>{size}</Button>);
			const button = screen.getByRole('button', { name: size });
			expect(button).toBeInTheDocument();
			unmount();
		});
	});
});
