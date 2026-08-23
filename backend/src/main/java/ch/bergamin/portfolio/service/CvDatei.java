package ch.bergamin.portfolio.service;

import ch.bergamin.portfolio.dto.Lebenslauf;
import tools.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

// Der Zugriff auf die lebenslauf.json - lesen und schreiben an einer
// Stelle, damit nicht zwei Controller je ihre eigene Vorstellung davon
// haben, wo die Datei liegt und wie sie aussieht.
@Service
public class CvDatei {

    private final String pfadAusEinstellung;
    private final ObjectMapper json;

    public CvDatei(@Value("${app.cv.file}") String pfadAusEinstellung, ObjectMapper json) {
        this.pfadAusEinstellung = pfadAusEinstellung;
        this.json = json;
    }

    // Gibt es ueberhaupt eine Datei?
    //
    // isRegularFile und nicht nur isReadable: fehlt die Datei beim
    // Start, legt Docker an ihrer Stelle einen leeren Ordner an. Den
    // koennte man lesen, nur eben nicht als Datei.
    public boolean vorhanden() {
        if (pfadAusEinstellung == null || pfadAusEinstellung.isBlank()) return false;
        Path p = Path.of(pfadAusEinstellung);
        return Files.isRegularFile(p) && Files.isReadable(p);
    }

    // Der Inhalt, so wie er in der Datei steht.
    public String rohLesen() throws IOException {
        return Files.readString(Path.of(pfadAusEinstellung), StandardCharsets.UTF_8);
    }

    public Lebenslauf lesen() throws IOException {
        return json.readValue(rohLesen(), Lebenslauf.class);
    }

    // Schreibt den geprueften Lebenslauf zurueck.
    //
    // Bewusst in dieselbe Datei hinein und nicht "neu schreiben, dann
    // umbenennen", obwohl das sonst der saubere Weg waere: Docker
    // haengt hier eine EINZELNE Datei hinein. Wird sie ersetzt, zeigt
    // die Verbindung ins Leere und der Container sieht die Aenderung
    // nie. Ueberschreiben trifft dieselbe Datei und funktioniert.
    public void schreiben(Lebenslauf inhalt) throws IOException {
        // Eingerueckt schreiben. Die Datei wird auch von Hand
        // angeschaut und notfalls von Hand repariert, dann ist eine
        // einzige lange Zeile das Letzte, was man gebrauchen kann.
        Files.writeString(Path.of(pfadAusEinstellung),
                json.writerWithDefaultPrettyPrinter().writeValueAsString(inhalt),
                StandardCharsets.UTF_8);
    }

    public boolean beschreibbar() {
        return vorhanden() && Files.isWritable(Path.of(pfadAusEinstellung));
    }
}
