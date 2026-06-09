import { pageColors } from '../styles/colors'

function Contact() {
  return (
    <div className="px-8 py-16 max-w-3xl mx-auto">
      <h1 className="text-7xl sniglet-bold leading-tight">
        Contact
      </h1>
      <div style={{
        height: '3px',
        width: '140px',
        background: pageColors.contact,
        transform: 'rotate(-0.5deg)',
        borderRadius: '2px',
        marginTop: '8px',
        marginBottom: '48px',
      }} />

      <div style={{
        border: '1.5px solid #333',
        borderRadius: '16px',
        padding: '2rem',
        display: 'flex',
        gap: '2rem',
        alignItems: 'flex-start',
      }}>

        {/* Foto */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '8px',
          background: pageColors.contact,
          border: '1.5px solid #333',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
        }}>
          MB
        </div>

        {/* Infos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <p className="text-gray-400 text-xs mb-1">Name</p>
            <p className="sniglet-bold">Michael Bergamin</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Email</p>
            <p>michael.bergamin@protonmail.com</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Number</p>
            <p>+41 76 537 56 30</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Location</p>
            <p>3232 Ins, Schweiz</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Contact