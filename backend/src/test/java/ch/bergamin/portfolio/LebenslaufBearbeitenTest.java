package ch.bergamin.portfolio;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;

// Den Lebenslauf im Admin-Bereich aendern.
//
// Eigene Testklasse, weil hier wirklich eine Datei auf der Platte
// gebraucht wird. Im ZugriffsschutzTest ist app.cv.file absichtlich
// leer - dort wird geprueft, was ohne Datei passiert.
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class LebenslaufBearbeitenTest {

    // Eine echte Datei in einem Ordner, den das Betriebssystem nach
    // dem Test selbst wieder aufraeumt.
    private static final Path DATEI = anlegen();

    private static Path anlegen() {
        try {
            Path ordner = Files.createTempDirectory("lebenslauf-test");
            ordner.toFile().deleteOnExit();
            Path d = ordner.resolve("lebenslauf.json");
            d.toFile().deleteOnExit();
            return d;
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    @DynamicPropertySource
    static void pfadSetzen(DynamicPropertyRegistry registry) {
        registry.add("app.cv.file", DATEI::toString);
    }

    private static final String GUELTIG = """
            {
              "ueberMich": { "de": "Hallo", "en": "Hello" },
              "ausbildung": [
                { "zeit":  { "de": "2024", "en": "2024" },
                  "titel": { "de": "IMS",  "en": "IMS" },
                  "ort":   { "de": "Bern", "en": "Bern" },
                  "text":  { "de": "",     "en": "" } }
              ],
              "referenzen": [
                { "name": "Test Person",
                  "rolle":   { "de": "Lehrperson", "en": "Teacher" },
                  "betrieb": "Testschule",
                  "zusatz":  { "de": "", "en": "" },
                  "kontakt": "test@example.org" }
              ],
              "sprachen": [
                { "name":   { "de": "Deutsch",       "en": "German" },
                  "niveau": { "de": "Muttersprache", "en": "Native" } }
              ],
              "itKenntnisse": ["Java", "React"],
              "hobbys": [ { "de": "Klavier", "en": "Piano" } ]
            }
            """;

    @LocalServerPort int port;
    private final ObjectMapper json = new ObjectMapper();
    private final HttpClient client = HttpClient.newHttpClient();

    @BeforeEach
    void ausgangslage() throws Exception {
        Files.writeString(DATEI, GUELTIG, StandardCharsets.UTF_8);
    }

    private HttpRequest.Builder bauen(String weg, String token) {
        HttpRequest.Builder b = HttpRequest.newBuilder(URI.create("http://localhost:" + port + weg))
                .header("Content-Type", "application/json");
        if (token != null) b.header("Authorization", "Bearer " + token);
        return b;
    }

    private HttpResponse<String> hole(String weg, String token) throws Exception {
        return client.send(bauen(weg, token).GET().build(), HttpResponse.BodyHandlers.ofString());
    }

    private HttpResponse<String> lege(String weg, String token, String koerper) throws Exception {
        return client.send(bauen(weg, token).PUT(HttpRequest.BodyPublishers.ofString(koerper)).build(),
                HttpResponse.BodyHandlers.ofString());
    }

    private String anmelden(String benutzer, String passwort) throws Exception {
        HttpResponse<String> antwort = client.send(
                bauen("/api/auth/login", null)
                        .POST(HttpRequest.BodyPublishers.ofString(
                                "{\"username\":\"" + benutzer + "\",\"password\":\"" + passwort + "\"}"))
                        .build(),
                HttpResponse.BodyHandlers.ofString());
        assertThat(antwort.statusCode()).isEqualTo(200);
        return json.readTree(antwort.body()).get("token").asText();
    }

    @Test
    void ohneAnmeldungGehtNichts() throws Exception {
        assertThat(hole("/api/admin/cv", null).statusCode()).isEqualTo(401);
        assertThat(lege("/api/admin/cv", null, GUELTIG).statusCode()).isEqualTo(401);
    }

    // Der wichtigste Test hier: ein Lehrbetrieb darf den Lebenslauf
    // lesen, aber nicht umschreiben.
    @Test
    void einBetriebDarfNichtSpeichern() throws Exception {
        String admin = anmelden("testadmin", "testadmin123");
        client.send(bauen("/api/admin/accounts", admin)
                .POST(HttpRequest.BodyPublishers.ofString(
                        "{\"username\":\"cvbetrieb\",\"password\":\"geheim12345\",\"displayName\":\"CV AG\"}"))
                .build(), HttpResponse.BodyHandlers.ofString());

        String betrieb = anmelden("cvbetrieb", "geheim12345");

        assertThat(hole("/api/cv", betrieb).statusCode()).isEqualTo(200);
        assertThat(lege("/api/admin/cv", betrieb, GUELTIG).statusCode()).isEqualTo(403);
    }

    @Test
    void adminSpeichertUndDieSeiteZeigtEsAn() throws Exception {
        String admin = anmelden("testadmin", "testadmin123");

        String geaendert = GUELTIG.replace("\"de\": \"Hallo\"", "\"de\": \"Neuer Text\"");
        assertThat(lege("/api/admin/cv", admin, geaendert).statusCode()).isEqualTo(200);

        // In der Datei angekommen ...
        assertThat(Files.readString(DATEI, StandardCharsets.UTF_8)).contains("Neuer Text");
        // ... und wird auch so ausgeliefert.
        assertThat(hole("/api/cv", admin).body()).contains("Neuer Text");
    }

    // Was das Formular anzeigt, muss es auch zurueckschicken koennen.
    @Test
    void gelesenesLaesstSichUnveraendertSpeichern() throws Exception {
        String admin = anmelden("testadmin", "testadmin123");

        HttpResponse<String> gelesen = hole("/api/admin/cv", admin);
        assertThat(gelesen.statusCode()).isEqualTo(200);

        assertThat(lege("/api/admin/cv", admin, gelesen.body()).statusCode()).isEqualTo(200);
    }

    // Kaputtes darf gar nicht erst in die Datei kommen: der Fehler
    // faellt sonst erst auf, wenn ein Lehrbetrieb die Seite oeffnet.
    @Test
    void unvollstaendigesWirdAbgewiesenUndDieDateiBleibt() throws Exception {
        String admin = anmelden("testadmin", "testadmin123");
        String vorher = Files.readString(DATEI, StandardCharsets.UTF_8);

        // ueberMich fehlt.
        String kaputt = """
                { "ausbildung": [], "referenzen": [], "sprachen": [],
                  "itKenntnisse": [], "hobbys": [] }
                """;

        assertThat(lege("/api/admin/cv", admin, kaputt).statusCode()).isEqualTo(400);
        assertThat(Files.readString(DATEI, StandardCharsets.UTF_8)).isEqualTo(vorher);
    }

    @Test
    void keinJsonWirdAbgewiesen() throws Exception {
        String admin = anmelden("testadmin", "testadmin123");
        String vorher = Files.readString(DATEI, StandardCharsets.UTF_8);

        assertThat(lege("/api/admin/cv", admin, "kein json").statusCode()).isEqualTo(400);
        assertThat(Files.readString(DATEI, StandardCharsets.UTF_8)).isEqualTo(vorher);
    }
}
