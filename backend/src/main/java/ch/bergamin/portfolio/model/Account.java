package ch.bergamin.portfolio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

// Ein Konto zum Anmelden.
//
// Jeder Lehrbetrieb bekommt sein eigenes Konto. So sehe ich spaeter
// genau, welcher Betrieb sich angemeldet hat und welcher nicht.
//
// @Entity heisst: aus dieser Klasse macht Hibernate eine Tabelle.
@Entity
@Table(name = "accounts")
public class Account {

    // Die Nummer vergibt die Datenbank selbst.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Der Benutzername zum Anmelden, z.B. "bbc-buempliz".
    // unique = es darf ihn nur einmal geben.
    @Column(nullable = false, unique = true)
    private String username;

    // Niemals das Passwort selbst speichern, nur seinen Hash.
    // Aus dem Hash kann man das Passwort nicht zurueckrechnen.
    @Column(nullable = false)
    private String passwordHash;

    // Wie der Betrieb richtig heisst, z.B. "BBC Buempliz".
    @Column(nullable = false)
    private String displayName;

    // ADMIN = ich selbst, COMPANY = ein Lehrbetrieb.
    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    // JPA braucht einen leeren Konstruktor.
    protected Account() {
    }

    public Account(String username, String passwordHash, String displayName, String role) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.displayName = displayName;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
