import { Link } from 'react-router-dom'
import { pageColors } from '../styles/colors'
import PageTitle from '../components/PageTitle'

// Wird gezeigt wenn jemand eine Adresse aufruft die es nicht gibt.
function NotFound() {
  return (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
      <PageTitle title="Nicht gefunden" color={pageColors.home} />

      <p className="text-gray-700 mb-8">
        Diese Seite gibt es nicht. Vielleicht ein Tippfehler in der Adresse?
      </p>

      <Link
        to="/"
        className="pill"
        style={{ background: 'white', padding: '8px 20px', fontSize: '14px' }}
      >
        Zurück zur Startseite →
      </Link>
    </div>
  )
}

export default NotFound
