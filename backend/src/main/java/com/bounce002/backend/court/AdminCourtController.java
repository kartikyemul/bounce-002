package com.bounce002.backend.court;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/** Admin only (see SecurityConfig): list every court, add one, edit one. */
@RestController
@RequestMapping("/api/admin/courts")
public class AdminCourtController {
    record CourtRequest(@NotBlank @Size(max = 50) String name,
                        @NotBlank @Size(max = 40) String surface,
                        @NotNull @Pattern(regexp = "INDOOR|OUTDOOR") String setting,
                        @NotNull @Size(max = 300) String description,
                        @Min(0) @Max(100000) int pricePerHour,
                        boolean active) {}

    private final CourtRepository courts;

    public AdminCourtController(CourtRepository courts) { this.courts = courts; }

    @GetMapping
    public List<Court> all() { return courts.findAllByOrderById(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Court create(@Valid @RequestBody CourtRequest r) { return save(new Court(), r); }

    @PutMapping("/{id}")
    public Court update(@PathVariable Long id, @Valid @RequestBody CourtRequest r) {
        var c = courts.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Court not found"));
        return save(c, r);
    }

    private Court save(Court c, CourtRequest r) {
        c.setName(r.name().trim());
        c.setSurface(r.surface().trim());
        c.setSetting(r.setting());
        c.setDescription(r.description().trim());
        c.setPricePerHour(r.pricePerHour());
        c.setActive(r.active());
        try {
            return courts.saveAndFlush(c);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A court with that name already exists");
        }
    }
}
