package com.vl.vilniuslife.controller;

import com.vl.vilniuslife.model.GeoPoint;
import com.vl.vilniuslife.model.NoiseMeasurementResponse;
import com.vl.vilniuslife.service.NoiseMeasurementsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NoiseMeasurementsController {

    @Autowired
    NoiseMeasurementsService service;

    @GetMapping("/noiseMeasurement")
    public NoiseMeasurementResponse getNoiseMeasurement(@RequestParam double lat, @RequestParam double lon) {
        return service.getNoiseMeasurement(new GeoPoint(lat, lon));
    }
}
