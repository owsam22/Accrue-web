import api from './axios';

const CACHE_KEY = 'accrue_bills';
const save = (data) => { try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {} };

export const getBills = async (params = {}) => {
  const res = await api.get('/bills', { params });
  save(res.data);
  return res.data;
};

export const getCachedBills = () => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || []; } catch { return []; }
};

export const createBill = (data) =>
  api.post('/bills', data).then((r) => r.data);

export const payBill = (id, data = {}) =>
  api.put(`/bills/${id}/pay`, data).then((r) => r.data);

export const updateBill = (id, data) =>
  api.put(`/bills/${id}`, data).then((r) => r.data);

export const deleteBill = (id) =>
  api.delete(`/bills/${id}`).then((r) => r.data);
