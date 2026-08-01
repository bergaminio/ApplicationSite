import { useState, useEffect } from 'react'
import { pageColors, postitColors } from '../styles/colors'
import Postit from '../components/Postit'
import PageTitle from '../components/PageTitle'
import ProjectModal from '../components/ProjectModal'
import { loadRepos } from '../api/github'
import type { Project } from '../types'

// Meine gepflegten Projekte.
//
// Neues Projekt? Einfach einen Block kopieren und anpassen.
// Beim Bild: leg deinen Screenshot in public/demos/ ab (z.B. bolt.png)
// und trage hier '/demos/bolt.png' ein - dann erscheint er im Fenster.
const myProjects: Project[] = [
  {
    name: 'Diese Portfolio-Website',
    repo: 'ApplicationSite',
    text: 'Von Null gebaut, ohne Vorlage. Jede Seite hat ihre eigene Farbe und einen handgezeichneten Look.',
    learned: ['React', 'TypeScript', 'HTML', 'CSS', 'Tailwind', 'Vite'],
    language: 'TypeScript',
    scene: 'privat',
    image: '/demos/bewerbungsseite.png',
  },
  {
    name: 'Bolt — Sprint-App',
    repo: '',
    text: 'Misst Sprints. Die App startet automatisch und stoppt per GPS nach einer festen Distanz, zum Beispiel 100 oder 400 Meter.',
    learned: ['Flutter', 'Dart', 'GPS', 'Android'],
    language: 'Dart',
    scene: 'privat',
    image: '/demos/bolt.png',
  },
  {
    name: 'Aschenreich — 3D-Rollenspiel',
    repo: '',
    text: 'Ein Dark-Fantasy-Rollenspiel, das direkt im Browser läuft.',
    learned: ['JavaScript', 'Three.js', 'Electron', '3D'],
    language: 'JavaScript',
    scene: 'privat',
    image: '/demos/aschenreich.png',
  },
  {
    name: 'Bomberman',
    repo: 'Bomberman',
    text: 'Das Spiel nachgebaut, um objektorientiertes Programmieren zu üben.',
    learned: ['Java', 'OOP'],
    language: 'Java',
    scene: 'gibb',
    image: '/demos/platzhalter.svg',
  },
  {
    name: 'agentDecider',
    repo: 'agentDecider',
    text: 'Ein kleines Programm mit Fenster, das zufällig einen Valorant-Agenten auswählt und den Hintergrund passend einfärbt.',
    learned: ['Python', 'Tkinter', 'Git'],
    language: 'Python',
    scene: 'privat',
    image: '/demos/platzhalter.svg',
  },
]

function Projects() {
  const [search, setSearch] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('Alle')
  const [selectedScene, setSelectedScene] = useState('Alle')
  const [showFilter, setShowFilter] = useState(false)

  // Welches Projekt gerade im Fenster offen ist. null = keines.
  const [openProject, setOpenProject] = useState<Project | null>(null)

  // Die Repos die von GitHub dazukommen.
  const [githubProjects, setGithubProjects] = useState<Project[]>([])

  // Beim ersten Laden der Seite einmal GitHub fragen.
  useEffect(() => {
    loadRepos()
      .then(repos => {
        const extra = repos
          // Repos die schon oben in der Liste stehen ueberspringen.
          .filter(repo => !myProjects.some(mine => mine.repo === repo.name))
          .map(repo => ({
            name: repo.name,
            repo: repo.name,
            text: repo.description ?? 'Noch keine Beschreibung auf GitHub.',
            learned: [],
            language: repo.language ?? 'Anderes',
            // GitHub-Topics wie "gibb" nutzen wir als Bereich.
            scene: repo.topics[0] ?? 'anderes',
            image: '',
          }))
        setGithubProjects(extra)
      })
      // Wenn GitHub nicht antwortet, zeigen wir einfach nur meine Liste.
      .catch(() => setGithubProjects([]))
  }, [])

  const allProjects = [...myProjects, ...githubProjects]

  // Die Filter-Knoepfe bauen wir aus dem was es wirklich gibt.
  // So kann in der Auswahl nie etwas stehen das es gar nicht mehr gibt.
  const languages = ['Alle', ...Array.from(new Set(allProjects.map(p => p.language)))]
  const scenes = ['Alle', ...Array.from(new Set(allProjects.map(p => p.scene)))]

  // Behalte nur die Projekte die zur Suche und zu beiden Filtern passen.
  const filtered = allProjects.filter(project => {
    const matchSearch = project.name.toLowerCase().includes(search.toLowerCase())
    const matchLanguage = selectedLanguage === 'Alle' || project.language === selectedLanguage
    const matchScene = selectedScene === 'Alle' || project.scene === selectedScene
    return matchSearch && matchLanguage && matchScene
  })

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-4xl mx-auto">
      <PageTitle title="Meine Projekte" color={pageColors.projects} />

      <p className="text-gray-500 text-lg mb-10" style={{ transform: 'rotate(-0.3deg)' }}>
        Ich lerne am liebsten, indem ich Sachen baue. Klick ein Projekt an
        für den Screenshot und den Code.
      </p>

      {/* Suchfeld und der Knopf der die Filter auf- und zuklappt */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Suchen..."
          value={search}
          onChange={event => setSearch(event.target.value)}
          className="box flex-1 px-4 py-2"
          style={{ background: 'transparent', fontFamily: 'inherit' }}
        />
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="box px-4 py-2 cursor-pointer"
          style={{
            background: showFilter ? pageColors.projects : 'transparent',
            fontFamily: 'inherit',
          }}
        >
          Filter ▾
        </button>
      </div>

      {/* Die Filter sieht man nur wenn showFilter true ist */}
      {showFilter && (
        <div className="box flex flex-wrap gap-6 sm:gap-8 p-4 mb-6">
          <div>
            <p className="text-sm text-gray-400 mb-2">Sprache</p>
            {languages.map(language => (
              <button
                key={language}
                onClick={() => setSelectedLanguage(language)}
                className="pill block mb-1"
                style={{ background: selectedLanguage === language ? pageColors.projects : 'transparent' }}
              >
                {language}
              </button>
            ))}
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Bereich</p>
            {scenes.map(scene => (
              <button
                key={scene}
                onClick={() => setSelectedScene(scene)}
                className="pill block mb-1"
                style={{ background: selectedScene === scene ? pageColors.projects : 'transparent' }}
              >
                {scene}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Für jedes gefundene Projekt ein Post-it. Klick öffnet das Fenster. */}
      {/* Auf dem Handy eine Spalte, ab 768px zwei */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {filtered.map((project, i) => (
          <div
            key={project.name}
            onClick={() => setOpenProject(project)}
            className="cursor-pointer"
          >
            <Postit
              colors={postitColors.yellow}
              rotate={i % 2 === 0 ? -0.8 : 0.8}
            >
              <p className="sniglet-bold text-lg mb-2">{project.name}</p>
              <p className="text-sm text-gray-700 mb-4">{project.text}</p>

              {/* Was ich dabei gelernt habe */}
              {project.learned.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.learned.map(skill => (
                    <span key={skill} className="pill" style={{ background: 'white' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </Postit>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-400">Nichts gefunden.</p>
      )}

      {/* Das Fenster gibt es nur wenn ein Projekt angeklickt wurde */}
      {openProject && (
        <ProjectModal
          project={openProject}
          onClose={() => setOpenProject(null)}
        />
      )}
    </div>
  )
}

export default Projects
