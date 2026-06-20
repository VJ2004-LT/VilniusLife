import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_API_URL;

export default function AdminRoute({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    fetch(`${BACKEND_URL}/auth/admin`, { credentials: "include" })
      .then(res => setStatus(res.ok ? "ok" : "denied"))
      .catch(() => setStatus("denied"));
  }, []);

  if (status === "checking") return null;
  if (status === "denied") return <Navigate to="/" replace />;
  return children;
}
