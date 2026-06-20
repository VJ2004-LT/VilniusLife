import { useState } from "react";
import { makeForumComment } from "../../utils/forumComment";
import { useAuth } from "../../context/AuthContext";
function ForumComment({ onClose, coordsLat, coordsLng, postId }) {
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  async function handleComment(e) {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in.");
      return;
    }
    if (!body.trim()) {
      setError("Comment is empty.");
      return;
    }
    if (body.trim().length < 10) {
      setError("Content must be at least 10 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    const result = await makeForumComment(user.id, postId, body);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40">
      <div className="panel w-96 p-4">
        <div className="flex justify-between items-center mb-3">
          <p className="font-bold">New Comment</p>
          <button onClick={onClose} className="text-gray-400 hover:text-black cursor-pointer">✕</button>
        </div>
          <form onSubmit={handleComment}>
          <textarea
            className="w-full border rounded p-1 text-sm"
            rows={4}
            placeholder="Thoughts about the post..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            minLength={10}
            maxLength={500}
            required
          />
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          <button
            type="submit"
            className="mt-2 w-full py-1 rounded bg-primary text-white text-sm cursor-pointer hover:bg-secondary"
            disabled={loading}
          >
            {loading ? 'Posting comment...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForumComment;
