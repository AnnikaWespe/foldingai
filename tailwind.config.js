module.exports = {
  content: ["./index.html", "./src/**/*.{js,html}"],
  theme: {
    extend: {
      colors: {
        white: "#FFF5F5", // weiches, leicht roséfarbenes Weiß für den Hintergrund
        black: "#000000", // tiefes Schwarz für Text und starke Kontraste
        secondary: "#1A8B9D", // Petrolblau als Hauptakzent / strukturierende Farbe
        accent: {
          DEFAULT: "#B2D430", // lebendiges Limettengrün als Sekundärakzent
          dark: "#8AA522", // etwas gedecktere Variante für Hover / aktive Zustände
        },
      },
      fontFamily: {
        heading: ["Sora", "sans-serif"],
        body: ["Tenor Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
