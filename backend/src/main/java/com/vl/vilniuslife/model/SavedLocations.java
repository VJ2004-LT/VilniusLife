package com.vl.vilniuslife.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "savedLocations")
@IdClass(SavedLocations.SavedLocationsId.class)
public class SavedLocations {

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @Id
    @Column(name = "location_id")
    private Integer locationId;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private Users user;

    @ManyToOne
    @JoinColumn(name = "location_id", insertable = false, updatable = false)
    private Locations location;

    @Column(name = "risk_score")
    private Integer riskScore;

    @Column(name = "avg_noise_level")
    private String avgNoiseLevel;

    @Column(name = "address")
    private String address;

    @CreationTimestamp
    @Column(name = "saved_at")
    private LocalDateTime savedAt;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "schools", columnDefinition = "jsonb")
    private String schools;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "route_infos", columnDefinition = "jsonb")
    private String routeInfos;

    public SavedLocations() {}

    public SavedLocations(Integer userId, Integer locationId, Integer riskScore, String avgNoiseLevel, String address, String schools, String routeInfos) {
        this.userId = userId;
        this.locationId = locationId;
        this.riskScore = riskScore;
        this.avgNoiseLevel = avgNoiseLevel;
        this.address = address;
        this.schools = schools;
        this.routeInfos = routeInfos;
    }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getLocationId() { return locationId; }
    public void setLocationId(Integer locationId) { this.locationId = locationId; }

    public Users getUser() { return user; }
    public Locations getLocation() { return location; }

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

    public static class SavedLocationsId implements Serializable {
        private Integer userId;
        private Integer locationId;

        public SavedLocationsId() {}

        public SavedLocationsId(Integer userId, Integer locationId) {
            this.userId = userId;
            this.locationId = locationId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof SavedLocationsId)) return false;
            SavedLocationsId that = (SavedLocationsId) o;
            return Objects.equals(userId, that.userId) && Objects.equals(locationId, that.locationId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(userId, locationId);
        }
    }
}
