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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}
