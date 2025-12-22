import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Homepage from './pages/Homepage';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import JobDescriptionForm from './pages/JobDescriptionForm';
import MatchResults from './pages/MatchResults';
import GapAnalysis from './pages/GapAnalysis';

const AppRoutes = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<ResumeUpload />} />
        <Route path="/job" element={<JobDescriptionForm />} />
        <Route path="/matches" element={<MatchResults />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/gap-analysis" element={<GapAnalysis />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
