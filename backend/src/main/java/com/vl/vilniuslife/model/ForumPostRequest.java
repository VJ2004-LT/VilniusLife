package com.vl.vilniuslife.model;


public class ForumPostRequest {

    private String content;

    private String title;

    private double coordsLng;

    private double coordsLat;

    public ForumPostRequest(String content, String title, double coordsLng, double coordsLat) {
        this.content = content;
        this.title = title;
        this.coordsLng = coordsLng;
        this.coordsLat = coordsLat;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public double getCoordsLat() {
        return coordsLat;
    }

    public void setCoordsLat(double coordsLat) {
        this.coordsLat = coordsLat;
    }

    public double getCoordsLng() {
        return coordsLng;
    }

    public void setCoordsLng(double coordsLng) {
        this.coordsLng = coordsLng;
    }
}
