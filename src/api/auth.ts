// Redet mit dem Backend (Spring Boot, Port 8080).
//
// Beim Entwickeln laeuft das Backend auf einem anderen Port als das
// Frontend. Spaeter auf dem Server kann man VITE_API_URL setzen.
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

// Gibt es ueberhaupt ein Backend, mit dem wir reden koennen?
//
// Beim Entwickeln ja - da laeuft es auf localhost. In der gebauten
// Fassung nur, wenn beim Bauen VITE_API_URL gesetzt wurde.
//
// Ohne das wuerde jede Seite zwei Anfragen ins Leere schicken, und
// der Browser schreibt fuer jede einen roten Fehler in die Konsole -
// auch wenn der Code ihn abfaengt. Also fragen wir gar nicht erst.
export const BACKEND_EINGERICHTET =
  Boolean(import.meta.env.VITE_API_URL) || import.meta.env.DEV

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
  if (!BACKEND_EINGERICHTET) return null

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

// Schaut nach, ob das Backend ueberhaupt da ist.
//
// Welchen Status es antwortet, ist egal - ohne Token kommt 401, und
// auch das heisst: der Server lebt. Nur wenn gar keine Antwort kommt,
// laeuft er nicht.
//
// Dadurch passt sich die Login-Seite von selbst an: laeuft der Server
// nicht, zeigt sie einen Hinweis statt eines Formulars, das ohnehin
// nicht funktionieren wuerde.
export async function backendErreichbar(): Promise<boolean> {
  if (!BACKEND_EINGERICHTET) return false
  try {
    await fetch(`${API}/api/auth/me`, {
      signal: AbortSignal.timeout(3000),
    })
    return true
  } catch {
    return false
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
}
