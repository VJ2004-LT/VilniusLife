package com.vl.vilniuslife.model;

import java.time.LocalDateTime;

public class SavedLocationResponse {

    private Integer locationId;
    private Integer riskScore;
    private String avgNoiseLevel;
    private String address;
    private LocalDateTime savedAt;
    private String schools;
    private String routeInfos;
    private double coordsLat;
    private double coordsLng;

    public SavedLocationResponse(Integer locationId, Integer riskScore, String avgNoiseLevel, String address,
                                 LocalDateTime savedAt, String schools, String routeInfos, double coordsLat, double coordsLng) {
        this.locationId = locationId;
        this.riskScore = riskScore;
        this.avgNoiseLevel = avgNoiseLevel;
        this.address = address;
        this.savedAt = savedAt;
        this.schools = schools;
        this.routeInfos = routeInfos;
        this.coordsLat = coordsLat;
        this.coordsLng = coordsLng;
    }

    public Integer getLocationId() { return locationId; }
    public void setLocationId(Integer locationId) { this.locationId = locationId; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public String getAvgNoiseLevel() { return avgNoiseLevel; }
    public void setAvgNoiseLevel(String avgNoiseLevel) { this.avgNoiseLevel = avgNoiseLevel; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public LocalDateTime getSavedAt() { return savedAt; }
    public void setSavedAt(LocalDateTime savedAt) { this.savedAt = savedAt; }

    public String getSchools() { return schools; }
    public void setSchools(String schools) { this.schools = schools; }

    public String getRouteInfos() { return routeInfos; }
    public void setRouteInfos(String routeInfos) { this.routeInfos = routeInfos; }

    public double getCoordsLat() { return coordsLat; }
    public void setCoordsLat(double coordsLat) { this.coordsLat = coordsLat; }

    public double getCoordsLng() { return coordsLng; }
    public void setCoordsLng(double coordsLng) { this.coordsLng = coordsLng; }

}
