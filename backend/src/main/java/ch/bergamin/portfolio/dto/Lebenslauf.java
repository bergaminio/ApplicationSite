package ch.bergamin.portfolio.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

// Der Lebenslauf, wie er in der lebenslauf.json steht.
//
// Bis jetzt hat der Server den Inhalt nur durchgereicht, ohne
// hineinzuschauen. Das reicht nicht mehr, seit man ihn im
// Admin-Bereich aendern kann: was gespeichert wird, muss vorher
// geprueft sein. Sonst legt ein Tippfehler im Formular die
// Lebenslauf-Seite lahm, und zwar erst dann, wenn ein Lehrbetrieb sie
// aufmacht.
//
// Deshalb dieselbe Struktur nochmal als Java-Typ. Jackson liest die
// Datei hier hinein und schreibt sie daraus zurueck - passt etwas
// nicht, gibt es beim Speichern einen Fehler und nicht spaeter auf
// der Website.
public record Lebenslauf(
        @NotNull @Valid Zweisprachig ueberMich,
        @NotNull @Valid List<Ausbildung> ausbildung,
        @NotNull @Valid List<Referenz> referenzen,
        @NotNull @Valid List<Sprache> sprachen,
        @NotNull List<String> itKenntnisse,
        @NotNull @Valid List<Zweisprachig> hobbys) {

    // Ein Text in beiden Sprachen. Kommt ueberall vor.
    //
    // Beide Felder duerfen leer sein: bei der Oberstufe steht zum
    // Beispiel keine Beschreibung. Leer heisst "wird nicht angezeigt",
    // fehlend hiesse "kaputt" - darum @NotNull und nicht @NotBlank.
    public record Zweisprachig(@NotNull String de, @NotNull String en) {}

    public record Ausbildung(
            @NotNull @Valid Zweisprachig zeit,
            @NotNull @Valid Zweisprachig titel,
            @NotNull @Valid Zweisprachig ort,
            @NotNull @Valid Zweisprachig text) {}

    // Der Name steht nur einmal da: Menschen heissen in beiden
    // Sprachen gleich.
    public record Referenz(
            @NotBlank String name,
            @NotNull @Valid Zweisprachig rolle,
            @NotNull String betrieb,
            @NotNull @Valid Zweisprachig zusatz,
            @NotNull String kontakt) {}

    public record Sprache(
            @NotNull @Valid Zweisprachig name,
            @NotNull @Valid Zweisprachig niveau) {}
}
