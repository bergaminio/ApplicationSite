package ch.bergamin.portfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Startpunkt der ganzen Anwendung.
// Beim Start sucht Spring selbst alle Klassen in diesem Paket
// und darunter, und setzt sie zusammen.
@SpringBootApplication
public class PortfolioApplication {

    public static void main(String[] args) {
        SpringApplication.run(PortfolioApplication.class, args);
    }
}
