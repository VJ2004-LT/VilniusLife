package com.vl.vilniuslife.model;

public class NoiseMeasurementResponse {

    String dayCarNoiseLevel;
    String nightCarNoiseLevel;
    String railwayNoiseLevel;
    String airportNoiseLevel;

    public NoiseMeasurementResponse(String dayCarNoiseLevel, String nightCarNoiseLevel, String railwayNoiseLevel, String airportNoiseLevel) {
        this.dayCarNoiseLevel = dayCarNoiseLevel;
        this.nightCarNoiseLevel = nightCarNoiseLevel;
        this.railwayNoiseLevel = railwayNoiseLevel;
        this.airportNoiseLevel = airportNoiseLevel;
    }

    public String getDayCarNoiseLevel() {
        return dayCarNoiseLevel;
    }

    public void setDayCarNoiseLevel(String dayCarNoiseLevel) {
        this.dayCarNoiseLevel = dayCarNoiseLevel;
    }

    public String getNightCarNoiseLevel() {
        return nightCarNoiseLevel;
    }

    public void setNightCarNoiseLevel(String nightCarNoiseLevel) {
        this.nightCarNoiseLevel = nightCarNoiseLevel;
    }

    public String getRailwayNoiseLevel() {
        return railwayNoiseLevel;
    }

    public void setRailwayNoiseLevel(String railwayNoiseLevel) {
        this.railwayNoiseLevel = railwayNoiseLevel;
    }

    public String getAirportNoiseLevel() {
        return airportNoiseLevel;
    }

    public void setAirportNoiseLevel(String airportNoiseLevel) {
        this.airportNoiseLevel = airportNoiseLevel;
    }
}
