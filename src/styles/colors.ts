// Jede Seite hat ihre eigene Farbe.
export const pageColors = {
  home: '#f37882',       // Rot
  personal: '#f1aa81',   // Orange
  projects: '#ffd06b',   // Gelb
  story: '#6edaa4',      // Grün
  contact: '#70d6fe',    // Blau
  login: '#e91e8c',      // Pink
}

// Ein Post-it braucht drei Toene:
// main   = die Farbe vom Zettel
// shadow = der Schatten dahinter
// corner = die abgeknickte Ecke oben rechts
//
// Schatten und Ecke sind bewusst hell und wenig farbig gehalten.
// Kraeftige Toene (frueher ein sattes Oliv und Braun) faerben das
// weisse Blatt daneben optisch mit - es wirkt dann cremig statt weiss.
export const postitColors = {
  yellow: { main: '#ffd06b', shadow: '#d8cba8', corner: '#b9a878' },
  orange: { main: '#f1aa81', shadow: '#dcc4b3', corner: '#b39079' },
}
