import { useEffect, useState } from 'react'
import { pageColors, textColors } from '../styles/colors'
import PageTitle from '../components/PageTitle'
import DokumentAnsicht from '../components/DokumentAnsicht'
import { useSprache } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { ladeDokumente, ladeAlleAlsZip } from '../api/documents'
import type { Dokument } from '../api/documents'
import { ui } from '../texts'

// Die Bereiche in der Reihenfolge, in der sie angezeigt werden.
const bereiche = [
  { schluessel: 'EFZ', titel: ui.areaEFZ },
  { schluessel: 'BM', titel: ui.areaBM },
  { schluessel: 'UEK', titel: ui.areaUEK },
  // Zum Schluss nochmal der Lebenslauf. Wer die Unterlagen
  // durchgeht, hat ihn dann beisammen und muss nicht die Seite
  // wechseln.
  { schluessel: 'LEBENSLAUF', titel: ui.areaLebenslauf },
] as const

function Grades() {
  const { t } = useSprache()
  const { benutzer, laedt: authLaedt } = useAuth()

  const [dokumente, setDokumente] = useState<Dokument[]>([])
  const [laedt, setLaedt] = useState(true)
  const [fehler, setFehler] = useState('')
  // Der ZIP-Knopf. "laeuft" sperrt ihn waehrend des Packens, sonst
  // klickt man dreimal und bekommt drei Archive.
  const [zipLaeuft, setZipLaeuft] = useState(false)
  const [zipFehler, setZipFehler] = useState(false)

  async function holeZip() {
    setZipFehler(false)
    setZipLaeuft(true)
    try {
      await ladeAlleAlsZip()
    } catch {
      setZipFehler(true)
    } finally {
      setZipLaeuft(false)
    }
  }


  useEffect(() => {
    if (authLaedt) return
    ladeDokumente()
      .then(setDokumente)
      .catch(() => setFehler(t(ui.adminNoRight)))
      .finally(() => setLaedt(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLaedt])

  if (authLaedt || laedt) {
    return (
      <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
        <PageTitle title={t(ui.gradesTitle)} color={pageColors.login} skizze="urkunde" />
        <p className="text-gray-500">{t(ui.adminLoading)}</p>
      </div>
    )
  }

  // Ohne Anmeldung gibt es hier nichts zu sehen.
  if (!benutzer || fehler) {
    return (
      <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
        <PageTitle title={t(ui.gradesTitle)} color={pageColors.login} skizze="urkunde" />
        <p style={{ color: textColors.login }}>{fehler || t(ui.adminNoRight)}</p>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
      <PageTitle title={t(ui.gradesTitle)} color={pageColors.login} skizze="urkunde" />

      <p className="text-gray-500 mb-6" style={{ maxWidth: '34rem' }}>
        {t(ui.gradesIntro)}
      </p>

      {/* Ein Lehrbetrieb will nicht neun Dateien einzeln anklicken.
          Der Knopf packt alles zusammen, was hinter der Anmeldung
          liegt - auch den Lebenslauf. */}
      {dokumente.length > 0 && (
        <div className="mb-10">
          <button
            onClick={holeZip}
            disabled={zipLaeuft}
            className="pill"
            style={{
              cursor: zipLaeuft ? 'default' : 'pointer',
              background: zipLaeuft ? 'white' : textColors.login,
              color: zipLaeuft ? '#666' : 'white',
              padding: '8px 20px',
              fontSize: '20px',
            }}
          >
            {zipLaeuft ? t(ui.gradesZipLaeuft) : t(ui.gradesZip)}
          </button>
          {zipFehler && (
            <p className="text-sm mt-2" style={{ color: textColors.login }} role="alert">
              {t(ui.gradesZipFehler)}
            </p>
          )}
        </div>
      )}

      {dokumente.length === 0 ? (
        <p className="text-gray-500">{t(ui.gradesEmpty)}</p>
      ) : (
        bereiche.map(bereich => {
          const eigene = dokumente.filter(d => d.area === bereich.schluessel)
          if (eigene.length === 0) return null

          return (
            <div key={bereich.schluessel} className="mb-12">
              <h2 className="sniglet-bold text-sm text-gray-500 mb-4" style={{ letterSpacing: '0.12em' }}>
                {t(bereich.titel).toUpperCase()}
              </h2>

              {eigene.map(dokument => (
                <DokumentAnsicht key={dokument.id} dokument={dokument} />
              ))}
            </div>
          )
        })
      )}
    </div>
  )
}

export default Grades
