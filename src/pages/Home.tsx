import { Link } from 'react-router-dom'
import { pageColors, postitColors } from '../styles/colors'
import Postit from '../components/Postit'
import { useSprache } from '../context/LanguageContext'
import { ui } from '../texts'

function Home() {
  const { t } = useSprache()

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">

      {/* Der Name mit dem roten Strich darunter */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <h1 className="text-5xl sm:text-6xl md:text-7xl sniglet-bold leading-tight" style={{ color: pageColors.home }}>
          Michael
        </h1>
        <h1 className="text-5xl sm:text-6xl md:text-7xl sniglet-bold leading-tight">
          Bergamin
        </h1>
        <div
          className="strich"
          style={{
            position: 'absolute',
            bottom: '-20px',
            left: 0,
            width: '140%',
            height: '2vh',
            background: pageColors.home,
            borderRadius: '2vh',
          }}
        />
      </div>

      <p
        className="text-gray-500 mt-8 text-lg sanft-rein"
        style={{ animationDelay: '250ms' }}
      >
        {t(ui.homeRole)}
      </p>

      {/* Post-it mit dem Knopf zu den Projekten */}
      <div className="mt-12 sm:mt-16" style={{ maxWidth: '320px' }}>
        <Postit colors={postitColors.yellow} rotate={-1}>
          <p className="text-gray-700 mb-6 text-lg">
            {t(ui.homePostit)}
          </p>
          <Link
            to="/projects"
            className="pill"
            style={{ background: 'white', padding: '8px 24px', fontSize: '14px' }}
          >
            {t(ui.homeButton)}
          </Link>
        </Postit>
      </div>

    </div>
  )
}

export default Home
