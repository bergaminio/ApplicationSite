package ch.bergamin.portfolio.security;

import jakarta.servlet.DispatcherType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

// Legt fest, wer was darf.
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final String allowedOrigins;

    public SecurityConfig(
            JwtAuthFilter jwtAuthFilter,
            @Value("${app.cors.allowed-origins}") String allowedOrigins) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.allowedOrigins = allowedOrigins;
    }

    // Verschluesselt Passwoerter beim Anlegen und prueft sie beim Anmelden.
    // BCrypt ist absichtlich langsam - das macht Ausprobieren muehsam.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CSRF-Schutz brauchen wir nicht: wir arbeiten mit Token
            // im Kopf der Anfrage, nicht mit Cookies.
            .csrf(csrf -> csrf.disable())

            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Kein Server-Gedaechtnis. Jede Anfrage bringt ihr Token selbst mit.
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth
                    // Wenn intern ein Fehler auftritt, schickt Spring die
                    // Anfrage noch einmal an /error. Dieser zweite Durchlauf
                    // hat keine Anmeldung mehr. Ohne diese Zeile wuerde jeder
                    // Fehler als 401 beim Frontend ankommen - auch ein
                    // "Eingabe ungueltig" (400) oder "keine Rechte" (403).
                    .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()

                    // Anmelden muss ohne Token gehen, sonst kaeme man nie rein.
                    .requestMatchers("/api/auth/login").permitAll()
                    // Alles unter /api/admin/ nur fuer mich.
                    .requestMatchers("/api/admin/**").hasRole("ADMIN")
                    // Der Rest braucht ein gueltiges Token.
                    .anyRequest().authenticated())

            // Ohne Token gibt es 401 statt einer Weiterleitung auf ein
            // Login-Formular - das Frontend will eine klare Antwort.
            .exceptionHandling(ex -> ex
                    .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))

            // Unser Filter laeuft vor dem eingebauten Login-Filter.
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Der Browser laesst Anfragen an einen anderen Port nur zu, wenn
    // der Server das ausdruecklich erlaubt. Das Frontend laeuft beim
    // Entwickeln auf Port 5173, das Backend auf 8080.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
