import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getForumPosts, deleteForumPost, likeForumPost, dislikeForumPost, getForumPostLikes, getForumPostDislikes } from "../utils/forumPost";
import { getForumComments, deleteForumComment, likeForumComment, dislikeForumComment, getForumCommentLikes, getForumCommentDislikes } from "../utils/forumComment";
import ForumComment from "../components/map/ForumComment";
import { useAuth } from "../context/AuthContext";

function ForumPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showComment, setShowComment] = useState(false);
  const { user } = useAuth();
  const [postLikes, setPostLikes] = useState(0);
  const [postDislikes, setPostDislikes] = useState(0);
  const [commentVotes, setCommentVotes] = useState({});
  const [actionError, setActionError] = useState(null);
  const [actionErrorText, setActionErrorText] = useState(null);
  const topRef = useRef(null);

  useEffect(() => {
    if (actionError) {
      setActionErrorText(actionError);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
      const t = setTimeout(() => setActionError(null), 100);
      return () => clearTimeout(t);
    }
  }, [actionError])

  useEffect(() => {
    let foundPost = null;

    getForumPosts()
      .then(posts => {
        const found = posts.find(p => p.id === Number(id));
        if (!found) { setError("Post not found."); return Promise.reject("not found"); }
        foundPost = found;
        setPost(found);
        return getForumComments(found.id);
      })
      .then(async data => {
        if (!data) return;
        setComments(data);

        const votes = {};
        await Promise.all(data.map(async c => {
          votes[c.id] = {
            likes: await getForumCommentLikes(c.id),
            dislikes: await getForumCommentDislikes(c.id),
          };
        }));
        setCommentVotes(votes);

        if (foundPost) {
          setPostLikes(await getForumPostLikes(foundPost.id));
          setPostDislikes(await getForumPostDislikes(foundPost.id));
        }
      })
      .catch(err => { if (err !== "not found") setError("Failed to load post."); })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDeletePost() {
    if (!confirm("Delete this post?")) return;
    const result = await deleteForumPost(post.id);
    if (result.error) { alert(result.error); return; }
    navigate("/forum");
  }

  async function handleDeleteComment(commentId) {
    if (!confirm("Delete this comment?")) return;
    const result = await deleteForumComment(commentId);
    if (result.error) { alert(result.error); return; }
    setComments(prev => prev.filter(c => c.id !== commentId));
  }

  async function handleLikePost() {
    if (!user) { setActionError("You must be logged in."); return; } 
    const result = await likeForumPost(post.id);
    if (result.error) { setActionError(result.error); return; }
    setPostLikes(await getForumPostLikes(post.id));
    setPostDislikes(await getForumPostDislikes(post.id));
  }

  async function handleDislikePost() {
    if (!user) { setActionError("You must be logged in."); return; }
    const result = await dislikeForumPost(post.id);
    if (result.error) { setActionError(result.error); return; }
    setPostLikes(await getForumPostLikes(post.id));
    setPostDislikes(await getForumPostDislikes(post.id));
  }

  async function handleLikeComment(commentId) {
    if (!user) { setActionError("You must be logged in."); return; }
    const result = await likeForumComment(commentId);
    if (result.error) { setActionError(result.error); return; }
    const likes = await getForumCommentLikes(commentId);
    const dislikes = await getForumCommentDislikes(commentId);
    setCommentVotes(prev => ({ ...prev, [commentId]: { likes, dislikes } }));
  }

  async function handleDislikeComment(commentId) {
    if (!user) { setActionError("You must be logged in."); return; }
    const result = await dislikeForumComment(commentId);
    if (result.error) { setActionError(result.error); return; }
    const likes = await getForumCommentLikes(commentId);
    const dislikes = await getForumCommentDislikes(commentId);
    setCommentVotes(prev => ({ ...prev, [commentId]: { likes, dislikes } }));
  }

  if (loading) return <div className="flex flex-1 justify-center items-center">Loading...</div>;
  if (error) return <div className="flex flex-1 justify-center items-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col flex-1 h-full p-6 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-4" ref={topRef} >
          <button
            onClick={() => navigate('/forum')}
            className="text-sm px-4 py-2 bg-white border border-black/50 rounded-lg shadow hover:bg-gray-50 cursor-pointer"
          >
            Back to forum
          </button>
          <button
            onClick={() => navigate(`/map?postId=${post.id}`)}
            className="text-sm px-4 py-2 bg-white border border-black/50 rounded-lg shadow hover:bg-gray-50 cursor-pointer"
          >          
            View on map
          </button>
          {actionErrorText && <p className="text-sm text-red-500">{actionErrorText}</p>}
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5 border border-black/50 mb-6">
          <div className="flex justify-end">
            {(user?.id === post.userId || user?.isAdmin) && (
              <button onClick={handleDeletePost} className="text-xs text-red-400 hover:text-red-600 cursor-pointer">
                Delete post
              </button>
            )}
          </div>
          <h1 className="text-xl font-bold mb-2 break-words">{post.title}</h1>
          <p className="text-sm mb-4 break-words">{post.content}</p>
          <div className="flex justify-between items-center text-xs">
            <span>{post.userFname} {post.userLname}</span>

            <div className="flex items-center gap-3">
              <button onClick={handleLikePost} className="flex items-center gap-1 cursor-pointer hover:text-green-600">
                👍 {postLikes}
              </button>
              <button onClick={handleDislikePost} className="flex items-center gap-1 cursor-pointer hover:text-red-600">
                👎 {postDislikes}
              </button>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 border border-black/50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">
              Comments {comments.length > 0 && <span className="font-normal text-sm">({comments.length})</span>}
            </h2>
            <button
              onClick={() => setShowComment(true)}
             className="text-sm px-3 py-1 bg-primary text-white rounded-lg hover:bg-secondary cursor-pointer"
           >
              + Add comment
            </button>
          </div>
          {showComment && (
            <ForumComment
              postId={post.id}
              onClose={() => {
                setShowComment(false);
                getForumComments(post.id).then(data => { if (data) setComments(data); });
              }}
            />
          )}
          {comments.length === 0 ? (
            <p className="text-sm">No comments yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {[...comments].sort((a, b) => (commentVotes[b.id]?.likes ?? 0) - (commentVotes[a.id]?.likes ?? 0)).map(comment => (
                <div key={comment.id} className="border-b pb-3 last:border-0 last:pb-0">
                  {(user?.id === comment.userId || user?.isAdmin) && (
                    <button onClick={() => handleDeleteComment(comment.id)} className="text-xs text-red-400 hover:text-red-600 cursor-pointer mb-1 block">
                      Delete
                    </button>
                  )}
                  <p className="text-sm mb-2 break-words">{comment.content}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium">{comment.userFirstName} {comment.userLastName}</span>
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleLikeComment(comment.id)} className="flex items-center gap-1 cursor-pointer hover:text-green-600">
                        👍 {commentVotes[comment.id]?.likes ?? 0}
                      </button>
                      <button onClick={() => handleDislikeComment(comment.id)} className="flex items-center gap-1 cursor-pointer hover:text-red-600">
                        👎 {commentVotes[comment.id]?.dislikes ?? 0}
                      </button>
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForumPost;
