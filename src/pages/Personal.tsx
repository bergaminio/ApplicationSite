import { useRef, useState } from 'react'
import { pageColors, postitColors } from '../styles/colors'
import Postit from '../components/Postit'
import PageTitle from '../components/PageTitle'
import Diashow from '../components/Diashow'
import Skizze, { type SkizzenArt } from '../components/Skizze'
import { useSprache } from '../context/LanguageContext'
import { ui, type Text } from '../texts'

// ---------------------------------------------------------------
// Die Klavier-Aufnahme liegt in public/audio/klavier.m4a.
// Solange sie fehlt, steht dort ein Hinweis statt eines Abspielers.
// ---------------------------------------------------------------

interface Hobby {
  titel: Text
  text: Text
  audio?: string      // Pfad zur Aufnahme, wenn es eine gibt
  audioBis?: number   // Nur die ersten X Sekunden abspielen
  fotos?: string[]    // Bilder fuer die Diashow
  skizze?: SkizzenArt // Kleine Zeichnung neben der Ueberschrift
}

const hobbys: Hobby[] = [
  {
    titel: { de: 'Klavier', en: 'Piano' },
    text: {
      de: 'Ich spiele Klavier, weil es mich fordert. Ein Stück, das beim ersten Durchlesen unmöglich aussieht, sitzt nach ein paar Wochen, und dieses Gefühl mag ich. Dazu höre ich gerne klassische Musik, da liegt es nahe, sie auch selbst zu spielen. Man kommt weiter, indem man eine schwierige Stelle herauslöst und einzeln übt, bis sie sitzt. Beim Programmieren gehe ich genauso vor.',
      en: "I play the piano because it challenges me. A piece that looks impossible at first sight comes together after a few weeks, and I love that feeling. I also enjoy listening to classical music, so playing it myself was the obvious next step. You get ahead by taking one difficult passage out and practising it on its own until it works. That's exactly how I program.",
    },
    // .m4a und nicht .mp3: die Aufnahme kam als MP4-Container vom
    // Handy. Umwandeln braeuchte ein Werkzeug wie ffmpeg, und jeder
    // heutige Browser spielt m4a ohnehin ab.
    audio: '/audio/klavier.m4a',
    // 1:25.1 - so lange soll die Aufnahme laufen.
    audioBis: 85.1,
    skizze: 'klavier',
  },
  {
    titel: { de: 'Bogenschiessen', en: 'Archery' },
    text: {
      de: 'Bogenschiessen hilft mir bei Haltung und Fokus. Man steht still da, zielt und lässt los. Viel mehr ist es nicht, und genau diese Einfachheit tut mir gut.',
      en: "Archery helps me with posture and focus. You stand still, aim and let go. There isn't much more to it, and that simplicity is exactly what does me good.",
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
//
// "bis" begrenzt die Wiedergabe auf die ersten X Sekunden. Die Datei
// selbst bleibt ungekuerzt - zum Schneiden braeuchte es ein Werkzeug
// wie ffmpeg, das hier nicht installiert ist. Der Browser stoppt
// stattdessen selbst an der Stelle.
function Tonaufnahme({ pfad, bis }: { pfad: string; bis?: number }) {
  const { t } = useSprache()
  const [fehlt, setFehlt] = useState(false)
  // Merkt sich den laufenden Zeitgeber, damit man ihn abbrechen kann.
  const zeitgeber = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  if (fehlt) {
    return <p className="text-sm text-gray-500 mt-4">{t(ui.audioFehlt)}</p>
  }

  // Die Aufnahme an der Grenze anhalten.
  //
  // Zwei Wege gleichzeitig, weil jeder allein eine Luecke hat:
  //
  // Der Zeitgeber ist genau. Beim Start rechnen wir aus, wie viele
  // Millisekunden noch bleiben, und halten dann an. Aber Browser
  // bremsen Zeitgeber in Hintergrund-Tabs auf etwa eine Sekunde aus.
  //
  // timeupdate feuert nur rund viermal pro Sekunde, laeuft dafuer
  // auch im Hintergrund zuverlaessig weiter.
  //
  // requestAnimationFrame waere genauer, faellt hier aber aus: es
  // steht still, sobald die Seite nicht gezeichnet wird. Wer den Tab
  // wechselt, hoerte die Aufnahme sonst bis zum Ende.
  function stoppe(spieler: HTMLAudioElement) {
    spieler.pause()
    // Zurueck an den Anfang, damit ein zweiter Klick wieder von vorne
    // startet statt am gesperrten Ende festzuhaengen.
    spieler.currentTime = 0
  }

  function starteZeitgeber(e: React.SyntheticEvent<HTMLAudioElement>) {
    if (!bis) return
    const spieler = e.currentTarget
    clearTimeout(zeitgeber.current)
    const bleibt = (bis - spieler.currentTime) * 1000 / (spieler.playbackRate || 1)
    zeitgeber.current = setTimeout(() => stoppe(spieler), Math.max(0, bleibt))
  }

  function pruefeNach(e: React.SyntheticEvent<HTMLAudioElement>) {
    if (bis && e.currentTarget.currentTime >= bis) stoppe(e.currentTarget)
  }

  return (
    <audio
      controls
      // Das #t=0,X sagt dem Browser schon beim Laden, welcher
      // Ausschnitt gemeint ist. Nicht jeder Browser haelt sich an das
      // Ende, darum die beiden Pruefungen oben.
      src={bis ? `${pfad}#t=0,${bis}` : pfad}
      onPlay={starteZeitgeber}
      // Auch nach dem Spulen neu rechnen, sonst haelt der alte
      // Zeitgeber an der falschen Stelle an.
      onSeeked={starteZeitgeber}
      onPause={() => clearTimeout(zeitgeber.current)}
      onTimeUpdate={pruefeNach}
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

            {hobby.audio && <Tonaufnahme pfad={hobby.audio} bis={hobby.audioBis} />}
            {hobby.fotos && <Diashow bilder={hobby.fotos} />}
          </Postit>
        ))}
      </div>
    </div>
  )
}

export default Personal
