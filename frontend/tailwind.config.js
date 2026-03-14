/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },
        loss: {
          400: '#FF4081',
          500: '#F50057',
          600: '#C51162',
        },
        gfw: {
          bg: '#F5F5F5',
          card: '#FFFFFF',
          sidebar: '#333333',
          text: '#333333',
          muted: '#999999',
          border: '#E0E0E0',
        },
      },
      fontFamily: {
        sans: ['Fira Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
