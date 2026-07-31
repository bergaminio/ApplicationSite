// Holt meine öffentlichen Repos von GitHub.
//
// Wichtig: hier darf NIE ein GitHub-Token stehen. Alles was im Frontend
// steht, kann jeder Besucher im Browser lesen. Ohne Token sieht man
// darum nur öffentliche Repos - private gehen erst über ein Backend.

export const GITHUB_USER = 'bergaminio'

const CACHE_KEY = 'github-repos'
const CACHE_DAUER = 60 * 60 * 1000  // eine Stunde, in Millisekunden

// So sieht eine Antwort von GitHub aus (nur die Felder die wir brauchen).
export interface Repo {
  name: string
  description: string | null
  language: string | null
  html_url: string
  topics: string[]
}

export async function loadRepos(): Promise<Repo[]> {
  // Zuerst schauen ob wir die Antwort schon gespeichert haben.
  // GitHub erlaubt ohne Token nur 60 Anfragen pro Stunde - darum merken
  // wir uns das Ergebnis eine Stunde lang im Browser.
  const gespeichert = localStorage.getItem(CACHE_KEY)
  if (gespeichert) {
    try {
      const { zeit, repos } = JSON.parse(gespeichert)
      if (Date.now() - zeit < CACHE_DAUER) {
        return repos
      }
    } catch {
      // Kaputter Eintrag - einfach ignorieren und neu laden.
    }
  }

  const antwort = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated`)
  if (!antwort.ok) {
    throw new Error('GitHub antwortet nicht')
  }

  const repos: Repo[] = await antwort.json()
  localStorage.setItem(CACHE_KEY, JSON.stringify({ zeit: Date.now(), repos }))
  return repos
}
