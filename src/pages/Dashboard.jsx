import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { Users, Briefcase, Target, Loader } from 'lucide-react';
import { getDashboard } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await getDashboard();
      setDashboardData(res?.data || null);
    } catch (err) {
      console.error(err);
      alert('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader className="w-8 h-8 animate-spin" style={{ color: '#106EE8' }} />
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  const chartData = (dashboardData?.topCandidates || [])
    .slice(0, 10)
    .map((c, i) => ({
      name: `Candidate ${i + 1}`,
      score: c?.fitScore ?? 0,
    }));

  const scoreBadge = (score) => {
    if (score >= 80) return 'bg-[#0FC1A1]/20 text-[#0FC1A1]';
    if (score >= 60) return 'bg-[#106EE8]/20 text-[#106EE8]';
    if (score >= 40) return 'bg-[#90E0AB]/30 text-[#0A5]';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <Navbar/>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: 'Total Resumes',
            value: dashboardData?.stats?.totalResumes ?? 0,
            icon: <Users />,
            gradient: 'from-[#106EE8] to-[#0FC1A1]',
          },
          {
            label: 'Job Descriptions',
            value: dashboardData?.stats?.totalJDs ?? 0,
            icon: <Briefcase />,
            gradient: 'from-[#0FC1A1] to-[#90E0AB]',
          },
          {
            label: 'Total Matches',
            value: dashboardData?.stats?.totalMatches ?? 0,
            icon: <Target />,
            gradient: 'from-[#90E0AB] to-[#CBFFCE]',
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${card.gradient}
              p-6 rounded-2xl text-white shadow-xl
              transform transition-all duration-300
              hover:-translate-y-2 hover:shadow-2xl`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                {card.icon}
              </div>
              <div>
                <p className="text-sm opacity-90">{card.label}</p>
                <p className="text-4xl font-bold">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CHART */}
      {chartData.length > 0 && (
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Top Candidates by Fit Score
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar
                dataKey="score"
                fill="#106EE8"
                radius={[8, 8, 0, 0]}
                animationDuration={1200}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Recent Matches
        </h2>

        {dashboardData?.recentMatches?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Candidate', 'Job', 'Company', 'Score', 'Date'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y">
                {dashboardData.recentMatches.slice(0, 10).map((m, i) => (
                  <tr
                    key={i}
                    className="hover:bg-[#CBFFCE]/40 transition"
                  >
                    <td className="px-4 py-3 text-sm">
                      {m?.resumeId?.parsedData?.name ||
                        m?.resumeId?.fileName ||
                        'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {m?.jobDescriptionId?.title || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {m?.jobDescriptionId?.company || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${scoreBadge(
                          m?.fitScore ?? 0
                        )}`}
                      >
                        {m?.fitScore ?? 0}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {m?.createdAt
                        ? new Date(m.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">
            No matches yet. Upload resumes to get started.
          </p>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default Dashboard;
