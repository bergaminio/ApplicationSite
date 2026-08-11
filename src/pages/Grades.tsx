import { useEffect, useState } from 'react'
import { pageColors } from '../styles/colors'
import PageTitle from '../components/PageTitle'
import DokumentAnsicht from '../components/DokumentAnsicht'
import { useSprache } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { ladeDokumente } from '../api/documents'
import type { Dokument } from '../api/documents'
import { ui } from '../texts'

// Die drei Bereiche in der Reihenfolge, in der sie angezeigt werden.
const bereiche = [
  { schluessel: 'EFZ', titel: ui.areaEFZ },
  { schluessel: 'BM', titel: ui.areaBM },
  { schluessel: 'UEK', titel: ui.areaUEK },
] as const

function Grades() {
  const { t } = useSprache()
  const { benutzer, laedt: authLaedt } = useAuth()

  const [dokumente, setDokumente] = useState<Dokument[]>([])
  const [laedt, setLaedt] = useState(true)
  const [fehler, setFehler] = useState('')

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
        <p className="text-gray-400">{t(ui.adminLoading)}</p>
      </div>
    )
  }

  // Ohne Anmeldung gibt es hier nichts zu sehen.
  if (!benutzer || fehler) {
    return (
      <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
        <PageTitle title={t(ui.gradesTitle)} color={pageColors.login} skizze="urkunde" />
        <p style={{ color: pageColors.login }}>{fehler || t(ui.adminNoRight)}</p>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
      <PageTitle title={t(ui.gradesTitle)} color={pageColors.login} skizze="urkunde" />

      <p className="text-gray-500 mb-10" style={{ maxWidth: '34rem' }}>
        {t(ui.gradesIntro)}
      </p>

      {dokumente.length === 0 ? (
        <p className="text-gray-400">{t(ui.gradesEmpty)}</p>
      ) : (
        bereiche.map(bereich => {
          const eigene = dokumente.filter(d => d.area === bereich.schluessel)
          if (eigene.length === 0) return null

          return (
            <div key={bereich.schluessel} className="mb-12">
              <p className="sniglet-bold text-sm text-gray-400 mb-4" style={{ letterSpacing: '0.12em' }}>
                {t(bereich.titel).toUpperCase()}
              </p>

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
