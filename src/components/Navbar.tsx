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
    <nav className="flex items-center justify-between gap-3 px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200">
      <div className="flex flex-wrap gap-x-4 gap-y-2 sm:gap-8">
        {links.map(link => {
          const isActive = location.pathname === link.to
          return (
            <Link
              key={link.to}
              to={link.to}
              style={isActive ? { borderColor: link.color } : {}}
              className={`text-xs sm:text-sm transition-colors px-2 sm:px-3 py-1 ${
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
        className="text-xs sm:text-sm border border-gray-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-gray-50 transition-colors shrink-0"
      >
        Login
      </Link>
    </nav>
  )
}

export default Navbar
