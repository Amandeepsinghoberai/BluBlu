/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0073E6',
        brand: {
          cyan: '#00B3E6',
          accent: '#FFA500',
        },
        bg: {
          DEFAULT: '#0D0D0D',
          elev: '#001F3D',
          card: '#0F1F33',
          border: '#18314F',
        },
        text: {
          DEFAULT: '#FFFFFF',
          secondary: '#B3D7FF',
          muted: '#B0B0B0',
        },
        success: '#28A745',
        warning: '#FF6F00',
        danger: '#EF4444',
        info: '#00B3E6',
      },
    },
  },
  plugins: [],
};
