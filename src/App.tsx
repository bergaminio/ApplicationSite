import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { SpracheProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Buchdeckel from './components/Buchdeckel'
import Home from './pages/Home'
import Projects from './pages/Projects'
import CV from './pages/CV'
import Personal from './pages/Personal'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Grades from './pages/Grades'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'
import { wechselFuer } from './buch'

// Feine Linien am linken Rand, die andeuten, dass dort ein Stapel
// Papier liegt statt einer einzelnen starren Flaeche.
//
// Jede Zahl mit px, auch die Nullen. Sonst stehen in den beiden
// Zustaenden, zwischen denen ueberblendet wird, an derselben Stelle
// einmal "0" und einmal "0px" - und dann kann der Browser sie nicht
// als dieselbe Groesse erkennen.
const FALZKANTE =
  'inset 2px 0px 0px rgba(0, 0, 0, 0.07), inset 4px 0px 0px rgba(0, 0, 0, 0.05), inset 6px 0px 0px rgba(0, 0, 0, 0.03)'

// Wie weit eine Seite hochgeklappt wird. Muss unter 90 Grad bleiben:
// darueber zeigt sie ihre Rueckseite, und die ist ausgeblendet - die
// Seite wuerde mitten in der Bewegung verschwinden.
const WINKEL = -78

// Die beiden Schatten-Zustaende einer Seite: flach liegend und
// aufgeklappt.
//
// WICHTIG: beide brauchen gleich viele Lagen. Ein Browser kann
// zwischen zwei box-shadow-Angaben nur dann weich ueberblenden, wenn
// sie gleich viele Schatten haben. Sonst springt er sofort auf den
// Zielwert.
//
// Darum steht auch im flachen Zustand ein aeusserer Schatten - nur
// eben ohne Versatz, ohne Weichzeichnung und durchsichtig. Man sieht
// ihn nicht, aber er ist da und laesst sich weich hochfahren.
const OHNE_SCHATTEN = `0px 0px 0px rgba(0, 0, 0, 0), ${FALZKANTE}`
const MIT_SCHATTEN = `28px 0px 55px rgba(0, 0, 0, 0.22), ${FALZKANTE}`

// Wie sich eine Seite verhaelt. Welcher Zustand gilt, haengt von der
// Richtung ab - darum sind es Funktionen statt fester Werte.
//
// Vorwaerts blaettern: die alte Seite klappt weg, die neue liegt schon
// fertig darunter und bewegt sich nicht.
// Zurueck blaettern: genau umgekehrt - die alte bleibt liegen, die
// neue faellt von links wieder darauf.
const seitenVarianten = {
  // Flach auf dem Stapel.
  liegt: { rotateY: 0, boxShadow: OHNE_SCHATTEN, opacity: 1 },

  // Wie die Seite hereinkommt.
  kommt: (vorwaerts: boolean) =>
    vorwaerts
      ? { rotateY: 0, boxShadow: OHNE_SCHATTEN, opacity: 1 }
      : { rotateY: WINKEL, boxShadow: MIT_SCHATTEN, opacity: 1 },

  // Wie die Seite verschwindet.
  //
  // Beim Zurueckblaettern bleibt sie einfach liegen, sie bewegt sich
  // gar nicht. Wenn sich aber gar nichts aendert, hat motion nichts
  // zu animieren und meldet sofort "fertig" - die Seite wuerde schon
  // beim Start ausgehaengt und man saehe den Hintergrund durch.
  //
  // Der Wert ist mit Absicht unsichtbar: 0.999 statt 1. Motion hat
  // damit etwas zu animieren und haelt die Seite bis zum Schluss,
  // ohne dass man eine Aenderung sieht. Etwas Sichtbares wie
  // brightness waere hier falsch - die untere Seite wuerde sich
  // beim Zurueckblaettern grundlos verdunkeln.
  geht: (vorwaerts: boolean) =>
    vorwaerts
      ? { rotateY: WINKEL, boxShadow: MIT_SCHATTEN, opacity: 1 }
      : { rotateY: 0, boxShadow: OHNE_SCHATTEN, opacity: 0.999 },
}

// Legt fest welche Adresse welche Seite zeigt - und wie geblaettert wird.
//
// Beide Seiten liegen uebereinander: ein Raster mit einer einzigen
// Zelle, beide Seiten bekommen dieselbe zugewiesen.
function Seiten() {
  const location = useLocation()

  // Wer im Betriebssystem eingestellt hat, dass Bewegung stoert,
  // bekommt den Wechsel ohne Animation.
  const wenigerBewegung = useReducedMotion()

  // Wie der aktuelle Wechsel aussieht - einmal pro Adresse berechnet
  // und dann gemerkt.
  //
  // Das Merken ist wichtig: Wuerde man die Richtung bei jedem Zeichnen
  // neu ausrechnen, spraenge sie mitten in der Animation um. Sobald die
  // Seite aus irgendeinem Grund neu gezeichnet wird, ist der "vorherige"
  // Pfad naemlich schon der aktuelle - und der Abstand damit null.
  //
  // "pfad" ist dabei die Seite, von der wir gekommen sind. Deshalb
  // braucht es keinen zweiten Merker fuer den vorherigen Pfad.
  const [wechsel, setWechsel] = useState({
    pfad: location.pathname,
    vorwaerts: true,
    blaetter: 0,
  })

  // Zustand mitten im Zeichnen setzen ist hier richtig und kein
  // Fehler: React verwirft diesen Durchlauf sofort und zeichnet noch
  // einmal, bevor irgendetwas auf dem Bildschirm landet. Ein Effekt
  // waere zu spaet - die Seite waere dann schon einmal mit der alten
  // Richtung gezeichnet worden.
  const [zeigeBlaetter, setZeigeBlaetter] = useState(false)

  const dauer = wenigerBewegung ? 0 : 0.55

  if (wechsel.pfad !== location.pathname) {
    // Beim Sprung ueber mehrere Seiten fliegen leere Blaetter mit -
    // wie wenn man im Buch mehrere Seiten auf einmal umschlaegt.
    const neu = wechselFuer(wechsel.pfad, location.pathname)
    setWechsel({ pfad: location.pathname, ...neu })
    // Gleich hier und nicht in einem Effekt: die Blaetter muessen im
    // selben Durchlauf erscheinen wie die neue Seite, sonst sieht man
    // sie einen Wimpernschlag zu spaet.
    setZeigeBlaetter(neu.blaetter >= 1 && !wenigerBewegung)
  }

  const vorwaerts = wechsel.vorwaerts
  const anzahlBlaetter = wechsel.blaetter

  useEffect(() => {
    // Nach dem Blaettern oben anfangen, sonst landet man mitten
    // auf der neuen Seite.
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Die Blaetter wieder wegnehmen, wenn die Bewegung durch ist.
  useEffect(() => {
    if (!zeigeBlaetter) return
    const timer = setTimeout(() => setZeigeBlaetter(false), dauer * 1000 + 200)
    return () => clearTimeout(timer)
  }, [zeigeBlaetter, dauer])

  return (
    // perspective gehoert auf die Eltern-Schicht, sonst wirkt die
    // Drehung flach statt raeumlich. Die Klasse regelt, welche der
    // Seiten obenauf liegt - siehe index.css.
    <div
      className={vorwaerts ? 'buch-vor' : 'buch-zurueck'}
      style={{ display: 'grid', perspective: '1800px' }}
    >
      {/* Die leeren Zwischenblaetter. Sie stehen VOR der eigentlichen
          Seite, damit :last-child in index.css weiterhin die neue Seite
          trifft. Ihre Ebene setzen sie selbst, damit sie zwischen alter
          und neuer Seite liegen. */}
      {zeigeBlaetter &&
        Array.from({ length: anzahlBlaetter }).map((_, i) => (
          <motion.div
            key={`blatt-${location.key}-${i}`}
            aria-hidden
            // Der Schatten laeuft mit der Drehung mit: aufgeklappt
            // wirft das Blatt einen, flach liegend nicht. Fest im
            // style bliebe er auch am Ende stehen und gehoerte dann
            // zu nichts.
            initial={{
              rotateY: vorwaerts ? 0 : WINKEL,
              boxShadow: vorwaerts ? OHNE_SCHATTEN : MIT_SCHATTEN,
            }}
            animate={{
              rotateY: vorwaerts ? WINKEL : 0,
              boxShadow: vorwaerts ? MIT_SCHATTEN : OHNE_SCHATTEN,
            }}
            transition={{
              duration: dauer * 0.85,
              // Nacheinander statt gleichzeitig - so wirkt es wie ein
              // Stapel und nicht wie ein einzelnes dickes Blatt.
              delay: (i + 1) * 0.07,
              ease: [0.35, 0, 0.25, 1],
            }}
            style={{
              gridArea: '1 / 1',
              transformOrigin: 'left center',
              backfaceVisibility: 'hidden',
              // Auch die Zwischenblaetter sind liniert - sonst
              // faellt beim Blaettern auf, dass da leere Zettel
              // zwischen den Seiten liegen.
              background: 'var(--papier-liniert)',
              minHeight: '100vh',
              // vorwaerts: unter der alten (10), ueber der neuen (1)
              // zurueck:   ueber der alten (1), unter der neuen (10)
              zIndex: vorwaerts ? 9 - i : 2 + i,
            }}
          />
        ))}

      {/* Kein mode: beide Seiten sind gleichzeitig da und liegen
          uebereinander. Genau das macht den Blaetter-Eindruck. */}
      <AnimatePresence initial={false} custom={vorwaerts}>
        <motion.div
          key={location.pathname}
          custom={vorwaerts}
          variants={seitenVarianten}
          initial="kommt"
          animate="liegt"
          exit="geht"
          transition={{ duration: dauer, ease: [0.35, 0, 0.25, 1] }}
          style={{
            gridArea: '1 / 1',              // beide Seiten in dieselbe Zelle
            transformOrigin: 'left center', // EIN Falz, immer links
            backfaceVisibility: 'hidden',   // Rueckseite waere spiegelverkehrt
            // Die Linien sitzen auf der Seite selbst, nicht auf dem
            // Hintergrund dahinter. Nur so klappen sie beim Blaettern
            // mit um - sonst blieben sie stehen und die Seite waere
            // durchsichtig darueber.
            background: 'var(--papier-liniert)',
            minHeight: '100vh',
          }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/cv" element={<CV />} />
            <Route path="/personal" element={<Personal />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            {/* Brauchen eine Anmeldung. Das Backend prueft das nochmal -
                die Seite hier auszublenden ist kein Schutz. */}
            <Route path="/grades" element={<Grades />} />
            <Route path="/admin" element={<Admin />} />
            {/* Der Stern faengt alle Adressen ab die oben nicht stehen */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Die beiden Provider aussen herum geben Sprache und Anmelde-Zustand
// an alle Seiten weiter, ohne dass man sie durchreichen muss.
function App() {
  return (
    <SpracheProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* Der Einband liegt beim ersten Besuch ueber allem und
              klappt auf Klick auf. Er steht ausserhalb von <Seiten>,
              damit er nicht selbst mitblaettert. */}
          <Buchdeckel />
          <Navbar />
          <Seiten />
        </BrowserRouter>
      </AuthProvider>
    </SpracheProvider>
  )
}

export default App
