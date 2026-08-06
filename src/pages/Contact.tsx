import { pageColors } from '../styles/colors'
import PageTitle from '../components/PageTitle'
import { useSprache } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { ui, type Text } from '../texts'

// ---------------------------------------------------------------
// Meine Kontaktangaben. Stehen hier oben, damit man sie an einem
// Ort aendern kann - sie erscheinen unten auch im Impressum.
// ---------------------------------------------------------------

const NAME = 'Michael Bergamin'
const ORT = '3232 Ins, Schweiz'
const GITHUB = 'https://github.com/bergaminio/ApplicationSite'

// Die E-Mail steht in zwei Teilen und wird erst im Browser
// zusammengesetzt. Programme, die Webseiten nach Adressen absuchen,
// lesen meist nur den Quelltext ohne JavaScript auszufuehren.
//
// Warum ein Array mit join und nicht einfach teil1 + '@' + teil2?
// Weil das Bau-Werkzeug einfaches Zusammenzaehlen von Texten schon
// beim Bauen ausrechnet - die fertige Adresse stuende dann doch im
// Bündel. Einen join-Aufruf rechnet es nicht vorweg.
//
// Kein perfekter Schutz: wer sich Muehe gibt, kommt trotzdem dran.
// Wirklich sicher waere nur ein Kontaktformular ueber das Backend.
const EMAIL_TEILE = ['michael.bergamin', 'proton.me']

// Die Telefonnummer sieht nur, wer angemeldet ist.
const TELEFON = '+41 76 537 56 30'

// OFFEN: Sobald das Hosting steht, hier den Anbieter eintragen.
// Solange der Text leer ist, bleibt die Zeile im Impressum weg.
// Die IMS-Checkliste fragt danach ("gehostet auf?"), also vor der
// Abgabe ausfuellen.
const HOSTING: Text = { de: '', en: '' }

// Zeigt die E-Mail als anklickbaren Link. Die Adresse entsteht erst
// hier, beim Anzeigen im Browser.
function EmailLink() {
  const adresse = EMAIL_TEILE.join('@')
  return (
    <a href={'mailto:' + adresse} className="underline hover:text-gray-500">
      {adresse}
    </a>
  )
}

// Eine Zeile im Impressum: kleine graue Beschriftung, darunter der Wert.
function Angabe({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-gray-400 text-xs mb-1">{titel}</p>
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  )
}

function Contact() {
  const { t } = useSprache()
  const { benutzer } = useAuth()

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
            <p className="sniglet-bold">{NAME}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">{t(ui.labelEmail)}</p>
            <EmailLink />
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">{t(ui.labelPhone)}</p>
            {/* Nur fuer Angemeldete - sonst sammeln Bots die Nummer ein */}
            {benutzer ? (
              <a href={`tel:${TELEFON.replace(/\s/g, '')}`} className="underline hover:text-gray-500">
                {TELEFON}
              </a>
            ) : (
              <p className="text-gray-400 text-sm">{t(ui.phoneAfterLogin)}</p>
            )}
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">{t(ui.labelPlace)}</p>
            <p>{ORT}</p>
          </div>
        </div>

      </div>

      {/* ---- Impressum ---- */}
      <div className="mt-16">
        <p className="sniglet-bold text-sm text-gray-400" style={{ letterSpacing: '0.12em' }}>
          {t(ui.imprint).toUpperCase()}
        </p>
        <div style={{
          width: '60px',
          height: '3px',
          background: pageColors.contact,
          borderRadius: '2px',
          transform: 'rotate(-0.5deg)',
          marginTop: '6px',
          marginBottom: '1.5rem',
        }} />

        <Angabe titel={t(ui.imprintResponsible)}>
          <p>{NAME}</p>
          <p>{ORT}</p>
          <EmailLink />
        </Angabe>

        <Angabe titel={t(ui.imprintPurpose)}>
          {t(ui.imprintPurposeText)}
        </Angabe>

        {/* Erscheint erst, wenn oben ein Anbieter eingetragen ist */}
        {t(HOSTING) && (
          <Angabe titel={t(ui.imprintHosting)}>{t(HOSTING)}</Angabe>
        )}

        <Angabe titel={t(ui.imprintSource)}>
          <p className="mb-1">{t(ui.imprintSourceText)}</p>
          <a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-500"
          >
            {GITHUB.replace('https://', '')}
          </a>
        </Angabe>
      </div>
    </div>
  )
}

export default Contact
