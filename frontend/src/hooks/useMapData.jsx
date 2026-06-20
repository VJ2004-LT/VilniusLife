import { useState, useEffect } from "react";
import { getProblems } from "../utils/getProblems";
import { getForumPosts } from "../utils/forumPost";

export function useMapData() {
  const [problems, setProblems] = useState([]);
  const [problemsLoading, setProblemsLoading] = useState(true);
  const [problemsError, setProblemsError] = useState(false);

  const [forumPosts, setForumPosts] = useState([]);
  const [forumPostsLoading, setForumPostsLoading] = useState(true);
  const [forumPostsError, setForumPostsError] = useState(false);

  useEffect(() => {
    getProblems().then(data => {
      if (data.length === 0) setProblemsError(true);
      else setProblems(data);
      setProblemsLoading(false);
    });
  }, []);

  useEffect(() => {
    getForumPosts().then(data => {
      if (data.length === 0) setForumPostsError(true);
      else setForumPosts(data);
      setForumPostsLoading(false);
    });
  }, []);

  function refreshForumPosts() {
    setForumPostsLoading(true);
    setForumPostsError(false);
    getForumPosts().then(data => {
      if (data.length === 0) setForumPostsError(true);
      else setForumPosts(data);
      setForumPostsLoading(false);
    });
  }

  return { problems, problemsLoading, problemsError, forumPosts, forumPostsLoading, forumPostsError, refreshForumPosts  };
}
