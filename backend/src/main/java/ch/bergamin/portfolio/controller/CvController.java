package ch.bergamin.portfolio.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

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
// Der Inhalt wird nicht ausgewertet, sondern unveraendert
// durchgereicht. So muss diese Klasse nicht angefasst werden, wenn
// im Lebenslauf ein Feld dazukommt.
@RestController
@RequestMapping("/api/cv")
public class CvController {

    private final String datei;

    public CvController(@Value("${app.cv.file}") String datei) {
        this.datei = datei;
    }

    @GetMapping
    public ResponseEntity<String> lebenslauf() {
        if (datei == null || datei.isBlank()) {
            return ResponseEntity.notFound().build();
        }

        Path pfad = Path.of(datei);
        // isRegularFile und nicht nur isReadable: fehlt die Datei beim
        // Start, legt Docker an ihrer Stelle einen leeren Ordner an.
        // Den koennte man lesen, nur eben nicht als Datei.
        if (!Files.isRegularFile(pfad) || !Files.isReadable(pfad)) {
            return ResponseEntity.notFound().build();
        }

        try {
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Files.readString(pfad));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
