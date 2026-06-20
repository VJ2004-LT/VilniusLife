const BACKEND_URL = import.meta.env.VITE_API_URL;

export async function makeForumComment(userId, forumPostId, content,) {
  try {
    const res = await fetch(`${BACKEND_URL}/forumComment`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        forumPostId,
        content,
      }),
    });
    if (res.status === 403) return { error: "You must be logged in." };
    if (!res.ok) return { error: "Failed to comment." };
    return { success: true };
  } catch (e) {
    return { error: "Failed to connect to server." };
  }
}

export async function getForumComments(forumPostId) {
  try {

    const res = await fetch(`${BACKEND_URL}/forumComments/${forumPostId}`);

    if (!res.ok) return null;

    return await res.json();
  } catch (e) {
    return null;
  }
}
export async function deleteForumComment(commentId) {
  try {
    const res = await fetch(`${BACKEND_URL}/forumComment/${commentId}/delete`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.status === 403) return { error: "You can only delete your own comments." };
    if (!res.ok) return { error: "Failed to delete comment." };
    return { success: true };
  } catch (e) {
    return { error: "Failed to connect to server." };
  }
}
export async function likeForumComment(commentId) {
  try {
    const res = await fetch(`${BACKEND_URL}/forumComment/${commentId}/like`, {
      method: "POST", credentials: "include",
    });
    if (res.status === 403) return { error: "You must be logged in." };
    if (!res.ok) return { error: "Failed to like comment." };
    return { success: true };
  } catch (e) {
    return { error: "Failed to connect to server." };
  }
}

export async function dislikeForumComment(commentId) {
  try {
    const res = await fetch(`${BACKEND_URL}/forumComment/${commentId}/dislike`, {
      method: "POST", credentials: "include",
    });
    if (res.status === 403) return { error: "You must be logged in." };
    if (!res.ok) return { error: "Failed to dislike comment." };
    return { success: true };
  } catch (e) {
    return { error: "Failed to connect to server." };
  }
}

export async function getForumCommentLikes(commentId) {
  try {
    const res = await fetch(`${BACKEND_URL}/forumComment/${commentId}/likes`);
    if (!res.ok) return 0;
    return await res.json();
  } catch (e) { return 0; }
}

export async function getForumCommentDislikes(commentId) {
  try {
    const res = await fetch(`${BACKEND_URL}/forumComment/${commentId}/dislikes`);
    if (!res.ok) return 0;
    return await res.json();
  } catch (e) { return 0; }
}
