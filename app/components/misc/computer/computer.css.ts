import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

const backgroundLidComputer = `color-mix(in srgb, ${vars.colors.background} 100%, ${vars.colors.tertiary})`;
const backgroundChassisComputer = `color-mix(in srgb, ${vars.colors.background} 100%, ${vars.colors.tertiary})`;

export const computerStyle = style({
	padding: vars.spacing.md,
	position: 'relative',
	zIndex: 20,
	perspective: '2000px',
	transformStyle: 'preserve-3d',
	aspectRatio: '400 / 272.5',
	perspectiveOrigin: 'top left',
});

export const computerFrameLidStyle = style({
	width: '60%',
	height: '66%',
	position: 'absolute',
	left: '38%',
	top: '2%',
	transform: 'rotateY(-45deg) rotateX(15deg)',
	transformStyle: 'preserve-3d',
	background: backgroundLidComputer,
});

export const computerFrameLidFrontStyle = style({
	position: 'absolute',
	width: '100%',
	height: '100%',
	padding: vars.spacing.sm,
	background: backgroundLidComputer,

	selectors: {
		'&::after': {
			color: vars.colors.primary,
			content: 'NETOUN COMPUTERS',
			position: 'absolute',
			bottom: '0.05rem',
			fontSize: '0.25rem',
			left: '50%',
			transform: 'translateX(-50%)',
			textShadow: vars.textShadow.glow,
		},
	},
});

const computerScreenAfterKeyframe = keyframes({
	from: {
		backgroundPosition: '100% 100%',
	},
	to: {
		backgroundPosition: '100% 50%',
	},
});

export const computerScreenStyle = style({
	width: '100%',
	height: '100%',
	boxShadow: vars.boxShadow.sm,
	position: 'relative',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	gap: vars.spacing.xs,
	color: vars.colors.primary,
	backgroundColor: vars.colors.foreground,
	selectors: {
		'&::after': {
			content: '',
			position: 'absolute',
			inset: 0,
			backgroundImage:
				'linear-gradient(to top, transparent, transparent, #333333, #333333)',
			backgroundSize: '100% 4px',
			backgroundPosition: '100% 92%',
			opacity: 0.5,
			animation: `${computerScreenAfterKeyframe} 10s infinite`,
		},
	},
});

export const computerFrameLidBackStyle = style({
	position: 'absolute',
	width: '100%',
	height: '100%',
	transform: 'translateZ(-10px)',
	background: backgroundLidComputer,
});

export const computerFrameLidBottomStyle = style({
	position: 'absolute',
	width: '100%',
	height: '10px',
	bottom: '0',
	transform: 'rotateX(90deg) translateY(-5px) translateZ(-5px)',
	background: backgroundLidComputer,
});

export const computerFrameLidLeftStyle = style({
	position: 'absolute',
	width: '10px',
	height: '100%',
	right: '0',
	transform: 'translateZ(-5px) translateX(5px) rotateY(90deg)',
	background: backgroundLidComputer,
});

export const computerFrameLidRightStyle = style({
	position: 'absolute',
	width: '10px',
	height: '100%',
	transform: 'translateZ(-5px) translateX(-5px) rotateY(90deg)',
	background: backgroundLidComputer,
});

export const computerFrameLidTopStyle = style({
	position: 'absolute',
	width: '100%',
	height: '10px',
	transform: 'rotateX(90deg) translateY(-5px) translateZ(5px)',
	background: backgroundLidComputer,
});

export const computerScreenContentStyle = style({
	width: '100px',
});

export const computerFrameChassisStyle = style({
	width: '60%',
	height: '70%',
	position: 'absolute',
	left: '38%',
	top: '33%',
	transform: 'rotateY(-45deg) rotateX(90deg) translateY(55%)',
	transformStyle: 'preserve-3d',
	background: backgroundChassisComputer,
});

export const computerFrameChassisFrontStyle = style({
	position: 'absolute',
	width: '100%',
	height: '100%',
	padding: vars.spacing.sm,
	background: backgroundChassisComputer,
});

export const computerFrameChassisBackStyle = style({
	position: 'absolute',
	width: '100%',
	height: '100%',
	transform: 'translateZ(-10px)',
	background: backgroundChassisComputer,
});

export const computerFrameChassisBottomStyle = style({
	position: 'absolute',
	width: '100%',
	height: '10px',
	bottom: '0',
	transform: 'rotateX(90deg) translateY(-5px) translateZ(-5px)',
	background: `color-mix(in srgb, ${backgroundChassisComputer} 30%, ${vars.colors.foreground})`,
});

export const computerFrameChassisLeftStyle = style({
	position: 'absolute',
	width: '10px',
	height: '100%',
	right: '0',
	transform: 'translateZ(-5px) translateX(5px) rotateY(90deg)',
	background: `color-mix(in srgb, ${backgroundChassisComputer} 60%, ${vars.colors.foreground})`,
});

export const computerFrameChassisRightStyle = style({
	position: 'absolute',
	width: '10px',
	height: '100%',
	transform: 'translateZ(-5px) translateX(-5px) rotateY(90deg)',
	background: `color-mix(in srgb, ${backgroundChassisComputer} 60%, ${vars.colors.foreground})`,
});

export const computerFrameChassisTopStyle = style({
	position: 'absolute',
	width: '100%',
	height: '10px',
	transform: 'rotateX(90deg) translateY(-5px) translateZ(5px)',
	background: `color-mix(in srgb, ${backgroundChassisComputer} 60%, ${vars.colors.foreground})`,
});
