package ch.bergamin.portfolio.security;

import ch.bergamin.portfolio.model.Account;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

// Baut die Anmelde-Token und prueft sie wieder.
//
// Ein JWT ist ein Text mit drei Teilen: wer bin ich, bis wann gilt es,
// und eine Unterschrift. Die Unterschrift entsteht aus dem Geheimnis
// unten. Aendert jemand am Token auch nur ein Zeichen, passt die
// Unterschrift nicht mehr und wir merken es sofort.
//
// Wichtig: der Inhalt eines Tokens ist NICHT verschluesselt, jeder kann
// ihn lesen. Also nie etwas Geheimes hineinschreiben.
@Component
public class JwtUtil {

    private final SecretKey key;
    private final long validityHours;

    public JwtUtil(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.validity-hours}") long validityHours) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.validityHours = validityHours;
    }

    public String createToken(Account account) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(account.getUsername())
                .claim("role", account.getRole())
                .claim("name", account.getDisplayName())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(validityHours, ChronoUnit.HOURS)))
                .signWith(key)
                .compact();
    }

    // Wirft eine Exception wenn das Token gefaelscht oder abgelaufen ist.
    public Claims readToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
