import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
          hover: 'hsl(var(--primary-hover) / <alpha-value>)',
          orange: '#F97316',
          warm: '#FB7A2B',
          dark: '#EA580C',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
          bright: '#00D2FF',
          sky: '#38BDF8',
          deep: '#0284C7',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
          orange: '#F97316',
          amber: '#F59E0B',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
          hover: 'hsl(var(--card-hover) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        // Brand palette specific colors matching new visual identity
        brand: {
          orange: '#F97316',
          orangeWarm: '#FB7A2B',
          orangeHover: '#EA580C',
          purple: '#7C3AED',
          purpleDark: '#6D28D9',
          purpleLight: '#9333EA',
          blue: '#00D2FF',
          blueLight: '#38BDF8',
          cyan: '#06B6D4',
          teal: '#14B8A6',
          gold: '#EAB308',
          green: '#10B981',
          pink: '#EC4899',
          darkBg: 'hsl(var(--brand-dark-bg) / <alpha-value>)',
          surface: 'hsl(var(--brand-surface) / <alpha-value>)',
          card: 'hsl(var(--brand-card) / <alpha-value>)',
          cardBorder: 'hsl(var(--brand-card-border) / <alpha-value>)',
        },
        // 6 NAGHANISH Universe Worlds / Modes (ZERO orange collision)
        mode: {
          shilla: {
            teal: '#06B6D4',
            cyan: '#0EA5E9',
            aqua: '#14B8A6',
            indigo: '#6366F1',
          },
          arcade: {
            purple: '#7C3AED',
            cyan: '#00D2FF',
            blue: '#2563EB',
            neon: '#A855F7',
          },
          iqlab: {
            violet: '#8B5CF6',
            pink: '#EC4899',
            blue: '#00D2FF',
            white: '#FFFFFF',
          },
          reflex: {
            red: '#EF4444',
            rose: '#F43F5E',
            crimson: '#DC2626',
            yellow: '#FACC15',
          },
          champions: {
            gold: '#EAB308',
            purple: '#4C1D95',
            amber: '#F59E0B',
            black: '#0F0F1A',
          },
          chaos: {
            lime: '#84CC16',
            green: '#10B981',
            yellow: '#FACC15',
            emerald: '#059669',
          },
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '3xl': '1.5rem',
        '2xl': '1.25rem',
        xl: '1rem',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        glow: '0 0 25px -4px rgba(249, 115, 22, 0.45)',
        'glow-primary': '0 0 25px -4px rgba(249, 115, 22, 0.55)',
        'glow-orange': '0 0 25px -4px rgba(249, 115, 22, 0.5)',
        'glow-purple': '0 0 25px -4px rgba(124, 58, 237, 0.45)',
        'glow-blue': '0 0 25px -5px rgba(0, 210, 255, 0.5)',
        'glow-teal': '0 0 25px -5px rgba(6, 182, 212, 0.5)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.5)',
        'glow-gold': '0 0 25px -5px rgba(234, 179, 8, 0.5)',
        'glow-lime': '0 0 25px -5px rgba(132, 204, 22, 0.5)',
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.5)',
        'glow-pink': '0 0 25px -5px rgba(236, 72, 153, 0.5)',
        'soft-lg': '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
        'game-card': '0 12px 32px -4px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'game-card-hover': '0 20px 40px -4px rgba(0, 0, 0, 0.7), 0 0 25px -2px rgba(249, 115, 22, 0.35)',
      },
      fontFamily: {
        sans: ['Readex Pro', 'Alexandria', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Alexandria', 'Readex Pro', 'Plus Jakarta Sans', 'sans-serif'],
        arabic: ['Alexandria', 'Readex Pro', 'sans-serif'],
        latin: ['Plus Jakarta Sans', 'sans-serif'],
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(2deg)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
}

export default config
