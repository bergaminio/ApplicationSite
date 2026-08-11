import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useSprache } from '../context/LanguageContext'
import { ui } from '../texts'

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
// Zwei Dinge braucht so eine Drehung, damit sie nach etwas aussieht.
// Beide haben hier zuerst gefehlt und die Bewegung sah falsch aus,
// ohne dass man sagen konnte warum:
//
// 1. perspective am ELTERN-Element. Ohne sie rechnet der Browser
//    ohne Fluchtpunkt: der Deckel dreht sich nicht weg, er wird nur
//    seitlich zusammengedrueckt. Wie eine Jalousie statt wie ein Buch.
//    Beim Blaettern steht sie am Buch-Container in App.tsx - der
//    Deckel haengt daneben und braucht seine eigene.
//
// 2. Zwei getrennte Seiten. Dreht man ueber 90 Grad hinaus, schaut man
//    auf die Rueckseite - und die zeigt dieselbe Flaeche spiegelver-
//    kehrt. "Willkommen" stand also die halbe Animation lang seiten-
//    verkehrt da. Jetzt gibt es eine Vorder- und eine Rueckseite, beide
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
        aria-label={t(ui.deckelOeffnen)}
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            textAlign: 'center',
            background: EINBAND,
            // Der Buchruecken links. Auf dunklem Grund muss er heller
            // sein statt dunkler, sonst sieht man ihn nicht.
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.14) 0, rgba(255,255,255,0.07) 14px, transparent 34px)',
            boxShadow: offen ? '60px 0 90px rgba(0, 0, 0, 0.3)' : 'none',
          }}
        >
          <span
            className="sniglet-bold"
            style={{ fontSize: 'clamp(2.5rem, 9vw, 5rem)', color: 'white', lineHeight: 1.1 }}
          >
            {t(ui.deckelTitel)}
          </span>

          <span style={{ fontSize: 'clamp(1rem, 3vw, 1.4rem)', color: 'rgba(255,255,255,0.9)' }}>
            {t(ui.deckelName)}
          </span>

          {/* Ohne diesen Hinweis steht man vor einer roten Flaeche und
              weiss nicht, dass man klicken soll. */}
          <span
            className="pill"
            style={{ background: 'white', marginTop: '1rem', fontSize: '0.9rem' }}
          >
            {t(ui.deckelHinweis)}
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
