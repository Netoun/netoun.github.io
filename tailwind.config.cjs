/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["selector"],
	content: [
		"./src/**/*.{ts,tsx,astro}",
	],
	theme: {
		extend: {
			fontFamily: {
				title: ["Basteleur", "serif"],
				sans: ["Spoof", "sans-serif"],
			},
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				success: {
					DEFAULT: "hsl(var(--success))",
					foreground: "hsl(var(--success-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"text-shadow-glow": {
					'0%': { textShadow: "hsla(var(--foreground)/0.5) 0px 0px 2rem" },
					'25%': { textShadow: "hsla(var(--foreground)/0.5) 0px 0px 3rem" },
					'50%': {
						textShadow: "hsla(var(--foreground)/0.75) 0px 0px 5rem",
					},
					'75%': { textShadow: "hsla(var(--foreground)/0.7) 0px 0px 4rem" },
					'100%': {
						textShadow: "hsla(var(--foreground)/0.5) 0px 0px 2rem"
					}
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"text-shadow": "text-shadow-glow 8s infinite",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
