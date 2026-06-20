import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearUser } = useAuth();

  function handleNav(path) {
    if (location.pathname === path) {
      navigate(0);
    } else {
      navigate(path);
    }
  }

  async function handleLogout() {
    await logout();
    clearUser();
    navigate('/');
  }

  return (
    <nav className="bg-primary text-white px-3 py-4 pr-4 flex items-center justify-between">
      <div className="flex gap-5">
        <button onClick={() => handleNav('/')} className="text-xl font-bold cursor-pointer">VilniusLife</button>
        {user?.isAdmin && (
          <button onClick={() => handleNav('/admin')} className="text-xl font-bold cursor-pointer">Admin panel</button>
        )}
        <button onClick={() => handleNav('/forum')} className="text-xl font-bold cursor-pointer">Neighborhood forum</button>
        {user && (
          <button onClick={() => handleNav('/requests')} className="text-xl font-bold cursor-pointer">Requests</button>
        )}
        <button onClick={() => handleNav('/map')} className="text-xl font-bold cursor-pointer">Map</button>
      </div>
      <div className="flex gap-5">
        {user ? (
          <button onClick={handleLogout} className="text-xl font-bold cursor-pointer">Logout</button>
        ) : (
          <>
            <button onClick={() => handleNav('/register')} className="text-xl font-bold cursor-pointer">Register</button>
            <button onClick={() => handleNav('/login')} className="text-xl font-bold cursor-pointer">Login</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
