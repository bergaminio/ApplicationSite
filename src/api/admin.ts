// Die Wege die nur ich als Admin aufrufen darf.
import { getToken } from './auth'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
const ZEITLIMIT = 5000

export interface KontoUebersicht {
  username: string
  displayName: string
  role: string
  loginCount: number
  lastLogin: string | null   // null = hat sich noch nie angemeldet
}

export interface Anmeldeversuch {
  username: string
  success: boolean
  time: string
}

export class AdminFehler extends Error {
  art: 'keinRecht' | 'server'

  constructor(art: 'keinRecht' | 'server') {
    super(art)
    this.art = art
  }
}

// Holt Daten vom Backend und schickt das Token mit.
async function hole<T>(pfad: string): Promise<T> {
  let antwort: Response
  try {
    antwort = await fetch(`${API}${pfad}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
      signal: AbortSignal.timeout(ZEITLIMIT),
    })
  } catch {
    throw new AdminFehler('server')
  }

  // 401 = nicht angemeldet, 403 = angemeldet aber keine Rechte
  if (antwort.status === 401 || antwort.status === 403) {
    throw new AdminFehler('keinRecht')
  }
  if (!antwort.ok) throw new AdminFehler('server')

  return antwort.json()
}

export function ladeKonten() {
  return hole<KontoUebersicht[]>('/api/admin/accounts')
}

export function ladeAnmeldeversuche() {
  return hole<Anmeldeversuch[]>('/api/admin/logins')
}
