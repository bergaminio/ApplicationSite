import { Link, useLocation } from 'react-router-dom'
import { pageColors } from '../styles/colors'
import { useSprache } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { ui } from '../texts'

// Die Navigation ganz oben.
// Die Seite auf der man gerade ist, bekommt ein Oval in ihrer Farbe.

const links = [
  { to: '/', label: ui.navHome, color: pageColors.home },
  { to: '/projects', label: ui.navProjects, color: pageColors.projects },
  { to: '/cv', label: ui.navCV, color: pageColors.story },
  { to: '/personal', label: ui.navPersonal, color: pageColors.personal },
  { to: '/contact', label: ui.navContact, color: pageColors.contact },
]

function Navbar() {
  // useLocation sagt uns auf welcher Seite wir gerade sind.
  const location = useLocation()
  const { sprache, setSprache, t } = useSprache()
  const { benutzer } = useAuth()

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
              {t(link.label)}
            </Link>
          )
        })}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Sprach-Umschalter: die gewaehlte Sprache ist dunkel */}
        <div className="flex gap-1">
          {(['de', 'en'] as const).map(kuerzel => (
            <button
              key={kuerzel}
              onClick={() => setSprache(kuerzel)}
              className="pill"
              style={{
                cursor: 'pointer',
                background: sprache === kuerzel ? '#333' : 'transparent',
                color: sprache === kuerzel ? 'white' : '#999',
                borderColor: sprache === kuerzel ? '#333' : '#ccc',
              }}
            >
              {kuerzel.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Angemeldet? Dann steht hier der Name statt "Login".
            Der Name wird abgeschnitten statt umzubrechen: ein langer
            Betriebsname wie "Schweizerische Bundesbahnen SBB" hat sonst
            auf dem Handy die ganze Leiste ueber den Rand geschoben und
            waagrechtes Scrollen ausgeloest. */}
        <Link
          to="/login"
          title={benutzer ? benutzer.displayName : undefined}
          className="text-xs sm:text-sm border px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-gray-50 transition-colors overflow-hidden text-ellipsis whitespace-nowrap"
          style={{
            maxWidth: '9rem',
            ...(benutzer
              ? { borderColor: pageColors.login, color: pageColors.login }
              : { borderColor: '#d1d5db' }),
          }}
        >
          {benutzer ? benutzer.displayName : t(ui.navLogin)}
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
