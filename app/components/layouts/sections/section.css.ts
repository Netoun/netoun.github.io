import { style } from '@vanilla-extract/css';
import { breakpoints } from '@/styles/responsive.css';
import { vars } from '@/styles/theme.css';

export const sectionStyle = style({
	padding: vars.spacing.sm,
	'@media': {
		[breakpoints.lg]: {
			padding: vars.spacing.md,
		},
	},
});
