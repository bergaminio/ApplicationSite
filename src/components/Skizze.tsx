import { useId } from 'react'

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

export type SkizzenArt =
  | 'klavier' | 'bogen' | 'controller' | 'kamera' | 'laeufer' | 'stift'
  | 'buch' | 'bildschirm' | 'gluehbirne' | 'brief' | 'schluessel'
  | 'urkunde' | 'fragezeichen' | 'kaffee' | 'wegweiser'

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

  // Aufgeschlagenes Buch, von vorne.
  buch: (
    <>
      <path d="M50 32 C 40 24, 24 22, 12 26 L12 74 C 24 70, 40 72, 50 80" />
      <path d="M50 32 C 60 24, 76 22, 88 26 L88 74 C 76 70, 60 72, 50 80" />
      <path d="M50 32 L50 80" />
      <path d="M20 38 L40 40" />
      <path d="M20 50 L40 52" />
      <path d="M60 40 L80 38" />
      <path d="M60 52 L80 50" />
    </>
  ),

  // Bildschirm mit ein paar Zeilen Code.
  bildschirm: (
    <>
      <path d="M12 24 L88 24 L88 68 L12 68 Z" />
      <path d="M38 68 L36 80 L64 80 L62 68" />
      <path d="M28 80 L72 80" />
      <path d="M24 36 L30 42 L24 48" />
      <path d="M36 48 L52 48" />
      <path d="M62 36 L76 36" />
      <path d="M62 44 L70 44" />
    </>
  ),

  // Gluehbirne, fuer eine Idee.
  gluehbirne: (
    <>
      <path d="M50 14 C 33 14, 22 26, 22 40 C 22 52, 32 58, 36 68 L64 68 C 68 58, 78 52, 78 40 C 78 26, 67 14, 50 14 Z" />
      <path d="M38 74 L62 74" />
      <path d="M40 82 L60 82" />
      <path d="M42 68 C 42 52, 58 52, 58 68" />
    </>
  ),

  // Briefumschlag.
  brief: (
    <>
      <path d="M12 28 L88 28 L88 74 L12 74 Z" />
      <path d="M12 28 L50 54 L88 28" />
      <path d="M12 74 L40 50" />
      <path d="M88 74 L60 50" />
    </>
  ),

  // Schluessel, fuer den geschuetzten Bereich.
  schluessel: (
    <>
      <circle cx="30" cy="42" r="16" />
      <circle cx="30" cy="42" r="5" />
      <path d="M44 50 L82 76" />
      <path d="M66 62 L60 72" />
      <path d="M75 68 L69 78" />
    </>
  ),

  // Urkunde mit Siegel, fuer die Noten.
  urkunde: (
    <>
      <path d="M20 14 L74 14 L74 72 L20 72 Z" />
      <path d="M30 30 L64 30" />
      <path d="M30 42 L64 42" />
      <path d="M30 54 L50 54" />
      <circle cx="70" cy="68" r="12" />
      <path d="M64 78 L62 90 L70 85 L78 90 L76 78" />
    </>
  ),

  // Fragezeichen, fuer die Seite die es nicht gibt.
  fragezeichen: (
    <>
      <path d="M34 34 C 34 20, 46 14, 54 16 C 66 19, 70 32, 60 42 C 52 50, 50 54, 50 64" />
      <circle cx="50" cy="80" r="3" />
    </>
  ),

  // Kaffeetasse.
  kaffee: (
    <>
      <path d="M22 36 L74 36 L70 76 L26 76 Z" />
      <path d="M74 44 C 88 44, 88 62, 74 62" />
      <path d="M38 18 C 34 24, 42 26, 38 32" />
      <path d="M54 16 C 50 22, 58 24, 54 30" />
    </>
  ),

  // Wegweiser, fuer den Lebenslauf.
  wegweiser: (
    <>
      <path d="M46 20 L46 86" />
      <path d="M46 28 L78 28 L84 36 L78 44 L46 44" />
      <path d="M46 54 L20 54 L14 62 L20 70 L46 70" />
      <path d="M32 86 L60 86" />
    </>
  ),
}

// Die Farbe aller Skizzen. Steht nur hier, damit man sie an einer
// Stelle aendert. Kein reines Schwarz: das wirkt auf Papier hart,
// und der Rest der Seite ist auch nicht #000.
export const SKIZZENFARBE = '#1c1c1c'

// Damit die Skizzen nicht wie am Lineal gezogen aussehen.
//
// Statt jede Zeichnung von Hand krumm zu machen, verzieht ein Filter
// alle Linien ein wenig: feTurbulence erzeugt ein zufaelliges Rauschen,
// feDisplacementMap schiebt damit jeden Punkt der Zeichnung ein paar
// Zehntel zur Seite. Das Ergebnis sieht aus wie mit der Hand gezogen.
//
// baseFrequency steuert, wie oft die Linie die Richtung wechselt.
// scale steuert, wie weit sie abweicht. Beides bewusst klein: mehr
// und die Zeichnungen wirken zittrig statt handgemacht.
function Wackelfilter({ id }: { id: string }) {
  return (
    <filter id={id} x="-15%" y="-15%" width="130%" height="130%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={7} result="rauschen" />
      <feDisplacementMap in="SourceGraphic" in2="rauschen" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  )
}

// Ein leichter Schiefstand, damit nicht alle Skizzen exakt gerade
// stehen. Aus dem Namen gerechnet statt zufaellig: sonst wuerde jede
// Skizze bei jedem Neuzeichnen anders kippen und die Seite zappeln.
function neigung(art: string) {
  let summe = 0
  for (const zeichen of art) summe += zeichen.charCodeAt(0)
  return (summe % 7) - 3   // -3 bis +3 Grad
}

interface SkizzeProps {
  art: SkizzenArt
  /** Standard ist Schwarz. Ausserhalb der Post-its die Seitenfarbe. */
  farbe?: string
  groesse?: number
  /** Reine Verzierung - Screenreader sollen sie ueberspringen. */
  titel?: string
}

function Skizze({ art, farbe = SKIZZENFARBE, groesse = 56, titel }: SkizzeProps) {
  // Jede Skizze braucht ihre eigene Filter-Nummer. Zweimal dieselbe
  // waere ungueltiges HTML, und der Browser nimmt dann irgendeine.
  const filterId = useId()

  return (
    <svg
      viewBox="0 0 100 100"
      width={groesse}
      height={groesse}
      fill="none"
      stroke={farbe}
      // Etwas dicker als vorher: der Filter frisst an duennen Linien.
      strokeWidth={3.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      // Ohne aria-hidden liest ein Screenreader jede Skizze als
      // "Grafik" vor, ohne dass sie etwas beitraegt.
      aria-hidden={titel ? undefined : true}
      role={titel ? 'img' : undefined}
      style={{ flexShrink: 0, transform: `rotate(${neigung(art)}deg)` }}
    >
      {titel && <title>{titel}</title>}
      <defs>
        <Wackelfilter id={filterId} />
      </defs>
      <g filter={`url(#${filterId})`}>{ZEICHNUNGEN[art]}</g>
    </svg>
  )
}

export default Skizze
