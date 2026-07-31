import { pageColors } from '../styles/colors'
import { GITHUB_USER } from '../api/github'
import type { Project } from '../types'

// Das Fenster das aufgeht wenn man auf ein Projekt klickt.
// Zeigt den Screenshot, den Text, was ich gelernt habe
// und unten den Link zu GitHub.

interface ProjectModalProps {
  project: Project
  onClose: () => void   // wird aufgerufen wenn das Fenster zu soll
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
  // Den GitHub-Link bauen wir aus dem Repo-Namen zusammen.
  const githubUrl = project.repo
    ? `https://github.com/${GITHUB_USER}/${project.repo}`
    : ''

  return (
    // Der dunkle Hintergrund. Ein Klick darauf schliesst das Fenster.
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 50,
      }}
    >
      {/* stopPropagation sorgt dafuer, dass ein Klick INS Fenster
          es nicht gleich wieder schliesst. */}
      <div
        onClick={event => event.stopPropagation()}
        className="box"
        style={{
          background: '#faf8f4',
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.5rem',
        }}
      >

        {/* Titel und der Schliessen-Knopf */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <p className="sniglet-bold text-2xl">{project.name}</p>
          <button
            onClick={onClose}
            className="pill"
            style={{ cursor: 'pointer', background: 'white', flexShrink: 0 }}
          >
            Schliessen ✕
          </button>
        </div>

        {/* Der Screenshot. Fehlt das Bild, zeigen wir den Platzhalter. */}
        {project.image && (
          <img
            src={project.image}
            alt={`Screenshot von ${project.name}`}
            onError={event => { event.currentTarget.src = '/demos/platzhalter.svg' }}
            className="box mb-6"
            style={{
              width: '100%',
              // Hochkant-Screenshots (z.B. vom Handy) wuerden sonst
              // riesig hoch werden. objectFit passt das Bild ein,
              // ohne es zu verzerren.
              maxHeight: '55vh',
              objectFit: 'contain',
              background: 'white',
              display: 'block',
            }}
          />
        )}

        <p className="text-gray-700 mb-6">{project.text}</p>

        {/* Was ich dabei gelernt habe - in der Skills-Farbe Orange */}
        {project.learned.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-400 text-xs mb-2">Dabei gelernt</p>
            <div className="flex flex-wrap gap-2">
              {project.learned.map(skill => (
                <span
                  key={skill}
                  className="pill"
                  style={{ background: pageColors.skills }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Link zu GitHub - nur wenn es das Projekt dort gibt */}
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pill"
            style={{ background: 'white', padding: '8px 20px', fontSize: '14px' }}
          >
            Auf GitHub ansehen →
          </a>
        )}

      </div>
    </div>
  )
}

export default ProjectModal
