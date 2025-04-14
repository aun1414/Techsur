import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    
    navigate('/login');
  };

  return (
    <nav className="bg-black text-white px-6 py-4 shadow-md border-b border-zinc-800">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tight">
          <Link to="/" className="hover:text-white text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-500">
            Smart Resume Screener
          </Link>
        </div>

        <div className="space-x-6 text-sm">
          {token ? (
            <>
              {userRole === 'ADMIN' && (
                <Link to="/admin" className="hover:text-blue-400 transition">Admin Dashboard</Link>
              )}
              <Link to="/upload" className="hover:text-blue-400 transition">Upload</Link>
              <Link to="/history" className="hover:text-blue-400 transition">History</Link>
              <button onClick={handleLogout} className="hover:text-red-400 transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-400 transition">Login</Link>
              <Link to="/signup" className="hover:text-blue-400 transition">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
