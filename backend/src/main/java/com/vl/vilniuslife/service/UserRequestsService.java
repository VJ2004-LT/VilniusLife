package com.vl.vilniuslife.service;

import com.vl.vilniuslife.model.UserRequestStatus;
import com.vl.vilniuslife.model.UserRequests;
import com.vl.vilniuslife.model.Users;
import com.vl.vilniuslife.repository.UserRequestsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserRequestsService {

    @Autowired
    private UserRequestsRepository repository;

    @Autowired
    private UsersService usersService;

    public void createRequest(String email, String requestText) {
        Users user = usersService.getUserByEmail(email);
        if (user == null) return;
        repository.save(new UserRequests(user, UserRequestStatus.PENDING.name(), requestText));
    }

    public List<UserRequests> getMyRequests(String email) {
        Users user = usersService.getUserByEmail(email);
        if (user == null) return List.of();
        return repository.findByUserAndIsDeletedFalse(user);
    }

    public void deleteMyRequest(Integer id, String email) {
        Users user = usersService.getUserByEmail(email);
        UserRequests request = repository.findById(id).orElse(null);
        if (request == null) return;
        if (!request.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        request.setDeleted(true);
        repository.save(request);
    }

    public List<UserRequests> getAllRequests(String email) {
        if (!usersService.isAdmin(email)) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        return repository.findAll();
    }

    public void deleteRequest(Integer id, String email) {
        if (!usersService.isAdmin(email)) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        repository.deleteById(id);
    }

    public void changeStatus(Integer id, String status, String email) {
        if (!usersService.isAdmin(email)) throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        try {
            UserRequestStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status: " + status);
        }

        UserRequests request = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        request.setStatus(status);
        repository.save(request);
    }
}
