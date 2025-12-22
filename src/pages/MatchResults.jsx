import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, AlertCircle, Loader, Sparkles } from 'lucide-react';
import { matchCandidates, getResumes, getJDs } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MatchResults = () => {
  const [resumes, setResumes] = useState([]);
  const [jds, setJDs] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [selectedJD, setSelectedJD] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resumesRes, jdsRes] = await Promise.all([getResumes(), getJDs()]);
      setResumes(resumesRes.data.resumes || []);
      setJDs(jdsRes.data.jobDescriptions || []);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load resumes and job descriptions');
    } finally {
      setDataLoading(false);
    }
  };

  const handleMatch = async () => {
    if (!selectedResume || !selectedJD) {
      alert('⚠️ Please select both resume and job description');
      return;
    }

    setLoading(true);
    try {
      const response = await matchCandidates(selectedResume, selectedJD);
      console.log('Match response:', response.data);
      setMatchResult(response.data.data);
      alert('✅ Match analysis completed!');
    } catch (error) {
      console.error('Match error:', error);
      alert('❌ Failed to match candidates');
    } finally {
      setLoading(false);
    }
  };

  const getFitScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading data...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <Navbar/>
      <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Target className="w-6 h-6 text-purple-600" />
        Match Candidates
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Select Resume</label>
          <select
            value={selectedResume}
            onChange={(e) => setSelectedResume(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Choose a resume...</option>
            {resumes.map((resume) => (
              <option key={resume._id} value={resume._id}>
                {resume.fileName} - {resume.parsedData?.name || 'Unknown'}
              </option>
            ))}
          </select>
          {resumes.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">No resumes uploaded yet</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Select Job Description</label>
          <select
            value={selectedJD}
            onChange={(e) => setSelectedJD(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Choose a JD...</option>
            {jds.map((jd) => (
              <option key={jd._id} value={jd._id}>
                {jd.title} - {jd.company}
              </option>
            ))}
          </select>
          {jds.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">No job descriptions created yet</p>
          )}
        </div>
      </div>
      
      <button
        onClick={handleMatch}
        disabled={loading || !selectedResume || !selectedJD}
        className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition font-medium"
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Analyzing Match...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Run Match Analysis
          </>
        )}
      </button>

      {matchResult && (
        <div className="mt-6 space-y-4">
          {/* Fit Score */}
          <div className={`p-6 rounded-lg border-2 ${getFitScoreColor(matchResult.fitScore)}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Overall Fit Score</h3>
              <div className="text-right">
                <span className="text-4xl font-bold">{matchResult.fitScore}%</span>
                <p className="text-sm mt-1">
                  {matchResult.fitScore >= 80 && '🎉 Excellent Match'}
                  {matchResult.fitScore >= 60 && matchResult.fitScore < 80 && '✅ Good Match'}
                  {matchResult.fitScore >= 40 && matchResult.fitScore < 60 && '⚠️ Fair Match'}
                  {matchResult.fitScore < 40 && '❌ Poor Match'}
                </p>
              </div>
            </div>
          </div>

          {/* Matched Skills */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-800">
              <TrendingUp className="w-5 h-5" />
              Matched Skills ({matchResult.matchDetails?.matchedSkills?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {matchResult.matchDetails?.matchedSkills?.length > 0 ? (
                matchResult.matchDetails.matchedSkills.map((skill, idx) => (
                  <span key={idx} className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No matched skills</span>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              Missing Skills ({matchResult.matchDetails?.missingSkills?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {matchResult.matchDetails?.missingSkills?.length > 0 ? (
                matchResult.matchDetails.missingSkills.map((skill, idx) => (
                  <span key={idx} className="bg-red-200 text-red-900 px-3 py-1 rounded-full text-sm font-medium">
                    ✗ {skill}
                  </span>
                ))
              ) : (
                <span className="text-green-600 font-medium">🎉 All required skills matched!</span>
              )}
            </div>
          </div>

          {/* Gap Analysis */}
          {matchResult.gapAnalysis && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold mb-3 text-blue-800">💡 Recommendations</h3>
              <ul className="space-y-2">
                {matchResult.gapAnalysis.recommendations?.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interview Questions */}
          {matchResult.interviewQuestions && matchResult.interviewQuestions.length > 0 && (
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold mb-3 text-purple-800">❓ Interview Questions</h3>
              <ul className="space-y-3">
                {matchResult.interviewQuestions.map((q, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    <span className="font-medium text-purple-700">Q{idx + 1}:</span> {q.question || q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      </div>
      <Footer/>
    </div>
  );
};

export default MatchResults;