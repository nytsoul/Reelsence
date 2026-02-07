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
          primary: '#0b0b0f',
          card: '#16161d',
          elevated: '#1e1e28',
          hover: '#252533',
          input: '#1a1a24',
        },
        accent: {
          red: '#e50914',
          'red-hover': '#ff1a25',
          gold: '#f5c518',
          green: '#46d369',
          blue: '#2196f3',
          purple: '#9c27b0',
          orange: '#ff9800',
        },
        txt: {
          primary: '#ffffff',
          secondary: '#b3b3b3',
          muted: '#737373',
          dim: '#555555',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.7)',
        glow: '0 0 20px rgba(229, 9, 20, 0.3)',
        'glow-gold': '0 0 15px rgba(245, 197, 24, 0.2)',
        'glow-green': '0 0 15px rgba(70, 211, 105, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
