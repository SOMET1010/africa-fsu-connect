import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'inter': ['Inter', 'system-ui', 'sans-serif'],
				'poppins': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
				'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					light: 'hsl(var(--primary-light))',
					dark: 'hsl(var(--primary-dark))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					light: 'hsl(var(--secondary-light))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					light: 'hsl(var(--accent-light))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				info: {
					DEFAULT: 'hsl(var(--info))',
					foreground: 'hsl(var(--info-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Telecoms-specific colors
				'signal-excellent': 'hsl(var(--signal-excellent))',
				'signal-good': 'hsl(var(--signal-good))',
				'signal-average': 'hsl(var(--signal-average))',
				'signal-poor': 'hsl(var(--signal-poor))',
				'coverage-5g': 'hsl(var(--coverage-5g))',
				'coverage-4g': 'hsl(var(--coverage-4g))',
				'coverage-3g': 'hsl(var(--coverage-3g))',
				'coverage-2g': 'hsl(var(--coverage-2g))',
				// NEXUS Design System colors
				nx: {
					bg: 'hsl(var(--nx-bg))',
					surface: 'hsl(var(--nx-surface))',
					border: 'hsl(var(--nx-border))',
					text: {
						900: 'hsl(var(--nx-text-900))',
						700: 'hsl(var(--nx-text-700))',
						500: 'hsl(var(--nx-text-500))',
					},
					brand: {
						900: 'hsl(var(--nx-brand-900))',
						700: 'hsl(var(--nx-brand-700))',
						500: 'hsl(var(--nx-brand-500))',
					},
					coop: {
						600: 'hsl(var(--nx-coop-600))',
						500: 'hsl(var(--nx-coop-500))',
					},
					info: 'hsl(var(--nx-info-500))',
					warn: 'hsl(var(--nx-warn-500))',
					success: 'hsl(var(--nx-success-500))',
				}
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-card': 'var(--gradient-card)',
				'gradient-success': 'var(--gradient-success)',
				'gradient-warning': 'var(--gradient-warning)',
				'gradient-info': 'var(--gradient-info)',
				'gradient-glass': 'var(--gradient-glass)',
				'gradient-border': 'var(--gradient-border)',
				'gradient-telecom': 'var(--gradient-telecom)'
			},
			boxShadow: {
				'elegant': 'var(--shadow-lg)',
				'soft': 'var(--shadow-md)',
				'subtle': 'var(--shadow-sm)',
				'dramatic': 'var(--shadow-xl)',
				// NEXUS shadows
				'nxsm': 'var(--nx-shadow-sm)',
				'nxmd': 'var(--nx-shadow-md)',
			},
			zIndex: {
				'sidebar': 'var(--z-sidebar)',
				'header': 'var(--z-header)',
				'popover': 'var(--z-popover)',
				'overlay': 'var(--z-overlay)',
				'modal': 'var(--z-modal)',
				'tooltip': 'var(--z-tooltip)',
				'toast': 'var(--z-toast)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				// NEXUS radius tokens
				nxsm: 'var(--nx-radius-sm)',
				nxmd: 'var(--nx-radius-md)',
				nxlg: 'var(--nx-radius-lg)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0', opacity: '0' },
					to: { height: 'var(--radix-accordion-content-height)', opacity: '1' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
					to: { height: '0', opacity: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-out': {
					'0%': { transform: 'scale(1)', opacity: '1' },
					'100%': { transform: 'scale(0.95)', opacity: '0' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-out-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' }
				},
				slideUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				bounceSoft: {
					'0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
					'40%, 43%': { transform: 'translate3d(0,-8px,0)' },
					'70%': { transform: 'translate3d(0,-4px,0)' },
					'90%': { transform: 'translate3d(0,-2px,0)' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 0 0 hsl(var(--primary) / 0.4)' },
					'50%': { boxShadow: '0 0 0 10px hsl(var(--primary) / 0)' }
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-4px)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'scale-out': 'scale-out 0.2s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-right': 'slide-out-right 0.3s ease-out',
				'slide-up': 'slideUp 0.3s ease-out',
				'bounce-soft': 'bounceSoft 0.6s ease-out',
				'pulse-glow': 'pulse-glow 2s infinite',
				'bounce-subtle': 'bounce-subtle 1s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
