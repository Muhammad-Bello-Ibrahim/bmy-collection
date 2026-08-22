/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: '',
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
        border: '#E5E5E5',
        input: '#E5E5E5',
        ring: '#FFCB74',
        background: '#F6F6F6',
        foreground: '#111111',
        primary: {
          DEFAULT: '#111111',
          foreground: '#FFFFFF',
          hover: '#2F2F2F',
        },
        secondary: {
          DEFAULT: '#2F2F2F',
          foreground: '#FFFFFF',
          hover: '#111111',
        },
        accent: {
          DEFAULT: '#FFCB74',
          foreground: '#111111',
          hover: '#E6B35C',
          soft: 'rgba(255, 203, 116, 0.18)',
          light: '#FFF5E5',
        },
        neutral: {
          bg: '#F6F6F6',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          'card-dark': '#111111',
          'card-secondary': '#2F2F2F',
          border: '#E5E5E5',
          'border-subtle': '#EEEEEE',
          'text-primary': '#111111',
          'text-secondary': '#2F2F2F',
          'text-muted': '#6F6F6F',
          'text-disabled': '#A0A0A0',
        },
        brand: {
          dark: '#111111',
          secondary: '#2F2F2F',
          canvas: '#F6F6F6',
          surface: '#FFFFFF',
          accent: '#FFCB74',
          'accent-hover': '#E6B35C',
          'accent-soft': '#FFF5E5',
        },
        semantic: {
          success: '#22C55E',
          error: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F6F6F6',
          foreground: '#6F6F6F',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#111111',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#111111',
        },
      },
      fontFamily: {
        heading: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        body: ['var(--font-roboto)', 'Roboto', 'sans-serif'],
        mono: ['var(--font-ubuntu)', 'Ubuntu', 'monospace'],
        technical: ['var(--font-ubuntu)', 'Ubuntu', 'monospace'],
        sans: ['var(--font-roboto)', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        full: '9999px',
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(0, 0, 0, 0.04), 0 1px 3px -1px rgba(0, 0, 0, 0.02)',
        card: '0 4px 16px -2px rgba(0, 0, 0, 0.04)',
        'card-dark': '0 8px 24px -4px rgba(0, 0, 0, 0.25)',
        dock: '0 12px 32px -4px rgba(17, 17, 17, 0.4), 0 2px 6px rgba(0, 0, 0, 0.06)',
        accent: '0 8px 20px -4px rgba(255, 203, 116, 0.45)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};
