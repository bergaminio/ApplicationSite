// Zeigt den Titel einer Seite mit dem farbigen Strich darunter.
// Jede Seite braucht das - darum steht der Code hier nur einmal.

interface PageTitleProps {
  title: string   // z.B. "Meine Projekte"
  color: string   // die Farbe der Seite, kommt aus colors.ts
}

function PageTitle({ title, color }: PageTitleProps) {
  return (
    <div className="mb-12">
      {/* Auf dem Handy kleiner, auf grossen Schirmen gross.
          sm: ab 640px, md: ab 768px Bildschirmbreite. */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl sniglet-bold leading-tight">
        {title}
      </h1>

      {/* Der Strich unter dem Titel */}
      <div style={{
        width: '140px',
        height: '3px',
        background: color,
        borderRadius: '2px',
        transform: 'rotate(-0.5deg)',
        marginTop: '8px',
      }} />
    </div>
  )
}

export default PageTitle
