/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "app-base-color": "var(--app-base-color)",
        "app-sub-color": "var(--app-base-color)",

        "app-dark-color-100": "var(--app-dark-color-100)", // aside bg
        "app-dark-color-200": "var(--app-dark-color-200)", // aside bg
        "app-dark-color-300": "var(--app-dark-color-300)", // aside bg
        "app-dark-color-400": "var(--app-dark-color-400)", // aside bg
        "app-dark-color-500": "var(--app-dark-color-500)", // aside bg
      },
      height: {
        // header: "var(--app-header-height)",
        // noHeader: "calc(100vh - var(--app-header-height))",
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
