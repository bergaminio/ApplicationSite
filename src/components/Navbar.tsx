import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/skills">Skills</Link>
      <Link to="/projects">Projects</Link>
      <Link to="/story">Story</Link>
      <Link to="/contact">Contact</Link>
      <Link to="/login">Login</Link>
    </nav>
  )
}

export default Navbar