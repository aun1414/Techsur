import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          The resume screener for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-500">
            developers
          </span>
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Upload resumes and job descriptions to get instant match scores and AI insights.
          Empower your hiring process with real-time smart screening.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/upload')}
            className="bg-white text-black font-semibold px-6 py-2 rounded-full hover:opacity-90 transition"
          >
            Get Started →
          </button>
          <button
            onClick={() => navigate('/history')}
            className="border border-gray-600 text-gray-300 px-6 py-2 rounded-full hover:bg-gray-800 transition"
          >
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
