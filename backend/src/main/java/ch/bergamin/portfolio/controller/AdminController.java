package ch.bergamin.portfolio.controller;

import ch.bergamin.portfolio.dto.AccountOverview;
import ch.bergamin.portfolio.dto.NewAccountRequest;
import ch.bergamin.portfolio.model.Account;
import ch.bergamin.portfolio.model.GradeDocument;
import ch.bergamin.portfolio.repository.AccountRepository;
import ch.bergamin.portfolio.repository.GradeDocumentRepository;
import ch.bergamin.portfolio.repository.LoginEventRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

// Nur fuer mich. Der Zugriffsschutz steht in SecurityConfig:
// alles unter /api/admin/ braucht die Rolle ADMIN.
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AccountRepository accounts;
    private final LoginEventRepository loginEvents;
    private final GradeDocumentRepository documents;
    private final PasswordEncoder passwordEncoder;

    public AdminController(AccountRepository accounts,
                           LoginEventRepository loginEvents,
                           GradeDocumentRepository documents,
                           PasswordEncoder passwordEncoder) {
        this.accounts = accounts;
        this.loginEvents = loginEvents;
        this.documents = documents;
        this.passwordEncoder = passwordEncoder;
    }

    // GET /api/admin/logins
    // Jeder Anmeldeversuch, neueste zuerst.
    @GetMapping("/logins")
    public List<Map<String, Object>> logins() {
        return loginEvents.findAllByOrderByTimeDesc().stream()
                .map(event -> Map.<String, Object>of(
                        "username", event.getUsername(),
                        "success", event.isSuccess(),
                        "time", event.getTime()))
                .toList();
    }

    // GET /api/admin/accounts
    // Die Uebersicht: welcher Betrieb hat sich schon angemeldet?
    @GetMapping("/accounts")
    public List<AccountOverview> accountsUebersicht() {
        // Die Liste ist nach Zeit sortiert, neueste zuerst.
        var alleEvents = loginEvents.findAllByOrderByTimeDesc();

        return accounts.findAll().stream()
                .map(account -> {
                    // Nur die gelungenen Anmeldungen dieses Kontos zaehlen.
                    var gelungen = alleEvents.stream()
                            .filter(e -> e.isSuccess() && e.getUsername().equals(account.getUsername()))
                            .toList();

                    return new AccountOverview(
                            account.getUsername(),
                            account.getDisplayName(),
                            account.getRole(),
                            gelungen.size(),
                            // null heisst: noch nie angemeldet
                            gelungen.isEmpty() ? null : gelungen.getFirst().getTime());
                })
                .toList();
    }

    // POST /api/admin/accounts
    // Legt ein Konto fuer einen Lehrbetrieb an.
    @PostMapping("/accounts")
    public ResponseEntity<?> neuesKonto(@Valid @RequestBody NewAccountRequest request) {
        if (accounts.existsByUsername(request.username())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Diesen Benutzernamen gibt es schon"));
        }

        Account account = new Account(
                request.username(),
                passwordEncoder.encode(request.password()),
                request.displayName(),
                "COMPANY");
        accounts.save(account);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "username", account.getUsername(),
                "displayName", account.getDisplayName()));
    }

    // Nur diese Dateitypen nehmen wir an.
    private static final List<String> ERLAUBTE_TYPEN = List.of(
            "image/jpeg", "image/png", "image/webp", "application/pdf");

    private static final List<String> ERLAUBTE_BEREICHE = List.of("EFZ", "BM", "UEK");

    // POST /api/admin/documents
    // Laedt einen Notenausweis hoch (Bild oder PDF).
    @PostMapping("/documents")
    public ResponseEntity<?> hochladen(
            @RequestParam String title,
            @RequestParam String area,
            @RequestParam MultipartFile file) throws IOException {

        if (title.isBlank()) {
            return fehler("Bitte einen Titel angeben");
        }
        if (!ERLAUBTE_BEREICHE.contains(area)) {
            return fehler("Bereich muss EFZ, BM oder UEK sein");
        }
        if (file.isEmpty()) {
            return fehler("Keine Datei ausgewaehlt");
        }

        String typ = file.getContentType();
        if (typ == null || !ERLAUBTE_TYPEN.contains(typ)) {
            return fehler("Nur JPG, PNG, WEBP oder PDF");
        }

        GradeDocument dokument = documents.save(new GradeDocument(
                title.trim(),
                area,
                file.getOriginalFilename() == null ? "datei" : file.getOriginalFilename(),
                typ,
                file.getBytes()));

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", dokument.getId(),
                "title", dokument.getTitle(),
                "area", dokument.getArea(),
                "contentType", dokument.getContentType(),
                "size", dokument.getSize(),
                "uploadedAt", dokument.getUploadedAt()));
    }

    // DELETE /api/admin/documents/{id}
    @DeleteMapping("/documents/{id}")
    public ResponseEntity<?> loescheDokument(@PathVariable Long id) {
        if (!documents.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        documents.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private ResponseEntity<?> fehler(String meldung) {
        return ResponseEntity.badRequest().body(Map.of("message", meldung));
    }
}
