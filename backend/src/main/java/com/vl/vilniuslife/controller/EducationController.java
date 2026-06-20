package com.vl.vilniuslife.controller;

import com.vl.vilniuslife.model.School;
import com.vl.vilniuslife.model.SchoolsByAddressRequest;
import com.vl.vilniuslife.service.EducationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@RestController
public class EducationController {

    @Autowired
    private EducationService service;

    @PostMapping("/schoolsByAddress")
    public List<School> getSchoolsByAddress(@RequestBody SchoolsByAddressRequest request){
        return service.getSchoolsByAddress(request);
    }
}
