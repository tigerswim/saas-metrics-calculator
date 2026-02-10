/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Earnix Brand Colors
        earnix: {
          orange: '#F44D2E',
          'orange-dark': '#d93d1a',
          teal: '#03505C',
          'teal-light': '#0891b2', // cyan-600 for Insurance theme
        },
        // Industry Theme Colors
        insurance: {
          primary: '#0891b2', // Deep Teal (cyan-600)
          light: '#e0f2fe', // cyan-50
          accent: '#7e22ce', // purple-700 for status
        },
        banking: {
          primary: '#F44D2E', // Earnix Orange
          light: '#fef2f2', // red-50
          accent: '#0891b2', // teal for status
        },
        arr: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        retention: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        pipeline: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      backgroundImage: {
        'gradient-arr': 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
        'gradient-retention': 'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)',
        'gradient-pipeline': 'linear-gradient(135deg, #16a34a 0%, #4ade80 100%)',
        'gradient-marketing': 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
        'gradient-sales': 'linear-gradient(135deg, #dc2626 0%, #fb7185 100%)',
        'gradient-financial': 'linear-gradient(135deg, #475569 0%, #94a3b8 100%)',
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'flow': 'flow 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        flow: {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '-20' },
        },
      },
    },
  },
  plugins: [],
}
