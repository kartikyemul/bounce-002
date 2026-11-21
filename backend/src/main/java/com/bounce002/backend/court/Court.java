package com.bounce002.backend.court;

import jakarta.persistence.*;

@Entity
@Table(name = "courts")
public class Court {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private boolean active = true;
    private String surface;
    private String setting;
    private String description;
    @Column(name = "price_per_hour")
    private int pricePerHour;

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public String getSurface() { return surface; }
    public void setSurface(String surface) { this.surface = surface; }
    public String getSetting() { return setting; }
    public void setSetting(String setting) { this.setting = setting; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getPricePerHour() { return pricePerHour; }
    public void setPricePerHour(int pricePerHour) { this.pricePerHour = pricePerHour; }
}
