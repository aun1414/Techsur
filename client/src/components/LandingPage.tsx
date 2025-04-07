import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Smart Resume Screener</h1>
        <p className="text-lg text-gray-600 mb-8">
          Effortlessly match resumes with job descriptions using AI-powered analysis.
          Upload files and instantly get semantic similarity scores, summaries, and fit explanations.
        </p>
        <button
          onClick={() => navigate('/upload')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Upload Resume
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
