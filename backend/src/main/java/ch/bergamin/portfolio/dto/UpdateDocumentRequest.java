package ch.bergamin.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

// Womit ich ein bereits hochgeladenes Dokument umbenenne oder in
// einen anderen Bereich verschiebe. Die Datei selbst bleibt.
public record UpdateDocumentRequest(
        @NotBlank String title,

        @Pattern(regexp = "EFZ|BM|UEK", message = "Bereich muss EFZ, BM oder UEK sein")
        String area) {
}
