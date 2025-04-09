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
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">Your Match History</h2>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && history.length === 0 && (
        <p className="text-center text-gray-600">No matches found yet.</p>
      )}

      <div className="space-y-4">
        {paginatedMatches.map((match) => (
          <div key={match.id} className="bg-gray-50 p-4 rounded border">
            
            {/* Move `relative` here */}
            <div className="relative border rounded-xl shadow p-4 bg-white">
              {/* Floating delete button */}
              <button
                onClick={() => handleDelete(match.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>

              <h3 className="font-semibold text-gray-600 text-lg">Match: {match.matchScore}%</h3>
              <p className="text-sm text-gray-600">Resume: {match.resumeFile}</p>
              <p className="text-sm text-gray-600">Job: {match.jobFile}</p>
              <p className="text-xs text-gray-400 mt-2">
                Uploaded: {formatDate(match.timestamp)}
              </p>
            </div>
            
          </div>
        ))}
      </div>


      <div className="flex justify-center gap-2 mt-6">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
        >
          {i + 1}
        </button>
      ))}
    </div>
    </div>
  );
};

export default MatchHistory;
