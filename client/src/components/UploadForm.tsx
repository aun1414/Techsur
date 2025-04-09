import React, { useState } from 'react';
import axios from 'axios';
import { getAuthHeaders } from '../utils/auth';

const UploadForm: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobFile, setJobFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile || !jobFile) return;

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('job', jobFile);

    try {
      setLoading(true);
      setError('');
      const response = await axios.post('http://localhost:8080/api/match', formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      setResult(response.data);
    } catch (err: any) {
      console.error(err);
      setError("Upload failed. Make sure you're logged in and files are valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg max-w-xl w-full p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center">AI Resume Matcher</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Resume File (.pdf/.txt)</label>
            <input
              type="file"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="w-full bg-zinc-800 border border-gray-700 px-4 py-2 rounded text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Job Description File (.txt)</label>
            <input
              type="file"
              onChange={(e) => setJobFile(e.target.files?.[0] || null)}
              className="w-full bg-zinc-800 border border-gray-700 px-4 py-2 rounded text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-2 px-4 rounded hover:opacity-90 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Matching...' : 'Match Resume with Job'}
          </button>
        </form>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {result && (
          <div className="mt-6 bg-zinc-800 p-4 rounded border border-zinc-700 text-sm">
            <h3 className="font-semibold text-lg mb-2 text-white">Match Result</h3>
            {result.error ? (
              <p className="text-red-400">{result.error}</p>
            ) : (
              <>
                <p><span className="text-green-400 font-medium">Score:</span> {result.match}%</p>
                <p className="mt-2 text-gray-300"><strong>Resume Preview:</strong><br /><span className="text-white">{result.resume_preview}</span></p>
                <p className="mt-2 text-gray-300"><strong>Job Preview:</strong><br /><span className="text-white">{result.job_preview}</span></p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


export default UploadForm;
