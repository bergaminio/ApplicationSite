import { useState, useEffect, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { pageColors } from '../styles/colors'
import PageTitle from '../components/PageTitle'
import { useSprache } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { LoginFehler, backendErreichbar } from '../api/auth'
import { ui } from '../texts'

function Login() {
  const { t } = useSprache()
  const { benutzer, anmelden, abmelden } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fehler, setFehler] = useState('')
  const [laeuft, setLaeuft] = useState(false)

  // Laeuft der Server ueberhaupt? null = wird noch geprueft.
  // Ohne Server waere ein Anmeldeformular sinnlos - dann zeigen wir
  // stattdessen, was hier einmal hinkommt.
  const [serverDa, setServerDa] = useState<boolean | null>(null)

  useEffect(() => {
    backendErreichbar().then(setServerDa)
  }, [])

  async function absenden(event: FormEvent) {
    event.preventDefault()   // sonst laedt der Browser die Seite neu
    setFehler('')

    if (!username.trim() || !password) {
      setFehler(t(ui.loginEmpty))
      return
    }

    setLaeuft(true)
    try {
      await anmelden(username.trim(), password)
      setPassword('')
    } catch (e) {
      // Je nach Grund eine andere Meldung zeigen.
      if (e instanceof LoginFehler && e.art === 'falsch') setFehler(t(ui.loginWrong))
      else if (e instanceof LoginFehler && e.art === 'server') setFehler(t(ui.loginNoServer))
      else setFehler(t(ui.loginFailed))
    } finally {
      setLaeuft(false)
    }
  }

  // ---- Angemeldet: Formular weg, Begruessung her ----
  if (benutzer) {
    return (
      <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
        <PageTitle title={t(ui.loginTitle)} color={pageColors.login} />

        <div className="box p-5 sm:p-8" style={{ maxWidth: '28rem' }}>
          <p className="text-gray-400 text-xs mb-1">{t(ui.loggedInAs)}</p>
          <p className="sniglet-bold text-xl mb-6">{benutzer.displayName}</p>

          {/* Zu den Noten - das ist der Grund fuer den Login */}
          <Link
            to="/grades"
            className="pill block mb-4"
            style={{
              background: pageColors.login,
              color: 'white',
              padding: '8px 20px',
              fontSize: '14px',
              width: 'fit-content',
            }}
          >
            {t(ui.gradesLink)}
          </Link>

          {/* Der Weg zu meiner Uebersicht - sehe nur ich */}
          {benutzer.role === 'ADMIN' && (
            <Link
              to="/admin"
              className="pill block mb-4"
              style={{ background: 'white', padding: '8px 20px', fontSize: '14px', width: 'fit-content' }}
            >
              {t(ui.adminLink)}
            </Link>
          )}

          <button
            onClick={abmelden}
            className="pill"
            style={{ cursor: 'pointer', background: 'white', padding: '8px 20px', fontSize: '14px' }}
          >
            {t(ui.logout)}
          </button>
        </div>
      </div>
    )
  }

  // ---- Server laeuft noch nicht: zeigen was hier hinkommt ----
  if (serverDa === false) {
    return (
      <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
        <PageTitle title={t(ui.loginTitle)} color={pageColors.login} />

        <div className="box p-5 sm:p-8" style={{ maxWidth: '32rem' }}>
          <p className="sniglet-bold text-lg mb-3">{t(ui.loginSoonTitle)}</p>
          <p className="text-gray-700">{t(ui.loginSoonText)}</p>
        </div>
      </div>
    )
  }

  // ---- Nicht angemeldet: das Formular ----
  return (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
      <PageTitle title={t(ui.loginTitle)} color={pageColors.login} />

      <p className="text-gray-500 mb-8" style={{ maxWidth: '32rem' }}>
        {t(ui.loginText)}
      </p>

      {/* Solange die Pruefung laeuft, kein Formular zeigen - sonst
          blitzt es kurz auf und verschwindet wieder. */}
      {serverDa === null && (
        <p className="text-gray-400">{t(ui.loginChecking)}</p>
      )}

      <form
        onSubmit={absenden}
        className="box p-5 sm:p-8"
        style={{ maxWidth: '28rem', display: serverDa ? undefined : 'none' }}
      >
        <label className="block mb-4">
          <span className="text-gray-400 text-xs">{t(ui.loginUsername)}</span>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
            disabled={laeuft}
            className="box w-full px-4 py-2 mt-1"
            style={{ background: 'transparent', fontFamily: 'inherit' }}
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-400 text-xs">{t(ui.loginPassword)}</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={laeuft}
            className="box w-full px-4 py-2 mt-1"
            style={{ background: 'transparent', fontFamily: 'inherit' }}
          />
        </label>

        {/* Fehlermeldung, nur wenn es eine gibt */}
        {fehler && (
          <p
            className="text-sm mb-4"
            style={{ color: pageColors.login }}
            role="alert"
          >
            {fehler}
          </p>
        )}

        <button
          type="submit"
          disabled={laeuft}
          className="pill"
          style={{
            cursor: laeuft ? 'wait' : 'pointer',
            background: laeuft ? 'white' : pageColors.login,
            color: laeuft ? '#333' : 'white',
            padding: '8px 24px',
            fontSize: '14px',
          }}
        >
          {laeuft ? t(ui.loginLoading) : t(ui.loginButton)}
        </button>
      </form>
    </div>
  )
}

export default Login
