/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        nutmeg: ["Nutmeg", "sans-serif"],
      },
      colors: {
        "blue-nav": "#37AEFD",
        "blue-light": "#37AEFE",
        "blue-button": "#015DB1",
        "blue-card": "#00326C",
        "orange-card": "#FF6C00",
        "secondary-text": "#676D72",
        "bg-gray": "#676D72",
        "bg-blue": "#00326C",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
