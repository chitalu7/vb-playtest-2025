// tailwind.config.ts
import { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'shadow-black': '#0b0c10',
        'blood-orange': '#ff4500',
        'smoke-gray': '#505a5b',
        'ice-blue': '#a9d6e5',
        'pale-amber': '#f3b481',
      },
    },
  },
  plugins: [],
};

export default config;
