import { pageColors } from '../styles/colors'
import PageTitle from '../components/PageTitle'

function Login() {
  return (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
      <PageTitle title="Login" color={pageColors.login} />

      <p className="text-gray-500 text-lg">
        Hier kommt bald der Login. Danach sieht man meine Noten
        von der gibb, der BWD und der ICT Lernfactory.
      </p>
    </div>
  )
}

export default Login
