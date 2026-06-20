package com.vl.vilniuslife.model;

import java.util.List;

public class Street {

    private String name;
    private List<GeoPoint> coordinates;

    public Street(String name, List<GeoPoint> coordinates) {
        this.name = name;
        this.coordinates = coordinates;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<GeoPoint> getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(List<GeoPoint> coordinates) {
        this.coordinates = coordinates;
    }
}
