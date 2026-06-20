package com.vl.vilniuslife.service;

import com.vl.vilniuslife.model.GeoPoint;
import com.vl.vilniuslife.model.RouteSafetyRequest;
import com.vl.vilniuslife.model.Street;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class RouteSafetyService {

    private static final int METERS_IN_LATITUDE_DEGREE = 111320;
    private static final int PADDING_METERS = 50;

    private record BoundingBox(GeoPoint bottomLeft, GeoPoint topRight) {}
    private record IncidentStats(int injured, int killed) {}

    public int getRouteSafety(RouteSafetyRequest request) {
        RestClient restClient = RestClient.create();
        int totalInjured = 0;
        int totalKilled = 0;

        for (Street street : request.getRoute()) {
            BoundingBox box = calculateBoundingBox(street);
            IncidentStats stats = queryIncidents(restClient, street.getName(), box);
            totalInjured += stats.injured();
            totalKilled += stats.killed();
        }

        int routeSafety = 100 - totalInjured * 2 - totalKilled * 10;
        return Math.max(routeSafety, 0);
    }

    private BoundingBox calculateBoundingBox(Street street) {
        double minLat = Double.MAX_VALUE;
        double maxLat = -Double.MAX_VALUE;
        double minLng = Double.MAX_VALUE;
        double maxLng = -Double.MAX_VALUE;

        for (GeoPoint point : street.getCoordinates()) {
            minLat = Math.min(minLat, point.getLat());
            maxLat = Math.max(maxLat, point.getLat());
            minLng = Math.min(minLng, point.getLng());
            maxLng = Math.max(maxLng, point.getLng());
        }

        double avgLat = (minLat + maxLat) / 2.0;
        double latRadians = avgLat * Math.PI / 180.0;
        double latPadding = (double) PADDING_METERS / METERS_IN_LATITUDE_DEGREE;
        double lngPadding = (double) PADDING_METERS / (METERS_IN_LATITUDE_DEGREE * Math.cos(latRadians));

        return new BoundingBox(
                new GeoPoint(minLat - latPadding, minLng - lngPadding),
                new GeoPoint(maxLat + latPadding, maxLng + lngPadding)
        );
    }

    private IncidentStats queryIncidents(RestClient restClient, String streetName, BoundingBox box) {
        String encodedName = URLEncoder.encode(streetName, StandardCharsets.UTF_8).replace("+", "%20");

        String url = "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis2/Transportas_public/MapServer/74/query?where=gatves_pavadinimas%20%3D%20%27" + encodedName + "%27" +
                "&outFields=*" +
                "&geometry=" + box.bottomLeft().getLng() + "%2C" +
                box.bottomLeft().getLat() + "%2C" +
                box.topRight().getLng() + "%2C" +
                box.topRight().getLat() +
                "&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outSR=4326&f=json";

        JsonNode response = restClient.get()
                .uri(URI.create(url))
                .retrieve()
                .requiredBody(JsonNode.class);

        JsonNode features = response.get("features");
        if (features == null || !features.isArray()) {
            return new IncidentStats(0, 0);
        }

        int injured = 0;
        int killed = 0;
        for (JsonNode feature : features) {
            JsonNode attrs = feature.path("attributes");
            injured += attrs.path("suzeistu_skaicius").asInt(0);
            killed += attrs.path("zuvusiu_skaicius").asInt(0);
        }

        return new IncidentStats(injured, killed);
    }
}