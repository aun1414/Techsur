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
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">AI Resume Matcher</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Resume File (.pdf/.txt)</label>
          <input
            type="file"
            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Job Description File (.txt)</label>
          <input
            type="file"
            onChange={(e) => setJobFile(e.target.files?.[0] || null)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Matching...' : 'Match Resume with Job'}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h3 className="font-semibold text-lg mb-2">Match Result</h3>
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : (
            <>
              <p><strong>Score:</strong> {result.match}</p>
              <p className="mt-2"><strong>Resume Preview:</strong><br />{result.resume_preview}</p>
              <p className="mt-2"><strong>Job Preview:</strong><br />{result.job_preview}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadForm;
