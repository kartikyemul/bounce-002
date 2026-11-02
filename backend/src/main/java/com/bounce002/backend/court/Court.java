package com.bounce002.backend.court;

import jakarta.persistence.*;

@Entity
@Table(name = "courts")
public class Court {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private boolean active;

    public Long getId() { return id; }
    public String getName() { return name; }
    public boolean isActive() { return active; }
}
