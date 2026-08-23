// Die Wege die nur ich als Admin aufrufen darf.
import { getToken } from './auth'
import type { Lebenslauf } from './documents'

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

// Legt ein Konto fuer einen neuen Lehrbetrieb an.
//
// Der Benutzername muss eindeutig sein. Gibt es ihn schon, antwortet
// das Backend mit 409 und einer Meldung, die direkt angezeigt werden
// kann - besser als ein allgemeines "hat nicht geklappt".
export async function neuesKonto(username: string, password: string, displayName: string) {
  const antwort = await fetch(`${API}/api/admin/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ username, password, displayName }),
    signal: AbortSignal.timeout(ZEITLIMIT),
  })
  if (!antwort.ok) {
    const daten = await antwort.json().catch(() => null)
    throw new Error(daten?.message ?? 'Anlegen fehlgeschlagen')
  }
  return antwort.json()
}

// Aendert Anzeigename und/oder Passwort eines Kontos.
// Was leer bleibt, wird nicht angefasst.
export async function aendereKonto(username: string, displayName: string, password: string) {
  const antwort = await fetch(`${API}/api/admin/accounts/${username}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ displayName, password }),
    signal: AbortSignal.timeout(ZEITLIMIT),
  })
  if (!antwort.ok) {
    const daten = await antwort.json().catch(() => null)
    throw new Error(daten?.message ?? 'Ändern fehlgeschlagen')
  }
  return antwort.json()
}

export async function loescheKonto(username: string) {
  const antwort = await fetch(`${API}/api/admin/accounts/${username}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
    signal: AbortSignal.timeout(ZEITLIMIT),
  })
  if (!antwort.ok) {
    const daten = await antwort.json().catch(() => null)
    throw new Error(daten?.message ?? 'Löschen fehlgeschlagen')
  }
}

export function ladeKonten() {
  return hole<KontoUebersicht[]>('/api/admin/accounts')
}

export function ladeAnmeldeversuche() {
  return hole<Anmeldeversuch[]>('/api/admin/logins')
}

// Den Lebenslauf holen und speichern.
//
// Der Aufbau steht in lebenslauf.beispiel.json, der Typ dazu in
// api/documents.ts - dort wird er auch fuers Anzeigen gebraucht.
//
// Warum /api/admin/cv und nicht /api/cv? Weil unter /api/admin/ die
// Rolle ADMIN verlangt wird. Ein Lehrbetrieb darf den Lebenslauf
// lesen, aber nicht umschreiben.
export function ladeLebenslaufZumBearbeiten() {
  return hole<Lebenslauf>('/api/admin/cv')
}

export async function speichereLebenslauf(daten: Lebenslauf) {
  const antwort = await fetch(`${API}/api/admin/cv`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(daten),
    // Mehr Zeit als sonst: hier wird eine Datei geschrieben.
    signal: AbortSignal.timeout(15000),
  })
  if (!antwort.ok) {
    const daten = await antwort.json().catch(() => null)
    // 400 kommt von der Pruefung im Backend und nennt das Feld,
    // 500 vom Schreiben und nennt den Grund.
    throw new Error(daten?.error ?? daten?.message ?? 'Speichern fehlgeschlagen')
  }
}
