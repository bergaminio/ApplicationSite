# Die Bewerbungsseite auf einem Server starten

Alles läuft in drei Containern: Datenbank, Backend, Website.
Auf dem Server muss nur Docker installiert sein — kein Java, kein
Node, kein PostgreSQL.

**Vorher prüfen:** `docker compose version` muss antworten. Dazu rund
1 GB freien Arbeitsspeicher und etwa 3 GB Platz auf der Platte — der
erste Bau lädt Java und Node herunter.

---

## Kurzfassung

```bash
git clone https://github.com/bergaminio/ApplicationSite.git
cd ApplicationSite
cp .env.example .env
nano .env                 # die leeren Werte ausfüllen, siehe unten
cp lebenslauf.beispiel.json lebenslauf.json
nano lebenslauf.json      # Angaben eintragen, siehe unten
docker compose up -d
```

Der erste Start dauert ein paar Minuten, weil Docker Java und Node
herunterlädt und alles baut. Danach geht es in Sekunden.

---

## Die `.env` ausfüllen

Ohne diese Datei startet gar nichts — Compose bricht mit einer
Meldung ab, welcher Wert fehlt. Das ist Absicht: ein Server mit dem
Standardpasswort `admin` wäre schlimmer als einer, der nicht startet.

| Wert | Was hinein gehört |
|---|---|
| `DB_PASSWORD` | Irgendetwas Langes. Nur die Container benutzen es, niemand tippt es je ein. |
| `JWT_SECRET` | Mindestens 32 Zeichen. Wer es kennt, kommt ohne Passwort an die Noten. |
| `ADMIN_PASSWORD` | Michaels erstes Anmeldepasswort. |
| `SITE_URL` | Adresse der Website, z.B. `https://bergamin.ch` |
| `API_URL` | Adresse des Backends, z.B. `https://api.bergamin.ch` |
| `CONTACT_PLACE` | Wohnort für die Kontaktseite. Darf leer bleiben. |
| `CONTACT_PHONE` | Telefonnummer für die Kontaktseite. Darf leer bleiben. |

Passwörter erzeugen:

```bash
openssl rand -base64 32
```

**`SITE_URL` und `API_URL` müssen stimmen.** Steht dort die falsche
Adresse, lädt die Seite zwar, aber jede Anmeldung bricht mit
„Failed to fetch" ab. Das Backend lässt Anfragen nur von der Adresse
in `SITE_URL` zu (CORS), und die Website spricht genau die Adresse in
`API_URL` an.

---

## Die `lebenslauf.json`

Schulen, Referenzen, Sprachen und Hobbys stehen **nicht im Quelltext**,
sondern in einer Datei auf dem Server. Grund: das Repository auf GitHub
ist öffentlich. Stünden die Angaben dort, könnte sie jeder nachlesen —
egal, dass die Website eine Anmeldung verlangt.

Wohnort und Telefonnummer liegen aus demselben Grund in der `.env`
(`CONTACT_PLACE`, `CONTACT_PHONE`).

Die Datei gehört **neben** `docker-compose.yml`, also direkt ins
geklonte Verzeichnis. Docker reicht sie ins Backend hinein, gelesen
wird sie nur, nichts wird hineingeschrieben.

**Sie muss vor dem ersten `docker compose up` da sein.** Fehlt sie,
legt Docker an ihrer Stelle einen leeren **Ordner** an. Das Backend
läuft dann zwar, aber die Lebenslaufseite bleibt leer — und der Fehler
ist schwer zu finden, weil nirgends etwas rot wird.

Passiert es doch:

```bash
docker compose down
rm -rf lebenslauf.json
cp lebenslauf.beispiel.json lebenslauf.json
docker compose up -d
```

Nach einer Änderung an der Datei genügt ein Neustart, kein Neubau:

```bash
docker compose restart backend
```

Prüfen, ob das Backend sie gefunden hat — angemeldet im Browser die
Lebenslaufseite öffnen, oder auf dem Server:

```bash
docker compose exec backend ls -l /app/lebenslauf.json
```

Steht dort `-rw...` und eine Grösse über null, stimmt es. Steht dort
`drwx`, ist es der leere Ordner von oben.


---

## Nur das Backend hosten

Wenn die Website schon beim Webhoster liegt und hier nur das Backend
laufen soll:

```bash
docker compose up -d db backend
```

`API_URL` darf dann leer bleiben — aber die **Zeile muss in der `.env`
stehen**. Compose liest immer die ganze Datei, auch wenn man nur zwei
Dienste startet. Fehlt der Wert ganz, bricht es mit
`required variable API_URL is missing a value` ab, obwohl man das
Frontend gar nicht hochfahren wollte.

---

## Befehle für den Alltag

```bash
docker compose ps                    # was läuft, und ist es gesund
docker compose logs -f backend       # zuschauen, was das Backend macht
docker compose restart backend       # nur das Backend neu starten
docker compose down                  # alles stoppen, Daten bleiben
docker compose up -d --build         # nach einem git pull neu bauen
```

**`docker compose down -v` löscht die Datenbank samt aller Noten.**
Das `-v` entfernt das Volume. Ohne `-v` bleibt alles erhalten.

---

## Nach einer Änderung im Code

```bash
git pull
docker compose up -d --build
```

Wichtig, wenn sich `API_URL` ändert: die Website muss dann **neu
gebaut** werden, ein Neustart genügt nicht. Vite schreibt die Adresse
beim Bauen fest in die JavaScript-Dateien, nicht beim Starten.

```bash
docker compose up -d --build frontend
```

---

## Ports

Beide Dienste lauschen nur auf `127.0.0.1`, sind also **nicht direkt
aus dem Internet erreichbar**:

| | Port auf dem Server |
|---|---|
| Website | `127.0.0.1:8081` |
| Backend | `127.0.0.1:8080` |
| Datenbank | gar nicht — nur intern zwischen den Containern |

Davor gehört ein Reverse Proxy (nginx, Caddy, Traefik) oder ein
Cloudflare Tunnel, der HTTPS übernimmt und beide Adressen nach aussen
gibt. Sind die Ports auf dem Server schon belegt, kann man sie in
`docker-compose.yml` bei `ports:` ändern — links steht der Port auf
dem Server, rechts der im Container.

---

## Sicherung

Alles Wichtige liegt in einer einzigen Datenbank, auch die
hochgeladenen Notenausweise (als `bytea`, nicht als Dateien).
Eine Sicherung ist deshalb eine Datei:

```bash
docker compose exec db pg_dump -U portfolio portfolio > sicherung.sql
```

Zurückspielen:

```bash
cat sicherung.sql | docker compose exec -T db psql -U portfolio portfolio
```

---

## Wenn etwas nicht geht

**Backend startet und stirbt sofort.** `docker compose logs backend`
ansehen. Meist fehlt ein Wert in der `.env`.

**„Failed to fetch" beim Anmelden.** `SITE_URL` stimmt nicht mit der
Adresse überein, unter der die Seite wirklich läuft. Prüfen:

```bash
curl -I -X OPTIONS https://api.bergamin.ch/api/auth/login \
  -H "Origin: https://bergamin.ch" \
  -H "Access-Control-Request-Method: POST"
```

Es muss `Access-Control-Allow-Origin` zurückkommen.

**Lebenslaufseite ist leer, obwohl man angemeldet ist.** Das Backend
findet die `lebenslauf.json` nicht. Fast immer, weil sie beim ersten
Start noch nicht da war und Docker einen leeren Ordner angelegt hat:

```bash
docker compose exec backend ls -ld /app/lebenslauf.json
```

Beginnt die Zeile mit `d`, ist es der Ordner. Siehe oben, Abschnitt
„Die `lebenslauf.json`".

**Kontaktseite zeigt keinen Wohnort und keine Nummer.**
`CONTACT_PLACE` und `CONTACT_PHONE` sind leer. Das ist kein Fehler,
die Angaben sind freiwillig. Nach dem Nachtragen in der `.env`:
`docker compose up -d backend`.

**Datenbank startet nicht.** Ab PostgreSQL 18 gehört der Mount auf
`/var/lib/postgresql` und nicht mehr auf `/var/lib/postgresql/data`.
In der `docker-compose.yml` steht es richtig — nur nicht „korrigieren".

**Container gilt als `unhealthy`, antwortet aber.** Im Healthcheck
muss `127.0.0.1` stehen, nicht `localhost`: im Container zeigt
`localhost` zuerst auf die IPv6-Adresse `::1`, und die Dienste
lauschen nur auf IPv4.

---

## Was getestet ist

Der ganze Stapel lief am 12.08.2026 lokal durch:

- Beide Abbilder bauen von Null
- Alle drei Container melden sich als `healthy`
- Anmeldung mit dem Passwort aus der `.env`: HTTP 200, falsches
  Passwort: HTTP 401
- `/projects` liefert 200 statt 404 (SPA-Weiterleitung in nginx)
- CORS lässt `SITE_URL` durch und weist fremde Herkunft mit 403 ab
- Nach `docker compose down` und wieder `up` ist die Anmeldung noch
  gültig — die Daten überleben im Volume

Dazu läuft eine Testreihe automatisch mit. Sie prüft vor allem, dass
ohne Anmeldung nichts herausgegeben wird: Noten, Lebenslauf, ZIP,
Kontaktangaben und der Admin-Bereich antworten allesamt mit 401, ein
selbstgebautes Token wird abgewiesen, und ein Lehrbetrieb-Konto kommt
zwar an die Unterlagen, aber nicht in den Admin-Bereich.

```bash
cd backend && ./mvnw test     # 9 Tests, Backend
npm test                      # 16 Tests, Website
```

Die Tests brauchen keine Datenbank und kein Docker — das Backend
startet dafür eine Datenbank im Arbeitsspeicher.
