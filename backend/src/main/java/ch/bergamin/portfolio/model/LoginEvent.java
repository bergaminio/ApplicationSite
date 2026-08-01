package ch.bergamin.portfolio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

// Ein Anmeldeversuch.
//
// Das ist der Kern der Idee: fuer jeden Versuch wird eine Zeile
// geschrieben. So sehe ich, welcher Lehrbetrieb sich meine
// Unterlagen wirklich angeschaut hat - und welcher nie.
@Entity
@Table(name = "login_events")
public class LoginEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Was eingetippt wurde. Absichtlich Text und keine Verknuepfung
    // zum Konto: so werden auch Versuche mit falschem Benutzernamen
    // festgehalten.
    @Column(nullable = false)
    private String username;

    // Hat die Anmeldung geklappt?
    @Column(nullable = false)
    private boolean success;

    @Column(nullable = false)
    private Instant time = Instant.now();

    protected LoginEvent() {
    }

    public LoginEvent(String username, boolean success) {
        this.username = username;
        this.success = success;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public boolean isSuccess() {
        return success;
    }

    public Instant getTime() {
        return time;
    }
}
