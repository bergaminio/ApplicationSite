import { getToken } from './auth'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
const ZEITLIMIT = 5000

export interface Note {
  id: number
  area: 'EFZ' | 'BM' | 'UEK'
  subject: string
  value: number
}

function kopf() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

// Holt alle Noten. Braucht eine Anmeldung.
export async function ladeNoten(): Promise<Note[]> {
  const antwort = await fetch(`${API}/api/grades`, {
    headers: kopf(),
    signal: AbortSignal.timeout(ZEITLIMIT),
  })
  if (!antwort.ok) throw new Error('Noten konnten nicht geladen werden')
  return antwort.json()
}

// Nur fuer den Admin.
export async function speichereNote(area: string, subject: string, value: number) {
  const antwort = await fetch(`${API}/api/admin/grades`, {
    method: 'POST',
    headers: kopf(),
    body: JSON.stringify({ area, subject, value }),
    signal: AbortSignal.timeout(ZEITLIMIT),
  })
  if (!antwort.ok) throw new Error('Speichern fehlgeschlagen')
  return antwort.json()
}

export async function loescheNote(id: number) {
  const antwort = await fetch(`${API}/api/admin/grades/${id}`, {
    method: 'DELETE',
    headers: kopf(),
    signal: AbortSignal.timeout(ZEITLIMIT),
  })
  if (!antwort.ok) throw new Error('Löschen fehlgeschlagen')
}

// Rechnet den Durchschnitt und rundet auf eine Nachkommastelle.
export function durchschnitt(noten: Note[]): number | null {
  if (noten.length === 0) return null
  const summe = noten.reduce((s, n) => s + n.value, 0)
  return Math.round((summe / noten.length) * 10) / 10
}
