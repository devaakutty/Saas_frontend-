/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
content: [
  "./app/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
],
  theme: {
  extend: {
    colors: {
      // primary: "rgb(var(--primary) / <alpha-value>)",
       primary: "rgb(var(--primary) / <alpha-value>)",
      secondary: "rgb(var(--secondary) / <alpha-value>)",
      accent: "rgb(var(--accent) / <alpha-value>)",
    },
    fontFamily: {
      playfair: ["var(--font-playfair)"],
      inter: ["var(--font-inter)"],
    },
  },
},
  plugins: [],
};