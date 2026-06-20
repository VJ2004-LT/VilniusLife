import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getForumPosts, getForumPostLikes, getForumPostDislikes } from "../utils/forumPost";

const PAGE_SIZE = 4;

function Forum() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [forumPosts, setForumPosts] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [postVotes, setPostVotes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getForumPosts()
      .then(async data => {
        setForumPosts(data);
        const votes = {};
        await Promise.all(data.map(async post => {
          votes[post.id] = {
            likes: await getForumPostLikes(post.id),
            dislikes: await getForumPostDislikes(post.id),
          };
        }));
        setPostVotes(votes);
      })
      .catch(() => setError("Failed to load posts."))
      .finally(() => setLoading(false));
  }, []);

  const truncate = (text, max = 100) => {
    if (!text) return "";
    return text.length > max ? text.slice(0, max) + "..." : text;
  };

  const filtered = forumPosts.filter(post => {
    const q = query.toLowerCase();
    const fullName = `${post.userFname} ${post.userLname}`.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q) ||
      fullName.includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "likes") return (postVotes[b.id]?.likes ?? 0) - (postVotes[a.id]?.likes ?? 0);
    if (sortBy === "dislikes") return (postVotes[b.id]?.dislikes ?? 0) - (postVotes[a.id]?.dislikes ?? 0);
    if (sortBy === "date") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-1 h-full overflow-y-auto bg-gray-100 p-6 gap-2">
      
      <div className="w-100 p-4 leading-relaxed mt-25 mb-10">
        <p className="text-center font-bold mb-2">Welcome to the forums page.</p>
        The forum page is for seeing all of the forum posts and comments outside of the map.
        The forum is accesible at chat bubble icons found in the map.
        It is only possible to add new posts trough the map, because they require a location.
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-center gap-2 mb-8">
          <input
            className="w-full max-w-md px-4 py-2 border border-black/40 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black/50"
            placeholder="Search posts..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 border border-black/40 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black/50 bg-white text-sm"
          >
            <option value="">Sort by...</option>
            <option value="likes">Likes</option>
            <option value="dislikes">Dislikes</option>
            <option value="date">Date</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {loading ? (
          <p className="text-gray-600 text-center">Loading...</p>
        ) : sorted.length === 0 ? (
          <p className="text-gray-600 text-center">No forum posts found.</p>
        ) : (
          <div className="grid gap-4 max-w-5xl mx-auto w-full">
            {paginated.map(post => (
              <div
                key={post.id}
                onClick={() => navigate(`/forum/${post.id}`)}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer p-5 border border-black/50"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {truncate(post.content)}
                </p>
                <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
                  <span>{post.userFname} {post.userLname}</span>
                  <div className="flex items-center gap-3">
                    <span>👍 {postVotes[post.id]?.likes ?? 0}</span>
                    <span>👎 {postVotes[post.id]?.dislikes ?? 0}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
                className="w-24 py-2 bg-white border rounded-lg shadow disabled:opacity-50 hover:bg-gray-50"
              >
                ← Prev
              </button>
              <div className="w-28 text-center text-gray-700">
                Page {page} of {totalPages}
              </div>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPages}
                className="w-24 py-2 bg-white border rounded-lg shadow disabled:opacity-50 hover:bg-gray-50"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Forum;
