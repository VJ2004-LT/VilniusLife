package com.vl.vilniuslife.model;

import jakarta.persistence.*;

@Entity
@Table(name = "forum_post_disliked_user")
public class ForumPostDislikedUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forum_post_id", nullable = false, foreignKey = @ForeignKey(name = "fk_post_disliked_post"))
    private ForumPosts forumPost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_post_disliked_user"))
    private Users user;

    public ForumPostDislikedUser() {}

    public ForumPostDislikedUser(ForumPosts forumPost, Users user) {
        this.forumPost = forumPost;
        this.user = user;
    }

    public Integer getId() { return id; }
    public ForumPosts getForumPost() { return forumPost; }
    public void setForumPost(ForumPosts forumPost) { this.forumPost = forumPost; }
    public Users getUser() { return user; }
    public void setUser(Users user) { this.user = user; }
}
