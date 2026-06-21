package com.vl.vilniuslife.controller;

import com.vl.vilniuslife.model.ForumPostRequest;
import com.vl.vilniuslife.model.ForumPostResponse;
import com.vl.vilniuslife.service.ForumPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
public class ForumPostController {

    @Autowired
    private ForumPostService service;

    @PostMapping("/forumPost")
    public void forumPost(@RequestBody ForumPostRequest forumPostRequest, Principal principal) {
        service.forumPost(forumPostRequest, principal.getName());
    }

    @GetMapping("/forumPosts")
    public List<ForumPostResponse> getForumPosts() {
        return service.getForumPosts();
    }

    @DeleteMapping("/forumPost/{id}/delete")
    public void deleteForumPost(@PathVariable Integer id, Principal principal) {
        service.deleteForumPost(id, principal.getName());
    }

    @PostMapping("/forumPost/{id}/like")
    public void likeForumPost(@PathVariable Integer id, Principal principal) {
        service.likeForumPost(id, principal.getName());
    }

    @PostMapping("/forumPost/{id}/dislike")
    public void dislikeForumPost(@PathVariable Integer id, Principal principal) {
        service.dislikeForumPost(id, principal.getName());
    }

    @GetMapping("/forumPost/{id}/likes")
    public long getForumPostLikeCount(@PathVariable Integer id) {
        return service.getForumPostLikeCount(id);
    }

    @GetMapping("/forumPost/{id}/dislikes")
    public long getForumPostDislikeCount(@PathVariable Integer id) {
        return service.getForumPostDislikeCount(id);
    }
}
