import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SpracheProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Projects from './pages/Projects'
import CV from './pages/CV'
import Contact from './pages/Contact'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

// Legt fest welche Adresse welche Seite zeigt.
// SpracheProvider aussen herum, damit jede Seite an die Sprache kommt.
function App() {
  return (
    <SpracheProvider>
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
    </SpracheProvider>
  )
}

export default App
