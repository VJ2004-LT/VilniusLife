package com.vl.vilniuslife.controller;

import com.vl.vilniuslife.model.CreateAccountRequest;
import com.vl.vilniuslife.model.LoginRequest;
import com.vl.vilniuslife.model.Users;
import com.vl.vilniuslife.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import java.security.Principal;

@RestController
public class AuthController {

    @Autowired
    AuthService service;

    @PostMapping("/createAccount")
    void createAccount(@Valid @RequestBody CreateAccountRequest request) {
        service.createAccount(request);
    }

    @PostMapping("/login")
    Users login(@RequestBody LoginRequest request, HttpServletRequest req, HttpServletResponse res) {
        return service.login(request, req, res);
    }

    @PostMapping("/logout")
    void logout(HttpServletRequest req) {
        service.logout(req);
    }

    @GetMapping("/auth/me")
    public ResponseEntity<Void> me(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/auth/admin")
    public ResponseEntity<Void> admin(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        if (!service.isAdmin(principal.getName())) return ResponseEntity.status(403).build();
        return ResponseEntity.ok().build();
    }

}
