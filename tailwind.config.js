module.exports = {
  content: ["./index.html", "./src/**/*.{js,html}"],
  theme: {
    extend: {
      colors: {
        white: "#faf8f5", // leicht getöntes Weiß, angenehm für den Hintergrund
        black: "#1e1e1b", // warmes, tiefes Schwarzbraun für Text
        secondary: "#dcd3c5", // cremiges Hellbeige für Linien, Ränder, feine Flächen
        accent: {
          DEFAULT: "#6d2e36", // Aubergine / dunkles Weinrot
          dark: "#4c1e24", // tiefere Variante für Hover-Zustände
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};
