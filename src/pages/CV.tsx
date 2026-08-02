import { pageColors } from '../styles/colors'
import PageTitle from '../components/PageTitle'
import { useSprache } from '../context/LanguageContext'
import { ui, type Text } from '../texts'

// ---------------------------------------------------------------
// Hier stehen alle Angaben, jeweils auf Deutsch und Englisch.
// Etwas ändern? Beide Sprachen anpassen, sonst stimmt eine nicht.
// ---------------------------------------------------------------

const ueberMich: Text = {
  de:
    'Ich mache die IMS an der BWD Bern. Mit dem Programmieren angefangen habe ich, ' +
    'weil ich Sachen bauen wollte, die es so nicht gab: eine App, die meine Sprintzeiten ' +
    'per GPS stoppt, damit beim Training niemand mit der Stoppuhr danebenstehen muss. ' +
    'Danach kamen ein Rollenspiel im Browser und diese Website dazu. Am meisten lerne ich, ' +
    'wenn ich an etwas Eigenem sitze und es zum Laufen bringen muss. Jetzt suche ich ein ' +
    'Praktikum, in dem ich das an echten Projekten weitermache.',
  en:
    'I am doing the IMS at BWD Bern. I started programming because I wanted to build things ' +
    'that did not exist yet: an app that times my sprints by GPS, so nobody has to stand ' +
    'there with a stopwatch during training. A browser role-playing game and this website ' +
    'came after that. I learn the most when I am sitting on something of my own and have to ' +
    'get it working. Now I am looking for an internship where I can keep doing that on real projects.',
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
  {
    zeit: { de: '2014 – 2020', en: '2014 – 2020' },
    titel: { de: 'Primarschule', en: 'Primary school' },
    ort: {
      de: 'Primarschule BTM (Brüttelen · Treiten · Müntschemier)',
      en: 'Primary school BTM (Brüttelen · Treiten · Müntschemier)',
    },
    text: leer,
  },
]

const erfahrung: Eintrag[] = [
  {
    zeit: { de: '2023', en: '2023' },
    titel: { de: 'Schnupperlehre Informatik', en: 'IT taster apprenticeship' },
    ort: { de: 'BBC Bümpliz, Bern', en: 'BBC Bümpliz, Bern' },
    text: {
      de: 'Einblick in den Berufsalltag der Informatik und erste praktische Erfahrungen.',
      en: 'A look at everyday work in IT and first hands-on experience.',
    },
  },
]

// Nebenjobs und Freiwilligenarbeit. Die Checkliste der IMS fragt
// ausdruecklich danach - auch Unbezahltes zaehlt.
//
// OFFEN: Die Jahre sind aus dem Gedaechtnis - bitte nachpruefen.
// Ein falsches Datum faellt spaetestens im Bewerbungsgespraech auf.
// Der Ort fehlt noch; leer lassen geht, dann bleibt die Zeile weg.
const nebenjobs: Eintrag[] = [
  {
    zeit: { de: '2023', en: '2023' },
    titel: { de: 'Tontechnik bei einem Konzert', en: 'Sound engineering at a concert' },
    ort: leer,
    text: {
      de: 'Bedienung des Audiopults während der Veranstaltung.',
      en: 'Operating the mixing desk during the event.',
    },
  },
  {
    zeit: { de: '2024', en: '2024' },
    titel: { de: 'Service bei einer Theateraufführung', en: 'Service at a theatre performance' },
    ort: leer,
    text: {
      de: 'Bewirtung der Gäste während der Vorstellung.',
      en: 'Serving guests during the performance.',
    },
  },
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

const hobbys: Text[] = [
  { de: 'Klavier spielen', en: 'Playing piano' },
  { de: 'Gaming', en: 'Gaming' },
  { de: 'Bogenschiessen', en: 'Archery' },
]

// ---------------------------------------------------------------

// Ein Abschnitt im Lebenslauf, z.B. "Ausbildung".
// Überschrift mit kurzem grünem Strich, darunter der Inhalt.
function Abschnitt({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <p className="sniglet-bold text-sm text-gray-400" style={{ letterSpacing: '0.12em' }}>
        {titel.toUpperCase()}
      </p>
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

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
      <PageTitle title={t(ui.cvTitle)} color={pageColors.story} />

      {/* Sobald public/lebenslauf.pdf da ist, hier den Knopf einhängen:
          <a href="/lebenslauf.pdf" download className="pill"
             style={{ background: 'white', padding: '8px 20px', fontSize: '14px' }}>
            Als PDF herunterladen ↓
          </a>
      */}

      <p className="text-gray-700 mb-12" style={{ maxWidth: '38rem' }}>
        {t(ueberMich)}
      </p>

      <Abschnitt titel={t(ui.education)}>
        {ausbildung.map(eintrag => (
          <EintragZeile key={eintrag.titel.de} {...eintrag} />
        ))}
      </Abschnitt>

      <Abschnitt titel={t(ui.experience)}>
        {erfahrung.map(eintrag => (
          <EintragZeile key={eintrag.titel.de} {...eintrag} />
        ))}
      </Abschnitt>

      <Abschnitt titel={t(ui.sideJobs)}>
        {nebenjobs.map(eintrag => (
          <EintragZeile key={eintrag.titel.de} {...eintrag} />
        ))}
      </Abschnitt>

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

      <Abschnitt titel={t(ui.hobbies)}>
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
