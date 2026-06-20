package com.vl.vilniuslife.repository;

import com.vl.vilniuslife.model.ForumPostLikedUser;
import com.vl.vilniuslife.model.ForumPosts;
import com.vl.vilniuslife.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ForumPostLikedUserRepository extends JpaRepository<ForumPostLikedUser, Integer> {
    Optional<ForumPostLikedUser> findByForumPostAndUser(ForumPosts forumPost, Users user);
    long countByForumPost(ForumPosts forumPost);
}
