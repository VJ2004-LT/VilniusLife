package com.vl.vilniuslife.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.locationtech.jts.geom.Point;

@Entity
@Table(name = "locations")
public class Locations {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "category", length = 100)
    private String category;

    @NotNull
    @Column(name = "geo", columnDefinition = "geometry(point, 4326)", nullable = false)
    private Point geo;

    // Constructors
    public Locations() {}

    public Locations(String category, Point geo) {
        this.category = category;
        this.geo = geo;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Point getGeo() {
        return geo;
    }

    public void setGeo(Point geo) {
        this.geo = geo;
    }
}