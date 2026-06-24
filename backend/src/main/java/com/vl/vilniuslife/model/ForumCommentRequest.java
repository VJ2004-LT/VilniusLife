package com.vl.vilniuslife.model;

public class ForumCommentRequest {

    private Integer forumPostId;
    private String content;

    public ForumCommentRequest(Integer forumPostId, String content) {
        this.forumPostId = forumPostId;
        this.content = content;
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
