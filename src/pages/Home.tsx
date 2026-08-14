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

// Die Verweise unter der Aussage. Als Liste, damit ein weiterer
// Eintrag eine Zeile kostet und nicht drei.
const verweise = [
  { ziel: '/projects', text: ui.navProjects },
  { ziel: '/cv', text: ui.navCV },
  { ziel: '/contact', text: ui.navContact },
]

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

      {/* Drei Wege weiter */}
      <div className="flex flex-wrap gap-3 mt-8">
        {verweise.map(v => (
          <Link
            key={v.ziel}
            to={v.ziel}
            className="pill"
            style={{ background: 'white', padding: '8px 20px', fontSize: '20px' }}
          >
            {t(v.text)} →
          </Link>
        ))}
      </div>

      {/* Post-it mit dem Knopf zu den Projekten */}
      <div className="mt-12 sm:mt-16" style={{ maxWidth: '320px' }}>
        <Postit colors={postitColors.yellow} rotate={-1}>
          <p className="text-gray-700 mb-6 text-lg">
            {t(ui.homePostit)}
          </p>
          <div className="flex items-center justify-between gap-3">
            <Link
              to="/projects"
              className="pill"
              style={{ background: 'white', padding: '8px 24px', fontSize: '20px' }}
            >
              {t(ui.homeButton)}
            </Link>
            <Skizze art="buch" groesse={44} />
          </div>
        </Postit>
      </div>

    </div>
  )
}

export default Home
