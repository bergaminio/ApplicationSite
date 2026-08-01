import { pageColors } from '../styles/colors'
import PageTitle from '../components/PageTitle'
import { useSprache } from '../context/LanguageContext'
import { ui } from '../texts'

function Login() {
  const { t } = useSprache()

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
      <PageTitle title={t(ui.loginTitle)} color={pageColors.login} />

      <p className="text-gray-500 text-lg">
        {t(ui.loginText)}
      </p>
    </div>
  )
}

export default Login
