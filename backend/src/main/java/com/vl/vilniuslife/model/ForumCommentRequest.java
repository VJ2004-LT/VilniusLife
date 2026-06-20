package com.vl.vilniuslife.model;

public class ForumCommentRequest {

    private Integer userId;
    private Integer forumPostId;
    private String content;

    public ForumCommentRequest(Integer userId, Integer forumPostId, String content) {
        this.userId = userId;
        this.forumPostId = forumPostId;
        this.content = content;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getForumPostId() {
        return forumPostId;
    }

    public void setForumPostId(Integer forumPostId) {
        this.forumPostId = forumPostId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
