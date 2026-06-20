import { useState } from "react";
import { makeForumPost } from "../../utils/forumPost";
import { useAuth } from "../../context/AuthContext";

function ForumPost({ onClose, coordsLat, coordsLng }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  async function handlePost(e) {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in.");
      return;
    }

    if (!title.trim() || !body.trim()) {
      setError("Please fill in both title and content.");
      return;
    }
    if (title.trim().length < 10 || body.trim().length < 10) {
      setError("Title and body should be longer than 10characters");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await makeForumPost(user.id, title, body, coordsLat, coordsLng);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    alert('Post saved!');
    onClose(true);
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40">
      <div className="panel w-96 p-4">
        <div className="flex justify-between items-center mb-3">
          <p className="font-bold">New post</p>
          <button onClick={onClose} className="text-gray-400 hover:text-black cursor-pointer">✕</button>
        </div>
        <form onSubmit={handlePost}>
          <input
            type="text"
            className="w-full border rounded p-1 mb-2 text-sm"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            minLength={10}
            maxLength={50}
            required
          />
          <textarea
            className="w-full border rounded p-1 text-sm"
            rows={4}
            placeholder="Thoughts about the neighborhood..."
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
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForumPost;
