import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://3.138.105.216:8080/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token); // Save JWT
      localStorage.setItem("userEmail", response.data.email); // optional
      localStorage.setItem("userRole", response.data.role);   // 👈 store role here
      navigate('/upload'); // Go to Upload page
    } catch (err) {
      console.error(err);
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-md max-w-md w-full p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-zinc-800 text-white border border-gray-700 px-4 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-zinc-800 text-white border border-gray-700 px-4 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-white text-black py-2 rounded hover:opacity-90 transition">
            Login
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-400 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
