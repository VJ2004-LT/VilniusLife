package com.vl.vilniuslife.repository;

import com.vl.vilniuslife.model.ForumComments;
import com.vl.vilniuslife.model.ForumPosts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ForumCommentsRepository extends JpaRepository<ForumComments, Integer> {

    List<ForumComments> findByForumPostOrderByCreatedAtDesc(ForumPosts forumPost);
}