package com.vl.vilniuslife.controller;

import com.vl.vilniuslife.model.SaveLocationRequest;
import com.vl.vilniuslife.model.SavedLocationResponse;
import com.vl.vilniuslife.service.SavedLocationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.security.Principal;
import java.util.List;

@RestController
public class SavedLocationsController {

    @Autowired
    private SavedLocationsService savedLocationsService;

    @PostMapping("/saveLocation")
    public SavedLocationResponse saveLocation(@RequestBody SaveLocationRequest request, Principal principal) {
        return savedLocationsService.saveLocation(principal.getName(), request);
    }

    @GetMapping("/savedLocations")
    public List<SavedLocationResponse> getSavedLocations(Principal principal) {
        return savedLocationsService.getSavedLocations(principal.getName());
    }

    @DeleteMapping("/savedLocations/{id}")
    public void deleteLocation(@PathVariable Integer id, Principal principal) {
        savedLocationsService.deleteLocation(principal.getName(), id);
    }
}
