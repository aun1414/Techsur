import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-xl font-semibold">
          <Link to="/">Smart Resume Screener</Link>
        </div>

        <div className="space-x-6 text-sm">
          {token ? (
            <>
              <Link to="/upload" className="hover:underline">Upload</Link>
              <Link to="/history" className="hover:underline">History</Link>
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="hover:underline">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
