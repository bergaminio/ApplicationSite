package ch.bergamin.portfolio.controller;

import ch.bergamin.portfolio.model.Grade;
import ch.bergamin.portfolio.repository.GradeRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

// Die Noten. Sichtbar fuer alle die angemeldet sind - also fuer
// die Lehrbetriebe, denen ich die Zugangsdaten gegeben habe.
@RestController
@RequestMapping("/api/grades")
public class GradeController {

    private final GradeRepository grades;

    public GradeController(GradeRepository grades) {
        this.grades = grades;
    }

    @GetMapping
    public List<Map<String, Object>> alle() {
        return grades.findAllByOrderByAreaAscSubjectAsc().stream()
                .map(note -> Map.<String, Object>of(
                        "id", note.getId(),
                        "area", note.getArea(),
                        "subject", note.getSubject(),
                        "value", note.getValue()))
                .toList();
    }
}
