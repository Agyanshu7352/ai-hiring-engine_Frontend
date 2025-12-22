import React, { useState } from 'react';
import { Upload, FileText, Loader, CheckCircle, XCircle } from 'lucide-react';
import { parseResume } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ResumeUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowed.includes(selected.type)) {
      setError('Only PDF or Word documents allowed');
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError('File must be under 5MB');
      return;
    }

    setFile(selected);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const res = await parseResume(file);
      setParsedData(res.data.data);
      onUploadSuccess?.(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-1vw mx-auto flex flex-col items-center ">
      <Navbar />

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-2xl mx-auto w-full mt-10">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-[#106EE8]/10">
            <FileText className="w-6 h-6 text-[#106EE8]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Resume Parser
            </h2>
            <p className="text-sm text-gray-500">
              Upload a resume to extract structured candidate data
            </p>
          </div>
        </div>

        {/* UPLOAD AREA */}
        <div className="relative border-2 border-dashed rounded-xl p-8 text-center
          border-[#90E0AB] bg-[#CBFFCE]/20 transition hover:bg-[#CBFFCE]/30">

          <Upload className="w-12 h-12 mx-auto mb-4 text-[#106EE8]" />

          <p className="font-semibold text-gray-700">
            Click to upload or drag & drop
          </p>
          <p className="text-sm text-gray-500 mb-4">
            PDF or DOC · Max 5MB
          </p>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />

          {file && (
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-[#0FC1A1]" />
              {file.name}
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-red-600">
              <XCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* ACTION */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="mt-6 w-full py-3 rounded-xl font-semibold text-white
          bg-[#106EE8] hover:bg-[#0b5ed7] transition
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader className="w-4 h-4 animate-spin" />
              Parsing resume…
            </span>
          ) : (
            'Upload & Parse Resume'
          )}
        </button>
      </div>

      {/* RESULT */}
      {parsedData && (
        <div className="mt-8 bg-white rounded-2xl shadow-md border border-gray-100 p-6">

          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Parsed Candidate Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <Info label="Name" value={parsedData.parsedData?.name} />
            <Info label="Email" value={parsedData.parsedData?.email} />
            <Info label="Phone" value={parsedData.parsedData?.phone} />
            <Info
              label="Experience"
              value={`${parsedData.parsedData?.totalYearsExperience || 0} years`}
            />
          </div>

          <div className="mt-4">
            <span className="text-sm font-medium text-gray-600">Seniority</span>
            <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold
              bg-[#0FC1A1]/15 text-[#0FC1A1]">
              {parsedData.parsedData?.seniority || 'N/A'}
            </span>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {parsedData.parsedData?.skills?.length ? (
                parsedData.parsedData.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-medium
                    bg-[#106EE8]/10 text-[#106EE8]"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No skills detected</span>
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-semibold text-gray-800">{value || 'N/A'}</p>
  </div>
);

export default ResumeUpload;
