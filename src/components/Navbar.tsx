import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-black-2000,text-xl font-bold sniglet-regular">
      <div className="flex gap-17">
        <Link to="/" className="text-sm hover:text-gray-500 transition-colors">Home</Link>
        <Link to="/skills" className="text-sm hover:text-gray-500 transition-colors">Skills</Link>
        <Link to="/projects" className="text-sm hover:text-gray-500 transition-colors">Projects</Link>
        <Link to="/story" className="text-sm hover:text-gray-500 transition-colors">Story</Link>
        <Link to="/contact" className="text-sm hover:text-gray-500 transition-colors">Contact</Link>
      </div>
      <Link to="/login" className="text-sm border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
        Login
      </Link>
    </nav>
  )
}

export default Navbar