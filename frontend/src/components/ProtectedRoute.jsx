import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_API_URL;

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    fetch(`${BACKEND_URL}/auth/me`, { credentials: "include" })
      .then(res => setStatus(res.ok ? "ok" : "denied"))
      .catch(() => setStatus("denied"));
  }, []);

  if (status === "checking") return null;
  if (status === "denied") return <Navigate to="/login" replace />;
  return children;
}
