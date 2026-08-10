package ch.bergamin.portfolio.dto;

import jakarta.validation.constraints.Size;

// Womit ich ein Konto aendere.
//
// Beide Felder sind freiwillig: wer nur das Passwort aendern will,
// laesst displayName leer und umgekehrt.
//
// Der Benutzername laesst sich absichtlich nicht aendern - im
// Zugriffsprotokoll steht er als Text. Wuerde man ihn umbenennen,
// haette man plaetzlich zwei Namen fuer denselben Betrieb und die
// Uebersicht "wer war da" waere falsch.
public record UpdateAccountRequest(
        String displayName,

        @Size(min = 8, message = "Passwort muss mindestens 8 Zeichen haben")
        String password) {
}
