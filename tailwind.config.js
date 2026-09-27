/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#22393C',
        fog: '#46707E',
        moss: '#6B8B81',
        sage: '#AFBB98',
        clay: '#CECDB9',
        background: '#F7F7F2',
        surface: '#FFFFFF',
        'surface-muted': '#F0F1E9',
        border: 'rgba(34, 57, 60, 0.12)',
        'text-primary': '#22393C',
        'text-secondary': 'rgba(34, 57, 60, 0.65)',
        'text-muted': 'rgba(34, 57, 60, 0.45)',
        
        // Weather Colors
        weather: {
          low: '#AFBB98', // Sage
          moderate: '#8FA39A', // Muted green (adjusted for moss/sage mix)
          high: '#D6A87C', // Warm amber
          severe: '#C67A66', // Muted coral / rust
          extreme: '#9E4747' // Deep red
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(34, 57, 60, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(34, 57, 60, 0.1), 0 1px 2px -1px rgba(34, 57, 60, 0.1)',
        'md': '0 4px 6px -1px rgba(34, 57, 60, 0.1), 0 2px 4px -2px rgba(34, 57, 60, 0.1)',
        'lg': '0 10px 15px -3px rgba(34, 57, 60, 0.1), 0 4px 6px -4px rgba(34, 57, 60, 0.1)',
      }
    },
  },
  plugins: [],
}
