import api from './axios';

const CACHE_KEY = 'accrue_splits';
const save = (data) => { try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {} };

export const getSplits = async (params = {}) => {
  const res = await api.get('/splits', { params });
  save(res.data);
  return res.data;
};

export const getCachedSplits = () => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || []; } catch { return []; }
};

export const createSplit = (data) =>
  api.post('/splits', data).then((r) => r.data);

export const settleParticipant = (splitId, participantId, data = {}) =>
  api.put(`/splits/${splitId}/settle/${participantId}`, data).then((r) => r.data);

export const updateSplit = (id, data) =>
  api.put(`/splits/${id}`, data).then((r) => r.data);

export const deleteSplit = (id) =>
  api.delete(`/splits/${id}`).then((r) => r.data);
