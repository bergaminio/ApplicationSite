import { useState } from 'react'
import { pageColors } from '../styles/colors'

const events = [
  { id: 1, year: '2022', title: 'IMS Start', description: 'Beginn der Ausbildung an der Informations-Mittelschule in Bern.' },
  { id: 2, year: '2023', title: 'Erste Projekte', description: 'Erste Java und Web-Projekte an der gibb.' },
  { id: 3, year: '2024', title: 'Portfolio', description: 'Aufbau meiner persönlichen Portfolio-Website.' },
  { id: 4, year: '2025', title: 'Now', description: 'Auf der Suche nach einem spannenden Praktikum.' },
]

function Story() {
  const [activeEvent, setActiveEvent] = useState<number | null>(null)

  return (
    <div className="px-8 py-16 max-w-3xl mx-auto">
      <h1 className="text-7xl sniglet-bold leading-tight">
        My Story
      </h1>
      <div style={{
        height: '2vh',
        width: '55%',
        background: pageColors.story,
        transform: 'rotate(-0.5deg)',
        borderRadius: '2px',
        marginTop: '8px',
        marginBottom: '64px',
      }} />

      <div style={{ position: 'relative' }}>

        {/* Schlängelnde Linie */}
        <svg
          width="100%"
          height={events.length * 160}
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
        >
          <path
            d={`M 80 20 C 300 80, 100 200, 280 280 C 460 360, 80 440, 200 520`}
            fill="none"
            stroke={pageColors.story}
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />
        </svg>

        {/* Events */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {events.map((event, i) => (
            <div
              key={event.id}
              style={{
                display: 'flex',
                justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end',
                marginBottom: '3rem',
                paddingLeft: i % 2 === 0 ? '0' : '0',
              }}
            >
              <div
                onClick={() => setActiveEvent(activeEvent === event.id ? null : event.id)}
                style={{
                  background: activeEvent === event.id ? pageColors.story : 'white',
                  border: `2px solid ${pageColors.story}`,
                  borderRadius: '999px',
                  padding: '0.75rem 1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  maxWidth: '60%',
                }}
              >
                <p className="sniglet-bold text-sm" style={{ color: '#333' }}>
                  {event.year} · {event.title}
                </p>
                {activeEvent === event.id && (
                  <p className="text-sm mt-2" style={{ color: '#444' }}>
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Story