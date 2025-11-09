import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const settingsCard = style({
	position: 'absolute',
	top: vars.spacing.md,
	right: vars.spacing.md,
	backgroundImage: `linear-gradient(to bottom right, color-mix(in srgb, ${vars.colors.foreground} 50%, transparent), color-mix(in srgb, ${vars.colors.foreground} 40%, transparent))`,
	borderRadius: vars.radius.lg,
	padding: vars.spacing.md,
	minWidth: '280px',
	zIndex: 1000,
	border: `1px solid ${vars.colors.border}`,
	boxShadow: vars.boxShadow.lg,
	fontSize: vars.fontSize.sm,
	color: vars.colors.background,
	selectors: {
		':global([data-quality="high"]) &': {
			backdropFilter: 'blur(10px)',
		},
	},
});

export const settingsCardHeader = style({
	marginBottom: '16px',
});

export const settingsCardTitle = style({
	fontSize: vars.fontSize.xl,
	color: vars.colors.background,
	fontWeight: '600',
});

export const settingsCardContent = style({
	display: 'flex',
	flexDirection: 'column',
	gap: '16px',
});

export const settingsCardLabel = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	marginBottom: '12px',
});

export const settingsCardSlider = style({
	width: '100%',
	height: '4px',
	background: 'rgba(255, 255, 255, 0.2)',
	borderRadius: '2px',
	outline: 'none',
	marginLeft: '12px',
});

export const settingsCardValue = style({
	background: 'rgba(255, 255, 255, 0.1)',
	padding: '4px 8px',
	borderRadius: '4px',
	fontSize: '11px',
	fontWeight: '600',
});

export const settingsCardButton = style({
	width: '100%',
	background: 'rgba(255, 255, 255, 0.1)',
	border: '1px solid rgba(255, 255, 255, 0.2)',
	color: 'white',
	padding: '10px 16px',
	borderRadius: '6px',
	fontSize: '12px',
	fontWeight: '500',
	cursor: 'pointer',
	transition: 'all 0.2s ease',

	selectors: {
		'&:active': {
			transform: 'translateY(0)',
		},
	},
});
