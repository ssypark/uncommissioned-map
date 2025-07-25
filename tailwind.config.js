/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './code/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      colors: {
        darkCream: 'var(--Dark-Cream)',
        cream:     'var(--Cream)',
        white:     'var(--White)',
        red:       'var(--Red)',
        black:     'var(--Black)',
        oldGrey:   'var(--Old-Grey)',
        oldWhite:  'var(--Old-White)',
        darkGrey:  'var(--Dark-Grey)'
      }
    }
  },
  plugins: []
}