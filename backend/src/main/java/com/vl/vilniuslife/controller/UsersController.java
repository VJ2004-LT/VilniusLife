package com.vl.vilniuslife.controller;

import com.vl.vilniuslife.model.Users;
import com.vl.vilniuslife.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
public class UsersController {

    @Autowired
    private UsersService usersService;

    @GetMapping("/users")
    public List<Users> getAllUsers(Principal principal) {
        return usersService.getAllUsers(principal.getName());
    }

    @DeleteMapping("/user/{id}/delete")
    public void deleteUser(@PathVariable Integer id, Principal principal) {
        usersService.deleteUser(id, principal.getName());
    }
}
