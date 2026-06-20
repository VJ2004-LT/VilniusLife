import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyRequests, getAllRequests, deleteMyRequest, deleteRequest, changeRequestStatus } from "../utils/userRequests";

const STATUSES = ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"];

const STATUS_STYLES = {
  PENDING:     "bg-gray-100 text-yellow-800",
  IN_PROGRESS: "bg-gray-100 text-blue-800",
  RESOLVED:    "bg-gray-100 text-green-800",
  REJECTED:    "bg-gray-100 text-red-800",
};

function UserRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRequest() {
      try {
        const data = user?.isAdmin ? await getAllRequests() : await getMyRequests();
        const found = data.find(r => r.id === Number(id));
        if (!found) { setError("Request not found."); return; }
        setRequest(found);
      } catch {
        setError("Failed to load request.");
      } finally {
        setLoading(false);
      }
    }
    fetchRequest();
  }, [id]);

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      user?.isAdmin ? await deleteRequest(request.id) : await deleteMyRequest(request.id);
      navigate("/requests");
    } catch {
      setError("Failed to delete request.");
    }
  }

  async function handleStatusChange(status) {
    try {
      await changeRequestStatus(request.id, status);
      setRequest({ ...request, status });
    } catch {
      setError("Failed to update status.");
    }
  }

  if (loading) return <div className="flex flex-1 h-full bg-gray-100 p-6 justify-center"><p className="text-gray-600">Loading...</p></div>;
  if (error)   return <div className="flex flex-1 h-full bg-gray-100 p-6 justify-center"><p className="text-red-500">{error}</p></div>;

  return (
    <div className="flex flex-1 h-full overflow-y-auto bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto w-full">

        <button
          onClick={() => navigate("/requests")}
          className="text-sm px-4 py-2 mb-3 bg-white border border-black/50 rounded-lg shadow hover:bg-gray-50 cursor-pointer"
        >
           Back to requests
        </button>
        <div className="bg-white rounded-2xl shadow-md p-6 border border-black/50">
          <div className="flex justify-between items-start mb-4">
            <span className={`px-3 py-1 rounded text-xs font-bold ${STATUS_STYLES[request.status] ?? "bg-gray-100 text-gray-600"}`}>
              {request.status}
            </span>
            <span className="text-xs text-gray-400">{new Date(request.createdAt).toLocaleDateString()}</span>
          </div>

          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words">{request.requestText}</p>

          {user?.isAdmin && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Submitted by: {request.user?.fname} {request.user?.lname} ({request.user?.email})</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    disabled={request.status === s}
                    className={`px-3 py-1 rounded text-xs font-semibold transition disabled:opacity-40 cursor-pointer ${STATUS_STYLES[s]}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserRequest;
