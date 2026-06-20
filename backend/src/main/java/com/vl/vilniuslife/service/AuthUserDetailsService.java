package com.vl.vilniuslife.service;

import com.vl.vilniuslife.model.UserPassword;
import com.vl.vilniuslife.model.Users;
import com.vl.vilniuslife.repository.UserPasswordRepository;
import com.vl.vilniuslife.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthUserDetailsService implements UserDetailsService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private UserPasswordRepository userPasswordRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserPassword userPassword = userPasswordRepository.findById(user.getId())
                .orElseThrow(() -> new UsernameNotFoundException("Password not found"));

        return User.withUsername(email)
                .password(userPassword.getPassword())
                .roles("USER")
                .build();
    }
}
