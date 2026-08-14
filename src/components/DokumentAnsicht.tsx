import { useEffect, useState } from 'react'
import { ladeDatei, istBild } from '../api/documents'
import type { Dokument } from '../api/documents'
import { useSprache } from '../context/LanguageContext'
import { ui } from '../texts'

// Zeigt ein einzelnes Dokument an.
//
// Bilder erscheinen direkt, PDFs als Knopf zum Oeffnen.
// Die Datei wird per fetch mit Token geholt - siehe api/documents.ts.

function DokumentAnsicht({ dokument }: { dokument: Dokument }) {
  const { t } = useSprache()
  const [adresse, setAdresse] = useState('')
  const [fehler, setFehler] = useState(false)

  useEffect(() => {
    let aktuelleAdresse = ''
    let abgebrochen = false

    ladeDatei(dokument.id)
      .then(url => {
        if (abgebrochen) {
          // Komponente ist schon weg - Adresse gleich wieder freigeben.
          URL.revokeObjectURL(url)
          return
        }
        aktuelleAdresse = url
        setAdresse(url)
      })
      .catch(() => setFehler(true))

    // Aufraeumen wenn die Komponente verschwindet, sonst bleibt
    // die Datei im Speicher liegen.
    return () => {
      abgebrochen = true
      if (aktuelleAdresse) URL.revokeObjectURL(aktuelleAdresse)
    }
  }, [dokument.id])

  return (
    <div className="mb-6">
      <p className="sniglet-bold mb-2">{dokument.title}</p>

      {fehler ? (
        <p className="text-sm text-gray-400">{t(ui.gradesFileFailed)}</p>
      ) : !adresse ? (
        <p className="text-sm text-gray-400">{t(ui.gradesLoadingFile)}</p>
      ) : istBild(dokument.contentType) ? (
        <img
          src={adresse}
          alt={dokument.title}
          className="box"
          style={{ width: '100%', display: 'block', background: 'white' }}
        />
      ) : (
        <a
          href={adresse}
          target="_blank"
          rel="noopener noreferrer"
          className="pill"
          style={{ background: 'white', padding: '8px 20px', fontSize: '20px' }}
        >
          {t(ui.gradesOpenPdf)}
        </a>
      )}
    </div>
  )
}

export default DokumentAnsicht
