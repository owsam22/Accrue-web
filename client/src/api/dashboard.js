import api from './axios';

const CACHE_KEY = 'accrue_dashboard';
const save = (data) => { try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {} };

export const getDashboard = async () => {
  const res = await api.get('/dashboard');
  save(res.data);
  return res.data;
};

export const getCachedDashboard = () => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || null; } catch { return null; }
};
