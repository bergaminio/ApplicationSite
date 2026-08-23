import { describe, it, expect } from 'vitest'
import { ui } from './texts'

// Diese Tests pruefen keine Formulierung, sondern nur, dass beim
// Aendern eines Textes nichts vergessen geht. Genau das passiert
// naemlich leicht: deutschen Satz umschreiben, englischen stehen
// lassen - und die englische Fassung stimmt nicht mehr.

const eintraege = Object.entries(ui)

describe('Texte', () => {
  it('hat ueberhaupt Eintraege', () => {
    expect(eintraege.length).toBeGreaterThan(50)
  })

  it('hat zu jedem Eintrag beide Sprachen', () => {
    const fehlend = eintraege
      .filter(([, w]) => typeof w.de !== 'string' || typeof w.en !== 'string')
      .map(([name]) => name)
    expect(fehlend).toEqual([])
  })

  it('hat nirgends einen leeren Text', () => {
    const leer = eintraege
      .filter(([, w]) => w.de.trim() === '' || w.en.trim() === '')
      .map(([name]) => name)
    expect(leer).toEqual([])
  })

  it('benutzt keine Geviertstriche', () => {
    // Michael wollte sie ueberall raus. Ein Test haelt sie draussen,
    // auch wenn spaeter ein Text dazukommt.
    const mitStrich = eintraege
      .filter(([, w]) => w.de.includes('\u2014') || w.en.includes('\u2014'))
      .map(([name]) => name)
    expect(mitStrich).toEqual([])
  })

  it('duzt niemanden', () => {
    // Eine Bewerbungsseite spricht Betriebe nicht mit du an.
    const duWorte = /\b(du|dich|dir|dein|deine|deinen|deinem|deiner)\b/i
    const geduzt = eintraege
      .filter(([, w]) => duWorte.test(w.de))
      .map(([name]) => name)
    expect(geduzt).toEqual([])
  })

  it('schreibt Schweizer ss statt ß', () => {
    const mitEszett = eintraege
      .filter(([, w]) => w.de.includes('ß'))
      .map(([name]) => name)
    expect(mitEszett).toEqual([])
  })
})
