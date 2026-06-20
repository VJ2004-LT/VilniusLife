import { createContext, useContext, useState, useEffect } from "react";
const BACKEND_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  function storeUser(userData) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  function clearUser() {
    setUser(null);
    localStorage.removeItem("user");
  }


  useEffect(() => {
    fetch(`${BACKEND_URL}/auth/me`, { credentials: "include" })
      .then(res => {
        if (!res.ok) clearUser();
      })
      .catch(() => clearUser());
  }, []);

  return (
    <AuthContext.Provider value={{ user, storeUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
