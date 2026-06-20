package com.vl.vilniuslife.service;

import com.vl.vilniuslife.model.CreateAccountRequest;
import com.vl.vilniuslife.model.LoginRequest;
import com.vl.vilniuslife.model.UserPassword;
import com.vl.vilniuslife.model.Users;
import com.vl.vilniuslife.repository.UserPasswordRepository;
import com.vl.vilniuslife.repository.UsersRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private UserPasswordRepository userPasswordRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private SecurityContextRepository securityContextRepository;

    @Autowired
    private UsersService usersService;

    public void createAccount(CreateAccountRequest request) {
        if (usersRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }

        Users user = usersRepository.save(new Users(request.getEmail(), request.getFname(), request.getLname()));

        String hashed = passwordEncoder.encode(request.getPassword());
        userPasswordRepository.save(new UserPassword(user.getId(), hashed));
    }

    public boolean isAdmin(String email) {
        return usersService.isAdmin(email);
    }

    public void logout(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
    }

    public Users login(LoginRequest request, HttpServletRequest req, HttpServletResponse res) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, req, res);

        return usersRepository.findByEmail(request.getEmail()).orElseThrow();
    }
}
