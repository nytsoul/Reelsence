/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          deep: '#0f0f1e',
          primary: '#1a1a2e',
          surface: '#252540',
          card: '#1e1e3a',
          elevated: '#3a3a5c',
          hover: '#2d2d48',
          input: '#1f1f38',
        },
        accent: {
          primary: '#6366f1',
          'primary-hover': '#818cf8',
          secondary: '#ec4899',
          'secondary-hover': '#f472b6',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          blue: '#0ea5e9',
          purple: '#8b5cf6',
          orange: '#f97316',
        },
        txt: {
          primary: '#f1f5f9',
          secondary: '#cbd5e1',
          muted: '#94a3b8',
          dim: '#64748b',
        },
      },
      fontFamily: {
        heading: ['Roboto', 'system-ui', 'sans-serif'],
        body: ['Roboto', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        glow: '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-pink': '0 0 15px rgba(236, 72, 153, 0.2)',
        'glow-green': '0 0 15px rgba(16, 185, 129, 0.2)',
        'glow-orange': '0 0 15px rgba(249, 115, 22, 0.2)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      dropShadow: {
        glow: '0 0 8px rgba(99, 102, 241, 0.4)',
      },
      backdropFilter: {
        none: 'none',
        sm: 'blur(4px)',
        md: 'blur(8px)',
        lg: 'blur(12px)',
        xl: 'blur(16px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      spacing: {
        'safe-top': 'max(env(safe-area-inset-top), 1rem)',
        'safe-bottom': 'max(env(safe-area-inset-bottom), 1rem)',
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('supports-backdrop', '@supports (backdrop-filter: blur(0))');
    },
  ],
}

