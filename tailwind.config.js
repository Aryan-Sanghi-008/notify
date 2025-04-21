// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        pingSmall: {
          "75%, 100%": { transform: "scale(1.1)", opacity: "0" },
        },
      },
      animation: {
        "ping-small": "pingSmall 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [],
};
