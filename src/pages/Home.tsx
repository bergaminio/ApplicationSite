import { Link } from 'react-router-dom'
import { pageColors } from '../styles/colors'

function Home() {
  return (
    <div className="px-8 py-16 max-w-3xl mx-auto">

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <h1 className="text-7xl sniglet-abold leading-tight" style={{ color: pageColors.home }}>
          Michael
        </h1>
        <h1 className="text-7xl sniglet-bold leading-tight">
          Bergamin
        </h1>
        <div style={{
          position: 'absolute',
          bottom: '-20px',
          left: '0',
          width: '140%',
          height: '8px',
          background: pageColors.home,
          transform: 'rotate(-0.5deg)',
          borderRadius: '2px',
        }} />
      </div>

      <p className="text-gray-500 mt-8 text-lg" style={{ transform: 'rotate(-0.3deg)' }}>
        Developer Student at BWD Bern
      </p>

      <div className="mt-16" style={{
        transform: 'rotate(-1deg)',
        filter: 'drop-shadow(4px 4px 0px #c8a000)',
        display: 'inline-block',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '20px',
          height: '20px',
          background: '#8a6500',
          clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
          zIndex: 1,
        }} />
        <div className="p-8" style={{
          background: pageColors.projects,
          border: '1.5px solid #333',
          borderRadius: '4px',
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
        }}>
          <p className="text-gray-700 mb-6 text-lg" style={{ transform: 'rotate(0.5deg)' }}>
            Browse through my projects
          </p>
          <Link
            to="/projects"
            className="text-sm px-6 py-2 transition-colors"
            style={{
              border: '1.5px solid #333',
              borderRadius: '999px',
              background: 'white',
            }}
          >
            Projects →
          </Link>
        </div>
      </div>

    </div>
  )
}

export default Home