/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4285F4', // Google Blue
          DEFAULT: '#3367D6', // Darker Blue
          dark: '#2A56C6',
        },
        secondary: {
          light: '#34A853', // Google Green
          DEFAULT: '#0F9D58', // Darker Green
          dark: '#0B8043',
        },
        accent: {
          light: '#FBBC05', // Google Yellow
          DEFAULT: '#F9AB00', // Darker Yellow
          dark: '#F29900',
        },
        danger: {
          light: '#EA4335', // Google Red
          DEFAULT: '#D23F31', // Darker Red
          dark: '#C5221F',
        },
        graphene: {
          light: '#424242',
          DEFAULT: '#212121',
          dark: '#000000',
        },
      },
    },
  },
  plugins: [],
}
