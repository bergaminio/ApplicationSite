package ch.bergamin.portfolio.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

// Ein Lebenszeichen. Braucht keine Anmeldung und verraet nichts.
//
// Das Frontend fragt hier an, um zu wissen ob der Server ueberhaupt
// laeuft. Vorher hat es dafuer /api/auth/me benutzt - das antwortet
// ohne Token mit 401, und der Browser schreibt dann bei jedem Besuch
// einen roten Fehler in die Konsole.
@RestController
public class PingController {

    @GetMapping("/api/ping")
    public Map<String, String> ping() {
        return Map.of("status", "ok");
    }
}
