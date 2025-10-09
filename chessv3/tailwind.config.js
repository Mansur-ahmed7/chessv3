/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        chess: {
          primary: '#769656',
          dark: '#4A6741',
          bg: '#302E2B',
          card: '#262421',
          'text-secondary': '#B5B5B5',
          accent: '#F0D97E',
          'light-square': '#EBECD0',
          'dark-square': '#739552',
          'last-move': 'rgba(155, 199, 0, 0.41)',
          selected: 'rgba(181, 136, 99, 0.5)'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
};