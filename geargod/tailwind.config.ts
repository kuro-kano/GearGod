import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily:{
        'figtree-regular': ["Figtree", "sans-serif"],
        'figtree-bold':["Figtree-Bold", "sans-serif"],
        'inter-regular': ["Inter", "sans-serif"],
        'inter-bold': ["Inter-Bold", "sans-serif"],
        'urbanist-bold': ["Urbanist-bold", "sans-serif"],
      }
    },
  },
  plugins: [],
} satisfies Config;
