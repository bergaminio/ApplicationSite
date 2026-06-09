interface PostitProps {
  color: string
  shadowColor: string
  cornerColor: string
  rotate?: number
  children: React.ReactNode
}

function Postit({ color, shadowColor, cornerColor, rotate = 0, children }: PostitProps) {
  return (
    <div style={{
      transform: `rotate(${rotate}deg)`,
      position: 'relative',
      width: '100%',
    }}>
      {/* Schatten-Schicht */}
      <div style={{
        position: 'absolute',
        top: '4px',
        left: '4px',
        right: '-4px',
        bottom: '-4px',
        background: shadowColor,
        clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
        borderRadius: '4px',
      }} />

      {/* Haupt Post-it */}
      <div style={{
        position: 'relative',
        background: color,
        border: '1.5px solid #333',
        borderRadius: '4px',
        padding: '1.5rem',
        clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
      }}>
        {/* Ecken-Dreieck */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '20px',
          height: '20px',
          background: cornerColor,
          clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
          zIndex: 1,
        }} />
        {children}
      </div>
    </div>
  )
}

export default Postit