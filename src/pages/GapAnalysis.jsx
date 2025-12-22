import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, BookOpen, Target, Clock, CheckCircle, Lightbulb, Award } from 'lucide-react';
import { getMatches } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const GapAnalysis = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await getMatches();
      setMatches(response.data.matches || []);
      if (response.data.matches && response.data.matches.length > 0) {
        setSelectedMatch(response.data.matches[0]);
      }
    } catch (error) {
      console.error('Error loading matches:', error);
      alert('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#106EE8' }} />
        <span className="ml-3" style={{ color: '#0FC1A1' }}>Loading analysis...</span>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="bg-white p-12 rounded-lg shadow-md text-center">
        <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#90E0AB' }} />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Matches Found</h3>
        <p className="text-gray-500 mb-6">
          Run a candidate match analysis first to see gap analysis
        </p>
        <button
          onClick={() => window.location.href = '#match'}
          className="px-6 py-3 rounded-lg text-white font-medium"
          style={{ background: 'linear-gradient(135deg, #106EE8, #0FC1A1)' }}
        >
          Go to Match Candidates
        </button>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#0FC1A1';
    if (score >= 60) return '#90E0AB';
    if (score >= 40) return '#CBFFCE';
    return '#FF6B6B';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6">
        <Navbar/>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" style={{ color: '#106EE8' }} />
          <span className="bg-gradient-to-r from-[#106EE8] to-[#0FC1A1] bg-clip-text text-transparent">
            Gap Analysis & Recommendations
          </span>
        </h2>

        {/* Match Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">Select Candidate Match</label>
          <select
            value={selectedMatch?._id || ''}
            onChange={(e) => {
              const match = matches.find(m => m._id === e.target.value);
              setSelectedMatch(match);
            }}
            className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition"
            style={{ 
              borderColor: '#0FC1A1',
              focusRing: '#106EE8'
            }}
          >
            {matches.map((match) => (
              <option key={match._id} value={match._id}>
                {match.resumeId?.parsedData?.name || match.resumeId?.fileName || 'Unknown'} - {' '}
                {match.jobDescriptionId?.title || 'N/A'} ({match.fitScore}%)
              </option>
            ))}
          </select>
        </div>

        {selectedMatch && (
          <div className="space-y-6">
            {/* Candidate Info Card */}
            <div 
              className="p-6 rounded-xl border-2"
              style={{ 
                background: 'linear-gradient(135deg, rgba(16, 110, 232, 0.05), rgba(15, 193, 161, 0.05))',
                borderColor: '#0FC1A1'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedMatch.resumeId?.parsedData?.name || 'Candidate'}
                  </h3>
                  <p className="text-gray-600">
                    Applied for: {selectedMatch.jobDescriptionId?.title || 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <div 
                    className="text-4xl font-bold mb-1"
                    style={{ color: getScoreColor(selectedMatch.fitScore) }}
                  >
                    {selectedMatch.fitScore}%
                  </div>
                  <div 
                    className="text-sm font-medium"
                    style={{ color: getScoreColor(selectedMatch.fitScore) }}
                  >
                    {getScoreLabel(selectedMatch.fitScore)}
                  </div>
                </div>
              </div>

              {/* Skills Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg" style={{ background: 'rgba(15, 193, 161, 0.1)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5" style={{ color: '#0FC1A1' }} />
                    <span className="font-semibold text-gray-700">Matched Skills</span>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: '#0FC1A1' }}>
                    {selectedMatch.matchDetails?.matchedSkills?.length || 0}
                  </div>
                </div>
                <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 107, 107, 0.1)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="font-semibold text-gray-700">Missing Skills</span>
                  </div>
                  <div className="text-2xl font-bold text-red-500">
                    {selectedMatch.matchDetails?.missingSkills?.length || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Missing Skills Details */}
            {selectedMatch.matchDetails?.missingSkills?.length > 0 && (
              <div className="p-6 rounded-xl border-2 border-red-200 bg-red-50">
                <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6" />
                  Skills Gap
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedMatch.matchDetails.missingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 rounded-full text-sm font-medium bg-red-200 text-red-900"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-red-700">
                  These skills are required for the role but not found in the candidate's resume
                </p>
              </div>
            )}

            {/* Recommendations */}
            {selectedMatch.gapAnalysis?.recommendations?.length > 0 && (
              <div 
                className="p-6 rounded-xl border-2"
                style={{ 
                  borderColor: '#106EE8',
                  background: 'rgba(16, 110, 232, 0.05)'
                }}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#106EE8' }}>
                  <Lightbulb className="w-6 h-6" />
                  Recommendations
                </h3>
                <ul className="space-y-3">
                  {selectedMatch.gapAnalysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: '#106EE8' }}
                      >
                        <span className="text-white font-bold text-sm">{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 leading-relaxed">{rec}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvement Areas */}
            {selectedMatch.gapAnalysis?.improvementAreas?.length > 0 && (
              <div 
                className="p-6 rounded-xl border-2"
                style={{ 
                  borderColor: '#90E0AB',
                  background: 'rgba(144, 224, 171, 0.05)'
                }}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#0FC1A1' }}>
                  <Target className="w-6 h-6" />
                  Areas for Improvement
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {selectedMatch.gapAnalysis.improvementAreas.map((area, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border flex items-center gap-3"
                      style={{ 
                        borderColor: '#90E0AB',
                        background: 'white'
                      }}
                    >
                      <BookOpen className="w-5 h-5 flex-shrink-0" style={{ color: '#0FC1A1' }} />
                      <span className="text-gray-700 font-medium">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Learning Path */}
            <div 
              className="p-6 rounded-xl border-2"
              style={{ 
                borderColor: '#CBFFCE',
                background: 'rgba(203, 255, 206, 0.1)'
              }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#0FC1A1' }}>
                <Award className="w-6 h-6" />
                Suggested Learning Path
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg border" style={{ borderColor: '#CBFFCE' }}>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#106EE8' }}
                  >
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">Short Term (1-3 months)</h4>
                    <p className="text-sm text-gray-600">
                      Focus on learning the top 3 missing skills through online courses and tutorials
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-lg border" style={{ borderColor: '#CBFFCE' }}>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#0FC1A1' }}
                  >
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">Medium Term (3-6 months)</h4>
                    <p className="text-sm text-gray-600">
                      Build practical projects showcasing new skills and contribute to open source
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-lg border" style={{ borderColor: '#CBFFCE' }}>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#90E0AB' }}
                  >
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">Long Term (6+ months)</h4>
                    <p className="text-sm text-gray-600">
                      Gain professional experience through freelance work or personal projects
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                className="flex-1 px-6 py-3 rounded-lg text-white font-semibold shadow-lg hover:scale-105 transition"
                style={{ background: 'linear-gradient(135deg, #106EE8, #0FC1A1)' }}
              >
                Generate Learning Resources
              </button>
              <button
                className="flex-1 px-6 py-3 rounded-lg font-semibold border-2 hover:scale-105 transition"
                style={{ 
                  borderColor: '#0FC1A1',
                  color: '#0FC1A1'
                }}
              >
                Export Report
              </button>
            </div>
          </div>
        )}
      </div>
        <Footer/>
    </div>
  );
};

export default GapAnalysis;