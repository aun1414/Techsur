import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeaders } from '../utils/auth';
import { ArrowLeft } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


function parseAnalysis(text: string) {
    const sections = {
      fitSummary: "",
      strengths: "",
      weaknesses: "",
      skills: [] as string[],
      experiences: [] as string[],
      keywords: [] as string[],
      matchExplanation: ""
    };
  
    // Extract the whole fit summary
    const fitMatch = text.match(/\*\*1\. Candidate Fit Summary:\*\*([\s\S]*?)\*\*2\./);
    const fitText = fitMatch?.[1].trim() || "";
    sections.fitSummary = fitText;
  
    // Inside fit summary: extract Strengths and Weaknesses
    const strengthsMatch = fitText.match(/\*\*Strengths:\*\*([\s\S]*?)\*\*Weaknesses:\*\*/);
    const weaknessesMatch = fitText.match(/\*\*Weaknesses:\*\*([\s\S]*)/);
  
    sections.strengths = strengthsMatch?.[1].trim() || "";
    sections.weaknesses = weaknessesMatch?.[1].trim() || "";
  
    // Key Skills
    const skillsMatch = text.match(/\*\*2\. Key Matching Skills:\*\*([\s\S]*?)\*\*3\./);
    if (skillsMatch) {
      sections.skills = skillsMatch[1].split("*").map(s => s.trim()).filter(Boolean);
    }
  
    // Experiences
    const experiencesMatch = text.match(/\*\*3\. Relevant Past Experiences\/Accomplishments:\*\*([\s\S]*?)\*\*4\./);
    if (experiencesMatch) {
      const expLines = experiencesMatch[1].split("*").map(e => e.trim()).filter(Boolean);
      sections.experiences = expLines;
    }
  
    // Keywords
    const keywordsMatch = text.match(/\*\*4\. Keywords from Job Description:\*\*([\s\S]*?)\*\*5\./);
    if (keywordsMatch) {
      sections.keywords = keywordsMatch[1].split("*").map(k => k.trim()).filter(Boolean);
    }
  
    // Match Explanation
    const matchExplainMatch = text.match(/\*\*5\. Match Score Explanation:\*\*([\s\S]*)/);
    sections.matchExplanation = matchExplainMatch?.[1].trim() || "";
  
    return sections;
}
  
  

const MatchInsight: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`http://18.191.140.83:8080/api/match/${id}`, {
      headers: getAuthHeaders(),
    })
    .then(res => setMatch(res.data))
    .catch(() => setError("Failed to load insights."));
  }, [id]);

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!match) return <p className="text-gray-400 text-center">Loading...</p>;
  const parsed = parseAnalysis(match.analysis);

  const getMatchLabel = (score: number) => {
    if (score >= 85) return { label: "Excellent Match", color: "bg-green-700 text-green-200" };
    if (score >= 60) return { label: "Good Match", color: "bg-yellow-600 text-yellow-100" };
    return { label: "Needs Improvement", color: "bg-red-700 text-red-200" };
  };
  const matchLevel = getMatchLabel(match.matchScore);
  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/history" className="text-gray-400 hover:text-white flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Back to History
        </Link>
      </div>

      <h1 className="text-3xl font-bold">Match Insights</h1>
      
      <div className="flex flex-col items-center mt-6 mb-4">
      <p className="text-2xl font-extrabold tracking-tight text-white mb-2">Match Score</p>
      <div className="w-40 h-40 drop-shadow-lg">
        <CircularProgressbar
          value={match.matchScore}
          text={`${match.matchScore.toFixed(0)}%`}
          styles={buildStyles({
            pathColor: match.matchScore > 75 ? '#4ade80' : match.matchScore > 50 ? '#facc15' : '#f87171',
            textColor: 'white',
            trailColor: '#27272a',
            textSize: '18px',
          })}
        />
      </div>
        
        <span className={`mt-2 px-3 py-1 rounded-full text-sm font-semibold ${matchLevel.color}`}>
          {matchLevel.label}
        </span>

        <p><strong>Resume File:</strong> {match.resumeFile}</p>
        <p><strong>Job File:</strong> {match.jobFile}</p>
        <p className="text-sm text-gray-400">Uploaded: {new Date(match.timestamp).toLocaleString()}</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Fit Summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <h3 className="text-lg font-semibold mb-2">Strengths</h3>
            <p className="text-green-300 text-sm whitespace-pre-wrap">{parsed.strengths}</p>
            </div>

            <div>
            <h3 className="text-lg font-semibold mb-2">Weaknesses</h3>
            <p className="text-red-300 text-sm whitespace-pre-wrap">{parsed.weaknesses}</p>
            </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold mb-2">Match Explanation</h3>
            <p className="text-gray-300 text-sm">{parsed.matchExplanation}</p>
        </div>
        </div>


        {/* Skills */}
        <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Key Skills</h2>
        <div className="flex flex-wrap gap-2">
            {parsed.skills.map((skill, idx) => (
            <span key={idx} className="bg-zinc-700 px-3 py-1 rounded-full text-sm text-white">
                {skill}
            </span>
            ))}
        </div>
        </div>

        {/* Experiences */}
        <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Relevant Experiences</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
            {parsed.experiences.map((exp, idx) => (
            <li key={idx}>{exp}</li>
            ))}
        </ul>
        </div>

        {/* Keywords */}
        <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Job Keywords</h2>
        <div className="flex flex-wrap gap-2">
            {parsed.keywords.map((kw, idx) => (
            <span key={idx} className="bg-blue-700 px-3 py-1 rounded-full text-sm text-white">
                {kw}
            </span>
            ))}
        </div>
        </div>


            </div>
        );
};

export default MatchInsight;
