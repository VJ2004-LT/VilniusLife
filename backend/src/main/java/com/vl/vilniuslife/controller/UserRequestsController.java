package com.vl.vilniuslife.controller;

import com.vl.vilniuslife.model.UserRequests;
import com.vl.vilniuslife.service.UserRequestsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
public class UserRequestsController {

    @Autowired
    private UserRequestsService service;

    @PostMapping("/request")
    public void createRequest(@RequestBody String requestText, Principal principal) {
        service.createRequest(principal.getName(), requestText);
    }

    @GetMapping("/myRequests")
    public List<UserRequests> getMyRequests(Principal principal) {
        return service.getMyRequests(principal.getName());
    }

    @DeleteMapping("/myRequest/{id}/delete")
    public void deleteMyRequest(@PathVariable Integer id, Principal principal) {
        service.deleteMyRequest(id, principal.getName());
    }

    @GetMapping("/allRequests")
    public List<UserRequests> getAllRequests(Principal principal) {
        return service.getAllRequests(principal.getName());
    }

    @DeleteMapping("/request/{id}/delete")
    public void deleteRequest(@PathVariable Integer id, Principal principal) {
        service.deleteRequest(id, principal.getName());
    }

    @PostMapping("/request/{id}/changeStatus/{status}")
    public void changeStatus(@PathVariable Integer id, @PathVariable String status, Principal principal) {
        service.changeStatus(id, status, principal.getName());
    }
}
