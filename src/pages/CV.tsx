import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { pageColors } from '../styles/colors'
import PageTitle from '../components/PageTitle'
import Skizze from '../components/Skizze'
import DokumentAnsicht from '../components/DokumentAnsicht'
import { useSprache } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { ladeDokumente } from '../api/documents'
import type { Dokument } from '../api/documents'
import { ui } from '../texts'

// Die Lebenslauf-Seite.
//
// Hier standen bis August 2026 alle Angaben fest im Quelltext:
// Wohnort, Schulen, Jahrgaenge, Sprachniveaus. Das Repository ist
// oeffentlich, also stand damit der halbe Lebenslauf fuer jeden
// lesbar auf GitHub - unabhaengig davon, ob die Seite eine Anmeldung
// verlangt oder nicht.
//
// Jetzt liegt der Lebenslauf als PDF in der Datenbank, genau wie die
// Notenausweise, und wird nur an Angemeldete ausgeliefert. Im
// Quelltext steht nichts Persoenliches mehr.
//
// Hochgeladen wird er im Admin-Bereich mit dem Bereich "Lebenslauf".
// Das PDF selbst entsteht mit werkzeuge/lebenslauf-pdf.ps1.
const BEREICH = 'LEBENSLAUF'

function CV() {
  const { t } = useSprache()
  const { benutzer, laedt: authLaedt } = useAuth()

  const [dokumente, setDokumente] = useState<Dokument[]>([])
  const [laedt, setLaedt] = useState(true)

  useEffect(() => {
    if (authLaedt) return
    if (!benutzer) {
      setLaedt(false)
      return
    }
    ladeDokumente()
      .then(setDokumente)
      .catch(() => setDokumente([]))
      .finally(() => setLaedt(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLaedt, benutzer])

  const rahmen = (inhalt: React.ReactNode) => (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
      <PageTitle title={t(ui.cvTitle)} color={pageColors.story} skizze="wegweiser" />
      {inhalt}
    </div>
  )

  // Solange unklar ist, ob jemand angemeldet ist, nichts behaupten.
  // Ohne diese Zwischenstufe blitzt der Hinweis "erst nach dem
  // Anmelden" auch bei Angemeldeten kurz auf.
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

  const lebenslauf = dokumente.filter(d => d.area === BEREICH)

  return rahmen(
    <>
      <div className="flex items-start gap-5 mb-10">
        <p className="text-gray-600" style={{ maxWidth: '38rem' }}>
          {t(ui.cvIntro)}
        </p>
        <Skizze art="laeufer" farbe={pageColors.story} groesse={72} />
      </div>

      {lebenslauf.length === 0 ? (
        <p className="text-gray-400">{t(ui.cvMissing)}</p>
      ) : (
        lebenslauf.map(d => <DokumentAnsicht key={d.id} dokument={d} />)
      )}
    </>
  )
}

export default CV
