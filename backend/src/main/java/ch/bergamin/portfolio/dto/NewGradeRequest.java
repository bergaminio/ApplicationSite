package ch.bergamin.portfolio.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

// Womit ich eine Note eintrage.
public record NewGradeRequest(
        // Nur diese drei Bereiche sind erlaubt.
        @Pattern(regexp = "EFZ|BM|UEK", message = "Bereich muss EFZ, BM oder UEK sein")
        String area,

        @NotBlank String subject,

        @DecimalMin(value = "1.0", message = "Note muss zwischen 1 und 6 liegen")
        @DecimalMax(value = "6.0", message = "Note muss zwischen 1 und 6 liegen")
        double value) {
}
