import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useSprache } from '../context/LanguageContext'
import { ui } from '../texts'
import Skizze from './Skizze'

// Die Farbe des Einbands. Ein sehr dunkles Grau statt reinem Schwarz:
// auf einem hellen Bildschirm wirkt #000 hart, und der Buchruecken
// links waere darauf gar nicht mehr zu sehen.
const EINBAND = '#161616'

// Der Einband des Buches.
//
// Liegt beim ersten Besuch ueber der Startseite. Ein Klick klappt ihn
// auf - dieselbe Bewegung wie beim Blaettern: Falz links, Drehung um
// die senkrechte Achse.
//
// Zwei Dinge braucht so eine Drehung, damit sie nach etwas aussieht:
//
// 1. perspective am ELTERN-Element. Ohne sie rechnet der Browser
//    ohne Fluchtpunkt: der Deckel dreht sich nicht weg, er wird nur
//    seitlich zusammengedrueckt. Wie eine Jalousie statt wie ein Buch.
//    Beim Blaettern steht sie am Buch-Container in App.tsx - der
//    Deckel haengt daneben und braucht seine eigene.
//
// 2. Zwei getrennte Seiten. Dreht man ueber 90 Grad hinaus, schaut man
//    auf die Rueckseite - und die zeigt dieselbe Flaeche spiegelver-
//    kehrt, samt Schrift. Darum eine Vorder- und eine Rueckseite, beide
//    mit backfaceVisibility: hidden. Ab 90 Grad uebernimmt die
//    Rueckseite, und die ist die Innenseite des Deckels: liniertes
//    Papier, wie im echten Buch.

// Muss zur perspective beim Blaettern passen (App.tsx), sonst wirken
// Deckel und Seiten unterschiedlich tief.
const PERSPEKTIVE = '1800px'

// Nur einmal pro Besuch. sessionStorage statt localStorage: beim
// naechsten Besuch soll der Einband wieder da sein, aber nicht bei
// jedem Zurueckklicken auf die Startseite waehrend derselben Sitzung.
const SCHLUESSEL = 'einband-geoeffnet'

function schonGeoeffnet() {
  try {
    return sessionStorage.getItem(SCHLUESSEL) === 'ja'
  } catch {
    // Manche Browser sperren sessionStorage im privaten Modus.
    // Dann zeigen wir den Einband eben jedes Mal - das ist kein Fehler.
    return false
  }
}

// Die Pinnwand auf dem Deckel.
//
// Fotos als Sofortbilder, dazwischen die gezeichnete Zielscheibe.
// Wer die Seite oeffnet, sieht in der ersten Sekunde einen Menschen
// mit Interessen und nicht nur eine dunkle Flaeche.
//
// Die Bilder kommen aus public/fotos/klein/ und nicht aus dem
// Hauptordner: die grossen sind zusammen 1.8 MB, die kleinen 197 KB.
// Fuer ein 190px breites Sofortbild reichen 460px Vorlage locker, und
// der Deckel ist das Erste, was geladen wird.
//
// x und y sind Prozent des Deckels. "nurGross" heisst: auf schmalen
// Bildschirmen weglassen, dort waere es zu voll.
const PINNWAND = [
  { bild: '/fotos/klein/foto01.jpg', x: 6,  y: 10, dreh: -7,  breite: 200, nurGross: false },
  { bild: '/fotos/klein/foto05.jpg', x: 74, y: 6,  dreh: 6,   breite: 170, nurGross: false },
  { bild: '/fotos/klein/foto07.jpg', x: 80, y: 55, dreh: -5,  breite: 180, nurGross: true },
  { bild: '/fotos/klein/foto03.jpg', x: 3,  y: 58, dreh: 4,   breite: 210, nurGross: true },
  { bild: '/fotos/klein/foto09.jpg', x: 42, y: 78, dreh: -3,  breite: 165, nurGross: true },
] as const

// Beide Seiten des Deckels liegen genau uebereinander.
const SEITE = {
  position: 'absolute',
  inset: 0,
  // Ohne diese Zeile sieht man beide Seiten gleichzeitig
  // durcheinander.
  backfaceVisibility: 'hidden',
} as const

function Buchdeckel() {
  const { t } = useSprache()
  const wenigerBewegung = useReducedMotion()

  // Zwei getrennte Zustaende, absichtlich:
  //   offen = der Deckel klappt gerade auf
  //   weg   = er ist ausgehaengt und existiert nicht mehr
  const [offen, setOffen] = useState(schonGeoeffnet)
  const [weg, setWeg] = useState(schonGeoeffnet)

  const dauer = wenigerBewegung ? 0.2 : 0.9

  // Warum nicht AnimatePresence mit exit?
  //
  // Weil das den Deckel erst entfernt, wenn die Animation "fertig"
  // meldet. Meldet sie das nie - Browser haelt Animationen an, weil
  // der Tab im Hintergrund ist, oder irgendein Fehler dazwischen -
  // bleibt eine bildschirmfuellende Flaeche ueber der ganzen Seite
  // liegen und nichts ist mehr anklickbar. Ein Zeitgeber kann nicht
  // haengenbleiben.
  useEffect(() => {
    if (!offen || weg) return
    const timer = setTimeout(() => setWeg(true), dauer * 1000 + 100)
    return () => clearTimeout(timer)
  }, [offen, weg, dauer])

  function oeffnen() {
    setOffen(true)
    try {
      sessionStorage.setItem(SCHLUESSEL, 'ja')
    } catch {
      // Siehe oben - wenn es nicht geht, geht es nicht.
    }
  }

  if (weg) return null

  return (
    // Diese Huelle dreht sich nicht mit. Sie ist nur da, um die
    // perspective zu setzen - die muss beim Eltern-Element stehen,
    // nicht beim gedrehten selbst.
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        perspective: PERSPEKTIVE,
        // Sobald er aufklappt, faengt er keine Klicks mehr ab.
        // Zweite Absicherung neben dem Zeitgeber: selbst wenn das
        // Element haengenbliebe, kaeme man an die Seite darunter.
        pointerEvents: offen ? 'none' : 'auto',
      }}
    >
      <motion.button
        type="button"
        onClick={oeffnen}
        // Kein aria-label mehr.
        //
        // Vorher stand hier "Buch aufschlagen", sichtbar auf dem
        // Deckel steht aber "Klicken zum Aufschlagen". Wer den
        // Rechner per Sprache bedient und sagt "Klick Klicken zum
        // Aufschlagen", trifft dann nichts: das Geraet sucht nach dem
        // aria-label, und das kennt diese Woerter nicht.
        //
        // Ohne aria-label bildet der Browser den Namen aus dem, was
        // draufsteht. Genau das ist hier richtig.
        animate={{
          rotateY: offen && !wenigerBewegung ? -168 : 0,
          opacity: offen && wenigerBewegung ? 0 : 1,
        }}
        transition={{ duration: dauer, ease: [0.35, 0, 0.25, 1] }}
        style={{
          position: 'absolute',
          inset: 0,
          padding: 0,
          border: 'none',
          background: 'transparent',
          cursor: offen ? 'default' : 'pointer',
          // Der Falz sitzt links, genau wie bei den Seiten.
          transformOrigin: 'left center',
          // Damit Vorder- und Rueckseite im Raum stehen bleiben statt
          // flachgedrueckt zu werden.
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Vorderseite: der Einband */}
        <span
          style={{
            ...SEITE,
            display: 'block',
            overflow: 'hidden',
            background: EINBAND,
            // Der Buchruecken links. Auf dunklem Grund muss er heller
            // sein statt dunkler, sonst sieht man ihn nicht.
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.14) 0, rgba(255,255,255,0.07) 14px, transparent 34px)',
            boxShadow: offen ? '60px 0 90px rgba(0, 0, 0, 0.3)' : 'none',
          }}
        >
          {/* Die Fotos. aria-hidden, weil sie schmuecken und nichts
              erklaeren - ein Screenreader wuerde sonst fuenfmal "Bild"
              vorlesen, bevor der Titel kommt. */}
          <span aria-hidden style={{ position: 'absolute', inset: 0 }}>
            {PINNWAND.map(p => (
              <img
                key={p.bild}
                src={p.bild}
                alt=""
                className={p.nurGross ? 'pinnwand-foto nur-gross' : 'pinnwand-foto'}
                style={{
                  position: 'absolute',
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.breite}px`,
                  maxWidth: '38vw',
                  transform: `rotate(${p.dreh}deg)`,
                  // Der weisse Rand macht aus dem Foto ein Sofortbild,
                  // unten breiter als oben - wie beim echten Polaroid.
                  background: 'white',
                  padding: '10px 10px 26px 10px',
                  boxShadow: '0 10px 24px rgba(0,0,0,0.45)',
                  // display steht bewusst NICHT hier, sondern in
                  // index.css. Ein inline-Style schlaegt jede Klasse,
                  // und dann liesse sich das Bild per .nur-gross auf
                  // dem Handy nicht mehr ausblenden.
                }}
              />
            ))}

            {/* Die Zielscheibe zwischen den Fotos */}
            <span style={{ position: 'absolute', left: '30%', top: '30%', opacity: 0.5 }}>
              <Skizze art="zielscheibe" farbe="#ffffff" groesse={120} />
            </span>
          </span>

          {/* Titel und Hinweis, ueber den Fotos. Der dunkle Schleier
              dahinter haelt die Schrift lesbar, egal welches Foto
              gerade darunterliegt. */}
          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.2rem',
              textAlign: 'center',
              padding: '0 1.5rem',
              background: 'radial-gradient(ellipse at center, rgba(22,22,22,0.92) 0%, rgba(22,22,22,0.72) 45%, rgba(22,22,22,0.25) 75%)',
            }}
          >
            <span
              className="schrift-titel"
              style={{ fontSize: 'clamp(2.5rem, 9vw, 5rem)', color: 'white', lineHeight: 1.1 }}
            >
              {t(ui.deckelTitel)}
            </span>

            <span style={{ fontSize: 'clamp(1rem, 3vw, 1.4rem)', color: 'rgba(255,255,255,0.9)' }}>
              {t(ui.deckelName)}
            </span>

            {/* Ohne diesen Hinweis steht man vor einer Flaeche und
                weiss nicht, dass man klicken soll. */}
            <span
              className="pill"
              style={{ background: 'white', marginTop: '0.6rem', fontSize: '1rem' }}
            >
              {t(ui.deckelHinweis)}
            </span>
          </span>
        </span>

        {/* Rueckseite: die Innenseite des Deckels. Sie wird erst ab
            90 Grad sichtbar. Um 180 Grad vorgedreht, sonst stuende
            sie selbst spiegelverkehrt. */}
        <span
          aria-hidden
          style={{
            ...SEITE,
            transform: 'rotateY(180deg)',
            background: 'var(--papier-liniert)',
            // Der Schatten sitzt hier rechts: von der Innenseite aus
            // gesehen liegt der Falz auf der anderen Seite.
            boxShadow: 'inset -2px 0 0 rgba(0,0,0,0.07), inset -4px 0 0 rgba(0,0,0,0.05)',
          }}
        />
      </motion.button>
    </div>
  )
}

export default Buchdeckel
