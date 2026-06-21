package com.vl.vilniuslife.service;

import com.vl.vilniuslife.model.*;
import com.vl.vilniuslife.repository.ForumCommentDislikedUserRepository;
import com.vl.vilniuslife.repository.ForumCommentLikedUserRepository;
import com.vl.vilniuslife.repository.ForumCommentsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.List;

@Service
public class ForumCommentService {

    @Autowired
    private ForumCommentsRepository repository;

    @Autowired
    private ForumCommentLikedUserRepository likedUserRepository;

    @Autowired
    private ForumCommentDislikedUserRepository dislikedUserRepository;

    @Autowired
    private ForumPostService forumPostService;

    @Autowired
    private UsersService usersService;

    public void postForumComment(ForumCommentRequest request, String email) {
        Users user = usersService.getUserByEmail(email);
        if (user == null) return;

        ForumPosts forumPost = forumPostService.getForumPost(request.getForumPostId());
        if (forumPost == null) return;

        repository.save(new ForumComments(user, forumPost, request.getContent()));
    }

    public ForumComments getForumComment(Integer commentId) {
        return repository.findById(commentId).orElse(null);
    }

    public void likeForumComment(Integer commentId, String email) {
        Users user = usersService.getUserByEmail(email);
        ForumComments comment = getForumComment(commentId);
        if (user == null || comment == null) return;

        if (likedUserRepository.findByForumCommentAndUser(comment, user).isPresent()) return;

        dislikedUserRepository.findByForumCommentAndUser(comment, user).ifPresent(dislikedUserRepository::delete);
        likedUserRepository.save(new ForumCommentLikedUser(comment, user));
    }

    public long getForumCommentLikeCount(Integer commentId) {
        ForumComments comment = getForumComment(commentId);
        if (comment == null) return 0;
        return likedUserRepository.countByForumComment(comment);
    }

    public long getForumCommentDislikeCount(Integer commentId) {
        ForumComments comment = getForumComment(commentId);
        if (comment == null) return 0;
        return dislikedUserRepository.countByForumComment(comment);
    }

    public void dislikeForumComment(Integer commentId, String email) {
        Users user = usersService.getUserByEmail(email);
        ForumComments comment = getForumComment(commentId);
        if (user == null || comment == null) return;

        if (dislikedUserRepository.findByForumCommentAndUser(comment, user).isPresent()) return;

        likedUserRepository.findByForumCommentAndUser(comment, user).ifPresent(likedUserRepository::delete);
        dislikedUserRepository.save(new ForumCommentDislikedUser(comment, user));
    }

    public void deleteForumComment(Integer commentId, String email) {
        Users user = usersService.getUserByEmail(email);
        ForumComments comment = getForumComment(commentId);
        if (user == null || comment == null) return;
        if (!comment.getUser().getId().equals(user.getId()) && !Boolean.TRUE.equals(user.getIsAdmin())) return;

        repository.delete(comment);
    }

    public List<ForumCommentResponse> getForumPostComments(Integer forumPostId) {
        ForumPosts forumPost = forumPostService.getForumPost(forumPostId);
        if (forumPost == null) return List.of();

        List<ForumComments> comments = repository.findByForumPostOrderByCreatedAtDesc(forumPost);
        List<ForumCommentResponse> response = new ArrayList<>();
        for (ForumComments comment : comments) {
            response.add(new ForumCommentResponse(
                    comment.getId(),
                    comment.getUser().getId(),
                    comment.getUser().getFname(),
                    comment.getUser().getLname(),
                    comment.getContent(),
                    comment.getCreatedAt()
            ));
        }
        return response;
    }
}
