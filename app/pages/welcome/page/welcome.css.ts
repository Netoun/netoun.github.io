import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const welcomeContainer = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	gap: vars.spacing.md,
});

export const welcomeHeading = style({
	fontSize: '10rem',
	wordSpacing: '-1rem',
	fontWeight: 'bold',
	fontFamily: vars.fontFamily.ppNeueMontreal,
	lineHeight: '0.8',
});
