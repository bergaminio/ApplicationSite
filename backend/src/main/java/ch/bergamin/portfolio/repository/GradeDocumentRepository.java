package ch.bergamin.portfolio.repository;

import ch.bergamin.portfolio.model.GradeDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface GradeDocumentRepository extends JpaRepository<GradeDocument, Long> {

    // Fuer die Liste brauchen wir die Datei selbst nicht - nur die Angaben
    // dazu. Diese Schnittstelle sorgt dafuer, dass die Bytes gar nicht
    // erst aus der Datenbank geholt werden. Sonst wuerde bei jedem
    // Seitenaufruf jedes Bild mitgeladen.
    interface Info {
        Long getId();
        String getTitle();
        String getArea();
        String getContentType();
        long getSize();
        Instant getUploadedAt();
    }

    List<Info> findAllByOrderByAreaAscUploadedAtDesc();
}
