package ch.bergamin.portfolio.repository;

import ch.bergamin.portfolio.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Ein Repository ist der Zugriff auf eine Tabelle.
//
// Das Besondere: man schreibt nur die Methoden-Namen hin, den Code
// dazu baut Spring beim Start selbst. "findByUsername" wird zu
// "SELECT * FROM accounts WHERE username = ?".
public interface AccountRepository extends JpaRepository<Account, Long> {

    // Optional heisst: vielleicht ist da ein Konto, vielleicht auch nicht.
    Optional<Account> findByUsername(String username);

    boolean existsByUsername(String username);
}
