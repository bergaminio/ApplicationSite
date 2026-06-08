import { PageColorContext } from '../context/PageColorContext'
import { pageColors } from '../styles/colors'

function Home() {
  return (
    <PageColorContext.Provider value={{ color: pageColors.home }}>
      <div className="px-8 py-16 max-w-3xl mx-auto">
        <h1 className="text-6xl font-bold sniglet-extrabold">
          Michael
        </h1>
        <h1 className="text-6xl font-bold sniglet-extrabold">
          Bergamin
        </h1>
        <p className="text-gray-500 mt-4 text-lg">
          Developer Student at BWD Bern
        </p>

        <div className="mt-12 border border-gray-300 rounded-2xl p-8 inline-block">
          <p className="text-gray-600 mb-4">Browse through my projects</p>
          <a
            href="/projects"
            className="border border-gray-800 rounded-full px-6 py-2 text-sm hover:bg-gray-100 transition-colors"
          >
            Projects
          </a>
        </div>
      </div>
    </PageColorContext.Provider>
  )
}

export default Home