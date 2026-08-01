package ch.bergamin.portfolio.dto;

// Was das Frontend nach erfolgreichem Anmelden zurueckbekommt.
public record LoginResponse(
        String token,
        String username,
        String displayName,
        String role) {
}
