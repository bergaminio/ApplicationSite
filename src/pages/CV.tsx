import { Link } from 'react-router-dom'
import { pageColors } from '../styles/colors'
import PageTitle from '../components/PageTitle'
import Skizze, { type SkizzenArt } from '../components/Skizze'
import { useSprache } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { ui, type Text } from '../texts'

// ---------------------------------------------------------------
// Hier stehen alle Angaben, jeweils auf Deutsch und Englisch.
// Etwas ändern? Beide Sprachen anpassen, sonst stimmt eine nicht.
// ---------------------------------------------------------------

const ueberMich: Text = {
  de:
    'Ich besuche die IMS an der BWD Bern. Mit dem Programmieren angefangen habe ich, ' +
    'weil ich Sachen bauen wollte, die es so nicht gab: eine App, die meine Sprintzeiten ' +
    'per GPS stoppt, damit beim Training niemand mit der Stoppuhr danebenstehen muss. ' +
    'Danach kamen ein Rollenspiel im Browser und diese Website dazu. Am meisten lerne ich, ' +
    'wenn ich an etwas Eigenem sitze und es zum Laufen bringen muss. Jetzt suche ich ein ' +
    'Praktikum, in dem ich das an echten Projekten vertiefen kann.',
  en:
    "I'm at the IMS at BWD Bern. I started programming because I wanted to build things " +
    'that did not exist yet: an app that times my sprints via GPS, so nobody has to stand ' +
    'there with a stopwatch during training. A browser role-playing game and this website ' +
    "came after that. I learn most when I'm building something of my own and have to make it " +
    "work. Now I'm looking for an internship where I can take that further on real projects.",
}

interface Eintrag {
  zeit: Text
  titel: Text
  ort: Text
  text: Text
}

const leer: Text = { de: '', en: '' }

const ausbildung: Eintrag[] = [
  {
    zeit: { de: '2024 – heute', en: '2024 – today' },
    titel: {
      de: 'Informatikmittelschule (IMS) EFZ',
      en: 'Informatikmittelschule (IMS) – IT secondary school, EFZ',
    },
    ort: {
      de: 'BWD Bern (IMS) · gibb Berufsfachschule Bern (Berufsschule)',
      en: 'BWD Bern (IMS) · gibb Bern (vocational school)',
    },
    text: {
      de: 'Softwareentwicklung, DevOps, agile Methoden und Geschäftsprozesse.',
      en: 'Software development, DevOps, agile methods and business processes.',
    },
  },
  {
    zeit: { de: '2021 – 2024', en: '2021 – 2024' },
    titel: { de: 'Oberstufenzentrum (OSZ)', en: 'Lower secondary school (OSZ)' },
    ort: { de: 'OSZ Ins', en: 'OSZ Ins' },
    text: leer,
  },
  // Die Primarschule stand hier bis August 2026. Ein
  // Bewerbungscoach hat sie gestrichen: in einem Lebenslauf beginnt
  // die Ausbildung bei der Oberstufe, die Primarschule hat jeder
  // besucht und sagt nichts aus.
]

// Referenzen statt Erfahrung.
//
// Bis August 2026 standen hier die Schnupperlehre bei BBC Buempliz
// und zwei Nebenjobs (Tontechnik, Service). Ein Bewerbungscoach hat
// beides gestrichen: fuer ein Praktikum in der Informatik sagt ein
// Abend am Audiopult wenig, und wer buergt, sagt mehr als was man
// gemacht hat.
//
// OFFEN: Michael muss die Angaben liefern. Solange die Liste leer
// ist, erscheint der Abschnitt gar nicht - besser als eine leere
// Ueberschrift.
//
// WICHTIG: vorher fragen. Niemand steht gern ungefragt mit Name und
// Telefonnummer auf einer Website.
interface Referenz {
  name: string
  rolle: Text      // z.B. "Berufsbildner Informatik"
  betrieb: string  // z.B. "BBC Bümpliz, Bern"
  kontakt: string  // Mail oder Telefon. Leer lassen = "auf Anfrage"
}

const referenzen: Referenz[] = [
  // {
  //   name: 'Vorname Nachname',
  //   rolle: { de: 'Berufsbildner Informatik', en: 'IT training supervisor' },
  //   betrieb: 'BBC Bümpliz, Bern',
  //   kontakt: 'vorname.nachname@example.ch',
  // },
]

const sprachen: { name: Text; niveau: Text }[] = [
  {
    name: { de: 'Deutsch', en: 'German' },
    niveau: { de: 'Muttersprache', en: 'Native speaker' },
  },
  {
    name: { de: 'Französisch', en: 'French' },
    niveau: { de: 'B2 (Zertifizierung März 2026)', en: 'B2 (certification March 2026)' },
  },
  {
    name: { de: 'Englisch', en: 'English' },
    niveau: { de: 'B2 (Zertifizierung März 2026)', en: 'B2 (certification March 2026)' },
  },
]

// Technik-Namen sind in beiden Sprachen gleich.
const itKenntnisse = [
  'React', 'TypeScript', 'Java', 'Spring Boot', 'Python',
  'Flutter', 'Git', 'GitLab', 'Docker', 'CI/CD',
]

// Muss zur Seite "Persoenliches" passen - dort stehen sie ausfuehrlich.
const hobbys: Text[] = [
  { de: 'Klavier spielen', en: 'Playing piano' },
  { de: 'Bogenschiessen', en: 'Archery' },
  { de: 'Gaming', en: 'Gaming' },
  { de: 'Fotografieren', en: 'Photography' },
]

// ---------------------------------------------------------------

// Ein Abschnitt im Lebenslauf, z.B. "Ausbildung".
// Überschrift mit kurzem grünem Strich, darunter der Inhalt.
function Abschnitt({ titel, skizze, children }: {
  titel: string
  skizze?: SkizzenArt
  children: React.ReactNode
}) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3">
        <p className="sniglet-bold text-sm text-gray-400" style={{ letterSpacing: '0.12em' }}>
          {titel.toUpperCase()}
        </p>
        {skizze && <Skizze art={skizze} farbe={pageColors.story} groesse={32} />}
      </div>
      <div style={{
        width: '60px',
        height: '3px',
        background: pageColors.story,
        borderRadius: '2px',
        transform: 'rotate(-0.5deg)',
        marginTop: '6px',
        marginBottom: '1.5rem',
      }} />
      {children}
    </div>
  )
}

// Ein einzelner Eintrag: Zeitraum links, Inhalt rechts.
function EintragZeile({ zeit, titel, ort, text }: Eintrag) {
  const { t } = useSprache()
  return (
    // Auf dem Handy steht der Zeitraum über dem Eintrag, ab 640px daneben.
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-6 mb-6">
      <p className="text-sm text-gray-400 sm:w-28 sm:shrink-0">{t(zeit)}</p>
      <div>
        <p className="sniglet-bold">{t(titel)}</p>
        {t(ort) && <p className="text-sm text-gray-500">{t(ort)}</p>}
        {t(text) && <p className="text-sm text-gray-700 mt-1">{t(text)}</p>}
      </div>
    </div>
  )
}

function CV() {
  const { t } = useSprache()
  const { benutzer, laedt } = useAuth()

  // Solange noch unklar ist, ob jemand angemeldet ist, nichts zeigen.
  // Ohne diese Zwischenstufe blitzt der Hinweis "erst nach dem
  // Anmelden" auch bei Angemeldeten kurz auf.
  if (laedt) {
    return (
      <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
        <PageTitle title={t(ui.cvTitle)} color={pageColors.story} skizze="wegweiser" />
        <p className="text-gray-400">{t(ui.adminLoading)}</p>
      </div>
    )
  }

  // Der Lebenslauf steht nur Angemeldeten offen.
  //
  // Ein Bewerbungscoach hat dazu geraten: hier stehen Wohnort,
  // Schulen und Jahrgaenge beieinander, und das gehoert nicht frei
  // ins Netz. Projekte und Startseite bleiben offen, die sollen ja
  // gefunden werden.
  if (!benutzer) {
    return (
      <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
        <PageTitle title={t(ui.cvTitle)} color={pageColors.story} skizze="wegweiser" />
        <p className="text-gray-700 mb-6" style={{ maxWidth: '34rem' }}>
          {t(ui.cvLocked)}
        </p>
        <Link
          to="/login"
          className="pill inline-block"
          style={{ background: pageColors.login, color: 'white', padding: '8px 20px', fontSize: '20px' }}
        >
          {t(ui.cvToLogin)}
        </Link>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
      <PageTitle title={t(ui.cvTitle)} color={pageColors.story} skizze="wegweiser" />

      {/* Hier stand ein Knopf "Als PDF herunterladen".
          Er ist raus, weil er den Login unterlaufen haette: eine Datei
          in public/ liefert der Webserver an jeden aus, der die
          Adresse kennt - angemeldet oder nicht. Die Seite waere
          geschuetzt gewesen, das PDF mit denselben Angaben nicht.

          Das PDF entsteht weiterhin mit werkzeuge/lebenslauf-pdf.ps1
          und wird Bewerbungen direkt beigelegt.

          Soll es doch auf die Website, muss es das Backend ausliefern
          wie die Notenausweise - dort prueft der Server bei jedem
          Abruf das Anmelde-Token. */}

      {/* Der Laeufer neben dem Text: ein Lebenslauf ist ein Weg,
          kein Stillstand. Reine Verzierung, darum aria-hidden
          (steckt in der Skizze selbst). */}
      <div className="flex items-start gap-5 mb-12">
        <p className="text-gray-700" style={{ maxWidth: '38rem' }}>
          {t(ueberMich)}
        </p>
        <Skizze art="laeufer" farbe={pageColors.story} groesse={72} />
      </div>

      <Abschnitt titel={t(ui.education)} skizze="buch">
        {ausbildung.map(eintrag => (
          <EintragZeile key={eintrag.titel.de} {...eintrag} />
        ))}
      </Abschnitt>

      {/* Erscheint erst, wenn oben Referenzen eingetragen sind.
          Eine Ueberschrift ohne Inhalt sieht nach Baustelle aus. */}
      {referenzen.length > 0 && (
        <Abschnitt titel={t(ui.references)} skizze="brief">
          {referenzen.map(r => (
            <div key={r.name} className="flex flex-col sm:flex-row gap-1 sm:gap-6 mb-6">
              <p className="text-sm text-gray-400 sm:w-28 sm:shrink-0">{t(r.rolle)}</p>
              <div>
                <p className="sniglet-bold">{r.name}</p>
                <p className="text-sm text-gray-500">{r.betrieb}</p>
                <p className="text-sm text-gray-700 mt-1">
                  {r.kontakt || t(ui.referencesOnRequest)}
                </p>
              </div>
            </div>
          ))}
        </Abschnitt>
      )}

      <Abschnitt titel={t(ui.languages)}>
        {sprachen.map(sprache => (
          <div key={sprache.name.de} className="flex flex-col sm:flex-row gap-0 sm:gap-6 mb-3 sm:mb-2">
            <p className="sniglet-bold text-sm sm:w-28 sm:shrink-0">{t(sprache.name)}</p>
            <p className="text-sm text-gray-700">{t(sprache.niveau)}</p>
          </div>
        ))}
      </Abschnitt>

      <Abschnitt titel={t(ui.itSkills)}>
        <div className="flex flex-wrap gap-2">
          {itKenntnisse.map(kenntnis => (
            <span key={kenntnis} className="pill" style={{ background: 'white' }}>
              {kenntnis}
            </span>
          ))}
        </div>
      </Abschnitt>

      <Abschnitt titel={t(ui.hobbies)} skizze="klavier">
        <div className="flex flex-wrap gap-2">
          {hobbys.map(hobby => (
            <span key={hobby.de} className="pill" style={{ background: 'white' }}>
              {t(hobby)}
            </span>
          ))}
        </div>
      </Abschnitt>
    </div>
  )
}

export default CV
