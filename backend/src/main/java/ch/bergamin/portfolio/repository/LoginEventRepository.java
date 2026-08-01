package ch.bergamin.portfolio.repository;

import ch.bergamin.portfolio.model.LoginEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoginEventRepository extends JpaRepository<LoginEvent, Long> {

    // Neueste zuerst.
    List<LoginEvent> findAllByOrderByTimeDesc();
}
