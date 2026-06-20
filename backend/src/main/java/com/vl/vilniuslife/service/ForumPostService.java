package com.vl.vilniuslife.service;

import com.vl.vilniuslife.model.*;
import com.vl.vilniuslife.repository.ForumPostDislikedUserRepository;
import com.vl.vilniuslife.repository.ForumPostLikedUserRepository;
import com.vl.vilniuslife.repository.ForumPostsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ForumPostService {

    @Autowired
    private ForumPostsRepository repository;

    @Autowired
    private ForumPostLikedUserRepository likedUserRepository;

    @Autowired
    private ForumPostDislikedUserRepository dislikedUserRepository;

    @Autowired
    private UsersService usersService;

    @Autowired
    private LocationsService locationsService;

    public void forumPost(ForumPostRequest request) {
        Locations location = locationsService.saveLocation("forumPost", request.getCoordsLng(), request.getCoordsLat());
        Users user = usersService.getUser(request.getUserId());
        if (user == null) return;

        repository.save(new ForumPosts(
                            user,
                            location,
                            request.getContent(),
                            request.getTitle())
        );
    }

    public ForumPosts getForumPost(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public void likeForumPost(Integer postId, String email) {
        Users user = usersService.getUserByEmail(email);
        ForumPosts post = getForumPost(postId);
        if (user == null || post == null) return;

        if (likedUserRepository.findByForumPostAndUser(post, user).isPresent()) return;

        dislikedUserRepository.findByForumPostAndUser(post, user).ifPresent(dislikedUserRepository::delete);
        likedUserRepository.save(new ForumPostLikedUser(post, user));
    }

    public long getForumPostLikeCount(Integer postId) {
        ForumPosts post = getForumPost(postId);
        if (post == null) return 0;
        return likedUserRepository.countByForumPost(post);
    }

    public long getForumPostDislikeCount(Integer postId) {
        ForumPosts post = getForumPost(postId);
        if (post == null) return 0;
        return dislikedUserRepository.countByForumPost(post);
    }

    public void dislikeForumPost(Integer postId, String email) {
        Users user = usersService.getUserByEmail(email);
        ForumPosts post = getForumPost(postId);
        if (user == null || post == null) return;

        if (dislikedUserRepository.findByForumPostAndUser(post, user).isPresent()) return;

        likedUserRepository.findByForumPostAndUser(post, user).ifPresent(likedUserRepository::delete);
        dislikedUserRepository.save(new ForumPostDislikedUser(post, user));
    }

    public void deleteForumPost(Integer postId, String email) {
        Users user = usersService.getUserByEmail(email);
        ForumPosts post = getForumPost(postId);
        if (user == null || post == null) return;
        if (!post.getUser().getId().equals(user.getId()) && !Boolean.TRUE.equals(user.getIsAdmin())) return;

        repository.delete(post);
    }

    public List<ForumPostResponse> getForumPosts() {
        List<ForumPosts> forumPosts = repository.findAll();
        List<ForumPostResponse> forumPostResponse = new ArrayList<>();
        for (ForumPosts forumPost : forumPosts) {
            forumPostResponse.add(new ForumPostResponse(forumPost.getId(),
                    forumPost.getUser().getId(),
                    forumPost.getUser().getFname(),
                    forumPost.getUser().getLname(),
                    forumPost.getContent(),
                    forumPost.getTitle(),
                    forumPost.getLocation().getGeo().getX(),
                    forumPost.getLocation().getGeo().getY(),
                    forumPost.getCreatedAt()
            ));
        }
        return forumPostResponse;
    }
}
