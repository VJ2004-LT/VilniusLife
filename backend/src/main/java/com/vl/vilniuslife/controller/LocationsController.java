package com.vl.vilniuslife.controller;

import com.vl.vilniuslife.model.Locations;
import com.vl.vilniuslife.service.LocationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class LocationsController {

    @Autowired
    private LocationsService service;

    @GetMapping("/locations")
    public List<Locations> getLocations(){
        return service.getLocations();
    }
}
