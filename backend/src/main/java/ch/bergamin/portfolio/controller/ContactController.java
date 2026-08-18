package ch.bergamin.portfolio.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

// Meine Kontaktangaben, die nicht oeffentlich sein sollen.
//
// Warum ueberhaupt ueber den Server? Weil das Repository oeffentlich
// ist. Stuenden Wohnort und Telefonnummer im Frontend-Quelltext,
// koennte sie jeder auf GitHub nachlesen - egal ob die Seite selbst
// eine Anmeldung verlangt.
//
// Dieser Weg braucht keine eigene Rechtepruefung: in SecurityConfig
// gilt anyRequest().authenticated(), und /api/contact steht nicht auf
// der Liste der oeffentlichen Adressen. Ohne gueltiges Token gibt es
// hier also 401.
@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final String ort;
    private final String telefon;

    public ContactController(
            @Value("${app.contact.place}") String ort,
            @Value("${app.contact.phone}") String telefon) {
        this.ort = ort;
        this.telefon = telefon;
    }

    @GetMapping
    public Map<String, String> kontakt() {
        return Map.of("place", ort, "phone", telefon);
    }
}
