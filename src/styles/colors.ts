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
// Die Zettel sind heller als die Seitenfarbe. Auf einer grossen
// Flaeche wirkt ein kraeftiger Ton sonst wie ein farbiger Hintergrund
// und das Weiss der Seite verschwindet.
export const postitColors = {
  yellow: { main: '#ffe2a4', shadow: '#e5dcc4', corner: '#cbbf9c' },
  orange: { main: '#f8cdb2', shadow: '#e6d5c8', corner: '#c9ab95' },
}
