package com.vl.vilniuslife.model;

public class SaveLocationRequest {

    private double lat;
    private double lng;
    private Integer riskScore;
    private String avgNoiseLevel;
    private String address;
    private String schools;
    private String routeInfos;

    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }

    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public String getAvgNoiseLevel() { return avgNoiseLevel; }
    public void setAvgNoiseLevel(String avgNoiseLevel) { this.avgNoiseLevel = avgNoiseLevel; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getSchools() { return schools; }
    public void setSchools(String schools) { this.schools = schools; }

    public String getRouteInfos() { return routeInfos; }
    public void setRouteInfos(String routeInfos) { this.routeInfos = routeInfos; }

}
