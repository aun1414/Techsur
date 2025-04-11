import React, { useState } from 'react';
import axios from 'axios';
import { getAuthHeaders } from '../utils/auth';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

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

  const FileDisplay = ({ file }: { file: File | null }) => (
    file ? (
      <div className="mt-2 flex items-center text-sm text-gray-300 gap-2">
        <FileText size={16} />
        <span className="truncate">{file.name}</span>
      </div>
    ) : null
  );

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl max-w-xl w-full p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center">AI Resume Matcher</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Resume Upload */}
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 bg-zinc-800 text-center hover:border-gray-500 transition">
            <label className="block text-sm text-gray-400 mb-2">Upload Resume (.pdf/.txt)</label>
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="w-full opacity-0 h-0"
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="cursor-pointer inline-flex items-center gap-2 text-gray-200 hover:text-white">
              <Upload size={18} />
              {resumeFile ? "Change File" : "Choose File"}
            </label>
            <FileDisplay file={resumeFile} />
          </div>

          {/* Job Upload */}
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 bg-zinc-800 text-center hover:border-gray-500 transition">
            <label className="block text-sm text-gray-400 mb-2">Upload Job Description (.pdf/.txt)</label>
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => setJobFile(e.target.files?.[0] || null)}
              className="w-full opacity-0 h-0"
              id="job-upload"
            />
            <label htmlFor="job-upload" className="cursor-pointer inline-flex items-center gap-2 text-gray-200 hover:text-white">
              <Upload size={18} />
              {jobFile ? "Change File" : "Choose File"}
            </label>
            <FileDisplay file={jobFile} />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-2 px-4 rounded hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Matching...
              </>
            ) : (
              "Match Resume with Job"
            )}
          </button>
        </form>

        {/* Error */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Result */}
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
                <Link to={`/insight/${result.id}`} className="text-blue-400 underline text-sm mt-2 inline-block">
                  View Insights
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


export default UploadForm;
