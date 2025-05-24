import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'night-black': '#0D1117',
        'graphite': '#161B22',
        'graphite-light': '#24292e',
        'code-cyan': '#3EE4D9',
        'soft-blush': '#F6E8EA',
        'soft-blush-dark': '#D1C7C5',
        'alert-rose': '#EF626C',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;