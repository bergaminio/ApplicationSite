import { useState, useEffect } from 'react'
import { pageColors, postitColors } from '../styles/colors'
import Postit from '../components/Postit'
import PageTitle from '../components/PageTitle'
import ProjectModal from '../components/ProjectModal'
import Skizze from '../components/Skizze'
import { loadRepos } from '../api/github'
import { useSprache } from '../context/LanguageContext'
import { ui, type Text } from '../texts'
import type { Project } from '../types'

// Meine gepflegten Projekte.
//
// Neues Projekt? Einfach einen Block kopieren und anpassen.
// Beim Bild: leg deinen Screenshot in public/demos/ ab (z.B. bolt.png)
// und trage hier '/demos/bolt.png' ein - dann erscheint er im Fenster.
const myProjects: Project[] = [
  {
    id: 'portfolio',
    name: { de: 'Diese Portfolio-Website', en: 'This portfolio website' },
    repo: 'ApplicationSite',
    text: {
      de: 'Von Null gebaut, ohne Vorlage. Jede Seite hat ihre eigene Farbe und einen handgezeichneten Look.',
      en: 'Built from scratch, no template. Every page has its own colour and a hand-drawn look.',
    },
    learned: ['React', 'TypeScript', 'HTML', 'CSS', 'Tailwind', 'Vite'],
    language: 'TypeScript',
    scene: 'privat',
    image: '/demos/bewerbungsseite.png',
  },
  {
    id: 'bolt',
    name: { de: 'Bolt, die Sprint-App', en: 'Bolt, the sprint app' },
    repo: '',
    text: {
      de: 'Misst Sprints. Die App startet automatisch und stoppt per GPS nach einer festen Distanz, zum Beispiel 100 oder 400 Meter.',
      en: 'Measures sprints. The app starts automatically and stops via GPS after a set distance, for example 100 or 400 metres.',
    },
    learned: ['Flutter', 'Dart', 'GPS', 'Android'],
    language: 'Dart',
    scene: 'privat',
    image: '/demos/bolt.png',
  },
  {
    id: 'aschenreich',
    name: { de: 'Aschenreich, ein 3D-Rollenspiel', en: 'Aschenreich, a 3D role-playing game' },
    repo: '',
    text: {
      de: 'Ein Dark-Fantasy-Rollenspiel, das direkt im Browser läuft.',
      en: 'A dark fantasy role-playing game that runs right in the browser.',
    },
    learned: ['JavaScript', 'Three.js', 'Electron', '3D'],
    language: 'JavaScript',
    scene: 'privat',
    image: '/demos/aschenreich.jpg',
  },
  {
    id: 'bomberman',
    name: { de: 'Bomberman', en: 'Bomberman' },
    repo: 'Bomberman',
    text: {
      de: 'Das Spiel nachgebaut, um objektorientiertes Programmieren zu üben.',
      en: 'Rebuilt the game to practise object-oriented programming.',
    },
    learned: ['Java', 'OOP'],
    language: 'Java',
    scene: 'gibb',
    image: '/demos/bomberman.png',
  },
  {
    id: 'agentdecider',
    name: { de: 'agentDecider', en: 'agentDecider' },
    repo: 'agentDecider',
    text: {
      de: 'Ein kleines Programm mit Fenster, das zufällig einen Valorant-Agenten auswählt und den Hintergrund passend einfärbt.',
      en: 'A small windowed program that picks a random Valorant agent and colours the background to match.',
    },
    learned: ['Python', 'Tkinter', 'Git'],
    language: 'Python',
    scene: 'privat',
    image: '/demos/agentdecider.png',
  },
]

// Die Bereiche heissen auf Englisch anders. Was hier nicht steht
// (z.B. GitHub-Topics) wird einfach unveraendert angezeigt.
const bereichNamen: Record<string, Text> = {
  privat: ui.scenePrivate,
  anderes: ui.sceneOther,
}

const ALLE = 'Alle'   // interner Wert fuer "kein Filter"

function Projects() {
  const { t } = useSprache()

  const [search, setSearch] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState(ALLE)
  const [selectedScene, setSelectedScene] = useState(ALLE)
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
            id: repo.name,
            name: { de: repo.name, en: repo.name },
            repo: repo.name,
            text: repo.description
              ? { de: repo.description, en: repo.description }
              : ui.noDescription,
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
  const languages = [ALLE, ...Array.from(new Set(allProjects.map(p => p.language)))]
  const scenes = [ALLE, ...Array.from(new Set(allProjects.map(p => p.scene)))]

  // Zeigt einen Bereich in der richtigen Sprache an.
  function bereichText(scene: string) {
    if (scene === ALLE) return t(ui.all)
    return bereichNamen[scene] ? t(bereichNamen[scene]) : scene
  }

  // Behalte nur die Projekte die zur Suche und zu beiden Filtern passen.
  const filtered = allProjects.filter(project => {
    const matchSearch = t(project.name).toLowerCase().includes(search.toLowerCase())
    const matchLanguage = selectedLanguage === ALLE || project.language === selectedLanguage
    const matchScene = selectedScene === ALLE || project.scene === selectedScene
    return matchSearch && matchLanguage && matchScene
  })

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-4xl mx-auto">
      <PageTitle title={t(ui.projectsTitle)} color={pageColors.projects} skizze="bildschirm" />

      <div className="flex items-center gap-5 mb-10">
        <p className="text-gray-500 text-lg" style={{ transform: 'rotate(-0.3deg)' }}>
          {t(ui.projectsIntro)}
        </p>
        <Skizze art="gluehbirne" farbe={pageColors.projects} groesse={54} />
      </div>

      {/* Suchfeld und der Knopf der die Filter auf- und zuklappt */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder={t(ui.search)}
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
          {t(ui.filter)}
        </button>
      </div>

      {/* Die Filter sieht man nur wenn showFilter true ist */}
      {showFilter && (
        <div className="box flex flex-wrap gap-6 sm:gap-8 p-4 mb-6">
          <div>
            <p className="text-sm text-gray-400 mb-2">{t(ui.filterLang)}</p>
            {languages.map(language => (
              <button
                key={language}
                onClick={() => setSelectedLanguage(language)}
                className="pill block mb-1"
                style={{ background: selectedLanguage === language ? pageColors.projects : 'transparent' }}
              >
                {language === ALLE ? t(ui.all) : language}
              </button>
            ))}
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">{t(ui.filterScene)}</p>
            {scenes.map(scene => (
              <button
                key={scene}
                onClick={() => setSelectedScene(scene)}
                className="pill block mb-1"
                style={{ background: selectedScene === scene ? pageColors.projects : 'transparent' }}
              >
                {bereichText(scene)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Auf dem Handy eine Spalte, ab 768px zwei */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {filtered.map((project, i) => (
          <div
            key={project.id}
            onClick={() => setOpenProject(project)}
            className="cursor-pointer"
          >
            <Postit
              colors={postitColors.yellow}
              rotate={i % 2 === 0 ? -0.8 : 0.8}
              verzoegerung={i * 70}
            >
              <p className="sniglet-bold text-lg mb-2">{t(project.name)}</p>
              <p className="text-sm text-gray-700 mb-4">{t(project.text)}</p>

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
        <p className="text-gray-400">{t(ui.nothingFound)}</p>
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
