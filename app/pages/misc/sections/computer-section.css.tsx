import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const computerSection = style({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	minHeight: '100vh',
	backgroundImage: `
        linear-gradient(color-mix(in srgb, ${vars.colors.secondary} 15%, transparent) .1rem, transparent .1rem), 
        linear-gradient(90deg, color-mix(in srgb, ${vars.colors.secondary} 15%, transparent) .1rem, transparent .1rem)
    `,
	backgroundSize: '5rem 5rem',
	padding: vars.spacing.md,
});

export const computerWrapperBaseSection = style({});

export const computerWrapper3DSection = style({
	width: '400px',
	transformStyle: 'preserve-3d',
});

export const computerSettingsSection = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.spacing.md,
});

export const computerSettingsLabel = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: vars.spacing.md,
});

export const computerSettingsLabelTitle = style({
	fontWeight: vars.fontWeight.bold,
});

export const computerSettingsValue = style({
	width: '3.5rem',
});

export const computerSettingsInput = style({
	width: '100%',
	color: vars.colors.foreground,
});
