import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Text } from '../texts'

// Merkt sich welche Sprache gewaehlt ist und gibt sie an alle Seiten weiter.
// So muss man die Sprache nicht von Komponente zu Komponente durchreichen.

export type Sprache = 'de' | 'en'

interface SpracheContextType {
  sprache: Sprache
  setSprache: (neu: Sprache) => void
  t: (text: Text) => string   // holt aus einem Text-Paar die richtige Sprache
}

const SpracheContext = createContext<SpracheContextType>({
  sprache: 'de',
  setSprache: () => {},
  t: text => text.de,
})

export function SpracheProvider({ children }: { children: ReactNode }) {
  const [sprache, setSpracheState] = useState<Sprache>(() => {
    // Beim Start schauen ob der Besucher schon mal gewaehlt hat.
    return localStorage.getItem('sprache') === 'en' ? 'en' : 'de'
  })

  // Die Wahl merken, damit sie beim naechsten Besuch noch stimmt.
  function setSprache(neu: Sprache) {
    setSpracheState(neu)
    localStorage.setItem('sprache', neu)
  }

  // Dem Browser sagen in welcher Sprache die Seite ist.
  // Wichtig fuer Vorlese-Programme und Suchmaschinen.
  useEffect(() => {
    document.documentElement.lang = sprache
  }, [sprache])

  function t(text: Text) {
    return text[sprache]
  }

  return (
    <SpracheContext.Provider value={{ sprache, setSprache, t }}>
      {children}
    </SpracheContext.Provider>
  )
}

// Damit holt sich jede Seite die Sprache: const { t } = useSprache()
export function useSprache() {
  return useContext(SpracheContext)
}
