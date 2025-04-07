import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuthHeaders } from '../utils/auth';

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

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">Your Match History</h2>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && history.length === 0 && (
        <p className="text-center text-gray-600">No matches found yet.</p>
      )}

      <div className="space-y-4">
        {history.map((match) => (
          <div key={match.id} className="bg-gray-50 p-4 rounded border">
            <p><strong>Match Score:</strong> {match.matchScore.toFixed(2)}</p>
            <p><strong>Resume:</strong> {match.resumeFile}</p>
            <p><strong>Job:</strong> {match.jobFile}</p>
            <p className="text-sm text-gray-500">
              <strong>Matched On:</strong> {new Date(match.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchHistory;
