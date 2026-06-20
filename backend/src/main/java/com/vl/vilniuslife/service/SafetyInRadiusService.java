package com.vl.vilniuslife.service;

import com.vl.vilniuslife.model.GeoPoint;
import com.vl.vilniuslife.model.SafetyInRadiusRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;

import java.net.URI;

@Service
public class SafetyInRadiusService {

    private static final int METERS_IN_LATITUDE_DEGREE = 111320;

    private record BoundingBox(GeoPoint bottomLeft, GeoPoint topRight) {}
    private record IncidentStats(int injured, int killed) {}

    public int getSafetyInRadius(SafetyInRadiusRequest request) {
        BoundingBox box = calculateBoundingBox(request.getGeoPoint(), request.getRadius());
        IncidentStats stats = queryIncidents(RestClient.create(), box);
        int safety = 100 - stats.injured() * 2 - stats.killed() * 10;
        return Math.max(safety, 0);
    }

    private BoundingBox calculateBoundingBox(GeoPoint center, int radiusMeters) {
        double latRadians = center.getLat() * Math.PI / 180.0;
        double latDelta = (double) radiusMeters / METERS_IN_LATITUDE_DEGREE;
        double lngDelta = (double) radiusMeters / (METERS_IN_LATITUDE_DEGREE * Math.cos(latRadians));

        return new BoundingBox(
                new GeoPoint(center.getLat() - latDelta, center.getLng() - lngDelta),
                new GeoPoint(center.getLat() + latDelta, center.getLng() + lngDelta)
        );
    }

    private IncidentStats queryIncidents(RestClient restClient, BoundingBox box) {
        String url = "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis2/Transportas_public/MapServer/74/query?where=1%3D1" +
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
