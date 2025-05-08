import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuthHeaders } from '../utils/auth'; // assumes you have this utility

interface UserEntry {
  id: number;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    axios.get('http://18.191.140.83:8080/api/admin/stats', {
        headers: getAuthHeaders()
    })
    .then(res => setStats(res.data))
    .catch(() => console.log("Failed to fetch stats"));
    }, []);

  useEffect(() => {
    axios.get('http://18.191.140.83:8080/api/admin/users', {
      headers: getAuthHeaders()
    })
    .then(res => {
      setUsers(res.data);
    })
    .catch(() => {
      setError('Unauthorized or failed to fetch users.');
    })
    .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://18.191.140.83:8080/api/admin/users/${id}`, {
        headers: getAuthHeaders()
      });
      setUsers(users.filter(u => u.id !== id));
    } catch {
      alert("Delete failed.");
    }
  };
  return (
    
    <div className="min-h-screen bg-black text-white px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {stats && (
        <div className="space-y-6 mb-10">
            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-800 p-4 rounded shadow text-center">
                <p className="text-sm text-gray-400">Total Users</p>
                <h2 className="text-2xl font-bold">{stats.totalUsers}</h2>
            </div>

            <div className="bg-zinc-800 p-4 rounded shadow text-center">
                <p className="text-sm text-gray-400">Total Matches</p>
                <h2 className="text-2xl font-bold">{stats.totalMatches}</h2>
            </div>
            </div>

            {/* Top Skills Section */}
            {stats.topSkills?.length > 0 && (
            <div>
                <h2 className="text-lg font-bold mb-2">Top Matched Skills</h2>
                <div className="flex flex-wrap gap-2">
                {stats.topSkills.map((skill: string, idx: number) => (
                    <span
                    key={idx}
                    className="bg-indigo-700 text-white px-3 py-1 rounded-full text-sm"
                    >
                    {skill}
                    </span>
                ))}
                </div>
            </div>
            )}
        </div>
        )}

      {loading && <p className="text-gray-400">Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && users.length > 0 && (
        <div className="overflow-x-auto rounded border border-zinc-800">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-800 text-gray-300 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Full Name</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-t border-zinc-800 hover:bg-zinc-900">
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.fullName}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN'
                        ? 'bg-green-800 text-green-200'
                        : 'bg-zinc-700 text-gray-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                        className="bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-500"
                        onClick={() => handleDelete(user.id)}
                    >
                        Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
