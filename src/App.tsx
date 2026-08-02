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
// AnimatePresence haelt die alte Seite noch einen Moment im Speicher,
// damit sie wegblaettern kann. Ohne das waere sie sofort weg und man
// saehe nur die neue hereinkommen.
//
// mode="wait" heisst: erst blaettert die alte weg, dann kommt die neue.
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

  const dauer = wenigerBewegung ? 0 : 0.3

  return (
    // perspective gehoert auf die Eltern-Schicht, sonst wirkt die
    // Drehung flach statt raeumlich.
    <div style={{ perspective: '1400px' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, rotateY: -16, x: -12 }}
          animate={{ opacity: 1, rotateY: 0, x: 0 }}
          exit={{ opacity: 0, rotateY: 14, x: 12 }}
          transition={{ duration: dauer, ease: 'easeInOut' }}
          style={{ transformOrigin: 'left center' }}
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
