export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { court: '#2B5D9B', deep: '#0F2340', ball: '#E4F03C', mist: '#F3F6FA', kitchen: '#3C70B3' },
      fontFamily: { sans: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'] },
      keyframes: {
        pop: { '0%': { opacity: 0, transform: 'translate(-50%, 8px) scale(.96)' }, '100%': { opacity: 1, transform: 'translate(-50%, 0) scale(1)' } },
      },
      animation: { pop: 'pop .25s ease-out both' },
    },
  },
  plugins: [],
}
