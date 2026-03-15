/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ── Green Paradise palette ── */
        paradise: {
          bg:      '#F5F0E8',    // warm beige background
          cream:   '#FAF7F2',    // lighter cream
          card:    '#FFFFFF',    // card white
          sage:    '#8B9E7C',    // muted sage
          green:   '#4A7C59',    // primary green
          dark:    '#2D5A3D',    // deep forest
          forest:  '#1A3C28',    // darkest green
          leaf:    '#6B8F5E',    // leaf green
          mint:    '#D4E4CB',    // light mint
          moss:    '#3D6B4F',    // moss accent
          sand:    '#E8DFD0',    // sandy warm
          stone:   '#B8AFA3',    // stone grey
          bark:    '#8B7D6B',    // bark brown
          text:    '#2C3E2D',    // primary text
          muted:   '#7A8F7B',    // muted text
          border:  '#D4CFBF',    // soft border
        },
        /* ── Keep functional colors for map UI ── */
        forest: {
          50: '#F0F7EC', 100: '#D9EDCF', 200: '#B8DCA5', 300: '#8DC87A',
          400: '#66BB6A', 500: '#4CAF50', 600: '#43A047', 700: '#388E3C',
          800: '#2E5E3B', 900: '#1B3D25',
        },
        loss: { 400: '#FF4081', 500: '#F50057', 600: '#C51162' },
        gfw: {
          bg: '#F5F0E8', card: '#FFFFFF', sidebar: '#2D5A3D',
          text: '#2C3E2D', muted: '#7A8F7B', border: '#D4CFBF',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'organic': '0 2px 20px rgba(45, 90, 61, 0.06)',
        'organic-md': '0 4px 30px rgba(45, 90, 61, 0.08)',
        'organic-lg': '0 8px 40px rgba(45, 90, 61, 0.10)',
        'organic-xl': '0 16px 60px rgba(45, 90, 61, 0.12)',
        'glow': '0 0 20px rgba(74, 124, 89, 0.15)',
      },
      borderRadius: {
        '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem',
      },
      keyframes: {
        leafDrift: {
          '0%':   { transform: 'translate(0, 0) rotate(0deg)', opacity: '0' },
          '15%':  { opacity: '0.6' },
          '85%':  { opacity: '0.4' },
          '100%': { transform: 'translate(60px, -120px) rotate(45deg)', opacity: '0' },
        },
        gentleSway: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%':      { transform: 'rotate(1deg)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        pulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(74,124,89,0)' },
          '50%':      { boxShadow: '0 0 12px 4px rgba(74,124,89,0.12)' },
        },
      },
      animation: {
        'leaf-drift': 'leafDrift 8s ease-in-out infinite',
        'gentle-sway': 'gentleSway 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'float': 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulse 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
