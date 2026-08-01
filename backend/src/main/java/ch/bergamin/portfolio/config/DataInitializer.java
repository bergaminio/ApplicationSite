package ch.bergamin.portfolio.config;

import ch.bergamin.portfolio.model.Account;
import ch.bergamin.portfolio.repository.AccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// Laeuft einmal beim Start. Legt mein Admin-Konto an,
// falls es noch keins gibt.
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final AccountRepository accounts;
    private final PasswordEncoder passwordEncoder;
    private final String adminUsername;
    private final String adminPassword;

    public DataInitializer(AccountRepository accounts,
                           PasswordEncoder passwordEncoder,
                           @Value("${app.admin.username}") String adminUsername,
                           @Value("${app.admin.password}") String adminPassword) {
        this.accounts = accounts;
        this.passwordEncoder = passwordEncoder;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(String... args) {
        if (accounts.existsByUsername(adminUsername)) {
            return;
        }

        accounts.save(new Account(
                adminUsername,
                passwordEncoder.encode(adminPassword),
                "Michael Bergamin",
                "ADMIN"));

        log.info("Admin-Konto '{}' angelegt.", adminUsername);

        if ("admin".equals(adminPassword)) {
            log.warn("");
            log.warn("  ACHTUNG: Das Admin-Passwort ist noch das Standard-Passwort.");
            log.warn("  Setze ADMIN_PASSWORD als Umgebungsvariable, bevor das");
            log.warn("  Backend irgendwo oeffentlich erreichbar ist.");
            log.warn("");
        }
    }
}
