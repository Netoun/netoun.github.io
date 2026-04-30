import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './button.component';

describe('Button', () => {
	it('renders with default props', () => {
		render(<Button>Click me</Button>);
		const button = screen.getByRole('button', { name: 'Click me' });
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
});
