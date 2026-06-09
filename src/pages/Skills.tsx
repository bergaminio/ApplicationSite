import { pageColors } from '../styles/colors'

const skills = {
  Frontend: [
    { name: 'HTML', percent: 90 },
    { name: 'CSS', percent: 60 },
  ],
  Backend: [
    { name: 'Java', percent: 10 },
    { name: 'C#', percent: 30 },
  ],
  Tools: [
    { name: 'Git', percent: 80 },
  ],
}

function Skills() {
  return (
    <div className="px-8 py-16 max-w-3xl mx-auto">
      <h1 className="text-7xl sniglet-bold leading-tight">
        My Skills
      </h1>
      <div style={{
        height: '2vh',
        width: '50%',
        background: pageColors.skills,
        transform: 'rotate(-0.5deg)',
        borderRadius: '1vh',
        marginTop: '8px',
        marginBottom: '48px',
      }} />

      <div style={{
        border: '1.5px solid #333',
        borderRadius: '12px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}>
        {Object.entries(skills).map(([category, items]) => (
          <div key={category}>
            <p className="text-gray-400 text-sm mb-3">{category}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items.map((skill) => (
                <div key={skill.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className="text-sm">{skill.name}</span>
                    <span className="text-sm text-gray-400">{skill.percent}%</span>
                  </div>
                  <div style={{
                    height: '6px',
                    background: '#e8e8e8',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${skill.percent}%`,
                      background: pageColors.skills,
                      borderRadius: '3px',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Skills