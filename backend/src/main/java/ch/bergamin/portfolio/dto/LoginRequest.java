package ch.bergamin.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

// Was das Frontend beim Anmelden schickt.
// record ist eine kurze Schreibweise fuer eine Klasse,
// die nur Daten haelt.
public record LoginRequest(
        @NotBlank String username,
        @NotBlank String password) {
}
