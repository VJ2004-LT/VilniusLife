package com.vl.vilniuslife.controller;

import com.vl.vilniuslife.model.RouteSafetyRequest;
import com.vl.vilniuslife.service.RouteSafetyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RouteSafety {

    @Autowired
    RouteSafetyService service;

    @PostMapping("/routeSafety")
    int getRouteSafety(@RequestBody RouteSafetyRequest route) {
        return service.getRouteSafety(route);
    }
}
