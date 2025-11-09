import { style } from '@vanilla-extract/css';
import { breakpoints } from '@/styles/responsive.css';
import { vars } from '@/styles/theme.css';

export const welcomeHeroComputerWrapperStyles = style({
	position: 'absolute',
	zIndex: 10,
	bottom: 0,
	right: '5vw',
	filter: `drop-shadow(0 0 2.5rem color-mix(in srgb, ${vars.colors.secondary} 60%, transparent))`,
    width: '300px',
	selectors: {
		':global([data-quality="high"]) &': {
			filter: `drop-shadow(0 0 3.5rem color-mix(in srgb, ${vars.colors.secondary} 70%, transparent))`,
		},
	},
	'@media': {
		[breakpoints.md]: {
			width: '400px'
		},
		[breakpoints.xl]: {
			width: '600px'
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
	fontSize: vars.fontSize['2xl'],
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	textAlign: 'center',
	fontWeight: vars.fontWeight.bold,
    
    '@media': {
        [breakpoints.md]: {
            fontSize: vars.fontSize['4xl'],
        },
    },
});

export const welcomeHeroComputerImageStyles = style({
	width: '100%',
	height: '100%',
	objectFit: 'cover',
	position: 'absolute',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	zIndex: 1,
	opacity: 0.75,
});

export const welcomeHeroComputerContentStyles = style({
	position: 'relative',
	zIndex: 10,
});
