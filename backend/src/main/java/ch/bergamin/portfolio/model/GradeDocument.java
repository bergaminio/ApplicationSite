package ch.bergamin.portfolio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

import java.time.Instant;

// Ein offizielles Dokument: Scan oder Foto eines Notenausweises,
// oder ein PDF davon.
//
// Die Datei liegt als Bytes direkt in der Datenbank. Bei ein paar
// Zeugnissen ist das der einfachste Weg: keine Dateipfade, keine
// Rechte auf dem Server, und die Sicherung der Datenbank enthaelt
// die Dokumente gleich mit.
@Entity
@Table(name = "documents")
public class GradeDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Wie es auf der Seite heissen soll, z.B. "Notenausweis 2. Semester"
    @Column(nullable = false)
    private String title;

    // EFZ, BM oder UEK
    @Column(nullable = false)
    private String area;

    // Der urspruengliche Dateiname, z.B. "zeugnis.jpg"
    @Column(nullable = false)
    private String filename;

    // image/jpeg, image/png, image/webp oder application/pdf
    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private long size;

    @Lob
    @Column(nullable = false)
    private byte[] data;

    @Column(nullable = false)
    private Instant uploadedAt = Instant.now();

    protected GradeDocument() {
    }

    public GradeDocument(String title, String area, String filename,
                         String contentType, byte[] data) {
        this.title = title;
        this.area = area;
        this.filename = filename;
        this.contentType = contentType;
        this.data = data;
        this.size = data.length;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getFilename() {
        return filename;
    }

    public String getContentType() {
        return contentType;
    }

    public long getSize() {
        return size;
    }

    public byte[] getData() {
        return data;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }
}
