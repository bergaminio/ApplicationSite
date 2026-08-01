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
    de: 'Hier liegen meine Noten von der gibb, der BWD und der ICT Lernfactory. Die Zugangsdaten stehen in meiner Bewerbung.',
    en: 'My grades from gibb, BWD and ICT Lernfactory are behind this login. The credentials are in my application.',
  },
  loginUsername:  { de: 'Benutzername', en: 'Username' },
  loginPassword:  { de: 'Passwort', en: 'Password' },
  loginButton:    { de: 'Anmelden', en: 'Sign in' },
  loginLoading:   { de: 'Einen Moment...', en: 'One moment...' },
  loginEmpty:     { de: 'Bitte beides ausfüllen.', en: 'Please fill in both fields.' },
  loginWrong:     { de: 'Benutzername oder Passwort stimmt nicht.', en: 'Username or password is not correct.' },
  loginNoServer: {
    de: 'Der Server antwortet nicht. Läuft das Backend?',
    en: 'The server is not responding. Is the backend running?',
  },
  loginFailed:  { de: 'Das hat nicht geklappt. Bitte nochmal versuchen.', en: 'That did not work. Please try again.' },

  // Angemeldet
  loggedInAs: { de: 'Angemeldet als', en: 'Signed in as' },
  logout:     { de: 'Abmelden', en: 'Sign out' },
  gradesSoon: {
    de: 'Die Noten kommen als Nächstes. Der Login funktioniert schon.',
    en: 'The grades are coming next. The login already works.',
  },

  // Meine Uebersicht (nur fuer den Admin)
  adminTitle:   { de: 'Übersicht', en: 'Overview' },
  adminLink:    { de: 'Wer war da? →', en: 'Who stopped by? →' },
  adminIntro: {
    de: 'Jeder Lehrbetrieb hat ein eigenes Konto. Hier sehe ich, wer sich meine Unterlagen wirklich angeschaut hat.',
    en: 'Every company has its own account. Here I can see who actually looked at my application.',
  },
  adminLoading:  { de: 'Wird geladen...', en: 'Loading...' },
  adminNoRight:  { de: 'Dafür fehlen dir die Rechte.', en: 'You do not have permission for this.' },
  adminNoServer: { de: 'Der Server antwortet nicht.', en: 'The server is not responding.' },
  adminCompanies: { de: 'Lehrbetriebe', en: 'Companies' },
  adminAttempts:  { de: 'Letzte Anmeldeversuche', en: 'Recent sign-in attempts' },
  adminNever:     { de: 'noch nie', en: 'never yet' },
  adminTimes:     { de: '× angemeldet', en: '× signed in' },
  adminLastTime:  { de: 'zuletzt', en: 'last' },
  adminFailed:    { de: 'fehlgeschlagen', en: 'failed' },
  adminOk:        { de: 'erfolgreich', en: 'successful' },
  adminNoAttempts: { de: 'Noch keine Anmeldeversuche.', en: 'No sign-in attempts yet.' },

  // Als Doppelpunkt-Satz gebaut, damit die Grammatik bei jeder
  // Zahl stimmt - "1 von 3 Betrieben haben" waere falsch.
  adminLookedIn:      { de: 'Reingeschaut', en: 'Looked in' },
  adminOf:            { de: 'von', en: 'of' },
  adminCompaniesWord: { de: 'Betrieben', en: 'companies' },

  // Noten
  gradesTitle: { de: 'Noten', en: 'Grades' },
  gradesLink:  { de: 'Meine Noten →', en: 'My grades →' },
  gradesIntro: {
    de: 'Meine aktuellen Noten aus der Ausbildung.',
    en: 'My current grades from my training.',
  },
  gradesEmpty:   { de: 'Noch keine Noten eingetragen.', en: 'No grades entered yet.' },
  gradesAverage: { de: 'Durchschnitt', en: 'Average' },
  gradesOverall: { de: 'Gesamtdurchschnitt', en: 'Overall average' },

  areaEFZ: { de: 'EFZ · Berufsfachschule gibb', en: 'EFZ · gibb vocational school' },
  areaBM:  { de: 'BM · BWD Bern', en: 'Vocational baccalaureate · BWD Bern' },
  areaUEK: { de: 'ÜK · ICT Lernfactory', en: 'Inter-company courses · ICT Lernfactory' },

  // Noten eintragen (nur Admin)
  gradeAdd:      { de: 'Note eintragen', en: 'Add grade' },
  gradeArea:     { de: 'Bereich', en: 'Area' },
  gradeSubject:  { de: 'Fach', en: 'Subject' },
  gradeValue:    { de: 'Note', en: 'Grade' },
  gradeSave:     { de: 'Speichern', en: 'Save' },
  gradeDelete:   { de: 'Löschen', en: 'Delete' },
  gradeInvalid:  { de: 'Fach ausfüllen und eine Note zwischen 1 und 6 wählen.', en: 'Enter a subject and a grade between 1 and 6.' },
  gradeFailed:   { de: 'Speichern hat nicht geklappt.', en: 'Saving did not work.' },

  // Seite nicht gefunden
  notFoundTitle: { de: 'Nicht gefunden', en: 'Not found' },
  notFoundText: {
    de: 'Diese Seite gibt es nicht. Vielleicht ein Tippfehler in der Adresse?',
    en: 'This page does not exist. Maybe a typo in the address?',
  },
  backHome: { de: 'Zurück zur Startseite →', en: 'Back to home →' },
}
