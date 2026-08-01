import { Link, useLocation } from 'react-router-dom'
import { pageColors } from '../styles/colors'

// Die Navigation ganz oben.
// Die Seite auf der man gerade ist, bekommt ein Oval in ihrer Farbe.

const links = [
  { to: '/', label: 'Start', color: pageColors.home },
  { to: '/projects', label: 'Projekte', color: pageColors.projects },
  { to: '/cv', label: 'Lebenslauf', color: pageColors.story },
  { to: '/contact', label: 'Kontakt', color: pageColors.contact },
]

function Navbar() {
  // useLocation sagt uns auf welcher Seite wir gerade sind.
  const location = useLocation()

  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
      <div className="flex gap-8">
        {links.map(link => {
          const isActive = location.pathname === link.to
          return (
            <Link
              key={link.to}
              to={link.to}
              style={isActive ? { borderColor: link.color } : {}}
              className={`text-sm transition-colors px-3 py-1 ${
                isActive
                  ? 'border rounded-full'
                  : 'underline hover:text-gray-500'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>

      <Link
        to="/login"
        className="text-sm border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
      >
        Login
      </Link>
    </nav>
  )
}

export default Navbar
