/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Verifica que esta ruta sea correcta
  ],
  theme: {
    extend: {
      colors: {
        'medium-purple': '#8959DB',
        'deep-amethyst': '#6C4F8F',
        'lilac-breeze': '#D5A6FD',
        'soft-cloud': '#F4F4F4',
        'pink-whirl': '#F3C3F1',
        'lime-zest': '#ABDB59',
      },
    },
  },
  plugins: [],
};