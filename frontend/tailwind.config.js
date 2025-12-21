/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "light-gradient": "url('/src/assets/bluePurpleYellowGradient.png')",
      },
    },
  },
  darkMode: "class", // IMPORTANT
};
