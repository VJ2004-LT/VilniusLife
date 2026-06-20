package com.vl.vilniuslife.repository;

import com.vl.vilniuslife.model.UserRequests;
import com.vl.vilniuslife.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserRequestsRepository extends JpaRepository<UserRequests, Integer> {

    List<UserRequests> findByUserAndIsDeletedFalse(Users user);
}