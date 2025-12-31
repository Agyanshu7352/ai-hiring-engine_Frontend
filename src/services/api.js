import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Resume APIs
export const parseResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  return api.post('/parse-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getResumes = async () => {
  return api.get('/resumes');
};

export const getResumeById = async (id) => {
  return api.get(`/resumes/${id}`);
};

export const deleteResume = async (id) => {
  return api.delete(`/resumes/${id}`);
};

// Job Description APIs
export const parseJD = async (jdData) => {
  return api.post('/parse-jd', jdData);
};

export const getJDs = async () => {
  return api.get('/job-descriptions');
};

export const getJDById = async (id) => {
  return api.get(`/job-descriptions/${id}`);
};

export const deleteJD = async (id) => {
  return api.delete(`/job-descriptions/${id}`);
};

// Match APIs
export const matchCandidates = async (resumeId, jobDescriptionId) => {
  return api.post('/match', { resumeId, jobDescriptionId });
};

export const getMatches = async () => {
  return api.get('/matches');
};

// Dashboard APIs
export const getDashboard = async () => {
  return api.get('/dashboard');
};

export default api;