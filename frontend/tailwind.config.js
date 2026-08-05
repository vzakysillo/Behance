/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          100: "#e3d9fc",
          600: "#6146ea",
          700: "#4a28c4",
        },
        ink: "#1b1b1b",
        inkDark: "#130016",
        line: "#949494",
        error: "#f7165a",
      },
      fontFamily: {
        sans: ["Geist"],
      },
    },
  },
  plugins: [],
};
