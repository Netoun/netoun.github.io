/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				hand: ["Caveat Brush", 'sans-serif'],
				sans: ['"PPTelegraf"', 'sans-serif'],
			},
			colors: {
				primary: "hsl(var(--color-primary) / <alpha-value>)",
				secondary: 'hsl(var(--color-secondary) / <alpha-value>)'
			},
			animation: {
				'blink': 'blink 500ms steps(1, end) infinite',
				'ollie-skate': 'ollie-skate 2s ease-in-out',
			},
			keyframes: {
				'blink': {
					'0%, 100%': { transform: 'translate(0, 0) rotate(0)' },
					'50%': { transform: 'translate(1.25rem, -0.75rem)' },
				},
				'ollie-skate': {
					'0%': { transform: 'translate(0, 0) rotate(0)' },
					'25%': { transform: 'translate(25vw, 1rem) rotate(-45deg)' },
					'50%': { transform: 'translate(50vw, ) rotate(-25deg)' },
					'75%': { transform: 'translate(75vw, 0)' },
					'100%': { transform: 'translate(100vw, 0) rotate(0)' },
				},
			}
		},
	},
	plugins: [],
}
