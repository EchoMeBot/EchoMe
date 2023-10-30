import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      keyframes: {
        "dot-1": {
          "0%": { scale: "0" },
          "33%": { scale: "1" },
          "66%": { scale: "1" },
          "99%": { scale: "1" },
        },
        "dot-2": {
          "0%": { scale: "0" },
          "33%": { scale: "0" },
          "66%": { scale: "1" },
          "99%": { scale: "1" },
        },
        "dot-3": {
          "0%": { scale: "0" },
          "33%": { scale: "0" },
          "66%": { scale: "0" },
          "99%": { scale: "1" },
        },
      },
      animation: {
        "dot-1": "dot-1 1s linear infinite",
        "dot-2": "dot-2 1s linear infinite",
        "dot-3": "dot-3 1s linear infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [require("@tailwindcss/forms")],
};
export default config;
