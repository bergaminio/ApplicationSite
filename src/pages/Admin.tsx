import { useEffect, useState } from 'react'
import { pageColors } from '../styles/colors'
import PageTitle from '../components/PageTitle'
import { useSprache } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { ladeKonten, ladeAnmeldeversuche, aendereKonto, loescheKonto, AdminFehler } from '../api/admin'
import type { KontoUebersicht, Anmeldeversuch } from '../api/admin'
import { ladeDokumente, ladeHoch, loescheDokument, aendereDokument } from '../api/documents'
import type { Dokument } from '../api/documents'
import { ui } from '../texts'

// Zeigt einen Zeitpunkt lesbar an, z.B. "01.08.2026, 16:12"
function zeitpunkt(iso: string, sprache: string) {
  return new Date(iso).toLocaleString(sprache === 'de' ? 'de-CH' : 'en-GB', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

function Admin() {
  const { t, sprache } = useSprache()
  const { benutzer, laedt: authLaedt } = useAuth()

  const [konten, setKonten] = useState<KontoUebersicht[]>([])
  const [versuche, setVersuche] = useState<Anmeldeversuch[]>([])
  const [dokumente, setDokumente] = useState<Dokument[]>([])
  const [laedt, setLaedt] = useState(true)
  const [fehler, setFehler] = useState('')

  // Das Formular zum Hochladen
  const [bereich, setBereich] = useState('EFZ')
  const [titel, setTitel] = useState('')
  const [datei, setDatei] = useState<File | null>(null)
  const [uploadFehler, setUploadFehler] = useState('')
  const [laedtHoch, setLaedtHoch] = useState(false)

  // Welches Dokument gerade umbenannt wird. null = keines.
  const [bearbeiteDok, setBearbeiteDok] = useState<number | null>(null)
  const [neuerTitel, setNeuerTitel] = useState('')
  const [neuerBereich, setNeuerBereich] = useState('EFZ')

  // Welches Konto gerade geaendert wird. null = keines.
  const [bearbeiteKonto, setBearbeiteKonto] = useState<string | null>(null)
  const [neuerName, setNeuerName] = useState('')
  const [neuesPasswort, setNeuesPasswort] = useState('')
  const [kontoFehler, setKontoFehler] = useState('')

  useEffect(() => {
    // Warten bis klar ist, ob jemand angemeldet ist.
    if (authLaedt) return

    Promise.all([ladeKonten(), ladeAnmeldeversuche(), ladeDokumente()])
      .then(([k, v, d]) => {
        setKonten(k)
        setVersuche(v)
        setDokumente(d)
      })
      .catch(e => {
        if (e instanceof AdminFehler && e.art === 'keinRecht') setFehler(t(ui.adminNoRight))
        else setFehler(t(ui.adminNoServer))
      })
      .finally(() => setLaedt(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLaedt])

  // Nur Lehrbetriebe zaehlen, mich selbst nicht.
  const betriebe = konten.filter(k => k.role === 'COMPANY')
  const warenDa = betriebe.filter(k => k.loginCount > 0).length

  async function hochladen() {
    setUploadFehler('')

    if (!titel.trim() || !datei) {
      setUploadFehler(t(ui.docNeedAll))
      return
    }
    // Vor dem Senden pruefen, damit man nicht erst 10 MB hochlaedt
    // und dann eine Absage bekommt.
    if (datei.size > 10 * 1024 * 1024) {
      setUploadFehler(t(ui.docTooBig))
      return
    }

    setLaedtHoch(true)
    try {
      const neu = await ladeHoch(titel.trim(), bereich, datei)
      setDokumente([...dokumente, neu])
      setTitel('')
      setDatei(null)
      // Auch das Dateifeld selbst leeren
      const feld = document.querySelector<HTMLInputElement>('input[type="file"]')
      if (feld) feld.value = ''
    } catch (e) {
      setUploadFehler(e instanceof Error ? e.message : t(ui.docFailed))
    } finally {
      setLaedtHoch(false)
    }
  }

  // ---- Dokument umbenennen ----
  function starteUmbenennen(d: Dokument) {
    setBearbeiteDok(d.id)
    setNeuerTitel(d.title)
    setNeuerBereich(d.area)
    setUploadFehler('')
  }

  async function speichereDokument(id: number) {
    if (!neuerTitel.trim()) return
    try {
      await aendereDokument(id, neuerTitel.trim(), neuerBereich)
      setDokumente(dokumente.map(d =>
        d.id === id ? { ...d, title: neuerTitel.trim(), area: neuerBereich as Dokument['area'] } : d
      ))
      setBearbeiteDok(null)
    } catch {
      setUploadFehler(t(ui.docFailed))
    }
  }

  // ---- Konto aendern ----
  function starteKontoAendern(k: KontoUebersicht) {
    setBearbeiteKonto(k.username)
    setNeuerName(k.displayName)
    setNeuesPasswort('')
    setKontoFehler('')
  }

  async function speichereKonto(username: string) {
    setKontoFehler('')
    if (neuesPasswort && neuesPasswort.length < 8) {
      setKontoFehler('Passwort muss mindestens 8 Zeichen haben')
      return
    }
    try {
      await aendereKonto(username, neuerName.trim(), neuesPasswort)
      setKonten(konten.map(k =>
        k.username === username ? { ...k, displayName: neuerName.trim() } : k
      ))
      setBearbeiteKonto(null)
      setNeuesPasswort('')
    } catch (e) {
      setKontoFehler(e instanceof Error ? e.message : t(ui.docFailed))
    }
  }

  async function kontoEntfernen(username: string) {
    if (!window.confirm(t(ui.accConfirmDelete))) return
    try {
      await loescheKonto(username)
      setKonten(konten.filter(k => k.username !== username))
    } catch (e) {
      setKontoFehler(e instanceof Error ? e.message : t(ui.docFailed))
    }
  }

  async function dokumentEntfernen(id: number) {
    try {
      await loescheDokument(id)
      setDokumente(dokumente.filter(d => d.id !== id))
    } catch {
      setUploadFehler(t(ui.docFailed))
    }
  }

  if (authLaedt || laedt) {
    return (
      <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
        <PageTitle title={t(ui.adminTitle)} color={pageColors.login} />
        <p className="text-gray-400">{t(ui.adminLoading)}</p>
      </div>
    )
  }

  if (fehler || !benutzer || benutzer.role !== 'ADMIN') {
    return (
      <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
        <PageTitle title={t(ui.adminTitle)} color={pageColors.login} />
        <p style={{ color: pageColors.login }}>{fehler || t(ui.adminNoRight)}</p>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
      <PageTitle title={t(ui.adminTitle)} color={pageColors.login} />

      <p className="text-gray-500 mb-8" style={{ maxWidth: '34rem' }}>
        {t(ui.adminIntro)}
      </p>

      {/* Die Zahl auf einen Blick */}
      <p className="sniglet-bold text-2xl mb-8">
        {t(ui.adminLookedIn)}: {warenDa} {t(ui.adminOf)} {betriebe.length} {t(ui.adminCompaniesWord)}
      </p>

      {/* ---- Die Betriebe ---- */}
      <p className="sniglet-bold text-sm text-gray-400 mb-3" style={{ letterSpacing: '0.12em' }}>
        {t(ui.adminCompanies).toUpperCase()}
      </p>

      <div className="flex flex-col gap-3 mb-12">
        {betriebe.map(konto => {
          const warDa = konto.loginCount > 0
          return (
            <div
              key={konto.username}
              className="box p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              // Wer noch nie da war, bekommt einen farbigen Rand -
              // das ist ja die Information die mich interessiert.
              style={warDa ? {} : { borderColor: pageColors.login }}
            >
              <div>
                <p className="sniglet-bold">{konto.displayName}</p>
                <p className="text-xs text-gray-400">{konto.username}</p>
              </div>

              <div className="flex items-center gap-3 text-sm sm:text-right">
                <div>
                  {warDa ? (
                    <>
                      <p>{konto.loginCount}{t(ui.adminTimes)}</p>
                      <p className="text-xs text-gray-400">
                        {t(ui.adminLastTime)}: {zeitpunkt(konto.lastLogin!, sprache)}
                      </p>
                    </>
                  ) : (
                    <span className="pill" style={{ background: pageColors.login, color: 'white' }}>
                      {t(ui.adminNever)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => starteKontoAendern(konto)}
                  className="pill"
                  style={{ cursor: 'pointer', fontSize: '11px' }}
                >
                  {t(ui.accEdit)}
                </button>
                <button
                  onClick={() => kontoEntfernen(konto.username)}
                  className="pill"
                  style={{ cursor: 'pointer', fontSize: '11px' }}
                >
                  {t(ui.accDelete)}
                </button>
              </div>
            </div>
          )
        })}

        {/* Mein eigenes Konto - hier aendere ich mein Passwort */}
        {konten.filter(k => k.role === 'ADMIN').map(konto => (
          <div key={konto.username} className="box p-4" style={{ borderStyle: 'dashed' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="sniglet-bold">{konto.displayName}</p>
                <p className="text-xs text-gray-400">{konto.username} · {t(ui.accAdminHint)}</p>
              </div>
              <button
                onClick={() => starteKontoAendern(konto)}
                className="pill"
                style={{ cursor: 'pointer', fontSize: '11px' }}
              >
                {t(ui.accEdit)}
              </button>
            </div>
          </div>
        ))}

        {/* Aendern-Formular, erscheint unter der Liste */}
        {bearbeiteKonto && (
          <div className="box p-4" style={{ borderColor: pageColors.login }}>
            <p className="text-xs text-gray-400 mb-2">{bearbeiteKonto}</p>

            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <input
                type="text"
                placeholder={t(ui.accDisplayName)}
                value={neuerName}
                onChange={e => setNeuerName(e.target.value)}
                className="box flex-1 px-3 py-2"
                style={{ background: 'transparent', fontFamily: 'inherit' }}
              />
              <input
                type="password"
                placeholder={t(ui.accNewPassword)}
                value={neuesPasswort}
                onChange={e => setNeuesPasswort(e.target.value)}
                autoComplete="new-password"
                className="box flex-1 px-3 py-2"
                style={{ background: 'transparent', fontFamily: 'inherit' }}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => speichereKonto(bearbeiteKonto)}
                className="pill"
                style={{ cursor: 'pointer', background: pageColors.login, color: 'white', padding: '6px 14px' }}
              >
                {t(ui.accSave)}
              </button>
              <button
                onClick={() => setBearbeiteKonto(null)}
                className="pill"
                style={{ cursor: 'pointer' }}
              >
                {t(ui.accCancel)}
              </button>
            </div>

            {kontoFehler && (
              <p className="text-sm mt-2" style={{ color: pageColors.login }} role="alert">{kontoFehler}</p>
            )}
          </div>
        )}
      </div>

      {/* ---- Notenausweise hochladen ---- */}
      <p className="sniglet-bold text-sm text-gray-400 mb-3" style={{ letterSpacing: '0.12em' }}>
        {t(ui.docAdd).toUpperCase()}
      </p>

      <div className="box p-4 mb-12">
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <select
            value={bereich}
            onChange={e => setBereich(e.target.value)}
            className="box px-3 py-2"
            style={{ background: 'transparent', fontFamily: 'inherit' }}
          >
            <option value="EFZ">EFZ</option>
            <option value="BM">BM</option>
            <option value="UEK">ÜK</option>
          </select>

          <input
            type="text"
            placeholder={t(ui.docTitle)}
            value={titel}
            onChange={e => setTitel(e.target.value)}
            className="box flex-1 px-3 py-2"
            style={{ background: 'transparent', fontFamily: 'inherit' }}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={e => setDatei(e.target.files?.[0] ?? null)}
            className="text-sm flex-1"
          />

          <button
            onClick={hochladen}
            disabled={laedtHoch}
            className="pill"
            style={{
              cursor: laedtHoch ? 'wait' : 'pointer',
              background: pageColors.login,
              color: 'white',
              padding: '8px 16px',
            }}
          >
            {laedtHoch ? t(ui.docUploading) : t(ui.docUpload)}
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-2">{t(ui.docTypes)}</p>

        {uploadFehler && (
          <p className="text-sm mt-2" style={{ color: pageColors.login }} role="alert">{uploadFehler}</p>
        )}

        {/* Was schon hochgeladen ist. Beim Umbenennen wird die Zeile
            zum Eingabefeld - die Datei selbst bleibt unangetastet. */}
        {dokumente.length > 0 && (
          <div className="flex flex-col gap-2 mt-4">
            {dokumente.map(d => bearbeiteDok === d.id ? (
              <div key={d.id} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                <select
                  value={neuerBereich}
                  onChange={e => setNeuerBereich(e.target.value)}
                  className="box px-2 py-1 text-sm"
                  style={{ background: 'transparent', fontFamily: 'inherit' }}
                >
                  <option value="EFZ">EFZ</option>
                  <option value="BM">BM</option>
                  <option value="UEK">ÜK</option>
                </select>
                <input
                  type="text"
                  value={neuerTitel}
                  onChange={e => setNeuerTitel(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') speichereDokument(d.id) }}
                  autoFocus
                  className="box flex-1 px-3 py-1 text-sm"
                  style={{ background: 'transparent', fontFamily: 'inherit' }}
                />
                <button
                  onClick={() => speichereDokument(d.id)}
                  className="pill"
                  style={{ cursor: 'pointer', fontSize: '11px', background: pageColors.login, color: 'white' }}
                >
                  {t(ui.docSave)}
                </button>
                <button
                  onClick={() => setBearbeiteDok(null)}
                  className="pill"
                  style={{ cursor: 'pointer', fontSize: '11px' }}
                >
                  {t(ui.docCancel)}
                </button>
              </div>
            ) : (
              <div key={d.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-400 text-xs" style={{ width: '3rem' }}>{d.area}</span>
                <span className="flex-1">{d.title}</span>
                <span className="text-gray-400 text-xs">{Math.round(d.size / 1024)} KB</span>
                <button
                  onClick={() => starteUmbenennen(d)}
                  className="pill"
                  style={{ cursor: 'pointer', fontSize: '11px' }}
                >
                  {t(ui.docRename)}
                </button>
                <button
                  onClick={() => dokumentEntfernen(d.id)}
                  className="pill"
                  style={{ cursor: 'pointer', fontSize: '11px' }}
                >
                  {t(ui.docDelete)}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---- Das rohe Protokoll ---- */}
      <p className="sniglet-bold text-sm text-gray-400 mb-3" style={{ letterSpacing: '0.12em' }}>
        {t(ui.adminAttempts).toUpperCase()}
      </p>

      {versuche.length === 0 ? (
        <p className="text-gray-400 text-sm">{t(ui.adminNoAttempts)}</p>
      ) : (
        <div className="box p-4 flex flex-col gap-2">
          {versuche.slice(0, 20).map((v, i) => (
            <div key={i} className="flex justify-between gap-4 text-sm">
              <span className="sniglet-bold">{v.username}</span>
              <span className="text-gray-400 text-xs">{zeitpunkt(v.time, sprache)}</span>
              <span
                className="text-xs"
                style={{ color: v.success ? '#4a9d6e' : pageColors.login, minWidth: '6rem', textAlign: 'right' }}
              >
                {v.success ? t(ui.adminOk) : t(ui.adminFailed)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Admin
