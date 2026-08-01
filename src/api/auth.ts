// Redet mit dem Backend (Spring Boot, Port 8080).
//
// Beim Entwickeln laeuft das Backend auf einem anderen Port als das
// Frontend. Spaeter auf dem Server kann man VITE_API_URL setzen.
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

// Wo wir das Token im Browser ablegen.
const TOKEN_KEY = 'token'

// Nach so vielen Millisekunden geben wir auf.
// Ohne Zeitlimit haengt der Browser bei einem toten Server ewig
// und der Anmelde-Knopf bleibt blockiert.
const ZEITLIMIT = 5000

export interface Benutzer {
  username: string
  displayName: string
  role: string
}

export interface LoginAntwort extends Benutzer {
  token: string
}

// Eigene Fehlerklasse, damit die Login-Seite unterscheiden kann,
// was schiefgegangen ist.
export type FehlerArt = 'falsch' | 'server' | 'unbekannt'

export class LoginFehler extends Error {
  art: FehlerArt

  constructor(art: FehlerArt) {
    super(art)
    this.art = art
  }
}

export async function login(username: string, password: string): Promise<LoginAntwort> {
  let antwort: Response
  try {
    antwort = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      signal: AbortSignal.timeout(ZEITLIMIT),
    })
  } catch {
    // Hierher kommen wir wenn der Server nicht erreichbar ist
    // oder das Zeitlimit abgelaufen ist.
    throw new LoginFehler('server')
  }

  if (antwort.status === 401) throw new LoginFehler('falsch')
  if (!antwort.ok) throw new LoginFehler('unbekannt')

  const daten: LoginAntwort = await antwort.json()
  localStorage.setItem(TOKEN_KEY, daten.token)
  return daten
}

// Fragt das Backend, wer mit dem gespeicherten Token angemeldet ist.
// Gibt null zurueck wenn kein oder ein abgelaufenes Token da ist.
export async function me(): Promise<Benutzer | null> {
  const token = getToken()
  if (!token) return null

  try {
    const antwort = await fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(ZEITLIMIT),
    })
    if (!antwort.ok) {
      // Token abgelaufen oder ungueltig - dann weg damit.
      logout()
      return null
    }
    return await antwort.json()
  } catch {
    // Server nicht erreichbar. Token behalten, vielleicht laeuft
    // er gleich wieder.
    return null
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
}
