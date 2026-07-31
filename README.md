# Portfolio — Michael Bergamin

Meine persönliche Bewerbungswebsite. Handgezeichneter Skizzenbuch-Look,
jede Seite hat ihre eigene Farbe.

**Gebaut mit:** React · TypeScript · Vite · Tailwind CSS · React Router

## Starten

```bash
npm install
npm run dev
```

Läuft dann auf http://localhost:5173

## Befehle

| Befehl | macht |
|---|---|
| `npm run dev` | Startet den Entwicklungs-Server mit Auto-Reload |
| `npm run build` | Baut die Seite fürs Internet (prüft auch die TypeScript-Fehler) |
| `npm run preview` | Zeigt den gebauten Stand an |
| `npm run lint` | Sucht nach Code-Fehlern |

## Aufbau

```
src/
├── components/     Bausteine die auf mehreren Seiten vorkommen
│   ├── Navbar.tsx      Die Navigation ganz oben
│   ├── PageTitle.tsx   Seiten-Titel mit farbigem Strich darunter
│   └── Postit.tsx      Post-it Zettel mit abgeknickter Ecke
├── pages/          Eine Datei pro Seite
│   ├── Home.tsx
│   ├── Skills.tsx
│   ├── Projects.tsx
│   ├── Story.tsx
│   ├── Contact.tsx
│   └── Login.tsx
├── styles/
│   └── colors.ts   Alle Farben an einem Ort
├── App.tsx         Legt fest welche URL welche Seite zeigt
├── index.css       Schrift, Hintergrund und die Klassen .pill und .box
└── main.tsx        Startpunkt der App
```

## Farben

Jede Seite hat eine eigene Signature-Farbe, alle in `src/styles/colors.ts`:

| Seite | Farbe |
|---|---|
| Home | Rot `#f37882` |
| Skills | Orange `#f1aa81` |
| Projects | Gelb `#ffd06b` |
| Story | Grün `#6edaa4` |
| Contact | Blau `#70d6fe` |
| Login | Pink `#e91e8c` |

Hintergrund der ganzen Seite: warmes Weiss `#faf8f4`
Schrift: [Sniglet](https://fonts.google.com/specimen/Sniglet) von Google Fonts

## Noch offen

- [ ] Login-Seite
- [ ] Projekte über die GitHub-API laden
- [ ] Responsive Design fürs Handy
- [ ] Backend mit Java Spring Boot + PostgreSQL
- [ ] Deployment auf bergamin.ch
