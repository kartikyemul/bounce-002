package com.bounce002.backend.court;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourtRepository extends JpaRepository<Court, Long> {
    List<Court> findByActiveTrueOrderById();

    List<Court> findAllByOrderById();
}
