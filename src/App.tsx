import { useEffect } from 'react'
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

// Legt fest welche Adresse welche Seite zeigt - und wie geblaettert wird.
//
// So blaettert ein Buch: die naechste Seite lag schon immer darunter.
// Sie bewegt sich nicht. Bewegen tut sich nur die Seite obendrauf -
// sie hebt sich ab und klappt ueber den Falz weg.
//
// Damit das geht, muessen beide Seiten uebereinander liegen. Der Trick
// dafuer ist ein Raster mit einer einzigen Zelle: beide Seiten bekommen
// dieselbe Zelle zugewiesen und liegen dadurch aufeinander.
//
// Welche der beiden obenauf liegt, steht in index.css bei ".buch".
function Seiten() {
  const location = useLocation()

  // Wer im Betriebssystem eingestellt hat, dass Bewegung stoert,
  // bekommt den Wechsel ohne Animation.
  const wenigerBewegung = useReducedMotion()

  useEffect(() => {
    // Nach dem Blaettern oben anfangen, sonst landet man mitten
    // auf der neuen Seite.
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Eine Seite umzublaettern dauert laenger als ein Ein-/Ausblenden,
  // sonst wirkt es hektisch.
  const dauer = wenigerBewegung ? 0 : 0.55

  return (
    // perspective gehoert auf die Eltern-Schicht, sonst wirkt die
    // Drehung flach statt raeumlich. Je groesser der Wert, desto
    // ruhiger die Perspektive - wie bei einem grossen Buch.
    <div className="buch" style={{ display: 'grid', perspective: '1800px' }}>
      {/* Kein mode: beide Seiten sind gleichzeitig da und liegen
          uebereinander. Genau das macht den Blaetter-Eindruck. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={location.pathname}
          // Die neue Seite lag schon darunter - sie bekommt keinen
          // Auftritt. initial={false} heisst genau das: nicht
          // hereinbewegen, einfach da sein.
          initial={false}
          animate={{ rotateY: 0, boxShadow: FALZKANTE }}
          // Nur die alte Seite bewegt sich. Sie klappt ueber den Falz
          // nach links weg und wirft dabei einen Schatten auf die
          // darunterliegende, der mit ihr wandert.
          //
          // Der Winkel bleibt unter 90 Grad: darueber zeigt die Seite
          // ihre Rueckseite, und die ist ausgeblendet - sie wuerde
          // mitten in der Bewegung verschwinden.
          exit={{
            rotateY: -78,
            boxShadow: [
              `8px 0 20px rgba(0, 0, 0, 0.18), ${FALZKANTE}`,
              `26px 0 44px rgba(0, 0, 0, 0.32), ${FALZKANTE}`,
              `40px 0 60px rgba(0, 0, 0, 0.28), ${FALZKANTE}`,
            ],
          }}
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
