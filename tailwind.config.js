import less from "less";

const colors = {
  "app-base-color": "#32ccbc",
  "app-sub-color": "#32ccbc",

  red: "#bd3932",

  "app-dark-color-100": "#202020", // aside bg
  "app-dark-color-200": "#252525", // body bg
  "app-dark-color-300": "#2b2b2b", // header bg
  "app-dark-color-400": "#363636", // list deep
  "app-dark-color-500": "#3a3a3a", // list shallow

  "app-white-color-100": "#e2e8f0",
};

const commonHeight = "80px";
const limitWidth = "1150px";

less.options.modifyVars = {
  "@app-base-color": colors["app-base-color"],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    frameSize: `calc((100% - ${limitWidth}) / 2)`,
    noHeaderHeight: `calc((100vh - ${commonHeight}))`,
    extend: {
      colors,
      height: {
        common: commonHeight,
      },
      width: {
        88: "22rem",
        limit: limitWidth,
      },
      fontSize: {
        13: ["0.8125rem", "1.125rem"],
      },
    },
  },
  plugins: [],
};
