import { useEffect, useRef } from 'react'
import { pageColors } from '../styles/colors'
import { GITHUB_USER } from '../api/github'
import { useSprache } from '../context/LanguageContext'
import { ui } from '../texts'
import type { Project } from '../types'

// Das Fenster das aufgeht wenn man auf ein Projekt klickt.
// Zeigt den Screenshot, den Text, was ich gelernt habe
// und unten den Link zu GitHub.
//
// Ein Fenster, das sich vor die Seite legt, braucht drei Dinge, die
// man mit der Maus gar nicht bemerkt:
//
// 1. Escape schliesst es. Ohne das sitzt man mit der Tastatur darin
//    fest und kommt nur mit der Maus wieder heraus.
// 2. Der Fokus muss hinein und darin bleiben. Sonst tabbt man weiter
//    durch die Seite DAHINTER, die man gar nicht sieht.
// 3. Der Fokus muss zurueck. Nach dem Schliessen soll man wieder auf
//    dem Projekt stehen, das man geoeffnet hat, und nicht ganz oben
//    von vorne anfangen.

interface ProjectModalProps {
  project: Project
  onClose: () => void   // wird aufgerufen wenn das Fenster zu soll
}

// Was der Browser der Reihe nach fokussieren kann.
const FOKUSSIERBAR =
  'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'

function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { t } = useSprache()
  const fenster = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Wer das Fenster geoeffnet hat, bekommt den Fokus nachher zurueck.
    const vorher = document.activeElement as HTMLElement | null

    // Den Fokus ins Fenster holen. Ohne das bleibt er auf der Karte
    // dahinter und die naechste Tab-Taste laeuft an der Seite entlang,
    // die gerade verdeckt ist.
    fenster.current?.querySelector<HTMLElement>(FOKUSSIERBAR)?.focus()

    function taste(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      // Der Fokusfang: Tab am letzten Element springt wieder aufs
      // erste, Shift+Tab am ersten aufs letzte.
      if (e.key !== 'Tab' || !fenster.current) return

      const ziele = fenster.current.querySelectorAll<HTMLElement>(FOKUSSIERBAR)
      if (ziele.length === 0) return

      const erstes = ziele[0]
      const letztes = ziele[ziele.length - 1]

      if (!e.shiftKey && document.activeElement === letztes) {
        e.preventDefault()
        erstes.focus()
      } else if (e.shiftKey && document.activeElement === erstes) {
        e.preventDefault()
        letztes.focus()
      }
    }

    document.addEventListener('keydown', taste)
    return () => {
      document.removeEventListener('keydown', taste)
      vorher?.focus()
    }
  }, [onClose])

  // Den GitHub-Link bauen wir aus dem Repo-Namen zusammen.
  const githubUrl = project.repo
    ? `https://github.com/${GITHUB_USER}/${project.repo}`
    : ''

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem',
        zIndex: 50,
      }}
    >
      {/* Der dunkle Hintergrund. Ein Klick darauf schliesst das Fenster.

          Bleibt ein div mit onClick und wird kein Knopf. Mit der
          Tastatur schliesst Escape das Fenster, dafuer braucht es
          diese Flaeche nicht, und ein Knopf waere ein zusaetzliches
          Ziel beim Tabben, das nichts erklaert. Er ist reine
          Verzierung, darum aria-hidden.

          Wichtig: er liegt NEBEN dem Fenster und nicht darum herum.
          Als Huelle haette aria-hidden das Fenster gleich mit
          versteckt, und eine Vorlesesoftware haette nichts mehr
          gefunden. */}
      <div
        aria-hidden
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.45)' }}
      />

      <div
        ref={fenster}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fenster-titel"
        className="box p-4 sm:p-6"
        style={{
          position: 'relative',
          background: 'var(--papier)',
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >

        {/* Titel und der Schliessen-Knopf */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 id="fenster-titel" className="sniglet-bold text-xl sm:text-2xl">
            {t(project.name)}
          </h2>
          <button
            onClick={onClose}
            className="pill"
            style={{ cursor: 'pointer', background: 'white', flexShrink: 0 }}
          >
            {t(ui.close)}
          </button>
        </div>

        {/* Der Screenshot. Fehlt das Bild, zeigen wir den Platzhalter.

            alt beschreibt, was zu sehen ist, und wiederholt nicht bloss
            den Projektnamen - der steht als Ueberschrift eine Zeile
            darueber und wuerde sonst zweimal vorgelesen. */}
        {project.image && (
          <img
            src={project.image}
            alt={`${t(ui.screenshotVon)} ${t(project.name)}`}
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

        <p className="text-gray-700 mb-6">{t(project.text)}</p>

        {/* Was ich dabei gelernt habe - weiss wie die Badges auf den
            Karten, damit die Projects-Seite durchgehend gelb bleibt */}
        {project.learned.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-500 text-xs mb-2">{t(ui.learned)}</p>
            <div className="flex flex-wrap gap-2">
              {project.learned.map(skill => (
                <span
                  key={skill}
                  className="pill"
                  style={{ background: 'white' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Die Links unten. Die Live-Fassung steht zuerst und ist
            farbig: sie kann man anklicken und sofort ausprobieren,
            waehrend der Code erst gelesen werden will.

            Beide oeffnen einen neuen Tab. Der Zusatz im Text sagt das
            an, sonst wechselt der Browser fuer jemanden, der den
            Bildschirm nicht sieht, unangekuendigt die Seite. */}
        <div className="flex flex-wrap gap-3">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="pill"
              style={{ background: pageColors.projects, padding: '8px 20px', fontSize: '20px' }}
            >
              {t(ui.viewLive)}
              <span className="nur-vorlesen"> {t(ui.neuerTab)}</span>
            </a>
          )}

          {/* Link zu GitHub - nur wenn es das Projekt dort gibt */}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pill"
              style={{ background: 'white', padding: '8px 20px', fontSize: '20px' }}
            >
              {t(ui.viewOnGithub)}
              <span className="nur-vorlesen"> {t(ui.neuerTab)}</span>
            </a>
          )}
        </div>

      </div>
    </div>
  )
}

export default ProjectModal
