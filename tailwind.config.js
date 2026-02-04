/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#2aa6a3',
          light: '#57c4bf',
          lighter: '#7bd7d2',
        },
        bg: '#e8f8f7',
        text: '#04323b',
      },
      fontFamily: {
        display: ["'Playfair Display'", 'serif'],
        sans: ["'Inter'", 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', "'Helvetica Neue'", 'Arial'],
        script: ["'Pacifico'", 'cursive'],
      },
      keyframes: {
        floatDown: {
          '0%': { transform: 'translateY(-2px)' },
          '50%': { transform: 'translateY(6px)' },
          '100%': { transform: 'translateY(-2px)' },
        },
        popIn: {
          '0%': { 'transform': 'rotate(var(--rot, 0deg)) scale(.2) translateY(12px)', 'opacity': '0' },
          '60%': { 'transform': 'rotate(var(--rot, 0deg)) scale(1.06) translateY(-6px)', 'opacity': '1' },
          '100%': { 'transform': 'rotate(var(--rot, 0deg)) scale(1) translateY(0)', 'opacity': '1' },
        },
      },
      animation: {
        floatDown: 'floatDown 1.4s ease-in-out infinite',
        popIn: 'popIn 0.45s cubic-bezier(.2, .9, .2, 1) both',
      },
    },
  },
}

