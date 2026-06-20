package com.vl.vilniuslife.service;

import com.vl.vilniuslife.model.Users;
import com.vl.vilniuslife.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UsersService {

    @Autowired
    private UsersRepository repository;

    public Users getUser(Integer userId){
        return repository.findById(userId).orElse(null);
    }

    public Users getUserByEmail(String email) {
        return repository.findByEmail(email).orElse(null);
    }

    public boolean isAdmin(String email) {
        Users user = getUserByEmail(email);
        return user != null && Boolean.TRUE.equals(user.getIsAdmin());
    }

    public List<Users> getAllUsers(String email) {
        if (!isAdmin(email)) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        return repository.findAll();
    }

    public void deleteUser(Integer targetId, String email) {
        Users caller = getUserByEmail(email);
        if (!isAdmin(email) && !caller.getId().equals(targetId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        repository.deleteById(targetId);
    }
}
