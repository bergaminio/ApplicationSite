package ch.bergamin.portfolio.controller;

import ch.bergamin.portfolio.dto.LoginRequest;
import ch.bergamin.portfolio.dto.LoginResponse;
import ch.bergamin.portfolio.model.Account;
import ch.bergamin.portfolio.model.LoginEvent;
import ch.bergamin.portfolio.repository.AccountRepository;
import ch.bergamin.portfolio.repository.LoginEventRepository;
import ch.bergamin.portfolio.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;
import java.util.Optional;

// Alles rund ums Anmelden.
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AccountRepository accounts;
    private final LoginEventRepository loginEvents;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(AccountRepository accounts,
                          LoginEventRepository loginEvents,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.accounts = accounts;
        this.loginEvents = loginEvents;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Optional<Account> gefunden = accounts.findByUsername(request.username());

        boolean passt = gefunden.isPresent()
                && passwordEncoder.matches(request.password(), gefunden.get().getPasswordHash());

        // Jeden Versuch festhalten - auch den misslungenen.
        // Genau das ist der Punkt: ich will sehen wer sich angemeldet hat.
        loginEvents.save(new LoginEvent(request.username(), passt));

        if (!passt) {
            // Absichtlich dieselbe Meldung fuer "Konto gibt es nicht" und
            // "Passwort falsch". Sonst koennte jemand herausfinden,
            // welche Benutzernamen existieren.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Benutzername oder Passwort stimmt nicht"));
        }

        Account account = gefunden.get();
        String token = jwtUtil.createToken(account);

        return ResponseEntity.ok(new LoginResponse(
                token,
                account.getUsername(),
                account.getDisplayName(),
                account.getRole()));
    }

    // GET /api/auth/me - sagt dem Frontend, wer gerade angemeldet ist.
    // Braucht ein gueltiges Token.
    @GetMapping("/me")
    public ResponseEntity<?> me(Principal principal) {
        return accounts.findByUsername(principal.getName())
                .<ResponseEntity<?>>map(account -> ResponseEntity.ok(Map.of(
                        "username", account.getUsername(),
                        "displayName", account.getDisplayName(),
                        "role", account.getRole())))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}
