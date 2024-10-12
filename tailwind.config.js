/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#08042c',
        'secondary': '#5fb3cd',
        'tertiary': '#4983b6',
        'tertiary-80': '#4983b680',
        'quaternary': '#471413',
        'default': 'white',
        'gray': '#c6cbd3',
      },
      container: {
        center: true,
        screens: {
          sm: '100%',
          md: '640px',
          lg: '768px',
          xl: '1024px',
          '2xl': '1280px',
        },
      },
    },
  },
  plugins: [],
}
