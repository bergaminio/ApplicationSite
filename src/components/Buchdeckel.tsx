import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useSprache } from '../context/LanguageContext'
import { ui } from '../texts'
import { pageColors } from '../styles/colors'

// Der Einband des Buches.
//
// Liegt beim ersten Besuch ueber der Startseite. Ein Klick klappt ihn
// auf - dieselbe Bewegung wie beim Blaettern: Falz links, Drehung um
// die senkrechte Achse.
//
// Der Deckel darf weiter aufgehen als eine Seite (siehe WINKEL in
// App.tsx, dort sind es -78 Grad). Eine Seite muss unter 90 bleiben,
// weil ihre Rueckseite ausgeblendet ist und sie sonst mitten in der
// Bewegung verschwaende. Der Deckel hat eine gestaltete Rueckseite,
// darum darf er ganz aufklappen.

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
        <motion.button
          type="button"
          onClick={oeffnen}
          aria-label={t(ui.deckelOeffnen)}
          animate={{
            rotateY: offen && !wenigerBewegung ? -165 : 0,
            opacity: offen && wenigerBewegung ? 0 : 1,
            boxShadow: offen ? '60px 0 90px rgba(0, 0, 0, 0.35)' : '0 0 0 rgba(0,0,0,0)',
          }}
          transition={{ duration: dauer, ease: [0.35, 0, 0.25, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            cursor: 'pointer',
            // Sobald er aufklappt, faengt er keine Klicks mehr ab.
            // Zweite Absicherung neben dem Zeitgeber: selbst wenn das
            // Element haengenbliebe, kaeme man an die Seite darunter.
            pointerEvents: offen ? 'none' : 'auto',
            border: 'none',
            font: 'inherit',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',

            // Der Falz sitzt links, genau wie bei den Seiten.
            transformOrigin: 'left center',
            // Ohne diese Zeile wirkt die Drehung flach statt raeumlich.
            // Beim Blaettern steht sie am Eltern-Element; der Deckel
            // haengt direkt am body und braucht sie darum selbst.
            transformStyle: 'preserve-3d',

            background: pageColors.home,
            // Der dunkle Streifen links ist der Buchruecken.
            backgroundImage:
              'linear-gradient(to right, rgba(0,0,0,0.25) 0, rgba(0,0,0,0.12) 14px, transparent 34px)',
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
        </motion.button>
  )
}

export default Buchdeckel
