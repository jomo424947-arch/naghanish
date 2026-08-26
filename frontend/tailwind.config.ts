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
          light: '#A78BFA',
          dark: '#5B21B6',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
          // 2 shades lighter electric blue / cyan
          bright: '#00D2FF',
          sky: '#38BDF8',
          deep: '#0284C7',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
          bright: '#FF7315',
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
        // Brand palette specific colors matching reference image
        brand: {
          purple: '#7C3AED',
          purpleDark: '#6D28D9',
          purpleLight: '#9333EA',
          blue: '#00D2FF',      // Brighter blue
          blueLight: '#38BDF8',
          cyan: '#06B6D4',
          orange: '#FF7315',
          gold: '#EAB308',
          green: '#10B981',
          pink: '#EC4899',
          darkBg: 'hsl(var(--brand-dark-bg) / <alpha-value>)',
          surface: 'hsl(var(--brand-surface) / <alpha-value>)',
          card: 'hsl(var(--brand-card) / <alpha-value>)',
          cardBorder: 'hsl(var(--brand-card-border) / <alpha-value>)',
        },
        // 6 NAGHANISH Universe Worlds / Modes
        mode: {
          shilla: {
            orange: '#FF7315',
            yellow: '#FACC15',
            cyan: '#00D2FF',
            lime: '#84CC16',
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
            orange: '#FF7315',
            yellow: '#F59E0B',
            white: '#FFFFFF',
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
            orange: '#FF7315',
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
        glow: '0 0 25px -5px rgba(124, 58, 237, 0.4)',
        'glow-blue': '0 0 25px -5px rgba(0, 210, 255, 0.5)',
        'glow-orange': '0 0 25px -5px rgba(255, 115, 21, 0.5)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.5)',
        'glow-gold': '0 0 25px -5px rgba(234, 179, 8, 0.5)',
        'glow-lime': '0 0 25px -5px rgba(132, 204, 22, 0.5)',
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.5)',
        'glow-pink': '0 0 25px -5px rgba(236, 72, 153, 0.5)',
        'soft-lg': '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
        'game-card': '0 12px 32px -4px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'game-card-hover': '0 20px 40px -4px rgba(0, 0, 0, 0.6), 0 0 25px -2px rgba(124, 58, 237, 0.4)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'IBM Plex Sans Arabic', 'Inter', 'sans-serif'],
        arabic: ['IBM Plex Sans Arabic', 'Cairo', 'sans-serif'],
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
