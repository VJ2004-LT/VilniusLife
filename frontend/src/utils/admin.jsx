const API_URL = import.meta.env.VITE_API_URL;

export async function getUsers() {
  try {
    const res = await fetch(`${API_URL}/users`, {
      credentials: "include"
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (err) {
    console.error("getUsers failed:", err);
    throw err;
  }
}

export async function deleteUser(id) {
  try {
    const res = await fetch(`${API_URL}/user/${id}/delete`, {
      method: "DELETE",
      credentials: "include"
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  } catch (err) {
    console.error("deleteUser failed:", err);
    throw err;
  }
}
