import { useEffect, useState } from 'react'
import { pageColors } from '../styles/colors'
import PageTitle from '../components/PageTitle'
import { useSprache } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { ladeNoten, durchschnitt } from '../api/grades'
import type { Note } from '../api/grades'
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

  const [noten, setNoten] = useState<Note[]>([])
  const [laedt, setLaedt] = useState(true)
  const [fehler, setFehler] = useState('')

  useEffect(() => {
    if (authLaedt) return
    ladeNoten()
      .then(setNoten)
      .catch(() => setFehler(t(ui.adminNoRight)))
      .finally(() => setLaedt(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLaedt])

  if (authLaedt || laedt) {
    return (
      <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
        <PageTitle title={t(ui.gradesTitle)} color={pageColors.login} />
        <p className="text-gray-400">{t(ui.adminLoading)}</p>
      </div>
    )
  }

  // Ohne Anmeldung gibt es hier nichts zu sehen.
  if (!benutzer || fehler) {
    return (
      <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
        <PageTitle title={t(ui.gradesTitle)} color={pageColors.login} />
        <p style={{ color: pageColors.login }}>{fehler || t(ui.adminNoRight)}</p>
      </div>
    )
  }

  const gesamt = durchschnitt(noten)

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
      <PageTitle title={t(ui.gradesTitle)} color={pageColors.login} />

      <p className="text-gray-500 mb-8">{t(ui.gradesIntro)}</p>

      {noten.length === 0 ? (
        <p className="text-gray-400">{t(ui.gradesEmpty)}</p>
      ) : (
        <>
          {/* Der Gesamtdurchschnitt zuoberst */}
          <div className="box p-4 mb-10 flex items-center justify-between">
            <span className="text-sm text-gray-500">{t(ui.gradesOverall)}</span>
            <span className="sniglet-bold text-2xl">{gesamt?.toFixed(1)}</span>
          </div>

          {bereiche.map(bereich => {
            const eigene = noten.filter(n => n.area === bereich.schluessel)
            if (eigene.length === 0) return null
            const schnitt = durchschnitt(eigene)

            return (
              <div key={bereich.schluessel} className="mb-10">
                <div className="flex items-baseline justify-between mb-3">
                  <p className="sniglet-bold text-sm text-gray-400" style={{ letterSpacing: '0.12em' }}>
                    {t(bereich.titel).toUpperCase()}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-400">{t(ui.gradesAverage)} </span>
                    <span className="sniglet-bold">{schnitt?.toFixed(1)}</span>
                  </p>
                </div>

                <div className="box p-4 flex flex-col gap-2">
                  {eigene.map(note => (
                    <div key={note.id} className="flex justify-between gap-4 text-sm">
                      <span>{note.subject}</span>
                      <span
                        className="sniglet-bold"
                        // Ungenuegende Noten faerben wir ein - ehrlich ist besser
                        // als verstecken, und es faellt sowieso auf.
                        style={{ color: note.value < 4 ? pageColors.login : '#333' }}
                      >
                        {note.value.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

export default Grades
