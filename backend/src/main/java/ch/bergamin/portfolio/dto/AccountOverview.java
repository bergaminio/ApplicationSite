package ch.bergamin.portfolio.dto;

import java.time.Instant;

// Eine Zeile in meiner Uebersicht: welcher Betrieb hat sich
// wie oft angemeldet, und wann zuletzt.
//
// lastLogin ist null wenn sich der Betrieb noch nie angemeldet hat.
// Absichtlich kein Text wie "nie" - sonst stuende im englischen
// Frontend ein deutsches Wort. Die Wortwahl macht das Frontend.
public record AccountOverview(
        String username,
        String displayName,
        String role,
        long loginCount,
        Instant lastLogin) {
}
