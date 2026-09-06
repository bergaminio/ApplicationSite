// Die Reihenfolge der Seiten im "Buch" und alles, was sich daraus
// ergibt: in welche Richtung geblaettert wird und wie viele leere
// Blaetter dabei mitfliegen.
//
// Steht absichtlich in einer eigenen Datei und nicht in App.tsx: hier
// ist es reine Rechnerei ohne React, und genau darum laesst es sich in
// buch.test.ts pruefen, ohne einen Browser zu starten.

// Hoechstens so viele Zwischenblaetter zeigen. Bei acht Seiten waeren
// mehr zwar moeglich, aber viele duenne Blaetter wirken unruhig.
export const MAX_BLAETTER = 3

// Login, Noten und Uebersicht stehen hinten - wie ein Anhang. Dadurch
// blaettert es vom Login zurueck zur Startseite auch wirklich zurueck.
export const seitenReihenfolge = [
  '/', '/projects', '/barrierefreiheit', '/cv', '/personal', '/contact',
  '/login', '/grades', '/admin',
]

// Wie viele Seiten liegen zwischen den beiden? 1 = direkt nebeneinander,
// negativ heisst rueckwaerts. 0 heisst: eine der beiden gehoert nicht
// ins Buch, zum Beispiel eine Adresse die es gar nicht gibt.
export function abstand(von: string, nach: string) {
  const a = seitenReihenfolge.indexOf(von)
  const b = seitenReihenfolge.indexOf(nach)
  if (a === -1 || b === -1) return 0
  return b - a
}

// Wie der Wechsel von einer Seite zur anderen aussieht.
//
// Die leeren Blaetter sind absichtlich leer: echte Zwischenseiten
// einzubauen wuerde deren Daten laden, nur damit sie eine halbe
// Sekunde vorbeifliegen.
export function wechselFuer(von: string, nach: string) {
  const schritte = abstand(von, nach)
  return {
    vorwaerts: schritte >= 0,
    blaetter: Math.min(Math.abs(schritte) - 1, MAX_BLAETTER),
  }
}
