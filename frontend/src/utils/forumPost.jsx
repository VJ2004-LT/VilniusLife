const BACKEND_URL = import.meta.env.VITE_API_URL;

export async function makeForumPost(userId, title, content, coordsLat, coordsLng) {
  try {
    const res = await fetch(`${BACKEND_URL}/forumPost`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        title,
        content,
        coordsLat,
        coordsLng,
      }),
    });
    if (res.status === 403) return { error: "You must be logged in." };
    if (!res.ok) return { error: "Failed to post." };
    return { success: true };
  } catch (e) {
    return { error: "Failed to connect to server." };
  }
}

export async function getForumPosts() {
  try {
    const res = await fetch(`${BACKEND_URL}/forumPosts`);
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}
export async function deleteForumPost(postId) {
  try {
    const res = await fetch(`${BACKEND_URL}/forumPost/${postId}/delete`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.status === 403) return { error: "You can only delete your own posts." };
    if (!res.ok) return { error: "Failed to delete post." };
    return { success: true };
  } catch (e) {
    return { error: "Failed to connect to server." };
  }
}
export async function likeForumPost(postId) {
  try {
    const res = await fetch(`${BACKEND_URL}/forumPost/${postId}/like`, {
      method: "POST", credentials: "include",
    });
    if (res.status === 403) return { error: "You must be logged in." };
    if (!res.ok) return { error: "Failed to like post." };
    return { success: true };
  } catch (e) {
    return { error: "Failed to connect to server." };
  }
}

export async function dislikeForumPost(postId) {
  try {
    const res = await fetch(`${BACKEND_URL}/forumPost/${postId}/dislike`, {
      method: "POST", credentials: "include",
    });
    if (res.status === 403) return { error: "You must be logged in." };
    if (!res.ok) return { error: "Failed to dislike post." };
    return { success: true };
  } catch (e) {
    return { error: "Failed to connect to server." };
  }
}

export async function getForumPostLikes(postId) {
  try {
    const res = await fetch(`${BACKEND_URL}/forumPost/${postId}/likes`);
    if (!res.ok) return 0;
    return await res.json();
  } catch (e) { return 0; }
}

export async function getForumPostDislikes(postId) {
  try {
    const res = await fetch(`${BACKEND_URL}/forumPost/${postId}/dislikes`);
    if (!res.ok) return 0;
    return await res.json();
  } catch (e) { return 0; }
}
