import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyRequests, getAllRequests, createRequest, deleteMyRequest, deleteRequest } from "../utils/userRequests";

const PAGE_SIZE = 4;

const STATUS_STYLES = {
  PENDING:     "bg-gray-100 text-yellow-800",
  IN_PROGRESS: "bg-gray-100 text-blue-800",
  RESOLVED:    "bg-gray-100 text-green-800",
  REJECTED:    "bg-gray-100 text-red-800",
};

function UserRequests() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const tooShort = newText.trim().length > 0 && newText.trim().length < 50;

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const data = user?.isAdmin ? await getAllRequests() : await getMyRequests();
      setRequests(data);
    } catch {
      setError("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!newText.trim()) return;
    setSubmitting(true);
    try {
      await createRequest(newText.trim());
      setNewText("");
      await fetchRequests();
    } catch {
      setError("Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      user?.isAdmin ? await deleteRequest(id) : await deleteMyRequest(id);
      setRequests(requests.filter(r => r.id !== id));
    } catch {
      setError("Failed to delete request.");
    }
  }

  const totalPages = Math.ceil(requests.length / PAGE_SIZE);
  const paginated = requests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-1 h-full overflow-y-auto bg-gray-100 p-6 gap-2">

      <div className="w-100 p-4 leading-relaxed mt-25 mb-10">
        <p className="text-center font-bold mb-2">User Requests</p>
        {user?.isAdmin
          ? "As an admin you can see all submitted requests, change their status, and delete them."
          : "Submit a request or report an issue. You can track the status of your submitted requests here."
        }
      </div>

      <div className="flex flex-col flex-1 min-w-0">

        {!user?.isAdmin && user && (
          <div className="mb-6 max-w-5xl mx-auto w-full">
            <textarea
              className="w-full px-4 py-2 border border-black/40 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black/50 bg-white resize-none break-words"
              rows={3}
              minLength={50}
              maxLength={1000}
              placeholder="Describe your request or issue... (50–1000 characters)"
              value={newText}
              onChange={e => setNewText(e.target.value)}
            />
            <div className="flex justify-between items-center mt-1 mb-2 text-xs">
              <span className="text-red-500">
                {tooShort && `Minimum 50 characters required`}
              </span>
              <span className={newText.length > 950 ? "text-red-500" : "text-black"}>
                {newText.length} / 1000
              </span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting || !newText.trim() || tooShort}
              className="mt-2 px-5 py-2 bg-primary text-white rounded-xl shadow hover:opacity-90 disabled:opacity-50 transition"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        )}

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-center">No requests found.</p>
        ) : (
          <div className="grid gap-4 max-w-5xl mx-auto w-full min-w-0">
            {paginated.map(req => (
              <div
                key={req.id}
                onClick={() => navigate(`/requests/${req.id}`)}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer p-5 border border-black/50"
              >
                <p className=" text-sm line-clamp-3 overflow-hidden break-all">{req.requestText}</p>
                <div className="flex justify-between items-center mt-4 text-xs">
                  {user?.isAdmin && (
                    <span>{req.user?.fname} {req.user?.lname}</span>
                  )}
                  <div className="flex items-center gap-3 ml-auto">
                    <span className={`px-2 py-0.5 rounded font-semibold ${STATUS_STYLES[req.status] ?? "bg-gray-100"}`}>
                      {req.status}
                    </span>
                    <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(req.id); }}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-auto pt-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
                className="w-24 py-2 bg-white border rounded-lg shadow disabled:opacity-50 hover:bg-gray-50"
              >
                ← Prev
              </button>
              <div className="w-28 text-center">
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

export default UserRequests;
