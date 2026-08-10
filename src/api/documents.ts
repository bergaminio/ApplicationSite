import { getToken } from './auth'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
const ZEITLIMIT = 15000   // Uploads duerfen laenger dauern als eine normale Anfrage

export interface Dokument {
  id: number
  title: string
  area: 'EFZ' | 'BM' | 'UEK'
  contentType: string
  size: number
  uploadedAt: string
}

// Holt die Liste der Dokumente - ohne die Dateien selbst.
export async function ladeDokumente(): Promise<Dokument[]> {
  const antwort = await fetch(`${API}/api/documents`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    signal: AbortSignal.timeout(ZEITLIMIT),
  })
  if (!antwort.ok) throw new Error('Dokumente konnten nicht geladen werden')
  return antwort.json()
}

// Holt die Datei selbst und macht daraus eine Adresse, die der
// Browser anzeigen kann.
//
// Warum so umstaendlich? Ein <img src="..."> schickt das Token nicht
// mit. Die Datei liegt aber hinter dem Login. Also holen wir sie
// von Hand mit Token, und bauen daraus eine Adresse die nur in
// diesem Browser-Tab gilt.
//
// WICHTIG: die zurueckgegebene Adresse spaeter mit
// URL.revokeObjectURL() wieder freigeben, sonst bleibt die Datei
// im Speicher liegen.
export async function ladeDatei(id: number): Promise<string> {
  const antwort = await fetch(`${API}/api/documents/${id}/file`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    signal: AbortSignal.timeout(ZEITLIMIT),
  })
  if (!antwort.ok) throw new Error('Datei konnte nicht geladen werden')

  const blob = await antwort.blob()
  return URL.createObjectURL(blob)
}

// Nur fuer den Admin.
export async function ladeHoch(title: string, area: string, datei: File) {
  // FormData ist das Format fuer Datei-Uploads.
  // Content-Type setzen wir NICHT selbst - der Browser macht das,
  // inklusive einer Trennmarke die er selbst wuerfelt.
  const formular = new FormData()
  formular.append('title', title)
  formular.append('area', area)
  formular.append('file', datei)

  const antwort = await fetch(`${API}/api/admin/documents`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formular,
    signal: AbortSignal.timeout(ZEITLIMIT),
  })

  if (!antwort.ok) {
    const daten = await antwort.json().catch(() => null)
    throw new Error(daten?.message ?? 'Hochladen fehlgeschlagen')
  }
  return antwort.json() as Promise<Dokument>
}

// Benennt ein Dokument um oder verschiebt es in einen anderen
// Bereich. Die Datei selbst bleibt.
export async function aendereDokument(id: number, title: string, area: string) {
  const antwort = await fetch(`${API}/api/admin/documents/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ title, area }),
    signal: AbortSignal.timeout(ZEITLIMIT),
  })
  if (!antwort.ok) throw new Error('Ändern fehlgeschlagen')
  return antwort.json()
}

export async function loescheDokument(id: number) {
  const antwort = await fetch(`${API}/api/admin/documents/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
    signal: AbortSignal.timeout(ZEITLIMIT),
  })
  if (!antwort.ok) throw new Error('Löschen fehlgeschlagen')
}

export function istBild(contentType: string) {
  return contentType.startsWith('image/')
}
