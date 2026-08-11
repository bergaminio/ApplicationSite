// Kleine handgezeichnete Skizzen.
//
// Alle nach demselben Muster: nur Striche, keine Flaechen, runde
// Enden, und die Linien sind absichtlich nicht ganz gerade. Das
// passt zum Rest der Seite - gezeichnet statt gebaut.
//
// Die Farbe kommt von aussen, damit jede Seite ihre eigene behaelt.
// stroke="currentColor" waere kuerzer, wuerde aber die Textfarbe
// nehmen und dann waere alles schwarz.
//
// Neue Skizze? Einen Eintrag in ZEICHNUNGEN ergaenzen. Alle sind auf
// ein Feld von 100x100 gezeichnet, dann passen sie zusammen.

export type SkizzenArt = 'klavier' | 'bogen' | 'controller' | 'kamera' | 'laeufer' | 'stift'

const ZEICHNUNGEN: Record<SkizzenArt, React.ReactNode> = {
  // Ein Stueck Klaviatur, leicht schraeg von oben.
  klavier: (
    <>
      <path d="M12 34 L88 30 L88 68 L12 72 Z" />
      <path d="M27 33 L27 71" />
      <path d="M42 32 L42 70" />
      <path d="M57 31 L57 69" />
      <path d="M72 30 L72 69" />
      <path d="M22 33 L22 52 L33 51 L33 32" />
      <path d="M37 32 L37 51 L48 50 L48 31" />
      <path d="M67 31 L67 49 L78 48 L78 30" />
    </>
  ),

  // Bogen mit aufgelegtem Pfeil.
  bogen: (
    <>
      <path d="M32 12 C 62 32, 62 68, 32 88" />
      <path d="M32 12 L32 88" />
      <path d="M32 50 L82 50" />
      <path d="M82 50 L71 44" />
      <path d="M82 50 L71 56" />
      <path d="M38 44 L44 50 L38 56" />
    </>
  ),

  // Gamepad von vorne.
  controller: (
    <>
      <path d="M26 36 C 14 38, 10 56, 16 68 C 20 76, 30 74, 34 66 L38 58 L62 58 L66 66 C 70 74, 80 76, 84 68 C 90 56, 86 38, 74 36 Z" />
      <path d="M27 47 L37 47" />
      <path d="M32 42 L32 52" />
      <circle cx="66" cy="43" r="3.5" />
      <circle cx="75" cy="50" r="3.5" />
    </>
  ),

  // Fotoapparat.
  kamera: (
    <>
      <path d="M14 36 L34 36 L40 27 L62 27 L68 36 L88 36 L88 76 L14 76 Z" />
      <circle cx="51" cy="55" r="15" />
      <circle cx="51" cy="55" r="7" />
      <circle cx="79" cy="44" r="2.5" />
    </>
  ),

  // Strichmaennchen im Laufschritt.
  laeufer: (
    <>
      <circle cx="54" cy="20" r="9" />
      <path d="M52 30 L46 56" />
      <path d="M46 56 L34 78" />
      <path d="M34 78 L24 82" />
      <path d="M47 53 L64 70" />
      <path d="M64 70 L76 68" />
      <path d="M51 37 L69 30" />
      <path d="M69 30 L78 36" />
      <path d="M51 39 L34 40" />
      <path d="M34 40 L28 32" />
    </>
  ),

  // Bleistift, schraeg.
  stift: (
    <>
      <path d="M22 78 L30 58 L74 18 L82 27 L38 67 Z" />
      <path d="M30 58 L38 67" />
      <path d="M22 78 L31 74" />
      <path d="M68 24 L76 33" />
    </>
  ),
}

interface SkizzeProps {
  art: SkizzenArt
  farbe: string
  groesse?: number
  /** Reine Verzierung - Screenreader sollen sie ueberspringen. */
  titel?: string
}

function Skizze({ art, farbe, groesse = 56, titel }: SkizzeProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={groesse}
      height={groesse}
      fill="none"
      stroke={farbe}
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      // Ohne aria-hidden liest ein Screenreader jede Skizze als
      // "Grafik" vor, ohne dass sie etwas beitraegt.
      aria-hidden={titel ? undefined : true}
      role={titel ? 'img' : undefined}
      style={{ flexShrink: 0 }}
    >
      {titel && <title>{titel}</title>}
      {ZEICHNUNGEN[art]}
    </svg>
  )
}

export default Skizze
