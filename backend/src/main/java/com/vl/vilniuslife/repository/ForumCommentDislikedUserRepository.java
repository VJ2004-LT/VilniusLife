package com.vl.vilniuslife.repository;

import com.vl.vilniuslife.model.ForumCommentDislikedUser;
import com.vl.vilniuslife.model.ForumComments;
import com.vl.vilniuslife.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ForumCommentDislikedUserRepository extends JpaRepository<ForumCommentDislikedUser, Integer> {
    Optional<ForumCommentDislikedUser> findByForumCommentAndUser(ForumComments forumComment, Users user);
    long countByForumComment(ForumComments forumComment);
}
