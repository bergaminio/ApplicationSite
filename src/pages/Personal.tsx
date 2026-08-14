import { useState } from 'react'
import { pageColors, postitColors } from '../styles/colors'
import Postit from '../components/Postit'
import PageTitle from '../components/PageTitle'
import Diashow from '../components/Diashow'
import Skizze, { type SkizzenArt } from '../components/Skizze'
import { useSprache } from '../context/LanguageContext'
import { ui, type Text } from '../texts'

// ---------------------------------------------------------------
// Die Klavier-Aufnahme gehoert nach public/audio/klavier.mp3.
// Solange sie fehlt, steht dort ein Hinweis statt eines Abspielers.
// ---------------------------------------------------------------

interface Hobby {
  titel: Text
  text: Text
  audio?: string      // Pfad zur Aufnahme, wenn es eine gibt
  fotos?: string[]    // Bilder fuer die Diashow
  skizze?: SkizzenArt // Kleine Zeichnung neben der Ueberschrift
}

const hobbys: Hobby[] = [
  {
    titel: { de: 'Klavier', en: 'Piano' },
    text: {
      de: 'Ich spiele Klavier, weil es mich fordert. Ein Stück, das beim ersten Durchlesen unmöglich aussieht, sitzt nach ein paar Wochen, und dieses Gefühl mag ich. Dazu höre ich gerne klassische Musik, da liegt es nahe, sie auch selbst zu spielen. Man kommt weiter, indem man eine schwierige Stelle herauslöst und einzeln übt, bis sie sitzt. Beim Programmieren mache ich es genauso.',
      en: "I play the piano because it challenges me. A piece that looks impossible at first sight comes together after a few weeks, and I love that feeling. I also enjoy listening to classical music, so playing it myself was the obvious next step. You get ahead by taking one difficult passage out and practising it on its own until it works. That's exactly how I program.",
    },
    audio: '/audio/klavier.mp3',
    skizze: 'klavier',
  },
  {
    titel: { de: 'Bogenschiessen', en: 'Archery' },
    text: {
      de: 'Bogenschiessen hilft mir bei Haltung und Fokus. Man steht ruhig da, zielt und lässt los. Viel mehr ist es nicht, und genau das macht es so angenehm.',
      en: "Archery helps me with posture and focus. You stand still, aim and let go. There isn't much more to it, and that's exactly what I find so calming.",
    },
    skizze: 'bogen',
  },
  {
    titel: { de: 'Gaming', en: 'Gaming' },
    text: {
      de: 'Gaming ist mein Zeitvertreib, mit Kollegen oder allein. Meistens Multiplayer im Ranked-Modus, dazwischen Arcade-Spiele wie Rhythm und Fighting. Irgendwann wollte ich wissen, wie so ein Spiel von innen aussieht, und habe angefangen, selbst eines zu bauen: Aschenreich, ein Rollenspiel im Browser.',
      en: "Gaming is how I unwind, with friends or on my own. Mostly ranked multiplayer, with arcade games in between, like rhythm and fighting. At some point I wanted to know what a game looks like from the inside, so I started building one myself: Aschenreich, a role-playing game in the browser.",
    },
    skizze: 'controller',
  },
  {
    titel: { de: 'Fotografieren', en: 'Photography' },
    text: {
      de: 'Dazu sagen die Bilder mehr als ich schreiben könnte. Meistens draussen, meistens Landschaft, und meistens dann, wenn das Licht gerade stimmt.',
      en: 'The photos say more about this than I could write. Mostly outdoors, mostly landscapes, and mostly when the light happens to be right.',
    },
    skizze: 'kamera',
    // Leg deine Bilder in public/fotos/ ab und trage die Dateinamen
    // hier ein. Reihenfolge in der Liste = Reihenfolge in der Diashow.
    // Solange die Liste leer ist, steht dort ein Hinweis.
    //
    // Tipp: Bilder vorher auf etwa 1600 Pixel Breite verkleinern.
    // Fotos direkt aus der Kamera sind schnell 5 MB gross und die
    // Seite laedt dann quaelend langsam.
    fotos: [
      '/fotos/foto01.jpg',
      '/fotos/foto02.jpg',
      '/fotos/foto03.jpg',
      '/fotos/foto04.jpg',
      '/fotos/foto05.jpg',
      '/fotos/foto06.jpg',
      '/fotos/foto07.jpg',
      '/fotos/foto08.jpg',
      '/fotos/foto09.jpg',
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
      <PageTitle title={t(ui.personalTitle)} color={pageColors.personal} skizze="kaffee" />

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
            {/* Die Skizze steht neben der Ueberschrift, nicht
                darueber - so bleibt der Zettel kompakt. */}
            <div className="flex items-center gap-3 mb-2">
              {hobby.skizze && (
                <Skizze art={hobby.skizze} groesse={46} />
              )}
              <p className="sniglet-bold text-lg">{t(hobby.titel)}</p>
            </div>
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
