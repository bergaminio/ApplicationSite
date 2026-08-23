import { useEffect, useState } from 'react'
import { pageColors } from '../styles/colors'
import PageTitle from '../components/PageTitle'
import Skizze from '../components/Skizze'
import { useSprache } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { ladeKontakt } from '../api/documents'
import { ui, type Text } from '../texts'

// ---------------------------------------------------------------
// Meine Kontaktangaben. Stehen hier oben, damit man sie an einem
// Ort aendern kann - sie erscheinen unten auch im Impressum.
// ---------------------------------------------------------------

const NAME = 'Michael Bergamin'
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

// Wo die Seite laeuft. Bleibt der Text leer, faellt die Zeile im
// Impressum weg. Die IMS-Checkliste fragt danach ("gehostet auf?").
//
// Es sind zwei Orte, darum die zwei Saetze: die Website selbst liegt
// beim Hoster, die Anmeldung und die Notenausweise laufen auf einem
// eigenen Server. Cloudflare steht davor und liefert beides aus.
const HOSTING: Text = {
  de: 'Website: DNS-NET Services GmbH, Au ZH, Serverstandort Zürich. Auslieferung und DNS über Cloudflare Inc. Anmeldung und Notenausweise laufen auf einem privaten Server in der Schweiz, erreichbar über einen Cloudflare Tunnel.',
  en: 'Website: DNS-NET Services GmbH, Au ZH, Switzerland, servers located in Zurich. Delivery and DNS via Cloudflare Inc. Login and grade reports run on a private server in Switzerland, reachable through a Cloudflare Tunnel.',
}

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

  // Fehlt die Bilddatei, zeigen wir wieder das Kuerzel statt eines
  // kaputten Bildsymbols.
  const [fotoFehlt, setFotoFehlt] = useState(false)

  // Wohnort und Telefonnummer stehen nicht im Quelltext, sondern in
  // der Umgebung des Servers - das Repository ist oeffentlich. Der
  // Server rueckt sie nur mit gueltigem Token heraus.
  const [kontakt, setKontakt] = useState({ place: '', phone: '' })

  useEffect(() => {
    if (!benutzer) return
    ladeKontakt().then(setKontakt).catch(() => {})
  }, [benutzer])

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
      <PageTitle title={t(ui.contactTitle)} color={pageColors.contact} skizze="brief" />

      {/* Auf dem Handy untereinander, ab 640px nebeneinander */}
      <div className="box flex flex-col sm:flex-row gap-6 sm:gap-8 items-start p-5 sm:p-8" style={{ borderRadius: '16px' }}>

        {/* Das Foto. Bewusst nicht groesser als 120px: die Vorlage ist
            265 Pixel breit, darueber wird sie unscharf. Kommt einmal
            ein Foto in voller Aufloesung, darf es wachsen. */}
        {fotoFehlt ? (
          // Faellt das Bild aus, steht hier wie vorher das Kuerzel,
          // statt eines kaputten Bildsymbols.
          <div
            className="box flex items-center justify-center text-3xl"
            style={{ width: '160px', height: '188px', background: pageColors.contact, flexShrink: 0 }}
          >
            MB
          </div>
        ) : (
          <img
            src="/fotos/portrait.jpg"
            alt={NAME}
            onError={() => setFotoFehlt(true)}
            className="box"
            style={{
              width: '160px',
              height: '188px',
              objectFit: 'cover',
              flexShrink: 0,
              display: 'block',
            }}
          />
        )}

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
            {benutzer && kontakt.phone ? (
              <a href={`tel:${kontakt.phone.replace(/\s/g, '')}`} className="underline hover:text-gray-500">
                {kontakt.phone}
              </a>
            ) : (
              <p className="text-gray-400 text-sm">{t(ui.phoneAfterLogin)}</p>
            )}
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">{t(ui.labelPlace)}</p>
            {benutzer && kontakt.place
              ? <p>{kontakt.place}</p>
              : <p className="text-gray-400 text-sm">{t(ui.phoneAfterLogin)}</p>}
          </div>
        </div>

      </div>

      {/* ---- Impressum ---- */}
      <div className="mt-16">
        <div className="flex items-center gap-3">
          <p className="sniglet-bold text-sm text-gray-400" style={{ letterSpacing: '0.12em' }}>
            {t(ui.imprint).toUpperCase()}
          </p>
          <Skizze art="stift" farbe={pageColors.contact} groesse={34} />
        </div>
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
          {benutzer && kontakt.place && <p>{kontakt.place}</p>}
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
