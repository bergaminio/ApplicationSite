import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { pageColors } from '../styles/colors'
import PageTitle from '../components/PageTitle'
import Skizze, { type SkizzenArt } from '../components/Skizze'
import { useSprache } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { ladeLebenslauf, ladeDokumente } from '../api/documents'
import type { Lebenslauf, Zweisprachig, Dokument } from '../api/documents'
import { ui } from '../texts'

// Die Lebenslauf-Seite.
//
// Die Angaben standen bis August 2026 fest im Quelltext. Das
// Repository ist oeffentlich, also stand damit der halbe Lebenslauf
// fuer jeden lesbar auf GitHub - unabhaengig davon, ob die Seite eine
// Anmeldung verlangt.
//
// Jetzt kommen sie vom Server aus einer Datei, die dort liegt und
// nirgends sonst. Im Quelltext steht nur noch, WIE sie dargestellt
// werden, nicht WAS drinsteht.

// Ein Abschnitt, z.B. "Ausbildung": Ueberschrift mit gruenem Strich.
function Abschnitt({ titel, skizze, children }: {
  titel: string
  skizze?: SkizzenArt
  children: React.ReactNode
}) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3">
        <p className="sniglet-bold text-sm text-gray-400" style={{ letterSpacing: '0.12em' }}>
          {titel.toUpperCase()}
        </p>
        {skizze && <Skizze art={skizze} farbe={pageColors.story} groesse={32} />}
      </div>
      <div style={{
        width: '60px',
        height: '3px',
        background: pageColors.story,
        borderRadius: '2px',
        transform: 'rotate(-0.5deg)',
        marginTop: '6px',
        marginBottom: '1.5rem',
      }} />
      {children}
    </div>
  )
}

// Eine Zeile: Zeitraum links, Inhalt rechts.
// Auf dem Handy steht der Zeitraum darueber statt daneben.
function Zeile({ links, titel, ort, text }: {
  links: string
  titel: string
  ort?: string
  text?: string
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-6 mb-6">
      <p className="text-sm text-gray-400 sm:w-28 sm:shrink-0">{links}</p>
      <div>
        <p className="sniglet-bold">{titel}</p>
        {ort && <p className="text-sm text-gray-500">{ort}</p>}
        {text && <p className="text-sm text-gray-700 mt-1">{text}</p>}
      </div>
    </div>
  )
}

function CV() {
  const { t } = useSprache()
  const { benutzer, laedt: authLaedt } = useAuth()

  const [daten, setDaten] = useState<Lebenslauf | null>(null)
  const [dokumente, setDokumente] = useState<Dokument[]>([])
  // "geladen" statt "laedt": so wird der Zustand nur im Rueckruf
  // gesetzt und nicht mitten im Effekt. Setzt man dort direkt, loest
  // das eine zusaetzliche Renderrunde aus - ESLint weist darauf hin.
  const [geladen, setGeladen] = useState(false)

  useEffect(() => {
    if (authLaedt || !benutzer) return
    // Beides zusammen holen. Schlaegt eines fehl, zeigen wir das
    // andere trotzdem - lieber ein halber Lebenslauf als keiner.
    Promise.allSettled([ladeLebenslauf(), ladeDokumente()])
      .then(([lb, dk]) => {
        if (lb.status === 'fulfilled') setDaten(lb.value)
        if (dk.status === 'fulfilled') setDokumente(dk.value)
      })
      .finally(() => setGeladen(true))
  }, [authLaedt, benutzer])

  // Abgemeldet gibt es nichts zu laden, dann ist auch nichts am Laden.
  const laedt = authLaedt || (Boolean(benutzer) && !geladen)

  const rahmen = (inhalt: React.ReactNode) => (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
      <PageTitle title={t(ui.cvTitle)} color={pageColors.story} skizze="wegweiser" />
      {inhalt}
    </div>
  )

  if (authLaedt || laedt) {
    return rahmen(<p className="text-gray-400">{t(ui.adminLoading)}</p>)
  }

  // Ohne Anmeldung gibt es hier nichts zu sehen.
  if (!benutzer) {
    return rahmen(
      <>
        <p className="text-gray-700 mb-6" style={{ maxWidth: '34rem' }}>
          {t(ui.cvLocked)}
        </p>
        <Link
          to="/login"
          className="pill inline-block"
          style={{ background: pageColors.login, color: 'white', padding: '8px 20px', fontSize: '20px' }}
        >
          {t(ui.cvToLogin)}
        </Link>
      </>
    )
  }

  const pdf = dokumente.find(d => d.area === 'LEBENSLAUF')
  const zwei = (x: Zweisprachig) => t(x)

  return rahmen(
    <>
      {daten && (
        <div className="flex items-start gap-5 mb-12">
          <p className="text-gray-700" style={{ maxWidth: '38rem' }}>{zwei(daten.ueberMich)}</p>
          <Skizze art="laeufer" farbe={pageColors.story} groesse={72} />
        </div>
      )}

      {daten && (
        <>
          <Abschnitt titel={t(ui.education)} skizze="buch">
            {daten.ausbildung.map(e => (
              <Zeile key={zwei(e.titel)} links={zwei(e.zeit)} titel={zwei(e.titel)} ort={zwei(e.ort)} text={zwei(e.text)} />
            ))}
          </Abschnitt>

          {daten.referenzen.length > 0 && (
            <Abschnitt titel={t(ui.references)} skizze="brief">
              {daten.referenzen.map(r => (
                <Zeile
                  key={r.name}
                  links={zwei(r.rolle)}
                  titel={r.name}
                  ort={[r.betrieb, zwei(r.zusatz)].filter(Boolean).join(' · ')}
                  text={r.kontakt || t(ui.referencesOnRequest)}
                />
              ))}
            </Abschnitt>
          )}

          <Abschnitt titel={t(ui.languages)} skizze="stift">
            {daten.sprachen.map(s => (
              <Zeile key={zwei(s.name)} links={zwei(s.name)} titel={zwei(s.niveau)} />
            ))}
          </Abschnitt>

          <Abschnitt titel={t(ui.itSkills)} skizze="bildschirm">
            <div className="flex flex-wrap gap-2">
              {daten.itKenntnisse.map(k => (
                <span key={k} className="pill" style={{ background: 'white' }}>{k}</span>
              ))}
            </div>
          </Abschnitt>

          <Abschnitt titel={t(ui.hobbies)} skizze="klavier">
            <div className="flex flex-wrap gap-2">
              {daten.hobbys.map(h => (
                <span key={zwei(h)} className="pill" style={{ background: 'white' }}>{zwei(h)}</span>
              ))}
            </div>
          </Abschnitt>
        </>
      )}

      {/* Ohne Datei auf dem Server bleibt wenigstens das PDF. */}
      {!daten && !pdf && <p className="text-gray-400">{t(ui.cvMissing)}</p>}

      {/* Am Schluss der Hinweis aufs PDF. Es liegt bei den
          Notenausweisen, damit ein Betrieb alle Unterlagen an einem
          Ort hat und mit einem Klick als ZIP mitnehmen kann. */}
      {pdf && (
        <p className="text-sm text-gray-500">
          {t(ui.cvPdfHint)}{' '}
          <Link to="/grades" className="underline hover:text-gray-700">
            {t(ui.gradesTitle)}
          </Link>
        </p>
      )}
    </>
  )
}

export default CV
