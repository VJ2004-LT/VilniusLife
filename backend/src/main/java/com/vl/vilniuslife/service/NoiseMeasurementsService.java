package com.vl.vilniuslife.service;

import com.vl.vilniuslife.model.GeoPoint;
import com.vl.vilniuslife.model.NoiseMeasurementResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;

import java.net.URI;
import java.util.Optional;

@Service
public class NoiseMeasurementsService {

    private record GeoPointsSquare(GeoPoint bottomLeftGeoPoint, GeoPoint topRightGeoPoint) {}

    private final int METERS_IN_LATITUDE_DEGREE = 111320;

    public NoiseMeasurementResponse getNoiseMeasurement(GeoPoint request) {
        String dayCarNoiseLevel = null;
        String nightCarNoiseLevel = null;
        String railwayNoiseLevel = null;
        String airportNoiseLevel = null;

        for (int i = 0; i < 4; i++){
            GeoPointsSquare geoPoints = getGeoPoints(request, (int) (10 + Math.round(10 * Math.pow(2, i))));
            if (dayCarNoiseLevel == null) dayCarNoiseLevel = getNoiseLevel(geoPoints, 1, "esriGeometryEnvelope");
            if (nightCarNoiseLevel == null) nightCarNoiseLevel = getNoiseLevel(geoPoints, 3, "esriGeometryPoint");
            if (railwayNoiseLevel == null) railwayNoiseLevel = getNoiseLevel(geoPoints, 9, "esriGeometryEnvelope");
            if (airportNoiseLevel == null) airportNoiseLevel = getNoiseLevel(geoPoints, 16, "esriGeometryEnvelope");
            if (dayCarNoiseLevel != null && nightCarNoiseLevel != null && railwayNoiseLevel != null && airportNoiseLevel != null) break;
        }

        return new NoiseMeasurementResponse(dayCarNoiseLevel, nightCarNoiseLevel, railwayNoiseLevel, airportNoiseLevel);
    }

    private GeoPointsSquare getGeoPoints(GeoPoint request, int squareHalfSideMeters) {
        if (squareHalfSideMeters <= 0) {
            throw new IllegalArgumentException("squareHalfSideMeters must be positive");
        }
        double latRadians = request.getLat() * Math.PI / 180;
        double lat = (double) squareHalfSideMeters / METERS_IN_LATITUDE_DEGREE;
        double lon = squareHalfSideMeters / (METERS_IN_LATITUDE_DEGREE * Math.cos(latRadians));

        GeoPoint topRightGeoPoint = new GeoPoint(request.getLat() + lat, request.getLng() + lon);
        GeoPoint bottomLeftGeoPoint = new GeoPoint(request.getLat() - lat, request.getLng() - lon);
        return new GeoPointsSquare(topRightGeoPoint, bottomLeftGeoPoint);
    }

    private String getNoiseLevel(GeoPointsSquare geoPoints, int layer, String geometryType){
        RestClient restClient = RestClient.create();

        String url = "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis2/Aplinkosauga_VMSA/MapServer/" + layer + "/query?where=1%3D1&outFields=*&geometry=" +
                geoPoints.bottomLeftGeoPoint.getLng() + "%2C" +
                geoPoints.bottomLeftGeoPoint.getLat() + "%2C" +
                geoPoints.topRightGeoPoint.getLng() + "%2C" +
                geoPoints.topRightGeoPoint.getLat() + "%2C" +
                "&geometryType=" + geometryType + "&inSR=4326&spatialRel=esriSpatialRelIntersects&outSR=4326&f=json";
        JsonNode response = restClient.get()
                .uri(URI.create(url))
                .retrieve()
                .requiredBody(JsonNode.class);

        if (response.isArray() || response.isEmpty()){
            throw new RuntimeException("Empty or invalid getNightNoiseLevel: bad api response");
        }

        JsonNode noiseLevelZones = response.get("features");
        if (noiseLevelZones == null || !noiseLevelZones.isArray()) {
            throw new RuntimeException("Empty or invalid getNightNoiseLevel: bad features object");
        }

        int maxNoiseLevel = -1;
        String maxNoiseLevelStr = null;
        for (JsonNode noiseLevelZone : noiseLevelZones) {
            JsonNode triuksmNode = noiseLevelZone.path("attributes").path("TRIUKSM");
            if (!triuksmNode.isTextual()) {
                System.out.println("TRIUKSM not textual: " + triuksmNode);
                continue;
            }
            String noiseLevel = triuksmNode.textValue();
            Optional<Integer> maybeParsedNoiseLevel = parseInteger(noiseLevel);
            if (maybeParsedNoiseLevel.isPresent()) {
                int parsedNoiseLevel = maybeParsedNoiseLevel.get();
                if (maxNoiseLevel < parsedNoiseLevel) {
                    maxNoiseLevel = parsedNoiseLevel;
                    maxNoiseLevelStr = noiseLevel;
                }
            }
        }

        return maxNoiseLevelStr;
    }

    private Optional<Integer> parseInteger(String input) {
        if (input == null || input.isEmpty()) return Optional.empty();

        if (input.startsWith(">")) {
            try {
                return Optional.of(Integer.parseInt(input.substring(1)));
            } catch (NumberFormatException e) {
                return Optional.empty();
            }
        }

        String[] parts = input.split("-");
        if (parts.length == 2) {
            try {
                return Optional.of(Integer.parseInt(parts[1]));
            } catch (NumberFormatException e) {
                return  Optional.empty();
            }
        }

        return Optional.empty();
    }
}
