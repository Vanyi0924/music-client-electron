/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "app-base-color": "#00fa9a",
        // "app-base-color": "#00ff7f",
        "app-sub-color": "#00fa9a",
        "app-dark-color-100": "#202020", // aside bg
        "app-dark-color-200": "#252525", // body bg
        "app-dark-color-300": "#2b2b2b", // header bg
        "app-dark-color-400": "#363636", // list deep
        "app-dark-color-500": "#3a3a3a", // list shallow
      },
      height: {
        // 999: "50px",
      },
      width: {
        88: "22rem",
      },
      fontSize: {
        13: ["0.8125rem", "1.125rem"],
      },
    },
  },
  plugins: [],
};
