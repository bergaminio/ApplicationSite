import { useState } from 'react'
import { pageColors } from '../styles/colors'
import Postit from '../components/Postit'

const projects = [
  { id: 1, name: 'Java Project 1', language: 'Java', scene: 'gibb', description: 'A backend application built with Java.' },
  { id: 2, name: 'Java Project 2', language: 'Java', scene: 'private', description: 'A personal Java project WITH MY BUDDY THIERRY.' },
  { id: 3, name: 'Web Portfolio', language: 'CSS', scene: 'private', description: 'My personal portfolio website.' },
  { id: 4, name: 'C# App', language: 'C#', scene: 'gibb', description: 'A school project in C#.' },
]

const languages = ['All', 'Java', 'CSS', 'C#', 'Python']
const scenes = ['All', 'private', 'gibb', 'smt', 'else']

function Projects() {
  const [search, setSearch] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [selectedScene, setSelectedScene] = useState('All')
  const [showFilter, setShowFilter] = useState(false)

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchLang = selectedLanguage === 'All' || p.language === selectedLanguage
    const matchScene = selectedScene === 'All' || p.scene === selectedScene
    return matchSearch && matchLang && matchScene
  })

  return (
    <div className="px-8 py-16 max-w-4xl mx-auto">
      <h1 className="text-7xl sniglet-bold leading-tight">
        My Projects
      </h1>
      <div style={{
        height: '2vh',
        width: '70%',
        background: pageColors.projects,
        transform: 'rotate(-0.5deg)',
        borderRadius: '2vh',
        marginTop: '8px',
        marginBottom: '48px',
      }} />

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1,
            border: '1.5px solid #333',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            background: 'transparent',
            fontFamily: 'inherit',
          }}
        />
        <button
          onClick={() => setShowFilter(!showFilter)}
          style={{
            border: '1.5px solid #333',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            background: showFilter ? pageColors.projects : 'transparent',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Filter ▾
        </button>
      </div>

      {/* Filter */}
      {showFilter && (
        <div style={{
          border: '1.5px solid #333',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '2rem',
        }}>
          <div>
            <p className="text-sm text-gray-400 mb-2">Language</p>
            {languages.map(l => (
              <button
                key={l}
                onClick={() => setSelectedLanguage(l)}
                style={{
                  display: 'block',
                  marginBottom: '4px',
                  border: '1.5px solid #333',
                  borderRadius: '999px',
                  padding: '2px 12px',
                  fontSize: '12px',
                  background: selectedLanguage === l ? pageColors.projects : 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {l}
              </button>
            ))}
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Scene</p>
            {scenes.map(s => (
              <button
                key={s}
                onClick={() => setSelectedScene(s)}
                style={{
                  display: 'block',
                  marginBottom: '4px',
                  border: '1.5px solid #333',
                  borderRadius: '999px',
                  padding: '2px 12px',
                  fontSize: '12px',
                  background: selectedScene === s ? pageColors.projects : 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Project Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
      }}>
        {filtered.map((project, i) => (
          <Postit
            key={project.id}
            color={pageColors.projects}
            shadowColor="#c8a000"
            cornerColor="#8a6500"
            rotate={i % 2 === 0 ? -0.8 : 0.8}
          >
            <p className="sniglet-bold text-lg mb-2">{project.name}</p>
            <p className="text-sm text-gray-600 mb-4">{project.description}</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{
                border: '1.5px solid #333',
                borderRadius: '999px',
                padding: '2px 10px',
                fontSize: '11px',
                background: 'white',
              }}>{project.language}</span>
              <span style={{
                border: '1.5px solid #333',
                borderRadius: '999px',
                padding: '2px 10px',
                fontSize: '11px',
                background: 'white',
              }}>{project.scene}</span>
            </div>
          </Postit>
        ))}
      </div>
    </div>
  )
}

export default Projects