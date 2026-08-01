import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SpracheProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Projects from './pages/Projects'
import CV from './pages/CV'
import Contact from './pages/Contact'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

// Legt fest welche Adresse welche Seite zeigt.
//
// Die beiden Provider aussen herum geben Sprache und Anmelde-Zustand
// an alle Seiten weiter, ohne dass man sie durchreichen muss.
function App() {
  return (
    <SpracheProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/cv" element={<CV />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            {/* Der Stern faengt alle Adressen ab die oben nicht stehen */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </SpracheProvider>
  )
}

export default App
