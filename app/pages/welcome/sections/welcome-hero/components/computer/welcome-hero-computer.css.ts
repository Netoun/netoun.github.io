import { style } from '@vanilla-extract/css';
import { breakpoints } from '@/styles/responsive.css';
import { vars } from '@/styles/theme.css';

export const welcomeHeroComputerWrapperStyles = style({
	position: 'absolute',
	zIndex: 10,
	bottom: 0,
	right: '5vw',
	filter: `drop-shadow(0 0 2.5rem color-mix(in srgb, ${vars.colors.secondary} 30%, transparent))`,
	width: '300px',
	selectors: {
		':global([data-quality="high"]) &': {
			filter: `drop-shadow(0 0 3.5rem color-mix(in srgb, ${vars.colors.secondary} 70%, transparent))`,
		},
	},
	'@media': {
		[breakpoints.md]: {
			width: '400px',
		},
		[breakpoints.xl]: {
			width: '600px',
		},
	},
});

export const welcomeHeroComputerCapturesStyles = style({
	width: '100%',
	userSelect: 'none',
	pointerEvents: 'none',
	transformStyle: 'preserve-3d',
	transform:
		'rotateY(var(--mouse-position-x)) rotateX(var(--mouse-position-y)) translateZ(0)',
	willChange: 'transform',
	backfaceVisibility: 'hidden',
});

export const welcomeHeroComputerStyles = style({
	fontFamily: vars.fontFamily.doto,
	fontWeight: vars.fontWeight.bold,
	display: 'grid',
	gridTemplateColumns: 'repeat(2, 1fr)',
	gridTemplateRows: 'repeat(2, 1fr)',
	width: '100%',
	height: '100%',
	padding: vars.spacing.sm,
	background: `color-mix(in srgb, ${vars.colors.background} 10%, transparent)`,
});
