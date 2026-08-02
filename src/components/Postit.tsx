// Ein Post-it Zettel mit abgeknickter Ecke oben rechts.
// Die Farben kommen als Paket aus colors.ts, z.B. postitColors.yellow

interface PostitProps {
  colors: {
    main: string     // Farbe vom Zettel
    shadow: string   // Schatten dahinter
    corner: string   // die abgeknickte Ecke
  }
  rotate?: number    // wie schief der Zettel liegt, in Grad. Standard: gerade
  // Wie lange der Zettel wartet, bis er hereinfaellt (in Millisekunden).
  // Damit fallen mehrere Zettel nacheinander statt alle gleichzeitig.
  verzoegerung?: number
  children: React.ReactNode
}

// Diese Form schneidet oben rechts eine Ecke weg.
const cutCorner = 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)'

function Postit({ colors, rotate = 0, verzoegerung = 0, children }: PostitProps) {
  return (
    // Aeussere Schicht nur fuer die Animation. Die Drehung bleibt
    // eine Schicht weiter innen, sonst kommen sich die beiden
    // transform-Angaben in die Quere.
    <div className="postit-rein" style={{ animationDelay: `${verzoegerung}ms` }}>
      <div style={{
        position: 'relative',
        width: '100%',
        transform: `rotate(${rotate}deg)`,
      }}>
      {/* Der Schatten liegt als eigene Schicht dahinter, leicht versetzt */}
      <div style={{
        position: 'absolute',
        top: '4px',
        left: '4px',
        right: '-4px',
        bottom: '-4px',
        background: colors.shadow,
        clipPath: cutCorner,
        borderRadius: '4px',
      }} />

      {/* Der Zettel selbst */}
      <div style={{
        position: 'relative',
        background: colors.main,
        border: '1.5px solid #333',
        borderRadius: '4px',
        padding: '1.5rem',
        clipPath: cutCorner,
      }}>
        {/* Das Dreieck in der abgeknickten Ecke */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '20px',
          height: '20px',
          background: colors.corner,
          clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
        }} />
        {children}
        </div>
      </div>
    </div>
  )
}

export default Postit
