package com.vl.vilniuslife.model;

public class SafetyInRadiusRequest {

    GeoPoint geoPoint;
    Integer radius;

    public SafetyInRadiusRequest(GeoPoint geoPoint, Integer radius) {
        this.geoPoint = geoPoint;
        this.radius = radius;
    }

    public GeoPoint getGeoPoint() {
        return geoPoint;
    }

    public void setGeoPoint(GeoPoint geoPoint) {
        this.geoPoint = geoPoint;
    }

    public Integer getRadius() {
        return radius;
    }

    public void setRadius(Integer radius) {
        this.radius = radius;
    }
}
