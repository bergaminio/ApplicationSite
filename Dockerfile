# Baut die Website und liefert sie mit nginx aus.
#
# Auch hier zwei Stufen: Node braucht man nur zum Bauen. Was am Ende
# herauskommt, sind reine HTML-, CSS- und JS-Dateien - die kann jeder
# Webserver ausliefern, ganz ohne Node.

# ---- Stufe 1: bauen ------------------------------------------------
FROM node:22-alpine AS bau

WORKDIR /bau

# Erst nur die Paketlisten, dann installieren, dann der Rest.
# Gleiche Ueberlegung wie beim Backend: so laedt Docker die Pakete
# nur neu, wenn sich package.json wirklich geaendert hat.
#
# "npm ci" statt "npm install": es haelt sich strikt an
# package-lock.json. Damit baut der Rechner deines Kollegen exakt
# dieselben Versionen wie deiner.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# WICHTIG: Vite backt die Backend-Adresse beim BAUEN in die fertigen
# Dateien ein, nicht beim Starten. Eine Umgebungsvariable im
# docker-compose-Abschnitt "environment" kaeme also zu spaet - sie
# muss hier als Bau-Argument herein.
#
# Bleibt sie leer, laeuft die Seite trotzdem: sie zeigt dann statt des
# Anmeldeformulars den Hinweis, dass der geschuetzte Bereich noch
# nicht aufgeschaltet ist (siehe BACKEND_EINGERICHTET in api/auth.ts).
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---- Stufe 2: ausliefern -------------------------------------------
FROM nginx:alpine

# Ohne diese Datei bekommt man bei /projects einen 404: nginx sucht
# einen Ordner "projects", den es nicht gibt. Die Adressen erfindet
# erst React im Browser. Siehe nginx.conf daneben.
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=bau /bau/dist /usr/share/nginx/html

EXPOSE 80

# 127.0.0.1 und nicht localhost!
#
# "localhost" loest im Container zuerst auf die IPv6-Adresse ::1 auf,
# nginx lauscht hier aber nur auf IPv4. Ergebnis: von aussen antwortet
# die Seite tadellos, der Healthcheck im Container bekommt "Connection
# refused" und Docker meldet den Container dauerhaft als krank.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["sh", "-c", "wget -q --spider http://127.0.0.1/ || exit 1"]
