// So sieht ein Projekt bei uns aus.
// Wird von der Projects-Seite und vom Projekt-Fenster gebraucht.
export interface Project {
  name: string
  repo: string        // Repo-Name auf GitHub. Leer lassen wenn es keins gibt.
  text: string        // ein bis zwei Sätze was es ist
  learned: string[]   // was ich dabei gelernt habe
  language: string    // Programmiersprache
  scene: string       // wo es entstanden ist: privat, gibb, smt, anderes
  image: string       // Screenshot fürs Fenster. Leer lassen = kein Bild.
}
