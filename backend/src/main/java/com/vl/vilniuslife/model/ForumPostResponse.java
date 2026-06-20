package com.vl.vilniuslife.model;

import java.time.LocalDateTime;

public class ForumPostResponse {

    private Integer id;

    private Integer userId;

    private String userFname;

    private String userLname;

    private String content;

    private String title;

    private double coordsLat;

    private double coordsLng;

    private LocalDateTime createdAt;

    public ForumPostResponse(Integer id, Integer userId, String userFname, String userLname, String content, String title, double coordsLng, double coordsLat, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.userFname = userFname;
        this.userLname = userLname;
        this.content = content;
        this.title = title;
        this.coordsLat = coordsLat;
        this.coordsLng = coordsLng;
        this.createdAt = createdAt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUserFname() {
        return userFname;
    }

    public void setUserFname(String userFname) {
         this.userFname = userFname;
    }

    public String getUserLname() {
        return userLname;
    }

    public void setUserLname(String userLname) {
         this.userLname = userLname;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
