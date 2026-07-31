import { useState } from 'react'
import { pageColors, postitColors } from '../styles/colors'
import Postit from '../components/Postit'
import PageTitle from '../components/PageTitle'

// Meine Projekte.
const projects = [
  { id: 1, name: 'Java Project 1', language: 'Java', scene: 'gibb', description: 'A backend application built with Java.' },
  { id: 2, name: 'Java Project 2', language: 'Java', scene: 'private', description: 'A personal Java project WITH MY BUDDY THIERRY.' },
  { id: 3, name: 'Web Portfolio', language: 'CSS', scene: 'private', description: 'My personal portfolio website.' },
  { id: 4, name: 'C# App', language: 'C#', scene: 'gibb', description: 'A school project in C#.' },
]

// Die Auswahl in den Filtern.
const languages = ['All', 'Java', 'CSS', 'C#', 'Python']
const scenes = ['All', 'private', 'gibb', 'smt', 'else']

function Projects() {
  const [search, setSearch] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [selectedScene, setSelectedScene] = useState('All')
  const [showFilter, setShowFilter] = useState(false)

  // Behalte nur die Projekte die zur Suche und zu beiden Filtern passen.
  const filtered = projects.filter(project => {
    const matchSearch = project.name.toLowerCase().includes(search.toLowerCase())
    const matchLanguage = selectedLanguage === 'All' || project.language === selectedLanguage
    const matchScene = selectedScene === 'All' || project.scene === selectedScene
    return matchSearch && matchLanguage && matchScene
  })

  return (
    <div className="px-8 py-16 max-w-4xl mx-auto">
      <PageTitle title="My Projects" color={pageColors.projects} />

      {/* Suchfeld und der Knopf der die Filter auf- und zuklappt */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
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
        <div className="box flex gap-8 p-4 mb-6">
          <div>
            <p className="text-sm text-gray-400 mb-2">Language</p>
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
            <p className="text-sm text-gray-400 mb-2">Scene</p>
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

      {/* Fuer jedes gefundene Projekt ein Post-it */}
      <div className="grid grid-cols-2 gap-6">
        {filtered.map((project, i) => (
          <Postit
            key={project.id}
            colors={postitColors.yellow}
            rotate={i % 2 === 0 ? -0.8 : 0.8}
          >
            <p className="sniglet-bold text-lg mb-2">{project.name}</p>
            <p className="text-sm text-gray-600 mb-4">{project.description}</p>
            <div className="flex gap-2">
              <span className="pill" style={{ background: 'white' }}>{project.language}</span>
              <span className="pill" style={{ background: 'white' }}>{project.scene}</span>
            </div>
          </Postit>
        ))}
      </div>
    </div>
  )
}

export default Projects
