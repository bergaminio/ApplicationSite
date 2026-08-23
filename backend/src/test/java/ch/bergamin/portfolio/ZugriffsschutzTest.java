package ch.bergamin.portfolio;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import static org.assertj.core.api.Assertions.assertThat;

// Prueft, wer was sehen darf.
//
// Der wichtigste Test dieser Anwendung: hinter der Anmeldung liegen
// Notenausweise und der Lebenslauf. Geht der Schutz kaputt, merkt das
// ohne Test niemand, denn die Seite sieht weiterhin normal aus.
//
// Die Tests sprechen einen echten Server an, keine Attrappe. Benutzt
// wird der HTTP-Client aus dem JDK: Spring hat seine Testhelfer
// zwischen den Hauptversionen mehrfach umbenannt und verschoben, der
// hier bleibt wie er ist.
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class ZugriffsschutzTest {

    @LocalServerPort int port;
    private final ObjectMapper json = new ObjectMapper();

    private final HttpClient client = HttpClient.newHttpClient();

    private HttpResponse<String> hole(String weg, String token) throws Exception {
        HttpRequest.Builder b = HttpRequest.newBuilder(URI.create("http://localhost:" + port + weg));
        if (token != null) b.header("Authorization", "Bearer " + token);
        return client.send(b.GET().build(), HttpResponse.BodyHandlers.ofString());
    }

    private HttpResponse<String> sende(String weg, String token, String koerper) throws Exception {
        HttpRequest.Builder b = HttpRequest.newBuilder(URI.create("http://localhost:" + port + weg))
                .header("Content-Type", "application/json");
        if (token != null) b.header("Authorization", "Bearer " + token);
        return client.send(b.POST(HttpRequest.BodyPublishers.ofString(koerper)).build(),
                HttpResponse.BodyHandlers.ofString());
    }

    private String anmelden(String benutzer, String passwort) throws Exception {
        HttpResponse<String> antwort = sende("/api/auth/login", null,
                "{\"username\":\"" + benutzer + "\",\"password\":\"" + passwort + "\"}");
        assertThat(antwort.statusCode()).isEqualTo(200);
        return json.readTree(antwort.body()).get("token").asText();
    }

    @Test
    void pingIstOeffentlich() throws Exception {
        assertThat(hole("/api/ping", null).statusCode()).isEqualTo(200);
    }

    @Test
    void ohneTokenKommtManNirgendsHin() throws Exception {
        for (String weg : new String[] {
                "/api/documents", "/api/documents/zip", "/api/cv",
                "/api/contact", "/api/admin/accounts", "/api/admin/logins" }) {
            assertThat(hole(weg, null).statusCode())
                    .as("ohne Token muss %s gesperrt sein", weg)
                    .isEqualTo(401);
        }
    }

    @Test
    void erfundenesTokenReichtNicht() throws Exception {
        assertThat(hole("/api/documents", "nicht.echt.token").statusCode()).isEqualTo(401);
    }

    @Test
    void falschesPasswortGibtKeinToken() throws Exception {
        assertThat(sende("/api/auth/login", null,
                "{\"username\":\"testadmin\",\"password\":\"falsch\"}").statusCode()).isEqualTo(401);
    }

    @Test
    void angemeldeteSehenUnterlagenUndKontakt() throws Exception {
        String token = anmelden("testadmin", "testadmin123");

        assertThat(hole("/api/documents", token).statusCode()).isEqualTo(200);

        HttpResponse<String> kontakt = hole("/api/contact", token);
        assertThat(kontakt.statusCode()).isEqualTo(200);
        assertThat(kontakt.body()).contains("Teststrasse 1");
    }

    // Ohne hinterlegte Datei antwortet der Lebenslauf mit 404 statt
    // mit einem Fehler. Die Seite zeigt dann nur das PDF.
    @Test
    void lebenslaufOhneDateiGibt404() throws Exception {
        assertThat(hole("/api/cv", anmelden("testadmin", "testadmin123")).statusCode()).isEqualTo(404);
    }

    // Ein Lehrbetrieb darf die Unterlagen sehen, aber nichts verwalten.
    @Test
    void betriebDarfLesenAberNichtVerwalten() throws Exception {
        String admin = anmelden("testadmin", "testadmin123");

        assertThat(sende("/api/admin/accounts", admin,
                "{\"username\":\"testbetrieb\",\"password\":\"geheim12345\",\"displayName\":\"Test AG\"}")
                .statusCode()).isEqualTo(201);

        String betrieb = anmelden("testbetrieb", "geheim12345");

        assertThat(hole("/api/documents", betrieb).statusCode()).isEqualTo(200);
        assertThat(hole("/api/admin/accounts", betrieb).statusCode()).isEqualTo(403);
        assertThat(hole("/api/admin/logins", betrieb).statusCode()).isEqualTo(403);
    }

    // Derselbe Benutzername darf nicht zweimal vergeben werden, sonst
    // waere im Zugriffsprotokoll nicht mehr unterscheidbar, wer da war.
    @Test
    void benutzernameNurEinmal() throws Exception {
        String admin = anmelden("testadmin", "testadmin123");
        String koerper = "{\"username\":\"doppelt\",\"password\":\"geheim12345\",\"displayName\":\"Doppelt AG\"}";

        assertThat(sende("/api/admin/accounts", admin, koerper).statusCode()).isEqualTo(201);
        assertThat(sende("/api/admin/accounts", admin, koerper).statusCode()).isEqualTo(409);
    }

    @Test
    void kurzePasswoerterWerdenAbgewiesen() throws Exception {
        String admin = anmelden("testadmin", "testadmin123");
        assertThat(sende("/api/admin/accounts", admin,
                "{\"username\":\"kurz\",\"password\":\"1234\",\"displayName\":\"Kurz AG\"}")
                .statusCode()).isEqualTo(400);
    }
}
