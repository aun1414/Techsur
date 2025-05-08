import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://18.191.140.83:8080/api/auth/signup', {
        email,
        fullName,
        password,
      });

      if (response.data === 'User registered successfully!') {
        navigate('/login');
      } else {
        setError(response.data);
      }
    } catch (err) {
      console.error(err);
      setError('Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-md max-w-md w-full p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-zinc-800 text-white border border-gray-700 px-4 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Full Name"
            className="w-full bg-zinc-800 text-white border border-gray-700 px-4 py-2 rounded"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-400 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
