package com.vl.vilniuslife.controller;

import com.vl.vilniuslife.model.SafetyInRadiusRequest;
import com.vl.vilniuslife.service.SafetyInRadiusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SafetyInRadiusController {

    @Autowired
    SafetyInRadiusService service;

    @PostMapping("/safetyInRadius")
    int getSafetyInRadius(@RequestBody SafetyInRadiusRequest request) {
        return service.getSafetyInRadius(request);
    }
}
