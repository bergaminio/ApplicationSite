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
public/
└── demos/          Screenshots für das Projekt-Fenster
src/
├── api/
│   └── github.ts       Holt meine öffentlichen Repos von GitHub
├── context/
│   └── LanguageContext.tsx  Merkt sich die gewählte Sprache
├── components/     Bausteine die auf mehreren Seiten vorkommen
│   ├── Navbar.tsx      Die Navigation ganz oben
│   ├── PageTitle.tsx   Seiten-Titel mit farbigem Strich darunter
│   ├── Postit.tsx      Post-it Zettel mit abgeknickter Ecke
│   └── ProjectModal.tsx  Das Fenster beim Klick auf ein Projekt
├── pages/          Eine Datei pro Seite
│   ├── Home.tsx
│   ├── Projects.tsx
│   ├── CV.tsx          Der Lebenslauf
│   ├── Contact.tsx
│   └── Login.tsx
├── styles/
│   └── colors.ts   Alle Farben an einem Ort
├── texts.ts        Alle festen Texte auf Deutsch und Englisch
├── types.ts        Wie ein Projekt bei uns aussieht
├── App.tsx         Legt fest welche URL welche Seite zeigt
├── index.css       Schrift, Hintergrund und die Klassen .pill und .box
└── main.tsx        Startpunkt der App
```

## Projekte pflegen

Die Projects-Seite zeigt zwei Quellen zusammen:

1. **Die gepflegte Liste** oben in `src/pages/Projects.tsx` — mit Text, gelernten
   Techniken und Screenshot. Neues Projekt? Einen Block kopieren.
2. **GitHub** — alle öffentlichen Repos, die noch nicht in der Liste stehen,
   erscheinen automatisch. Die Antwort wird eine Stunde im Browser
   zwischengespeichert.

Screenshot hinzufügen: Bild in `public/demos/` ablegen und den Pfad
im passenden Block eintragen, z.B. `image: '/demos/bolt.png'`.

## Sprachen

Die Seite gibt es auf Deutsch und Englisch, umschalten über DE / EN
oben rechts. Die Wahl wird im Browser gemerkt.

Jeder Text ist ein Paar:

```ts
{ de: 'Schliessen', en: 'Close' }
```

Feste Texte (Navigation, Knöpfe, Überschriften) stehen in `src/texts.ts`.
Inhalte stehen direkt bei den Daten — Projekte in `src/pages/Projects.tsx`,
Lebenslauf in `src/pages/CV.tsx`.

In einer Komponente holt man sich die Sprache so:

```tsx
const { t } = useSprache()
<p>{t(ui.navHome)}</p>
```

**Wichtig:** Wenn du einen Text änderst, immer beide Sprachen anpassen.

## Farben

Jede Seite hat eine eigene Signature-Farbe, alle in `src/styles/colors.ts`:

| Seite | Farbe |
|---|---|
| Start | Rot `#f37882` |
| Projekte | Gelb `#ffd06b` |
| Lebenslauf | Grün `#6edaa4` |
| Kontakt | Blau `#70d6fe` |
| Login | Pink `#e91e8c` |

Orange `#f1aa81` färbt die "Dabei gelernt"-Badges im Projekt-Fenster.

Hintergrund der ganzen Seite: warmes Weiss `#faf8f4`
Schrift: [Sniglet](https://fonts.google.com/specimen/Sniglet) von Google Fonts

## Backend

Liegt im Ordner `backend/`. Java 25, Spring Boot 4.1, PostgreSQL 18.

### Starten

```bash
cd backend
docker compose up -d     # Datenbank starten
./mvnw spring-boot:run   # Backend starten (Port 8080)
```

Maven muss nicht installiert sein — `mvnw` holt es sich selbst.

### Was es kann

| Weg | Methode | Wer darf | Wofür |
|---|---|---|---|
| `/api/auth/login` | POST | alle | Anmelden, gibt ein JWT-Token zurück |
| `/api/auth/me` | GET | angemeldet | Wer bin ich? |
| `/api/admin/logins` | GET | nur ADMIN | Jeder Anmeldeversuch, neueste zuerst |
| `/api/admin/accounts` | GET | nur ADMIN | Übersicht: wer hat sich wie oft angemeldet |
| `/api/admin/accounts` | POST | nur ADMIN | Konto für einen Lehrbetrieb anlegen |
| `/api/grades` | GET | angemeldet | Alle Noten |
| `/api/admin/grades` | POST | nur ADMIN | Note eintragen |
| `/api/admin/grades/{id}` | DELETE | nur ADMIN | Note löschen |

**Die Idee dahinter:** Jeder Lehrbetrieb bekommt sein eigenes Konto. Jeder
Anmeldeversuch landet in der Tabelle `login_events` — auch die misslungenen.
So sehe ich, welcher Betrieb sich meine Unterlagen wirklich angeschaut hat
und welcher nie.

### Vor dem Deployment unbedingt setzen

Diese Werte haben lokal Standardwerte. Auf einem öffentlich erreichbaren
Server **müssen** sie als Umgebungsvariablen gesetzt werden:

| Variable | Warum |
|---|---|
| `JWT_SECRET` | Wer das Geheimnis kennt, kann sich gültige Token selbst bauen |
| `ADMIN_PASSWORD` | Sonst ist das Admin-Passwort `admin` |
| `SPRING_DATASOURCE_PASSWORD` | Das Datenbank-Passwort steht sonst im Repo |

## Noch offen

- [ ] PDF-Knopf auf dem Lebenslauf (sobald `public/lebenslauf.pdf` da ist)
- [ ] Login-Seite
- [ ] Backend mit Java Spring Boot + PostgreSQL
- [ ] Deployment auf bergamin.ch
