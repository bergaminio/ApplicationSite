package ch.bergamin.portfolio.repository;

import ch.bergamin.portfolio.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GradeRepository extends JpaRepository<Grade, Long> {

    List<Grade> findAllByOrderByAreaAscSubjectAsc();
}
