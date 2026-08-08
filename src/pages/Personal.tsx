import { useState } from 'react'
import { pageColors, postitColors } from '../styles/colors'
import Postit from '../components/Postit'
import PageTitle from '../components/PageTitle'
import Diashow from '../components/Diashow'
import { useSprache } from '../context/LanguageContext'
import { ui, type Text } from '../texts'

// ---------------------------------------------------------------
// PLATZHALTER - hier gehoeren deine eigenen Worte hin.
//
// Zwei bis drei Saetze pro Hobby reichen. Am meisten bringt es, wenn
// etwas davon zum Programmieren zurueckfuehrt - beim Gaming zum
// Beispiel der Weg zu Aschenreich.
//
// Die Klavier-Aufnahme gehoert nach public/audio/klavier.mp3.
// Solange sie fehlt, steht dort ein Hinweis statt eines Abspielers.
// ---------------------------------------------------------------

interface Hobby {
  titel: Text
  text: Text
  audio?: string      // Pfad zur Aufnahme, wenn es eine gibt
  fotos?: string[]    // Bilder fuer die Diashow
}

const hobbys: Hobby[] = [
  {
    titel: { de: 'Klavier', en: 'Piano' },
    text: {
      de: 'Ich spiele Klavier.',
      en: 'I play the piano.',
    },
    audio: '/audio/klavier.mp3',
  },
  {
    titel: { de: 'Bogenschiessen', en: 'Archery' },
    text: {
      de: 'Ich schiesse mit dem Bogen.',
      en: 'I do archery.',
    },
  },
  {
    titel: { de: 'Gaming', en: 'Gaming' },
    text: {
      de: 'Ich spiele gerne Videospiele.',
      en: 'I like playing video games.',
    },
  },
  {
    titel: { de: 'Fotografieren', en: 'Photography' },
    text: {
      de: 'Ich fotografiere.',
      en: 'I take photographs.',
    },
    // Leg deine Bilder in public/fotos/ ab und trage die Dateinamen
    // hier ein. Reihenfolge in der Liste = Reihenfolge in der Diashow.
    // Solange die Liste leer ist, steht dort ein Hinweis.
    //
    // Tipp: Bilder vorher auf etwa 1600 Pixel Breite verkleinern.
    // Fotos direkt aus der Kamera sind schnell 5 MB gross und die
    // Seite laedt dann quaelend langsam.
    fotos: [
      // '/fotos/foto1.jpg',
      // '/fotos/foto2.jpg',
      // '/fotos/foto3.jpg',
    ],
  },
]

// ---------------------------------------------------------------

// Ein Abspieler fuer eine Tonaufnahme.
// Fehlt die Datei, steht statt eines kaputten Abspielers ein Hinweis.
function Tonaufnahme({ pfad }: { pfad: string }) {
  const { t } = useSprache()
  const [fehlt, setFehlt] = useState(false)

  if (fehlt) {
    return <p className="text-sm text-gray-500 mt-4">{t(ui.audioFehlt)}</p>
  }

  return (
    <audio
      controls
      src={pfad}
      onError={() => setFehlt(true)}
      className="mt-4 w-full"
    />
  )
}

function Personal() {
  const { t } = useSprache()

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
      <PageTitle title={t(ui.personalTitle)} color={pageColors.personal} />

      <p className="text-gray-500 text-lg mb-10" style={{ transform: 'rotate(-0.3deg)' }}>
        {t(ui.personalIntro)}
      </p>

      {/* Schmaler als die Seite: ein Zettel ueber die volle Breite
          wirkt wie ein farbiger Balken, nicht wie eine Notiz. */}
      <div className="flex flex-col gap-8" style={{ maxWidth: '30rem' }}>
        {hobbys.map((hobby, i) => (
          <Postit
            key={hobby.titel.de}
            colors={postitColors.orange}
            rotate={i % 2 === 0 ? -0.6 : 0.6}
            verzoegerung={i * 90}
          >
            <p className="sniglet-bold text-lg mb-2">{t(hobby.titel)}</p>
            <p className="text-gray-700">{t(hobby.text)}</p>

            {hobby.audio && <Tonaufnahme pfad={hobby.audio} />}
            {hobby.fotos && <Diashow bilder={hobby.fotos} />}
          </Postit>
        ))}
      </div>
    </div>
  )
}

export default Personal
