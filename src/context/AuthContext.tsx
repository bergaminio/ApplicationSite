import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import * as authApi from '../api/auth'
import type { Benutzer } from '../api/auth'

// Merkt sich wer angemeldet ist und gibt es an alle Seiten weiter.

interface AuthContextType {
  benutzer: Benutzer | null
  laedt: boolean                  // true solange wir das Token pruefen
  anmelden: (username: string, password: string) => Promise<void>
  abmelden: () => void
}

const AuthContext = createContext<AuthContextType>({
  benutzer: null,
  laedt: true,
  anmelden: async () => {},
  abmelden: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [benutzer, setBenutzer] = useState<Benutzer | null>(null)
  const [laedt, setLaedt] = useState(true)

  // Beim Start einmal beim Backend nachfragen, ob das gespeicherte
  // Token ueberhaupt noch gilt. Ein Token laeuft nach 8 Stunden ab.
  useEffect(() => {
    authApi.me()
      .then(setBenutzer)
      .finally(() => setLaedt(false))
  }, [])

  async function anmelden(username: string, password: string) {
    const daten = await authApi.login(username, password)
    setBenutzer({
      username: daten.username,
      displayName: daten.displayName,
      role: daten.role,
    })
  }

  function abmelden() {
    authApi.logout()
    setBenutzer(null)
  }

  return (
    <AuthContext.Provider value={{ benutzer, laedt, anmelden, abmelden }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
