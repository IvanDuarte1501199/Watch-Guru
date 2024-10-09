/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#0d253f',
        'secondary': '#3a4348',
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
