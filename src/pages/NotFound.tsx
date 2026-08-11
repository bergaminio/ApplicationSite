import { Link } from 'react-router-dom'
import { pageColors } from '../styles/colors'
import PageTitle from '../components/PageTitle'
import { useSprache } from '../context/LanguageContext'
import { ui } from '../texts'

// Wird gezeigt wenn jemand eine Adresse aufruft die es nicht gibt.
function NotFound() {
  const { t } = useSprache()

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
      <PageTitle title={t(ui.notFoundTitle)} color={pageColors.home} skizze="fragezeichen" />

      <p className="text-gray-700 mb-8">
        {t(ui.notFoundText)}
      </p>

      <Link
        to="/"
        className="pill"
        style={{ background: 'white', padding: '8px 20px', fontSize: '14px' }}
      >
        {t(ui.backHome)}
      </Link>
    </div>
  )
}

export default NotFound
