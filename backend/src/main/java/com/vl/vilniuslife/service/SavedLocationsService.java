package com.vl.vilniuslife.service;

import com.vl.vilniuslife.model.Locations;
import com.vl.vilniuslife.model.SaveLocationRequest;
import com.vl.vilniuslife.model.SavedLocationResponse;
import com.vl.vilniuslife.model.SavedLocations;
import com.vl.vilniuslife.model.Users;
import com.vl.vilniuslife.repository.SavedLocationsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SavedLocationsService {

    @Autowired
    private SavedLocationsRepository savedLocationsRepository;

    @Autowired
    private UsersService usersService;

    @Autowired
    private LocationsService locationsService;

    public SavedLocationResponse saveLocation(String email, SaveLocationRequest request) {
        Users user = usersService.getUserByEmail(email);
        if (user == null) return null;

        Locations location = locationsService.findOrCreateLocation("Saves", request.getLng(), request.getLat());

        SavedLocations saved = savedLocationsRepository.save(new SavedLocations(
                user.getId(),
                location.getId(),
                request.getRiskScore(),
                request.getAvgNoiseLevel(),
                request.getAddress(),
                request.getSchools(),
                request.getRouteInfos()
        ));

       return new SavedLocationResponse(
                saved.getLocationId(),
                saved.getRiskScore(),
                saved.getAvgNoiseLevel(),
                saved.getAddress(),
                saved.getSavedAt(),
                saved.getSchools(),
                saved.getRouteInfos(),
                location.getGeo().getY(),
                location.getGeo().getX()
        );
    }

    public List<SavedLocationResponse> getSavedLocations(String email) {
        Users user = usersService.getUserByEmail(email);
        if (user == null) return List.of();

        List<SavedLocations> saved = savedLocationsRepository.findByUserId(user.getId());
        List<SavedLocationResponse> responses = new ArrayList<>();
        for (SavedLocations s : saved) {
            responses.add(new SavedLocationResponse(
                    s.getLocationId(),
                    s.getRiskScore(),
                    s.getAvgNoiseLevel(),
                    s.getAddress(),
                    s.getSavedAt(),
                    s.getSchools(),
                    s.getRouteInfos(),
                    s.getLocation().getGeo().getY(),
                    s.getLocation().getGeo().getX()
            ));
        }
        return responses;
    }
    public void deleteLocation(String email, Integer locationId) {
        Users user = usersService.getUserByEmail(email);
        if (user == null) return;

        SavedLocations.SavedLocationsId id = new SavedLocations.SavedLocationsId(user.getId(), locationId);
        savedLocationsRepository.deleteById(id);
    }
}
