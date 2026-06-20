package com.vl.vilniuslife.model;

import jakarta.persistence.*;
import org.springframework.data.domain.Persistable;

@Entity
@Table(name = "user_password")
public class UserPassword implements Persistable<Integer> {

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @Column(nullable = false, length = 255)
    private String password;

    @Transient
    private boolean isNew = true;

    public UserPassword() {}

    public UserPassword(Integer userId, String password) {
        this.userId = userId;
        this.password = password;
    }

    @Override
    public Integer getId() {
        return userId;
    }

    @Override
    public boolean isNew() {
        return isNew;
    }

    @PostPersist
    @PostLoad
    void markNotNew() {
        this.isNew = false;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
