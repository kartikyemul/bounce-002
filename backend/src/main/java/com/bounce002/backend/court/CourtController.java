package com.bounce002.backend.court;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Public list of courts that are open for booking. */
@RestController
@RequestMapping("/api/courts")
public class CourtController {
    private final CourtRepository courts;

    public CourtController(CourtRepository courts) { this.courts = courts; }

    @GetMapping
    public List<Court> active() { return courts.findByActiveTrueOrderById(); }
}
