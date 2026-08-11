import Skizze, { type SkizzenArt } from './Skizze'

// Zeigt den Titel einer Seite mit dem farbigen Strich darunter.
// Jede Seite braucht das - darum steht der Code hier nur einmal.

interface PageTitleProps {
  title: string        // z.B. "Meine Projekte"
  color: string        // die Farbe der Seite, kommt aus colors.ts
  skizze?: SkizzenArt  // kleine Zeichnung rechts vom Titel
}

function PageTitle({ title, color, skizze }: PageTitleProps) {
  return (
    <div className="mb-12">
      {/* Titel links, Skizze rechts. Auf dem Handy rutscht sie
          dadurch nicht unter den Titel, sondern bleibt daneben -
          sie ist ja klein. */}
      <div className="flex items-center justify-between gap-4">
        {/* Auf dem Handy kleiner, auf grossen Schirmen gross.
            sm: ab 640px, md: ab 768px Bildschirmbreite. */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl sniglet-bold leading-tight">
          {title}
        </h1>

        {/* Die Skizze am Titel traegt die Farbe der Seite. Nur die
            auf den Post-its bleiben schwarz - dort waere Farbe auf
            Farbe zu unruhig. */}
        {skizze && <Skizze art={skizze} farbe={color} groesse={68} />}
      </div>

      {/* Der Strich unter dem Titel. Die Klasse "strich" laesst ihn
          beim Laden von links nach rechts entstehen - die Drehung
          steckt in der Animation, siehe index.css. */}
      <div
        className="strich"
        style={{
          width: '140px',
          height: '3px',
          background: color,
          borderRadius: '2px',
          marginTop: '8px',
        }}
      />
    </div>
  )
}

export default PageTitle
