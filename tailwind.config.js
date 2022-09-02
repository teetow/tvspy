const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    colors: {
      black: colors.gray[900],
      red: "#ef476f",
      yellow: "#ffd166",
      green: "#06d6a0",
      white: colors.white,
    },
    fontFamily: {
      sans: [
        "Open Sans",
        "Source Sans Pro",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Oxygen",
        "Ubuntu",
        "Cantarell",
        "Open Sans",
        "Helvetica Neue",
        "sans-serif",
      ],
    },
    extend: {
      colors: {
        brand: {
          900: "#c4eaf7",
          800: "#65d9ff",
          700: "#00a3d9",
          600: "#118ab2",
          500: "#166580",
          400: "#165164",
          300: "#163c48",
          200: "#172c33",
          100: "#131e22",
        },
      },
    },
  },
  plugins: [],
};
