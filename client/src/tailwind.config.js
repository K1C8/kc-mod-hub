/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', ],
        'serif': ['ui-serif', 'Georgia', ],
        'mono': ['ui-monospace', 'SFMono-Regular', ]
      }
    },
  },
  plugins: [],
}

