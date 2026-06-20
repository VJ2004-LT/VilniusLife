import { useState, useEffect } from "react";
import { getUsers, deleteUser } from "../utils/admin";

const PAGE_SIZE = 10;

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      setError("Failed to delete user.");
    }
  }

  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paginated = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="h-full p-8 flex flex-col flex-1">
      <h1 className="text-3xl font-bold text-white mb-6">Admin Panel</h1>
      {error && <p className="text-black mb-4">{error}</p>}
      {loading ? (
        <p className="text-white">Loading users...</p>
      ) : (
        <>
          <div className="bg-gray-300 rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-sm table-fixed">
              <thead className="bg-secondary text-white">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">First name</th>
                  <th className="p-3 text-left">Last name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(user => (
                  <tr key={user.id} className="border-t">
                    <td className="p-3">{user.id}</td>
                    <td className="p-3">{user.fname}</td>
                    <td className="p-3">{user.lname}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded text-xs font-bold">
                        {user.isAdmin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="p-3">
                      <button onClick={() => handleDelete(user.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                      >Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-auto pt-6">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="!w-auto px-4">
                ← Prev
              </button>
              <span className="text-white self-center">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="!w-auto px-4">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminPanel;
