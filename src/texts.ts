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
  navPersonal: { de: 'Persönliches', en: 'Personal' },
  navContact:  { de: 'Kontakt',    en: 'Contact' },
  navLogin:    { de: 'Login',      en: 'Login' },

  // Startseite
  homeRole:   { de: 'Entwickler in Ausbildung an der BWD Bern', en: 'Developer in training at BWD Bern' },
  homePostit: { de: 'Schau dir meine Projekte an', en: 'Take a look at my projects' },
  homeButton: { de: 'Projekte →', en: 'Projects →' },

  // Projekte
  projectsTitle: { de: 'Meine Projekte', en: 'My projects' },
  projectsIntro: {
    de: 'Ich lerne am liebsten, indem ich Sachen baue. Klick ein Projekt an, dann siehst du den Screenshot und den Code.',
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
  sideJobs:   { de: 'Nebenjobs & Freiwilligenarbeit', en: 'Side jobs & volunteer work' },
  languages:  { de: 'Sprachen', en: 'Languages' },
  itSkills:   { de: 'IT-Kenntnisse', en: 'IT skills' },
  hobbies:    { de: 'Hobbys', en: 'Hobbies' },

  // Persönliches
  personalTitle: { de: 'Persönliches', en: 'Personal' },
  personalIntro: {
    de: 'Was mich neben dem Programmieren beschäftigt.',
    en: 'What keeps me busy besides programming.',
  },
  fotoZurueck: { de: 'Vorheriges Bild', en: 'Previous photo' },
  fotoWeiter:  { de: 'Nächstes Bild', en: 'Next photo' },
  fotosFehlen: {
    de: 'Die Bilder sind noch nicht abgelegt.',
    en: 'The photos are not in place yet.',
  },
  audioFehlt: {
    de: 'Die Aufnahme liegt noch nicht bereit.',
    en: 'The recording is not available yet.',
  },

  // Kontakt
  contactTitle: { de: 'Kontakt', en: 'Contact' },
  labelName:    { de: 'Name', en: 'Name' },
  labelEmail:   { de: 'E-Mail', en: 'Email' },
  labelPhone:   { de: 'Telefon', en: 'Phone' },
  labelPlace:   { de: 'Ort', en: 'Location' },
  phoneAfterLogin: {
    de: 'Nach dem Anmelden sichtbar',
    en: 'Visible after signing in',
  },

  // Impressum - steht unten auf der Kontakt-Seite
  imprint:            { de: 'Impressum', en: 'Legal notice' },
  imprintResponsible: { de: 'Verantwortlich für den Inhalt', en: 'Responsible for the content' },
  imprintPurpose:     { de: 'Zweck der Seite', en: 'Purpose of this site' },
  imprintPurposeText: {
    de: 'Persönliche Bewerbungswebsite. Entstanden im Rahmen der Ausbildung an der Informatikmittelschule der BWD Bern.',
    en: 'Personal application website. Created during my training at the IMS, BWD Bern.',
  },
  imprintHosting:     { de: 'Gehostet bei', en: 'Hosted at' },
  imprintSource:      { de: 'Quellcode', en: 'Source code' },
  imprintSourceText: {
    de: 'Diese Seite ist offen einsehbar auf GitHub.',
    en: 'The code of this site is public on GitHub.',
  },

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
    de: 'Der Anmelde-Bereich ist gerade nicht erreichbar. Bitte später nochmal versuchen.',
    en: 'The sign-in area is currently unavailable. Please try again later.',
  },

  // Wird gezeigt, solange das Backend noch nicht laeuft
  loginChecking: { de: 'Einen Moment...', en: 'One moment...' },
  loginSoonTitle: { de: 'Dieser Bereich entsteht gerade', en: 'This area is being built' },
  loginSoonText: {
    de: 'Dahinter kommen meine Noten von der gibb, der BWD und der ICT Lernfactory — geschützt durch eine eigene Anmeldung mit Java Spring Boot, PostgreSQL und JWT-Token. Sobald der Server läuft, steht hier das Anmeldeformular.',
    en: 'Behind this will be my grades from gibb, BWD and ICT Lernfactory — protected by my own sign-in built with Java Spring Boot, PostgreSQL and JWT tokens. As soon as the server is running, the sign-in form will appear here.',
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
    de: 'Die offiziellen Notenausweise aus meiner Ausbildung, so wie ich sie erhalten habe.',
    en: 'The official grade reports from my training, exactly as I received them.',
  },
  gradesEmpty:   { de: 'Noch keine Notenausweise hochgeladen.', en: 'No grade reports uploaded yet.' },
  gradesOpenPdf: { de: 'PDF öffnen', en: 'Open PDF' },
  gradesLoadingFile: { de: 'Wird geladen...', en: 'Loading...' },
  gradesFileFailed:  { de: 'Datei konnte nicht geladen werden.', en: 'File could not be loaded.' },

  areaEFZ: { de: 'EFZ · Berufsfachschule gibb', en: 'EFZ · gibb vocational school' },
  areaBM:  { de: 'BM · BWD Bern', en: 'Vocational baccalaureate · BWD Bern' },
  areaUEK: { de: 'ÜK · ICT Lernfactory', en: 'Inter-company courses · ICT Lernfactory' },

  // Notenausweis hochladen (nur Admin)
  docAdd:       { de: 'Notenausweis hochladen', en: 'Upload grade report' },
  docTitle:     { de: 'Titel, z.B. Notenausweis 2. Semester', en: 'Title, e.g. grade report semester 2' },
  docUpload:    { de: 'Hochladen', en: 'Upload' },
  docUploading: { de: 'Wird hochgeladen...', en: 'Uploading...' },
  docDelete:    { de: 'Löschen', en: 'Delete' },
  docNeedAll:   { de: 'Titel eingeben und eine Datei auswählen.', en: 'Enter a title and choose a file.' },
  docTypes:     { de: 'JPG, PNG, WEBP oder PDF, höchstens 10 MB', en: 'JPG, PNG, WEBP or PDF, max 10 MB' },
  docTooBig:    { de: 'Die Datei ist grösser als 10 MB.', en: 'The file is larger than 10 MB.' },
  docFailed:    { de: 'Das hat nicht geklappt.', en: 'That did not work.' },

  // Seite nicht gefunden
  notFoundTitle: { de: 'Nicht gefunden', en: 'Not found' },
  notFoundText: {
    de: 'Diese Seite gibt es nicht. Vielleicht ein Tippfehler in der Adresse?',
    en: 'This page does not exist. Maybe a typo in the address?',
  },
  backHome: { de: 'Zurück zur Startseite →', en: 'Back to home →' },
}
