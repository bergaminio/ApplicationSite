// Ein Text in beiden Sprachen.
// Ueberall wo Text auf der Seite steht, wird dieses Paar benutzt.
export interface Text {
  de: string
  en: string
}

// Alle festen Texte der Seite an einem Ort.
// Neuer Text? Hier einen Eintrag ergaenzen und mit t(ui.name) benutzen.
export const ui = {
  // Navigation
  navHome:     { de: 'Start',      en: 'Home' },
  navProjects: { de: 'Projekte',   en: 'Projects' },
  navCV:       { de: 'Lebenslauf', en: 'CV' },
  navContact:  { de: 'Kontakt',    en: 'Contact' },
  navLogin:    { de: 'Login',      en: 'Login' },

  // Startseite
  homeRole:   { de: 'Entwickler in Ausbildung an der BWD Bern', en: 'Developer in training at BWD Bern' },
  homePostit: { de: 'Schau dir meine Projekte an', en: 'Take a look at my projects' },
  homeButton: { de: 'Projekte →', en: 'Projects →' },

  // Projekte
  projectsTitle: { de: 'Meine Projekte', en: 'My projects' },
  projectsIntro: {
    de: 'Ich lerne am liebsten, indem ich Sachen baue. Klick ein Projekt an für den Screenshot und den Code.',
    en: 'I learn best by building things. Click a project for the screenshot and the code.',
  },
  search:       { de: 'Suchen...', en: 'Search...' },
  filter:       { de: 'Filter ▾', en: 'Filter ▾' },
  filterLang:   { de: 'Sprache', en: 'Language' },
  filterScene:  { de: 'Bereich', en: 'Area' },
  all:          { de: 'Alle', en: 'All' },
  nothingFound: { de: 'Nichts gefunden.', en: 'Nothing found.' },

  // Projekt-Fenster
  close:         { de: 'Schliessen ✕', en: 'Close ✕' },
  learned:       { de: 'Dabei gelernt', en: 'What I learned' },
  viewOnGithub:  { de: 'Auf GitHub ansehen →', en: 'View on GitHub →' },
  noDescription: { de: 'Noch keine Beschreibung auf GitHub.', en: 'No description on GitHub yet.' },

  // Bereiche (fuer den Filter)
  scenePrivate: { de: 'privat', en: 'private' },
  sceneOther:   { de: 'anderes', en: 'other' },

  // Lebenslauf
  cvTitle:    { de: 'Lebenslauf', en: 'CV' },
  education:  { de: 'Ausbildung', en: 'Education' },
  experience: { de: 'Erfahrung', en: 'Experience' },
  languages:  { de: 'Sprachen', en: 'Languages' },
  itSkills:   { de: 'IT-Kenntnisse', en: 'IT skills' },
  hobbies:    { de: 'Hobbys', en: 'Hobbies' },

  // Kontakt
  contactTitle: { de: 'Kontakt', en: 'Contact' },
  labelName:    { de: 'Name', en: 'Name' },
  labelEmail:   { de: 'E-Mail', en: 'Email' },
  labelPhone:   { de: 'Telefon', en: 'Phone' },
  labelPlace:   { de: 'Ort', en: 'Location' },

  // Login
  loginTitle: { de: 'Login', en: 'Login' },
  loginText: {
    de: 'Hier kommt bald der Login. Danach sieht man meine Noten von der gibb, der BWD und der ICT Lernfactory.',
    en: 'The login is coming soon. After that you can see my grades from gibb, BWD and ICT Lernfactory.',
  },

  // Seite nicht gefunden
  notFoundTitle: { de: 'Nicht gefunden', en: 'Not found' },
  notFoundText: {
    de: 'Diese Seite gibt es nicht. Vielleicht ein Tippfehler in der Adresse?',
    en: 'This page does not exist. Maybe a typo in the address?',
  },
  backHome: { de: 'Zurück zur Startseite →', en: 'Back to home →' },
}
