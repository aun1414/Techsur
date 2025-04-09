import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuthHeaders } from '../utils/auth';
import { Trash2 } from 'lucide-react';


interface MatchEntry {
  id: number;
  email: string;
  resumeFile: string;
  jobFile: string;
  matchScore: number;
  timestamp: string;
}

const MatchHistory: React.FC = () => {
  const [history, setHistory] = useState<MatchEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMatches = history.slice(startIndex, endIndex);

  const totalPages = Math.ceil(history.length / itemsPerPage);


  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/match/history', {
          headers: getAuthHeaders(),
        });
        setHistory(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load match history. Please log in again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/match/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setHistory(prev => prev.filter(match => match.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };


  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // You can customize this
  };
  
  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-center">Your Match History</h2>

        {loading && <p className="text-center text-gray-400">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && history.length === 0 && (
          <p className="text-center text-gray-500">No matches found yet.</p>
        )}

        <div className="space-y-4">
          {paginatedMatches.map((match) => (
            <div key={match.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg relative shadow-sm">
              <button
                onClick={() => handleDelete(match.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-400"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>

              <h3 className="text-lg font-semibold text-white">Match: {match.matchScore}%</h3>
              <p className="text-sm text-gray-300">Resume: {match.resumeFile}</p>
              <p className="text-sm text-gray-300">Job: {match.jobFile}</p>
              <p className="text-xs text-gray-500 mt-2">Uploaded: {formatDate(match.timestamp)}</p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1
                  ? 'bg-white text-black font-semibold'
                  : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
              } transition`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


export default MatchHistory;
