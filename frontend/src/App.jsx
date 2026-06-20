import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Map from "./pages/Map.jsx";
import Forum from "./pages/Forum.jsx";
import ForumPost from "./pages/ForumPost.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import UserRequests from "./pages/UserRequests.jsx";
import UserRequest from "./pages/UserRequest.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import { AuthProvider } from "./context/AuthContext.jsx";
function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
	    <Route path="/map" element={<Map />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:id" element={<ForumPost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/requests" element={<ProtectedRoute><UserRequests /></ProtectedRoute>} />
            <Route path="/requests/:id" element={<ProtectedRoute><UserRequest /></ProtectedRoute>} />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
             } />

          </Routes>
        </div>
      </div>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
