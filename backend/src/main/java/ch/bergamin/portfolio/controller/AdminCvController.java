package ch.bergamin.portfolio.controller;

import ch.bergamin.portfolio.dto.Lebenslauf;
import ch.bergamin.portfolio.service.CvDatei;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

// Den Lebenslauf im Admin-Bereich aendern.
//
// Liegt unter /api/admin/, damit SecurityConfig die Rolle ADMIN
// verlangt - ein Lehrbetrieb soll den Lebenslauf lesen duerfen, aber
// nicht umschreiben.
//
// Vorher ging das nur, indem jemand mit Zugang zum Server die Datei
// von Hand oeffnet und danach den Container neu startet. Bei einer
// falschen Jahreszahl ist das zu umstaendlich, und wer den Server
// nicht selbst betreibt, ist auf jemand anderen angewiesen.
@RestController
@RequestMapping("/api/admin/cv")
public class AdminCvController {

    private final CvDatei datei;

    public AdminCvController(CvDatei datei) {
        this.datei = datei;
    }

    // Der aktuelle Stand, damit das Formular ihn anzeigen kann.
    //
    // Anders als /api/cv geht das hier durch den Java-Typ: was das
    // Formular zu sehen bekommt, soll genau das sein, was es spaeter
    // auch zurueckschicken kann.
    @GetMapping
    public ResponseEntity<?> lesen() {
        if (!datei.vorhanden()) {
            return ResponseEntity.notFound().build();
        }
        try {
            return ResponseEntity.ok(datei.lesen());
        } catch (IOException e) {
            return fehler("Die Datei konnte nicht gelesen werden.");
        } catch (RuntimeException e) {
            // Jackson meldet kaputtes JSON ohne Umweg ueber IOException.
            // Ohne dieses Fangen sieht man im Formular nur "500" und
            // muesste im Server-Protokoll nachsehen, was los ist.
            return fehler("Die lebenslauf.json auf dem Server ist nicht lesbar: "
                    + e.getMessage());
        }
    }

    @PutMapping
    public ResponseEntity<?> speichern(@Valid @RequestBody Lebenslauf neu) {
        if (!datei.vorhanden()) {
            return fehler("Auf dem Server liegt keine lebenslauf.json. "
                    + "Siehe DEPLOY.md, Abschnitt \"Die lebenslauf.json\".");
        }

        // Frueh und deutlich melden statt beim Schreiben scheitern.
        // Passiert, wenn die Datei in der docker-compose.yml noch mit
        // :ro eingehaengt ist, also nur zum Lesen.
        if (!datei.beschreibbar()) {
            return fehler("Die Datei ist auf dem Server schreibgeschuetzt. "
                    + "In der docker-compose.yml darf beim Einhaengen kein :ro mehr stehen.");
        }

        try {
            datei.schreiben(neu);
            return ResponseEntity.ok(Map.of("status", "gespeichert"));
        } catch (IOException e) {
            return fehler("Die Datei konnte nicht geschrieben werden.");
        }
    }

    private ResponseEntity<Map<String, String>> fehler(String text) {
        return ResponseEntity.internalServerError().body(Map.of("error", text));
    }
}
