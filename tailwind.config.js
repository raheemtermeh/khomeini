/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-red": "#F01B29",
      },
      backgroundImage: {
        "dark-pattern": "url('/src/assets/bg-pattern.jpg')",
      },
      fontFamily: {
        shabnam: ["ShabnamFD", "sans-serif"],
      },
      height: {
        "screen-minus-2rem": "calc(100vh - 2rem)",
      },
    },
  },
  plugins: [],
};
