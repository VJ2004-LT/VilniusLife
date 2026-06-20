package com.vl.vilniuslife.model;

import jakarta.persistence.*;

@Entity
@Table(name = "forum_comment_disliked_user")
public class ForumCommentDislikedUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forum_comment_id", nullable = false, foreignKey = @ForeignKey(name = "fk_comment_disliked_comment"))
    private ForumComments forumComment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_comment_disliked_user"))
    private Users user;

    public ForumCommentDislikedUser() {}

    public ForumCommentDislikedUser(ForumComments forumComment, Users user) {
        this.forumComment = forumComment;
        this.user = user;
    }

    public Integer getId() { return id; }
    public ForumComments getForumComment() { return forumComment; }
    public void setForumComment(ForumComments forumComment) { this.forumComment = forumComment; }
    public Users getUser() { return user; }
    public void setUser(Users user) { this.user = user; }
}
