import { pageColors } from '../styles/colors'
import PageTitle from '../components/PageTitle'
import { useSprache } from '../context/LanguageContext'
import { ui } from '../texts'

function Contact() {
  const { t } = useSprache()

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
      <PageTitle title={t(ui.contactTitle)} color={pageColors.contact} />

      {/* Auf dem Handy untereinander, ab 640px nebeneinander */}
      <div className="box flex flex-col sm:flex-row gap-6 sm:gap-8 items-start p-5 sm:p-8" style={{ borderRadius: '16px' }}>

        {/* Platzhalter fürs Foto */}
        <div
          className="box flex items-center justify-center text-3xl"
          style={{
            width: '100px',
            height: '100px',
            background: pageColors.contact,
            flexShrink: 0,
          }}
        >
          MB
        </div>

        {/* Die Kontakt-Infos */}
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-gray-400 text-xs mb-1">{t(ui.labelName)}</p>
            <p className="sniglet-bold">Michael Bergamin</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">{t(ui.labelEmail)}</p>
            <p>michael.bergamin@proton.me</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">{t(ui.labelPhone)}</p>
            <p>+41 76 537 56 30</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">{t(ui.labelPlace)}</p>
            <p>3232 Ins, Schweiz</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Contact
