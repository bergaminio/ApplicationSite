import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { SpracheProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Projects from './pages/Projects'
import CV from './pages/CV'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Grades from './pages/Grades'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

// Feine Linien am linken Rand, die andeuten, dass dort ein Stapel
// Papier liegt statt einer einzelnen starren Flaeche.
const FALZKANTE =
  'inset 2px 0 0 rgba(0, 0, 0, 0.07), inset 4px 0 0 rgba(0, 0, 0, 0.05), inset 6px 0 0 rgba(0, 0, 0, 0.03)'

// Wie weit eine Seite hochgeklappt wird. Muss unter 90 Grad bleiben:
// darueber zeigt sie ihre Rueckseite, und die ist ausgeblendet - die
// Seite wuerde mitten in der Bewegung verschwinden.
const WINKEL = -78

const OHNE_SCHATTEN = FALZKANTE
const MIT_SCHATTEN = `40px 0 60px rgba(0, 0, 0, 0.28), ${FALZKANTE}`

// Die Reihenfolge der Seiten im "Buch". Daraus ergibt sich, in welche
// Richtung geblaettert wird: weiter hinten im Buch heisst vorwaerts.
const seitenReihenfolge = ['/', '/projects', '/cv', '/contact']

function istVorwaerts(von: string, nach: string) {
  const a = seitenReihenfolge.indexOf(von)
  const b = seitenReihenfolge.indexOf(nach)
  // Seiten ausserhalb des Buchs (Login, Noten, Uebersicht, 404)
  // behandeln wir als vorwaerts.
  if (a === -1 || b === -1) return true
  return b > a
}

// Wie sich eine Seite verhaelt. Welcher Zustand gilt, haengt von der
// Richtung ab - darum sind es Funktionen statt fester Werte.
//
// Vorwaerts blaettern: die alte Seite klappt weg, die neue liegt schon
// fertig darunter und bewegt sich nicht.
// Zurueck blaettern: genau umgekehrt - die alte bleibt liegen, die
// neue faellt von links wieder darauf.
const seitenVarianten = {
  // Flach auf dem Stapel.
  liegt: { rotateY: 0, boxShadow: OHNE_SCHATTEN },

  // Wie die Seite hereinkommt.
  kommt: (vorwaerts: boolean) =>
    vorwaerts
      ? { rotateY: 0, boxShadow: OHNE_SCHATTEN }        // lag schon da
      : { rotateY: WINKEL, boxShadow: MIT_SCHATTEN },   // faellt zurueck

  // Wie die Seite verschwindet.
  geht: (vorwaerts: boolean) =>
    vorwaerts
      ? { rotateY: WINKEL, boxShadow: MIT_SCHATTEN }    // klappt weg
      : { rotateY: 0, boxShadow: OHNE_SCHATTEN },       // bleibt liegen
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

  // Welche Seite vorher offen war. useRef merkt sich den Wert, ohne
  // dass die Seite dabei neu gezeichnet wird.
  const vorherigerPfad = useRef(location.pathname)
  const vorwaerts = istVorwaerts(vorherigerPfad.current, location.pathname)

  useEffect(() => {
    vorherigerPfad.current = location.pathname
    // Nach dem Blaettern oben anfangen, sonst landet man mitten
    // auf der neuen Seite.
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Eine Seite umzublaettern dauert laenger als ein Ein-/Ausblenden,
  // sonst wirkt es hektisch.
  const dauer = wenigerBewegung ? 0 : 0.55

  return (
    // perspective gehoert auf die Eltern-Schicht, sonst wirkt die
    // Drehung flach statt raeumlich. Die Klasse regelt, welche der
    // beiden Seiten obenauf liegt - siehe index.css.
    <div
      className={vorwaerts ? 'buch-vor' : 'buch-zurueck'}
      style={{ display: 'grid', perspective: '1800px' }}
    >
      {/* custom gibt die Richtung weiter. Das ist noetig, weil die
          wegblaetternde Seite sonst mit der Richtung von ihrem eigenen
          Aufbau arbeiten wuerde - also mit der von vorhin, nicht mit
          der von jetzt. AnimatePresence reicht dieses custom gezielt
          an die verschwindende Seite durch. */}
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
            background: '#faf8f4',          // sonst schimmert es durch
            minHeight: '100vh',
          }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/cv" element={<CV />} />
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
          <Navbar />
          <Seiten />
        </BrowserRouter>
      </AuthProvider>
    </SpracheProvider>
  )
}

export default App
