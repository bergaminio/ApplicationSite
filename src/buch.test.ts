import { describe, it, expect } from 'vitest'
import { abstand, wechselFuer, seitenReihenfolge, MAX_BLAETTER } from './buch'

describe('abstand', () => {
  it('zaehlt vorwaerts positiv', () => {
    expect(abstand('/', '/projects')).toBe(1)
    expect(abstand('/', '/contact')).toBe(4)
  })

  it('zaehlt rueckwaerts negativ', () => {
    expect(abstand('/projects', '/')).toBe(-1)
  })

  it('gibt 0, wenn eine Adresse nicht ins Buch gehoert', () => {
    expect(abstand('/', '/gibtsnicht')).toBe(0)
    expect(abstand('/gibtsnicht', '/')).toBe(0)
  })
})

describe('wechselFuer', () => {
  it('blaettert zur naechsten Seite vorwaerts, ohne Zwischenblatt', () => {
    expect(wechselFuer('/', '/projects')).toEqual({ vorwaerts: true, blaetter: 0 })
  })

  it('blaettert vom Login zurueck zur Startseite', () => {
    // Der eigentliche Grund, warum Login, Noten und Uebersicht hinten
    // in der Reihenfolge stehen.
    expect(wechselFuer('/login', '/').vorwaerts).toBe(false)
  })

  it('legt bei Spruengen Zwischenblaetter dazwischen', () => {
    expect(wechselFuer('/', '/personal').blaetter).toBe(2)
  })

  it('zeigt nie mehr Blaetter als erlaubt', () => {
    expect(wechselFuer('/', '/admin').blaetter).toBe(MAX_BLAETTER)
  })

  it('behandelt eine unbekannte Adresse als vorwaerts ohne Blaetter', () => {
    const w = wechselFuer('/', '/gibtsnicht')
    expect(w.vorwaerts).toBe(true)
    expect(w.blaetter).toBeLessThan(1)
  })
})

describe('seitenReihenfolge', () => {
  it('enthaelt jede Adresse nur einmal', () => {
    expect(new Set(seitenReihenfolge).size).toBe(seitenReihenfolge.length)
  })

  it('faengt bei der Startseite an', () => {
    expect(seitenReihenfolge[0]).toBe('/')
  })
})
