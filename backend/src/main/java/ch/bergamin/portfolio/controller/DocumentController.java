package ch.bergamin.portfolio.controller;

import ch.bergamin.portfolio.model.GradeDocument;
import ch.bergamin.portfolio.repository.GradeDocumentRepository;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

// Die Notenausweise. Sichtbar fuer alle die angemeldet sind -
// also fuer die Lehrbetriebe, denen ich die Zugangsdaten gegeben habe.
//
// Wichtig: die Dateien liegen NICHT in einem oeffentlichen Ordner.
// Sie kommen nur ueber diesen Weg raus, und der verlangt ein Token.
@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final GradeDocumentRepository documents;

    public DocumentController(GradeDocumentRepository documents) {
        this.documents = documents;
    }

    // GET /api/documents
    // Nur die Angaben, ohne die Dateien selbst.
    @GetMapping
    public List<GradeDocumentRepository.Info> alle() {
        return documents.findAllByOrderByAreaAscUploadedAtDesc();
    }

    // GET /api/documents/{id}/file
    // Die Datei selbst.
    @GetMapping("/{id}/file")
    public ResponseEntity<byte[]> datei(@PathVariable Long id) {
        GradeDocument dokument = documents.findById(id).orElse(null);
        if (dokument == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(dokument.getContentType()))
                // "inline" heisst: im Browser anzeigen statt herunterladen.
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline()
                                .filename(dokument.getFilename())
                                .build().toString())
                .body(dokument.getData());
    }

    // GET /api/documents/zip
    // Alle Unterlagen auf einmal, als ZIP.
    //
    // Ein Lehrbetrieb will nicht neun Dateien einzeln anklicken. Das
    // Archiv entsteht bei jeder Anfrage neu - bei neun Dateien und
    // gut einem Megabyte lohnt sich kein Zwischenspeicher, und so
    // ist es nie veraltet.
    // @Transactional ist hier Pflicht, nicht Zierde.
    //
    // PostgreSQL legt die Dateien als Large Object ab, und darauf
    // kommt man nur innerhalb einer offenen Transaktion. Ohne diese
    // Zeile liest Hibernate die erste Datei noch, dann ist die
    // Sitzung zu und es gibt einen Fehler beim Auspacken der Bytes.
    // Beim einzelnen Dokument faellt das nicht auf, weil dort die
    // Abfrage selbst die Transaktion mitbringt.
    @Transactional(readOnly = true)
    @GetMapping("/zip")
    public ResponseEntity<byte[]> alleAlsZip() {
        ByteArrayOutputStream speicher = new ByteArrayOutputStream();

        try (ZipOutputStream zip = new ZipOutputStream(speicher)) {
            // Merkt sich vergebene Namen. Zwei Dateien heissen beide
            // "Notenausweis 4. Semester" - im selben Archiv geht das
            // nicht zweimal, darum der Bereich davor und notfalls
            // eine Nummer dahinter.
            Set<String> vergeben = new HashSet<>();

            for (GradeDocument dokument : documents.findAllByOrderByAreaAscIdAsc()) {
                String name = eindeutigerName(dokument, vergeben);
                zip.putNextEntry(new ZipEntry(name));
                zip.write(dokument.getData());
                zip.closeEntry();
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename("unterlagen-michael-bergamin.zip")
                                .build().toString())
                .body(speicher.toByteArray());
    }

    // Baut einen Dateinamen, den jedes Betriebssystem akzeptiert.
    private String eindeutigerName(GradeDocument dokument, Set<String> vergeben) {
        // Alles ausser Buchstaben, Ziffern, Punkt, Strich und
        // Unterstrich ersetzen. Ein Schraegstrich im Namen wuerde im
        // Archiv einen Unterordner aufmachen, ein Doppelpunkt bricht
        // unter Windows das Entpacken ab.
        String titel = dokument.getTitle().replaceAll("[^A-Za-z0-9ÄÖÜäöüß. _-]", "_");
        String basis = dokument.getArea() + " - " + titel;
        String endung = endungFuer(dokument.getContentType());

        String name = basis + endung;
        int nummer = 2;
        while (!vergeben.add(name)) {
            name = basis + " (" + nummer++ + ")" + endung;
        }
        return name;
    }

    private String endungFuer(String contentType) {
        return switch (contentType) {
            case "application/pdf" -> ".pdf";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };
    }
}
