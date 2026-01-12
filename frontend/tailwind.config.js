/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        awesomecolor: "#1e3050",
        vacchunblue: "#0066bf",
        headerBg: "#ebebeb",
        aftnBg: "#474747",
        aftnBgOverlay: "#ababab",
        aftnTaviratBg: "#007DE9",
      },
    },
  },
  plugins: [],
};
