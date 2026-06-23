import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['var(--font-jakarta)', 'sans-serif'],
        display: ['var(--font-display)', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
