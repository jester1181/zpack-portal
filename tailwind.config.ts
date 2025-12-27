import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  safelist: ["bg-steel-texture"],

  theme: {
    extend: {
      colors: {
        background: "#111215",
        foreground: "#F8F9FA",
        electricBlue: "#1F8EFF",
        neonGreen: "#32FF7E",
        dangerRed: "#FF5E5E",
        darkGray: "#1A1A1A",
        lightGray: "#CCCCCC",
        slateSatin: "#0f1218",
        obsidian: "#121212",
      },
      fontFamily: {
        heading: ["Geist", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
        body: ["Roboto", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 2px 4px rgba(0, 0, 0, 0.1)",
        glow: "0 0 8px rgba(31, 142, 255, 0.8)",
        "glow-inner": "inset 0 0 200px rgba(0, 255, 255, 0.02)",
      },
      backgroundImage: {
        'steel-gradient': "linear-gradient(135deg, #101215, #0b0c0f)",
        'glow-overlay': "radial-gradient(ellipse at center, rgba(0,255,255,0.03), transparent)",
        'steel-texture': "url('/textures/hdsteel-bg.webp')",
      },
      keyframes: {
        slowShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'slow-shift': 'slowShift 20s ease infinite',
      },
      screens: {
        xs: "480px",
      },
      maxWidth: {
        screenLg: "1280px",
        screenMd: "1024px",
        screenSm: "768px",
      },
    },
  },
  darkMode: "class",
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
} satisfies Config;
