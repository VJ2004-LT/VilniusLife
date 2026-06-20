const BACKEND_URL = import.meta.env.VITE_API_URL;

export async function signup(email, password, fname, lname) {
  try {
    const res = await fetch(`${BACKEND_URL}/createAccount`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fname, lname }),
    });
    if (res.status === 409) return { error: "You already have an account." };
    if (!res.ok) return { error: "Failed to create account." };
    return { success: true };
  } catch (e) {
    return { error: "Failed to connect to server." };
  }
}

export async function logout() {
  try {
    await fetch(`${BACKEND_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (e) {
    // ignore
  }
}

export async function login(email, password) {
  try {
    const res = await fetch(`${BACKEND_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return { error: "Invalid email or password." };
    return { success: true, user: await res.json() };
  } catch (e) {
    return { error: "Failed to connect to server." };
  }
}
