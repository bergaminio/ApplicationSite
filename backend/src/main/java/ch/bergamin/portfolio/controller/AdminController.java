package ch.bergamin.portfolio.controller;

import ch.bergamin.portfolio.dto.AccountOverview;
import ch.bergamin.portfolio.dto.NewAccountRequest;
import ch.bergamin.portfolio.dto.NewGradeRequest;
import ch.bergamin.portfolio.model.Account;
import ch.bergamin.portfolio.model.Grade;
import ch.bergamin.portfolio.repository.AccountRepository;
import ch.bergamin.portfolio.repository.GradeRepository;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

// Nur fuer mich. Der Zugriffsschutz steht in SecurityConfig:
// alles unter /api/admin/ braucht die Rolle ADMIN.
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AccountRepository accounts;
    private final LoginEventRepository loginEvents;
    private final GradeRepository grades;
    private final PasswordEncoder passwordEncoder;

    public AdminController(AccountRepository accounts,
                           LoginEventRepository loginEvents,
                           GradeRepository grades,
                           PasswordEncoder passwordEncoder) {
        this.accounts = accounts;
        this.loginEvents = loginEvents;
        this.grades = grades;
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

    // POST /api/admin/grades
    // Traegt eine Note ein.
    @PostMapping("/grades")
    public ResponseEntity<?> neueNote(@Valid @RequestBody NewGradeRequest request) {
        Grade note = grades.save(new Grade(
                request.area(),
                request.subject().trim(),
                request.value()));

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", note.getId(),
                "area", note.getArea(),
                "subject", note.getSubject(),
                "value", note.getValue()));
    }

    // DELETE /api/admin/grades/{id}
    @DeleteMapping("/grades/{id}")
    public ResponseEntity<?> loescheNote(@PathVariable Long id) {
        if (!grades.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        grades.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
