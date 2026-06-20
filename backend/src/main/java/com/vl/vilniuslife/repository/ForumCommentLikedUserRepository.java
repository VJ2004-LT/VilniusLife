package com.vl.vilniuslife.repository;

import com.vl.vilniuslife.model.ForumCommentLikedUser;
import com.vl.vilniuslife.model.ForumComments;
import com.vl.vilniuslife.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ForumCommentLikedUserRepository extends JpaRepository<ForumCommentLikedUser, Integer> {
    Optional<ForumCommentLikedUser> findByForumCommentAndUser(ForumComments forumComment, Users user);
    long countByForumComment(ForumComments forumComment);
}
