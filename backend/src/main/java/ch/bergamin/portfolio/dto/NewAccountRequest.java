package ch.bergamin.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Womit ich ein neues Konto fuer einen Lehrbetrieb anlege.
public record NewAccountRequest(
        @NotBlank String username,
        @NotBlank @Size(min = 8, message = "Passwort muss mindestens 8 Zeichen haben") String password,
        @NotBlank String displayName) {
}
