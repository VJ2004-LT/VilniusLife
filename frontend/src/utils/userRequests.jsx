const API_URL = import.meta.env.VITE_API_URL;

export async function getMyRequests() {
  const res = await fetch(`${API_URL}/myRequests`, { credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getAllRequests() {
  const res = await fetch(`${API_URL}/allRequests`, { credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createRequest(requestText) {
  const res = await fetch(`${API_URL}/request`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestText),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function deleteMyRequest(id) {
  const res = await fetch(`${API_URL}/myRequest/${id}/delete`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function deleteRequest(id) {
  const res = await fetch(`${API_URL}/request/${id}/delete`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function changeRequestStatus(id, status) {
  const res = await fetch(`${API_URL}/request/${id}/changeStatus/${status}`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
