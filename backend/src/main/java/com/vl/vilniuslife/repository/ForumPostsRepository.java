package com.vl.vilniuslife.repository;

import com.vl.vilniuslife.model.ForumPosts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ForumPostsRepository extends JpaRepository<ForumPosts, Integer> {
}