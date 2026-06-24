package com.vl.vilniuslife.controller;

import com.vl.vilniuslife.model.ForumCommentRequest;
import com.vl.vilniuslife.model.ForumCommentResponse;
import com.vl.vilniuslife.service.ForumCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
public class ForumCommentController {

    @Autowired
    private ForumCommentService service;

    @PostMapping("/forumComment")
    public void postForumComment(@RequestBody ForumCommentRequest request, Principal principal) {
        service.postForumComment(request, principal.getName());
    }

    @GetMapping("/forumComments/{forumPostId}")
    public List<ForumCommentResponse> getForumPostComments(@PathVariable Integer forumPostId) {
        return service.getForumPostComments(forumPostId);
    }

    @DeleteMapping("/forumComment/{id}/delete")
    public void deleteForumComment(@PathVariable Integer id, Principal principal) {
        service.deleteForumComment(id, principal.getName());
    }

    @PostMapping("/forumComment/{id}/like")
    public void likeForumComment(@PathVariable Integer id, Principal principal) {
        service.likeForumComment(id, principal.getName());
    }

    @PostMapping("/forumComment/{id}/dislike")
    public void dislikeForumComment(@PathVariable Integer id, Principal principal) {
        service.dislikeForumComment(id, principal.getName());
    }

    @GetMapping("/forumComment/{id}/likes")
    public long getForumCommentLikeCount(@PathVariable Integer id) {
        return service.getForumCommentLikeCount(id);
    }

    @GetMapping("/forumComment/{id}/dislikes")
    public long getForumCommentDislikeCount(@PathVariable Integer id) {
        return service.getForumCommentDislikeCount(id);
    }
}
