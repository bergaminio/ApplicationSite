// Jede Seite hat ihre eigene Farbe.
export const pageColors = {
  home: '#f37882',       // Rot
  personal: '#f1aa81',   // Orange
  projects: '#ffd06b',   // Gelb
  story: '#6edaa4',      // Grün
  contact: '#70d6fe',    // Blau
  login: '#e91e8c',      // Pink
}

// Dieselben Farben, aber dunkel genug fuer Text.
//
// Das Pink der Anmeldeseite hat auf Weiss nur 4.17:1, gefordert sind
// 4.5:1. Es als Flaeche zu behalten und nur fuer Schrift nachzudunkeln
// ist der kleinstmoegliche Eingriff: die Seite sieht gleich aus, nur
// die paar Stellen mit Text darauf werden lesbar.
//
// #d4157f liegt bei 4.98:1 und ist mit blossem Auge kaum vom
// Original zu unterscheiden.
export const textColors = {
  login: '#d4157f',
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
  // Fuer die drei Zettel auf der Startseite. Jeder traegt die Farbe
  // der Seite, zu der er fuehrt - gruen fuer den Lebenslauf, blau
  // fuer den Kontakt. Genauso hell gehalten wie die beiden oberen,
  // sonst wirkt das weisse Papier daneben eingefaerbt.
  green:  { main: '#c9f0da', shadow: '#d6e5db', corner: '#a5c9b4' },
  blue:   { main: '#c8eafd', shadow: '#d5e3ea', corner: '#a3c4d5' },
}
