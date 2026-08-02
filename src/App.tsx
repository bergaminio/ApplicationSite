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

// Legt fest welche Adresse welche Seite zeigt - und wie geblaettert wird.
//
// So blaettert ein echtes Buch: die neue Seite liegt schon da und
// bewegt sich ueberhaupt nicht. Nur die alte klappt darueber weg.
//
// Damit das geht, muessen beide Seiten uebereinander liegen. Der Trick
// dafuer ist ein Raster mit einer einzigen Zelle: beide Seiten bekommen
// dieselbe Zelle zugewiesen und liegen dadurch aufeinander.
//
// Wichtig ist auch der Hintergrund auf der Seite selbst - ohne ihn
// wuerde die untere Seite durch die obere durchschimmern.
function Seiten() {
  const location = useLocation()

  // Wer im Betriebssystem eingestellt hat, dass Bewegung stoert,
  // bekommt den Wechsel ohne Animation.
  const wenigerBewegung = useReducedMotion()

  // Nach dem Blaettern oben anfangen, sonst landet man mitten
  // auf der neuen Seite.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Eine Seite umzublaettern dauert laenger als ein Ein-/Ausblenden,
  // sonst wirkt es hektisch.
  const dauer = wenigerBewegung ? 0 : 0.55

  return (
    // perspective gehoert auf die Eltern-Schicht, sonst wirkt die
    // Drehung flach statt raeumlich. Je groesser der Wert, desto
    // ruhiger die Perspektive - wie bei einem grossen Buch.
    <div style={{ display: 'grid', perspective: '1800px' }}>
      {/* Kein mode: beide Seiten sind gleichzeitig da und liegen
          uebereinander. Genau das macht den Blaetter-Eindruck. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={location.pathname}
          // Die neue Seite steht anfangs hochkant und faellt dann
          // flach aufs Buch - dabei deckt sie die alte zu.
          //
          // Warum herum und nicht die alte wegklappen? Weil die neue
          // Seite im Dokument die spaetere ist und dadurch von selbst
          // obenauf liegt. Andersherum muesste man mit z-index
          // nachhelfen, und der vertraegt keine Zwischenwerte.
          //
          // Der durchsichtige Schatten am Ende ist Absicht: von
          // "Schatten" auf "kein Schatten" kann der Browser nicht weich
          // ueberblenden, auf "durchsichtig" schon.
          initial={{ rotateY: -110, boxShadow: '24px 0 48px rgba(0, 0, 0, 0.3)' }}
          animate={{ rotateY: 0, boxShadow: '0px 0 0px rgba(0, 0, 0, 0)' }}
          // Die alte bleibt einfach liegen, bis sie zugedeckt ist.
          exit={{ opacity: 1 }}
          transition={{ duration: dauer, ease: [0.35, 0, 0.25, 1] }}
          style={{
            gridArea: '1 / 1',            // beide Seiten in dieselbe Zelle
            transformOrigin: 'left center',
            backfaceVisibility: 'hidden', // Rueckseite waere spiegelverkehrt
            background: '#faf8f4',        // sonst schimmert es durch
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
