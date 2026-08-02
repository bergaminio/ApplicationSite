import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
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

// Legt fest welche Adresse welche Seite zeigt.
//
// Der key sorgt fuer die Blaetter-Animation: sobald sich die Adresse
// aendert, ist es fuer React ein anderes Element. Es wird darum neu
// aufgebaut - und die Animation aus index.css laeuft wieder los.
function Seiten() {
  const location = useLocation()

  return (
    <div key={location.pathname} className="seite-blaettern">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        {/* Braucht eine Anmeldung. Das Backend prueft das nochmal -
            die Seite hier auszublenden ist kein Schutz. */}
        <Route path="/grades" element={<Grades />} />
        <Route path="/admin" element={<Admin />} />
        {/* Der Stern faengt alle Adressen ab die oben nicht stehen */}
        <Route path="*" element={<NotFound />} />
      </Routes>
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
