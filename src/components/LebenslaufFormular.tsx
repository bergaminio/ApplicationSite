import { useEffect, useId, useState } from 'react'
import { pageColors } from '../styles/colors'
import { useSprache } from '../context/LanguageContext'
import { ladeLebenslaufZumBearbeiten, speichereLebenslauf } from '../api/admin'
import type { Lebenslauf, Zweisprachig } from '../api/documents'
import { ui } from '../texts'

// Der Lebenslauf zum Bearbeiten im Admin-Bereich.
//
// Eigene Datei und nicht in Admin.tsx dazu: die Seite ist ohnehin
// schon lang, und hier haengt viel zusammen, was mit Konten und
// Notenausweisen nichts zu tun hat.
//
// Der Aufbau ist ueberall derselbe: fast jeder Text gibt es zweimal,
// auf Deutsch und auf Englisch. Darum das Feldpaar unten - links
// Deutsch, rechts Englisch, immer in derselben Reihenfolge, damit man
// nicht suchen muss.

const FELD = 'box w-full px-3 py-2'
const FELD_STIL = { background: 'transparent', fontFamily: 'inherit' } as const

// Ein Text in beiden Sprachen nebeneinander.
//
// Beide Felder brauchen eine eigene Beschriftung. Sichtbar steht der
// Titel nur einmal darueber - fuer eine Vorlesesoftware waeren das
// sonst zwei Felder, von denen keines sagt, welche Sprache es meint.
// Darum ein <label> pro Feld, das zweite Wort davon nur vorgelesen.
//
// useId erzeugt Nummern, die auch dann eindeutig bleiben, wenn dieses
// Feldpaar zwanzigmal auf derselben Seite steht.
function Paar({ titel, wert, aendern, mehrzeilig }: {
  titel: string
  wert: Zweisprachig
  aendern: (neu: Zweisprachig) => void
  mehrzeilig?: boolean
}) {
  const Eingabe = mehrzeilig ? 'textarea' : 'input'
  const nummer = useId()
  const idDe = `${nummer}-de`
  const idEn = `${nummer}-en`

  return (
    <div className="mb-3">
      <p className="text-xs text-gray-500 mb-1" aria-hidden>{titel}</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <label htmlFor={idDe} className="nur-vorlesen">{titel}, Deutsch</label>
          <Eingabe
            id={idDe}
            value={wert.de}
            onChange={e => aendern({ ...wert, de: e.target.value })}
            className={FELD}
            style={FELD_STIL}
            rows={mehrzeilig ? 5 : undefined}
            placeholder="Deutsch"
          />
        </div>
        <div className="flex-1">
          <label htmlFor={idEn} className="nur-vorlesen">{titel}, English</label>
          <Eingabe
            id={idEn}
            value={wert.en}
            onChange={e => aendern({ ...wert, en: e.target.value })}
            className={FELD}
            style={FELD_STIL}
            rows={mehrzeilig ? 5 : undefined}
            placeholder="English"
          />
        </div>
      </div>
    </div>
  )
}

// Ein einzelnes Feld, das es nur einmal gibt. Namen von Menschen zum
// Beispiel sind in beiden Sprachen gleich.
function Einzeln({ titel, wert, aendern }: {
  titel: string
  wert: string
  aendern: (neu: string) => void
}) {
  const id = useId()
  return (
    <div className="mb-3">
      <label htmlFor={id} className="block text-xs text-gray-500 mb-1">{titel}</label>
      <input id={id} value={wert} onChange={e => aendern(e.target.value)} className={FELD} style={FELD_STIL} />
    </div>
  )
}

// Ueberschrift mit farbigem Strich, wie auf der Lebenslauf-Seite.
function Block({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="sniglet-bold text-sm text-gray-500 mb-1" style={{ letterSpacing: '0.12em' }}>
        {titel.toUpperCase()}
      </h3>
      <div style={{
        width: '48px', height: '3px', background: pageColors.story,
        borderRadius: '2px', marginBottom: '1rem',
      }} />
      {children}
    </div>
  )
}

// Ein Eintrag in einer Liste: Rahmen drumherum, Loeschen-Knopf oben
// rechts. Ohne den Rahmen laufen bei drei Ausbildungen zwoelf Felder
// ineinander und man sieht nicht mehr, was zusammengehoert.
function Eintrag({ nummer, entfernen, children }: {
  nummer: number
  entfernen: () => void
  children: React.ReactNode
}) {
  const { t } = useSprache()
  return (
    <div className="box p-4 mb-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500">{nummer}</p>
        <button type="button" onClick={entfernen} className="pill" style={{ cursor: 'pointer', fontSize: '15px' }}>
          {t(ui.cvEditRemove)}
        </button>
      </div>
      {children}
    </div>
  )
}

const LEER: Zweisprachig = { de: '', en: '' }

function LebenslaufFormular() {
  const { t } = useSprache()

  const [daten, setDaten] = useState<Lebenslauf | null>(null)
  const [laedt, setLaedt] = useState(true)
  const [fehler, setFehler] = useState('')
  const [gespeichert, setGespeichert] = useState(false)
  const [speichert, setSpeichert] = useState(false)

  useEffect(() => {
    ladeLebenslaufZumBearbeiten()
      .then(setDaten)
      .catch(() => setFehler(t(ui.cvEditLoadFailed)))
      .finally(() => setLaedt(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Aendert ein einzelnes Feld und merkt sich, dass wieder etwas
  // offen ist. Ohne das bliebe "Gespeichert" stehen, waehrend man
  // schon wieder tippt.
  function setze(neu: Lebenslauf) {
    setDaten(neu)
    setGespeichert(false)
  }

  // Ein Element in einer Liste austauschen.
  function inListe<T>(liste: T[], nummer: number, neu: T) {
    return liste.map((alt, i) => (i === nummer ? neu : alt))
  }

  async function speichern() {
    if (!daten) return
    setSpeichert(true)
    setFehler('')
    try {
      await speichereLebenslauf(daten)
      setGespeichert(true)
    } catch (e) {
      setFehler(e instanceof Error ? e.message : t(ui.cvEditSaveFailed))
    } finally {
      setSpeichert(false)
    }
  }

  if (laedt) return <p className="text-gray-500 mb-12">{t(ui.adminLoading)}</p>

  if (!daten) {
    return (
      <div className="mb-12">
        <p className="text-gray-500">{fehler || t(ui.cvEditNoFile)}</p>
      </div>
    )
  }

  return (
    <div className="mb-12">
      <p className="text-gray-500 mb-6" style={{ maxWidth: '34rem' }}>
        {t(ui.cvEditIntro)}
      </p>

      <Block titel={t(ui.cvEditAbout)}>
        <Paar
          titel={t(ui.cvEditAboutField)}
          wert={daten.ueberMich}
          aendern={v => setze({ ...daten, ueberMich: v })}
          mehrzeilig
        />
      </Block>

      <Block titel={t(ui.education)}>
        {daten.ausbildung.map((e, i) => (
          <Eintrag
            key={i}
            nummer={i + 1}
            entfernen={() => setze({ ...daten, ausbildung: daten.ausbildung.filter((_, k) => k !== i) })}
          >
            <Paar titel={t(ui.cvEditPeriod)} wert={e.zeit}
              aendern={v => setze({ ...daten, ausbildung: inListe(daten.ausbildung, i, { ...e, zeit: v }) })} />
            <Paar titel={t(ui.cvEditTitleField)} wert={e.titel}
              aendern={v => setze({ ...daten, ausbildung: inListe(daten.ausbildung, i, { ...e, titel: v }) })} />
            <Paar titel={t(ui.cvEditPlace)} wert={e.ort}
              aendern={v => setze({ ...daten, ausbildung: inListe(daten.ausbildung, i, { ...e, ort: v }) })} />
            <Paar titel={t(ui.cvEditDetails)} wert={e.text}
              aendern={v => setze({ ...daten, ausbildung: inListe(daten.ausbildung, i, { ...e, text: v }) })} />
          </Eintrag>
        ))}
        <button
          type="button"
          className="pill"
          style={{ cursor: 'pointer' }}
          onClick={() => setze({
            ...daten,
            ausbildung: [...daten.ausbildung, { zeit: LEER, titel: LEER, ort: LEER, text: LEER }],
          })}
        >
          {t(ui.cvEditAdd)}
        </button>
      </Block>

      <Block titel={t(ui.references)}>
        {daten.referenzen.map((r, i) => (
          <Eintrag
            key={i}
            nummer={i + 1}
            entfernen={() => setze({ ...daten, referenzen: daten.referenzen.filter((_, k) => k !== i) })}
          >
            <Einzeln titel={t(ui.cvEditName)} wert={r.name}
              aendern={v => setze({ ...daten, referenzen: inListe(daten.referenzen, i, { ...r, name: v }) })} />
            <Paar titel={t(ui.cvEditRole)} wert={r.rolle}
              aendern={v => setze({ ...daten, referenzen: inListe(daten.referenzen, i, { ...r, rolle: v }) })} />
            <Einzeln titel={t(ui.cvEditSchool)} wert={r.betrieb}
              aendern={v => setze({ ...daten, referenzen: inListe(daten.referenzen, i, { ...r, betrieb: v }) })} />
            <Paar titel={t(ui.cvEditExtra)} wert={r.zusatz}
              aendern={v => setze({ ...daten, referenzen: inListe(daten.referenzen, i, { ...r, zusatz: v }) })} />
            <Einzeln titel={t(ui.cvEditContact)} wert={r.kontakt}
              aendern={v => setze({ ...daten, referenzen: inListe(daten.referenzen, i, { ...r, kontakt: v }) })} />
          </Eintrag>
        ))}
        <button
          type="button"
          className="pill"
          style={{ cursor: 'pointer' }}
          onClick={() => setze({
            ...daten,
            referenzen: [...daten.referenzen, { name: '', rolle: LEER, betrieb: '', zusatz: LEER, kontakt: '' }],
          })}
        >
          {t(ui.cvEditAdd)}
        </button>
      </Block>

      <Block titel={t(ui.languages)}>
        {daten.sprachen.map((s, i) => (
          <Eintrag
            key={i}
            nummer={i + 1}
            entfernen={() => setze({ ...daten, sprachen: daten.sprachen.filter((_, k) => k !== i) })}
          >
            <Paar titel={t(ui.cvEditLanguage)} wert={s.name}
              aendern={v => setze({ ...daten, sprachen: inListe(daten.sprachen, i, { ...s, name: v }) })} />
            <Paar titel={t(ui.cvEditLevel)} wert={s.niveau}
              aendern={v => setze({ ...daten, sprachen: inListe(daten.sprachen, i, { ...s, niveau: v }) })} />
          </Eintrag>
        ))}
        <button
          type="button"
          className="pill"
          style={{ cursor: 'pointer' }}
          onClick={() => setze({ ...daten, sprachen: [...daten.sprachen, { name: LEER, niveau: LEER }] })}
        >
          {t(ui.cvEditAdd)}
        </button>
      </Block>

      {/* IT-Kenntnisse und Hobbys sind blosse Aufzaehlungen. Ein Feld
          pro Eintrag waere hier umstaendlich: einfacher ist eine
          Zeile, in der die Begriffe durch Komma getrennt stehen. */}
      <Block titel={t(ui.itSkills)}>
        <p className="text-xs text-gray-500 mb-1">{t(ui.cvEditCommaHint)}</p>
        <input
          value={daten.itKenntnisse.join(', ')}
          onChange={e => setze({
            ...daten,
            itKenntnisse: e.target.value.split(',').map(x => x.trim()).filter(Boolean),
          })}
          className={FELD}
          style={FELD_STIL}
        />
      </Block>

      <Block titel={t(ui.hobbies)}>
        {daten.hobbys.map((h, i) => (
          <div key={i} className="flex items-end gap-2 mb-2">
            <div className="flex-1">
              <Paar titel={`${i + 1}`} wert={h}
                aendern={v => setze({ ...daten, hobbys: inListe(daten.hobbys, i, v) })} />
            </div>
            <button
              type="button"
              className="pill mb-3"
              style={{ cursor: 'pointer', fontSize: '15px' }}
              onClick={() => setze({ ...daten, hobbys: daten.hobbys.filter((_, k) => k !== i) })}
            >
              {t(ui.cvEditRemove)}
            </button>
          </div>
        ))}
        <button
          type="button"
          className="pill"
          style={{ cursor: 'pointer' }}
          onClick={() => setze({ ...daten, hobbys: [...daten.hobbys, LEER] })}
        >
          {t(ui.cvEditAdd)}
        </button>
      </Block>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={speichern}
          disabled={speichert}
          className="pill"
          style={{
            cursor: speichert ? 'default' : 'pointer',
            background: pageColors.story,
            color: 'white',
            padding: '6px 20px',
          }}
        >
          {speichert ? t(ui.cvEditSaving) : t(ui.cvEditSave)}
        </button>

        {gespeichert && <p className="text-sm text-gray-500">{t(ui.cvEditSaved)}</p>}
        {fehler && <p className="text-sm" style={{ color: '#b00' }}>{fehler}</p>}
      </div>
    </div>
  )
}

export default LebenslaufFormular
