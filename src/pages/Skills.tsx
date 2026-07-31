import { pageColors, postitColors } from '../styles/colors'
import Postit from '../components/Postit'
import PageTitle from '../components/PageTitle'

// Alles was ich gebaut habe - und was ich dabei gelernt habe.
// Willst du etwas ergänzen? Einfach einen Block kopieren
// und die drei Zeilen anpassen.
const things = [
  {
    title: 'Diese Portfolio-Website',
    text: 'Von Null gebaut, ohne Vorlage. Jede Seite hat ihre eigene Farbe.',
    skills: ['React', 'TypeScript', 'HTML', 'CSS', 'Tailwind', 'Vite'],
  },
  {
    title: 'Bolt — Sprint-App',
    text: 'Misst Sprints. Startet automatisch und stoppt per GPS nach einer festen Distanz, zum Beispiel 100 oder 400 Meter.',
    skills: ['Flutter', 'Dart', 'GPS', 'Android'],
  },
  {
    title: 'Aschenreich — 3D-Rollenspiel',
    text: 'Ein Dark-Fantasy-Spiel, das direkt im Browser läuft.',
    skills: ['JavaScript', 'Three.js', 'Electron', '3D'],
  },
  {
    title: 'Bomberman',
    text: 'Das Spiel nachgebaut, um objektorientiertes Programmieren zu üben.',
    skills: ['Java', 'OOP'],
  },
  {
    title: 'agentDecider',
    text: 'Ein kleines Programm mit Fenster, das zufällig einen Valorant-Agenten auswählt.',
    skills: ['Python', 'Tkinter', 'Git'],
  },
]

function Skills() {
  return (
    <div className="px-8 py-16 max-w-4xl mx-auto">
      <PageTitle title="My Skills" color={pageColors.skills} />

      <p className="text-gray-500 text-lg mb-10" style={{ transform: 'rotate(-0.3deg)' }}>
        Ich lerne am liebsten, indem ich Sachen baue. Das ist dabei rausgekommen.
      </p>

      {/* Für jede Sache ein Post-it */}
      <div className="grid grid-cols-2 gap-6 items-start">
        {things.map((thing, i) => (
          <Postit
            key={thing.title}
            colors={postitColors.orange}
            rotate={i % 2 === 0 ? -0.8 : 0.8}
          >
            <p className="sniglet-bold text-lg mb-2">{thing.title}</p>
            <p className="text-sm text-gray-700 mb-4">{thing.text}</p>

            {/* Die Techniken die ich dabei gebraucht habe */}
            <div className="flex flex-wrap gap-2">
              {thing.skills.map(skill => (
                <span key={skill} className="pill" style={{ background: 'white' }}>
                  {skill}
                </span>
              ))}
            </div>
          </Postit>
        ))}
      </div>
    </div>
  )
}

export default Skills
