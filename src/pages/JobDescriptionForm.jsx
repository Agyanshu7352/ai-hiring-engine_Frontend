import React, { useState } from 'react';
import { Briefcase, Loader, CheckCircle } from 'lucide-react';
import { parseJD } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const JobDescriptionForm = ({ onJDSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await parseJD(formData);
      setParsedData(response.data.data);
      onJDSuccess?.(response.data);
    } catch (err) {
      alert('❌ Failed to parse job description');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* PAGE BACKGROUND */}
      <main className="min-h-screen bg-[#CBFFCE]/20 py-12 px-4">

        {/* FORM CARD */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-blue-600 border border-green-500 p-8">

          {/* HEADER */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-[#106EE8]/10">
              <Briefcase className="w-6 h-6 text-[#106EE8]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Job Description Parser
              </h2>
              <p className="text-sm text-gray-500">
                Create a job description and extract structured requirements
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* JOB TITLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Senior Software Engineer"
                className="w-full px-4 py-2 rounded-lg border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-[#106EE8]/40"
              />
            </div>

            {/* COMPANY */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                placeholder="e.g. Tech Corp"
                className="w-full px-4 py-2 rounded-lg border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-[#106EE8]/40"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="9"
                placeholder="Paste the complete job description here..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-[#106EE8]/40"
              />
            </div>

            {/* CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white
              bg-[#106EE8] hover:bg-[#0b5ed7] transition
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Parsing job description…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Parse Job Description
                </span>
              )}
            </button>
          </form>
        </div>

        {/* PARSED RESULT */}
        {parsedData && (
          <div className="max-w-3xl mx-auto mt-8 bg-white rounded-2xl shadow-md border border-gray-100 p-6">

            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Parsed Job Requirements
            </h3>

            {/* SENIORITY */}
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-600">Seniority</span>
              <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold
                bg-[#0FC1A1]/15 text-[#0FC1A1]">
                {parsedData.parsedData?.seniority || 'N/A'}
              </span>
            </div>

            {/* REQUIRED SKILLS */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Required Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {parsedData.parsedData?.requiredSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-medium
                    bg-[#106EE8]/10 text-[#106EE8]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* OPTIONAL SKILLS */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">
                Optional Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {parsedData.parsedData?.optionalSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-medium
                    bg-[#90E0AB]/40 text-gray-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </>
  );
};

export default JobDescriptionForm;
