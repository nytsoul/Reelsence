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
          deep: '#0b1117',
          primary: '#0f171e',
          surface: '#121d29',
          card: '#15212d',
          elevated: '#1b2a3a',
          hover: '#1f2f40',
          input: '#12202d',
        },
        accent: {
          primary: '#00a8e1',
          'primary-hover': '#1fb6ff',
          secondary: '#1f80e0',
          'secondary-hover': '#3da5ff',
          success: '#2bd576',
          warning: '#f5c518',
          danger: '#ff4c4c',
          red: '#ff4c4c',
          gold: '#f5c518',
          green: '#2bd576',
          blue: '#00a8e1',
          purple: '#6c63ff',
          orange: '#f39c12',
        },
        txt: {
          primary: '#e8f1fa',
          secondary: '#b9c7d6',
          muted: '#8aa0b6',
          dim: '#6c8196',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
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
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)',
        'card-hover': '0 22px 28px -6px rgba(3, 10, 18, 0.65)',
        glow: '0 0 20px rgba(0, 168, 225, 0.3)',
        'glow-pink': '0 0 15px rgba(31, 128, 224, 0.3)',
        'glow-green': '0 0 15px rgba(43, 213, 118, 0.25)',
        'glow-orange': '0 0 15px rgba(243, 156, 18, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.12)',
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

