import { useState } from 'react'
import { useSprache } from '../context/LanguageContext'
import { ui } from '../texts'

// Eine einfache Diashow: ein Bild, zwei Knoepfe, ein Zaehler.
//
// Die Bilder liegen in public/fotos/. Fehlt eine Datei, springt der
// onError-Handler an und zeigt einen Hinweis statt eines kaputten
// Bildes.

function Diashow({ bilder }: { bilder: string[] }) {
  const { t } = useSprache()
  const [index, setIndex] = useState(0)
  const [fehler, setFehler] = useState(false)

  if (bilder.length === 0 || fehler) {
    return <p className="text-sm text-gray-500 mt-4">{t(ui.fotosFehlen)}</p>
  }

  // Der Rest der Division sorgt dafuer, dass es nach dem letzten Bild
  // wieder von vorne losgeht - und rueckwaerts genauso.
  const weiter = () => setIndex((index + 1) % bilder.length)
  const zurueck = () => setIndex((index - 1 + bilder.length) % bilder.length)

  return (
    <div className="mt-4">
      {/* Der weisse Rand macht aus dem Foto ein Sofortbild -
          passt zum handgezeichneten Rest der Seite. */}
      <div
        className="box"
        style={{
          background: 'white',
          padding: '10px 10px 0 10px',
          transform: 'rotate(-0.6deg)',
        }}
      >
        <img
          src={bilder[index]}
          alt={`${index + 1} / ${bilder.length}`}
          onError={() => setFehler(true)}
          style={{
            width: '100%',
            display: 'block',
            // Fester Rahmen, damit die Seite beim Blaettern nicht
            // springt. 4:3 passt zu den meisten Fotos.
            aspectRatio: '4 / 3',
            // 'contain' statt 'cover': das ganze Bild ist zu sehen.
            // Mit 'cover' wuerde ein Hochformat-Foto in diesem
            // Querformat-Rahmen oben und unten hart abgeschnitten -
            // bei einem Bild mit dem Motiv im unteren Drittel waere
            // genau das Motiv weg. Hochformate stehen jetzt schmaler
            // in der Mitte, mit weissem Rand links und rechts. Der
            // faellt nicht auf, weil der Sofortbild-Rahmen auch
            // weiss ist.
            objectFit: 'contain',
            background: 'white',
          }}
        />
        <div className="flex items-center justify-between py-2">
          <button
            onClick={zurueck}
            aria-label={t(ui.fotoZurueck)}
            className="pill"
            style={{ cursor: 'pointer', background: 'white' }}
          >
            ←
          </button>

          <span className="text-xs text-gray-400">
            {index + 1} / {bilder.length}
          </span>

          <button
            onClick={weiter}
            aria-label={t(ui.fotoWeiter)}
            className="pill"
            style={{ cursor: 'pointer', background: 'white' }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}

export default Diashow
