import { pageColors } from '../styles/colors'
import PageTitle from '../components/PageTitle'

function Skills() {
  return (
    <div className="px-8 py-16 max-w-3xl mx-auto">
      <PageTitle title="My Skills" color={pageColors.skills} />
    </div>
  )
}

export default Skills
