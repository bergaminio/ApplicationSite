import { Link } from 'react-router-dom'
import { pageColors, postitColors } from '../styles/colors'
import Postit from '../components/Postit'
import Skizze from '../components/Skizze'
import { useSprache } from '../context/LanguageContext'
import { ui } from '../texts'

// Die Startseite.
//
// Frueher stand hier fast nichts: der Name gross, eine Zeile Beruf,
// ein Post-it. Zusammen rund zwoelf Woerter. Wer die Seite oeffnete,
// wusste danach nicht mehr als vorher.
//
// Jetzt traegt ein Satz die Seite, und darunter steht, woher das
// kommt. Der Name rueckt dafuer nach oben und wird kleiner - er ist
// nicht die Nachricht, sondern die Unterschrift.

// Die drei Zettel unten auf der Startseite.
//
// Vorher standen hier drei schmale Knoepfe UND darunter noch ein
// Post-it, das ebenfalls zu den Projekten fuehrte - derselbe Weg
// zweimal. Jetzt ein Zettel pro Ziel, kein Ziel doppelt.
//
// Jeder traegt die Farbe der Seite, zu der er fuehrt, und liegt
// leicht schief. Die Verzoegerung laesst sie nacheinander
// hereinfallen statt alle gleichzeitig.
const zettel = [
  { ziel: '/projects', titel: ui.navProjects, text: ui.homePostit,        farbe: postitColors.yellow, drehung: -1.2, skizze: 'bildschirm' },
  { ziel: '/cv',       titel: ui.navCV,       text: ui.homePostitCV,      farbe: postitColors.green,  drehung: 0.8,  skizze: 'wegweiser' },
  { ziel: '/contact',  titel: ui.navContact,  text: ui.homePostitKontakt, farbe: postitColors.blue,   drehung: -0.5, skizze: 'brief' },
] as const

function Home() {
  const { t } = useSprache()

  return (
    // Breiter als die anderen Seiten (5xl statt 3xl). Die Startseite
    // lebt von grosser Schrift, und die braucht Platz - sonst bricht
    // jeder Satz auf fuenf Zeilen um.
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-5xl mx-auto">

      {/* Name und Rolle ueber der Aussage */}
      <p className="schrift-titel text-2xl sm:text-3xl md:text-4xl" style={{ color: pageColors.home }}>
        Michael Bergamin
      </p>
      <p className="text-gray-500 text-base sm:text-lg mb-8">
        {t(ui.homeRole)}
      </p>

      {/* Der Eyecatcher. Groesste Schrift der ganzen Seite.
          Eine Stufe kleiner als sonst ueblich, weil der Satz lang ist:
          bei 84px wuerde er den halben Bildschirm fuellen. */}
      <div>
        <h1
          className="schrift-titel text-3xl sm:text-4xl md:text-5xl leading-tight sanft-rein"
          // 32ch begrenzt die Zeilenlaenge. Ohne die Grenze laufen die
          // Zeilen ueber die volle Spaltenbreite und werden muehsam zu
          // lesen; enger gesetzt braeuchte der Satz zu viele Zeilen.
          style={{ maxWidth: '32ch' }}
        >
          {t(ui.homeClaim)}
        </h1>

        {/* Die Aufloesung, kleiner und in der Seitenfarbe. Sie steht
            bewusst allein, damit sie wie ein Nachsatz wirkt und nicht
            wie der zweite Teil der Ueberschrift. */}
        <p
          className="schrift-titel text-2xl sm:text-3xl md:text-4xl mt-4 sanft-rein"
          style={{ color: pageColors.home, animationDelay: '200ms' }}
        >
          {t(ui.homeClaimZwei)}
        </p>

        {/* Der Strich waechst beim Laden von links nach rechts,
            siehe .strich in index.css */}
        <div
          className="strich"
          style={{
            width: '220px',
            maxWidth: '100%',
            height: '10px',
            background: pageColors.home,
            borderRadius: '10px',
            marginTop: '14px',
          }}
        />
      </div>

      {/* Belegt die Aussage sofort mit Beispielen */}
      <div className="flex items-start gap-5 mt-8">
        <p
          className="text-gray-600 text-base sm:text-lg sanft-rein"
          style={{ animationDelay: '350ms', maxWidth: '42rem' }}
        >
          {t(ui.homeClaimSub)}
        </p>
        <Skizze art="gluehbirne" farbe={pageColors.home} groesse={56} />
      </div>

      {/* Wer dahintersteckt */}
      <p
        className="text-gray-700 mt-10 sanft-rein"
        style={{ animationDelay: '400ms', maxWidth: '42rem' }}
      >
        {t(ui.homeAbout)}
      </p>

      <p className="text-gray-800 mt-4 sniglet-bold" style={{ maxWidth: '42rem' }}>
        {t(ui.homeLooking)}
      </p>

      {/* Drei Wege weiter, als Zettel.
          Auf dem Handy untereinander, ab 640px nebeneinander. */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 mt-12 sm:mt-16">
        {zettel.map((z, i) => (
          <Postit
            key={z.ziel}
            colors={z.farbe}
            rotate={z.drehung}
            verzoegerung={i * 110}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <p className="schrift-titel text-2xl">{t(z.titel)}</p>
              <Skizze art={z.skizze} groesse={40} />
            </div>

            <p className="text-gray-700 mb-6">{t(z.text)}</p>

            <Link
              to={z.ziel}
              className="pill inline-block"
              style={{ background: 'white', padding: '8px 20px', fontSize: '20px' }}
            >
              {t(ui.homeOeffnen)}
            </Link>
          </Postit>
        ))}
      </div>

    </div>
  )
}

export default Home
