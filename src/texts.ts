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
  // Die Seite spricht den Besucher bewusst nirgends direkt an - weder
  // mit du noch mit Sie. Stattdessen Infinitiv ("ansehen") oder erste
  // Person ("ich"). Das bleibt hoeflich, ohne steif zu wirken.
  // Die drei Zettel unten auf der Startseite. Je ein Satz, der sagt,
  // was einen auf der Seite dahinter erwartet.
  homePostit:       { de: 'Fünf Sachen, die ich gebaut habe.', en: "Five things I've built." },
  homePostitCV:     { de: 'Wo ich herkomme und was ich kann.', en: 'Where I come from and what I can do.' },
  homePostitKontakt: { de: 'So erreicht man mich.', en: 'How to reach me.' },
  // Steht auf allen drei Zetteln. Vorher stand dort nochmal der
  // Seitenname, der eine Zeile darueber schon steht.
  homeOeffnen: { de: 'Öffnen →', en: 'Open →' },

  // Der Satz, der die Startseite traegt.
  //
  // Er beschreibt absichtlich ein Gefuehl und keine Faehigkeit. Wer
  // "ich bin motiviert und lernbereit" schreibt, klingt wie zwanzig
  // andere Bewerbungen. Wer den Moment beschreibt, in dem etwas zum
  // ersten Mal funktioniert, trifft jemanden, der ihn selbst kennt.
  //
  // Frueher stand hier "Ich baue Sachen, die es noch nicht gab" -
  // richtig, aber Standardsprache, die man auf jeder zweiten Seite
  // liest.
  homeClaim: {
    de: 'Es gibt diesen einen Moment, in dem der Bildschirm zum ersten Mal zeigt, was ich im Kopf hatte.',
    // "finally" hiess endlich, das deutsche "zum ersten Mal" heisst
    // aber erstmals - zwei verschiedene Aussagen. Und "what was in my
    // head" ist zwar richtig, klingt aber steif. "what I had pictured"
    // trifft beides: den Zeitpunkt und den Ton.
    en: 'There is that one moment when the screen shows exactly what I had pictured.',
  },
  homeClaimZwei: {
    de: 'Für den gebe ich alles.',
    // "Alles geben" ist im Deutschen Sportsprache. "give it my all"
    // ist im Englischen genau dasselbe Bild, deshalb passt es besser
    // als die woertliche Fassung "that is what I give everything for",
    // die im Englischen umstaendlich klingt.
    en: 'For that moment, I give it my all.',
  },
  homeClaimSub: {
    de: 'Eine App, die meine Sprintzeiten per GPS stoppt. Ein Rollenspiel im Browser. Diese Website samt Anmeldung und Datenbank.',
    en: 'An app that times my sprints via GPS. A role-playing game in the browser. This website, including its login and database.',
  },
  homeAbout: {
    de: 'Angefangen hat es damit, dass mich etwas gestört hat: beim Sprinttraining stand immer jemand mit der Stoppuhr daneben. Also habe ich eine App gebaut, die das per GPS erledigt. Seither wird aus jedem Ärgernis ein Projekt. Am meisten lerne ich, wenn ich an etwas Eigenem sitze und es zum Laufen bringen muss.',
    en: "It started with something that annoyed me: at sprint training, someone always had to stand there holding a stopwatch. So I built an app that does it via GPS. Since then, pretty much every annoyance turns into a project. I learn most when I'm building something of my own and have to make it work.",
  },
  // Praktikum, nicht Lehrstelle. Die IMS schliesst mit einem
  // Praktikumsjahr ab - das steht auch im Lebenslauf so. Vorher
  // widersprachen sich die beiden Seiten.
  homeLooking: {
    de: 'Ich suche ein Praktikum in der Applikationsentwicklung.',
    en: "I'm looking for an internship in software development.",
  },

  // Projekte
  projectsTitle: { de: 'Meine Projekte', en: 'My projects' },
  projectsIntro: {
    de: 'Ich lerne am liebsten, indem ich Sachen baue. Ein Klick auf ein Projekt zeigt den Screenshot und den Code.',
    en: 'I learn best by building things. A click on a project shows the screenshot and the code.',
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
  viewLive:      { de: 'Live ausprobieren →', en: 'Try it live →' },
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
  // Der Einband, der beim ersten Besuch ueber der Startseite liegt.
  deckelTitel:   { de: 'Willkommen', en: 'Welcome' },
  deckelName:    { de: 'Michael Bergamin', en: 'Michael Bergamin' },
  deckelHinweis: { de: 'Klicken zum Aufschlagen', en: 'Click to open' },
  deckelOeffnen: { de: 'Buch aufschlagen', en: 'Open the book' },

  // Steht als alt-Text am Bild. Michael wollte hier ausdruecklich
  // den Hinweis statt einer Beschreibung des Motivs.
  fotoAlt: {
    de: 'Dieses Bild konnte nicht geladen werden.',
    en: 'This image could not be loaded.',
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
    // Nicht "application website": im Englischen heisst "application"
    // auch Programm, und auf einer Informatikseite versteht man es
    // garantiert falsch. "Job application" ist eindeutig.
    en: 'Personal job application website. Created during my studies at the IMS, BWD Bern.',
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
  loginSoonTitle: {
    de: 'Fertig gebaut, noch nicht aufgeschaltet',
    en: 'Built, not yet deployed',
  },
  loginSoonText: {
    de: 'Dahinter liegen meine Noten von der gibb, der BWD und der ICT Lernfactory. Die Anmeldung dafür habe ich selbst gebaut, mit Java Spring Boot, PostgreSQL und JWT-Token. Sie läuft nur noch auf keinem Server. Sobald sie aufgeschaltet ist, steht hier das Anmeldeformular.',
    en: "Behind this are my grades from gibb, BWD and ICT Lernfactory. I built the sign-in myself, with Java Spring Boot, PostgreSQL and JWT tokens. It's just not running on a server yet. Once it is, the sign-in form will appear here.",
  },
  loginSoonCode: {
    de: 'Den Code dazu ansehen →',
    en: 'Look at the code →',
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
  adminNoRight:  { de: 'Dafür fehlen die Rechte.', en: 'Permission is missing for this.' },
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
  // Bewusst ohne Anbieter: die ueK waren bei mehreren, die Namen
  // stehen bei den einzelnen Dokumenten.
  areaUEK: { de: 'ÜK · Überbetriebliche Kurse', en: 'Inter-company courses' },

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
  docRename:    { de: 'Umbenennen', en: 'Rename' },
  docSave:      { de: 'Speichern', en: 'Save' },
  docCancel:    { de: 'Abbrechen', en: 'Cancel' },

  // Konten verwalten
  accEdit:        { de: 'Ändern', en: 'Edit' },
  accDelete:      { de: 'Löschen', en: 'Delete' },
  accDisplayName: { de: 'Anzeigename (nicht der Anmeldename)', en: 'Display name (not the login name)' },
  // Steht vor dem Benutzernamen. Ohne diese zwei Woerter sieht man
  // den Anzeigenamen gross und den Anmeldenamen klein daneben - und
  // tippt dann beim Anmelden den falschen ein.
  accLoginName: { de: 'Anmeldename:', en: 'Login name:' },
  accNewPassword: { de: 'Neues Passwort (leer = unverändert)', en: 'New password (empty = unchanged)' },
  accRepeatPassword: { de: 'Passwort wiederholen', en: 'Repeat password' },
  accShowPassword: { de: 'Passwort anzeigen', en: 'Show password' },
  accMismatch: {
    de: 'Die beiden Passwörter sind nicht gleich',
    en: "The two passwords don't match",
  },
  accSave:        { de: 'Speichern', en: 'Save' },
  accCancel:      { de: 'Abbrechen', en: 'Cancel' },
  accConfirmDelete: {
    de: 'Konto wirklich löschen? Das Zugriffsprotokoll bleibt erhalten.',
    en: 'Really delete this account? The access log will be kept.',
  },
  accAdminHint: {
    de: 'Eigenes Konto. Der Anmeldename bleibt, auch wenn der Anzeigename geändert wird.',
    en: 'Own account. The login name stays the same even if the display name changes.',
  },

  // Seite nicht gefunden
  notFoundTitle: { de: 'Nicht gefunden', en: 'Not found' },
  notFoundText: {
    de: 'Diese Seite gibt es nicht. Vielleicht ein Tippfehler in der Adresse?',
    en: "This page doesn't exist. Maybe a typo in the address?",
  },
  backHome: { de: 'Zurück zur Startseite →', en: 'Back to home →' },
}
