package ch.bergamin.portfolio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Eine einzelne Note.
@Entity
@Table(name = "grades")
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Woher die Note kommt: EFZ (gibb), BM (BWD) oder UEK (Lernfactory).
    @Column(nullable = false)
    private String area;

    @Column(nullable = false)
    private String subject;

    // Schweizer Skala 1.0 bis 6.0
    @Column(nullable = false)
    private double value;

    protected Grade() {
    }

    public Grade(String area, String subject, double value) {
        this.area = area;
        this.subject = subject;
        this.value = value;
    }

    public Long getId() {
        return id;
    }

    public String getArea() {
        return area;
    }

    public String getSubject() {
        return subject;
    }

    public double getValue() {
        return value;
    }
}
