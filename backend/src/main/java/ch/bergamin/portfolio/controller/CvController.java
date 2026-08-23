package ch.bergamin.portfolio.controller;

import ch.bergamin.portfolio.service.CvDatei;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

// Der Lebenslauf als Angaben, nicht als PDF.
//
// Warum ueber den Server und nicht einfach im Frontend-Quelltext?
// Weil das Repository oeffentlich ist. Stuenden Schulen, Jahrgaenge
// und Referenzen dort, koennte sie jeder auf GitHub nachlesen - egal
// ob die Seite eine Anmeldung verlangt.
//
// Die Angaben liegen als JSON-Datei auf dem Server. Der Pfad kommt
// aus CV_FILE. Absichtlich eine Datei und keine Tabelle: ein
// Lebenslauf aendert sich ein paarmal im Jahr, dafuer lohnt sich
// keine Verwaltungsmaske.
//
// Hier wird nur gelesen. Geaendert wird er im Admin-Bereich, siehe
// AdminCvController - dort verlangt SecurityConfig die Rolle ADMIN.
// Stuende das Speichern hier, duerfte es jeder angemeldete
// Lehrbetrieb.
@RestController
@RequestMapping("/api/cv")
public class CvController {

    private final CvDatei datei;

    public CvController(CvDatei datei) {
        this.datei = datei;
    }

    @GetMapping
    public ResponseEntity<String> lebenslauf() {
        if (!datei.vorhanden()) {
            return ResponseEntity.notFound().build();
        }

        try {
            // Unveraendert durchgereicht und nicht durch den
            // Java-Typ geschickt: die Seite soll auch dann noch
            // etwas anzeigen, wenn in der Datei ein Feld steht, das
            // der Server noch nicht kennt.
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(datei.rohLesen());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
