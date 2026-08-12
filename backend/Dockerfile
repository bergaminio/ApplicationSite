# Baut das Backend und packt es in ein Abbild, das man ueberall
# starten kann, ohne dass Java installiert sein muss.
#
# Zwei Stufen, darum steht zweimal FROM:
#
#   Stufe 1 "bau"   hat das ganze Java-Entwicklungswerkzeug (JDK) und
#                   Maven. Sie holt die Bibliotheken und baut die
#                   .jar-Datei. Dieses Abbild waere ueber 500 MB gross.
#   Stufe 2         nimmt NUR die fertige .jar aus Stufe 1 mit und
#                   startet sie mit einer schlanken Java-Laufzeit (JRE).
#
# Alles aus Stufe 1 - Quelltext, Maven, der Bibliotheks-Zwischenspeicher -
# bleibt zurueck. Am Ende sind es rund 250 statt 800 MB.

# ---- Stufe 1: bauen ------------------------------------------------
FROM eclipse-temurin:25-jdk AS bau

WORKDIR /bau

# Erst nur die Dateien kopieren, die sagen WELCHE Bibliotheken
# gebraucht werden - noch nicht den Quelltext.
#
# Warum getrennt? Docker merkt sich jeden Schritt. Aendert sich eine
# Datei nicht, benutzt es das gemerkte Ergebnis wieder. Der Quelltext
# aendert sich staendig, die Bibliotheksliste fast nie. So werden die
# Bibliotheken nur neu geladen, wenn sich pom.xml wirklich aendert -
# sonst dauert jeder Bau minutenlang.
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Jetzt der Quelltext und der eigentliche Bau.
# -DskipTests, weil auf dem Server keine Datenbank zum Testen steht.
COPY src src
RUN ./mvnw clean package -DskipTests -B

# ---- Stufe 2: laufen -----------------------------------------------
FROM eclipse-temurin:25-jre

# curl braucht der Healthcheck weiter unten. Das JRE-Abbild bringt
# keins mit, also nachinstallieren - noch als root, danach nicht mehr.
# Die Paketlisten anschliessend wegraeumen, sonst schleppt das Abbild
# rund 40 MB unnoetig mit.
RUN apt-get update \
 && apt-get install --no-install-recommends -y curl \
 && rm -rf /var/lib/apt/lists/*

# Nicht als Administrator laufen lassen. Falls jemand ueber eine Luecke
# in die Anwendung kommt, sitzt er dann wenigstens nicht als root im
# Container.
RUN useradd --create-home --shell /bin/bash portfolio
USER portfolio

WORKDIR /app

# Der Stern passt auf die Versionsnummer im Dateinamen, damit hier
# nichts bricht, wenn sie in der pom.xml hochgezaehlt wird.
COPY --from=bau /bau/target/*.jar app.jar

EXPOSE 8080

# Damit Docker weiss, ob die Anwendung wirklich laeuft und nicht nur
# der Prozess da ist. /api/ping antwortet ohne Anmeldung.
# 127.0.0.1 statt localhost: im Container zeigt localhost zuerst auf
# die IPv6-Adresse ::1, und wenn der Dienst nur auf IPv4 lauscht,
# meldet Docker den Container dauerhaft als krank - obwohl er von
# aussen einwandfrei antwortet.
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD ["sh", "-c", "curl -fsS http://127.0.0.1:8080/api/ping || exit 1"]

ENTRYPOINT ["java", "-jar", "app.jar"]
