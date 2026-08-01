import { pageColors } from '../styles/colors'
import PageTitle from '../components/PageTitle'

// ---------------------------------------------------------------
// Hier stehen alle Angaben. Etwas ändern? Einfach den Text anpassen
// oder einen Block kopieren.
// ---------------------------------------------------------------

const ueberMich =
  'Ich mache die IMS an der BWD Bern. Mit dem Programmieren angefangen habe ich, ' +
  'weil ich Sachen bauen wollte, die es so nicht gab: eine App, die meine Sprintzeiten ' +
  'per GPS stoppt, damit beim Training niemand mit der Stoppuhr danebenstehen muss. ' +
  'Danach kamen ein Rollenspiel im Browser und diese Website dazu. Am meisten lerne ich, ' +
  'wenn ich an etwas Eigenem sitze und es zum Laufen bringen muss. Jetzt suche ich ein ' +
  'Praktikum, in dem ich das an echten Projekten weitermache.'

const ausbildung = [
  {
    zeit: '2024 – heute',
    titel: 'Informatikmittelschule (IMS) EFZ',
    ort: 'BWD Bern (IMS) · gibb Berufsfachschule Bern (Berufsschule)',
    text: 'Softwareentwicklung, DevOps, agile Methoden und Geschäftsprozesse.',
  },
  {
    zeit: '2021 – 2024',
    titel: 'Oberstufenzentrum (OSZ)',
    ort: 'OSZ Ins',
    text: '',
  },
  {
    zeit: '2014 – 2020',
    titel: 'Primarschule',
    ort: 'Primarschule BTM (Brüttelen · Treiten · Müntschemier)',
    text: '',
  },
]

const erfahrung = [
  {
    zeit: '2023',
    titel: 'Schnupperlehre Informatik',
    ort: 'BBC Bümpliz, Bern',
    text: 'Einblick in den Berufsalltag der Informatik und erste praktische Erfahrungen.',
  },
]

const sprachen = [
  { name: 'Deutsch', niveau: 'Muttersprache' },
  { name: 'Französisch', niveau: 'B2 (Zertifizierung März 2026)' },
  { name: 'Englisch', niveau: 'B2 (Zertifizierung März 2026)' },
]

const itKenntnisse = [
  'React', 'TypeScript', 'Java', 'Spring Boot', 'Python',
  'Flutter', 'Git', 'GitLab', 'Docker', 'CI/CD',
]

const hobbys = ['Klavier spielen', 'Gaming', 'Bogenschiessen']

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
function Eintrag({ zeit, titel, ort, text }: {
  zeit: string
  titel: string
  ort: string
  text: string
}) {
  return (
    // Auf dem Handy steht der Zeitraum über dem Eintrag, ab 640px daneben.
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-6 mb-6">
      <p className="text-sm text-gray-400 sm:w-28 sm:shrink-0">
        {zeit}
      </p>
      <div>
        <p className="sniglet-bold">{titel}</p>
        {ort && <p className="text-sm text-gray-500">{ort}</p>}
        {text && <p className="text-sm text-gray-700 mt-1">{text}</p>}
      </div>
    </div>
  )
}

function CV() {
  return (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
      <PageTitle title="Lebenslauf" color={pageColors.story} />

      {/* Sobald public/lebenslauf.pdf da ist, hier den Knopf einhängen:
          <a href="/lebenslauf.pdf" download className="pill"
             style={{ background: 'white', padding: '8px 20px', fontSize: '14px' }}>
            Als PDF herunterladen ↓
          </a>
      */}

      <p className="text-gray-700 mb-12" style={{ maxWidth: '38rem' }}>
        {ueberMich}
      </p>

      <Abschnitt titel="Ausbildung">
        {ausbildung.map(eintrag => (
          <Eintrag key={eintrag.titel} {...eintrag} />
        ))}
      </Abschnitt>

      <Abschnitt titel="Erfahrung">
        {erfahrung.map(eintrag => (
          <Eintrag key={eintrag.titel} {...eintrag} />
        ))}
      </Abschnitt>

      <Abschnitt titel="Sprachen">
        {sprachen.map(sprache => (
          <div key={sprache.name} className="flex flex-col sm:flex-row gap-0 sm:gap-6 mb-3 sm:mb-2">
            <p className="sniglet-bold text-sm sm:w-28 sm:shrink-0">
              {sprache.name}
            </p>
            <p className="text-sm text-gray-700">{sprache.niveau}</p>
          </div>
        ))}
      </Abschnitt>

      <Abschnitt titel="IT-Kenntnisse">
        <div className="flex flex-wrap gap-2">
          {itKenntnisse.map(kenntnis => (
            <span key={kenntnis} className="pill" style={{ background: 'white' }}>
              {kenntnis}
            </span>
          ))}
        </div>
      </Abschnitt>

      <Abschnitt titel="Hobbys">
        <div className="flex flex-wrap gap-2">
          {hobbys.map(hobby => (
            <span key={hobby} className="pill" style={{ background: 'white' }}>
              {hobby}
            </span>
          ))}
        </div>
      </Abschnitt>
    </div>
  )
}

export default CV
