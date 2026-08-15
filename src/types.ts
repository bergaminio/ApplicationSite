import type { Text } from './texts'

// So sieht ein Projekt bei uns aus.
// Wird von der Projects-Seite und vom Projekt-Fenster gebraucht.
export interface Project {
  id: string          // eindeutiger Name, nur intern (fuer React als Schluessel)
  name: Text          // wie das Projekt heisst
  repo: string        // Repo-Name auf GitHub. Leer lassen wenn es keins gibt.
  // Volle Adresse, wenn das Projekt irgendwo live laeuft.
  // Fuer einen Lehrbetrieb ist das der staerkste Beleg: er kann es
  // anklicken und ausprobieren, statt Code lesen zu muessen.
  demo?: string
  text: Text          // ein bis zwei Sätze was es ist
  learned: string[]   // was ich dabei gelernt habe (Technik-Namen, nicht übersetzt)
  language: string    // Programmiersprache
  scene: string       // wo es entstanden ist: privat, gibb, smt, anderes
  image: string       // Screenshot fürs Fenster. Leer lassen = kein Bild.
}
