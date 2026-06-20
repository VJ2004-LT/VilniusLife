package com.vl.vilniuslife.model;

public class ShortProblem {

    private int problemId;
    private String problemTypeString;
    private double coordsLat;
    private double coordsLng;

    public int getProblemId() {
        return problemId;
    }

    public void setProblemId(int problemId) {
        this.problemId = problemId;
    }

    public double getCoordsLng() {
        return coordsLng;
    }

    public void setCoordsLng(double coordsLng) {
        this.coordsLng = coordsLng;
    }

    public double getCoordsLat() {
        return coordsLat;
    }

    public void setCoordsLat(double coordsLat) {
        this.coordsLat = coordsLat;
    }

    public String getProblemTypeString() {
        return problemTypeString;
    }

    public void setProblemTypeString(String problemTypeString) {
        this.problemTypeString = problemTypeString;
    }
}
