package com.vl.vilniuslife.service;

import com.vl.vilniuslife.model.Locations;
import com.vl.vilniuslife.repository.LocationsRepository;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationsService {

    @Autowired
    private LocationsRepository repository;

    public List<Locations> getLocations() {
        return repository.findAll();
    }

    public Locations saveLocation(String category, Double lng, Double lat){
        Point point = new GeometryFactory().createPoint(new Coordinate(lng, lat));
        return repository.save(new Locations(category, point));
    }

    public Locations findOrCreateLocation(String category, Double lng, Double lat) {
        return repository.findByCategoryAndCoords(category, lng, lat)
                .orElseGet(() -> saveLocation(category, lng, lat));
    }
}
