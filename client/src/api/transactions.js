import api from './axios';

const CACHE_KEY = 'accrue_transactions';

const save = (data) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
};

export const getTransactions = async (params = {}) => {
  const res = await api.get('/transactions', { params });
  save(res.data);
  return res.data;
};

export const getCachedTransactions = () => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || { transactions: [] }; } catch { return { transactions: [] }; }
};

export const createTransaction = (data) =>
  api.post('/transactions', data).then((r) => r.data);

export const updateTransaction = (id, data) =>
  api.put(`/transactions/${id}`, data).then((r) => r.data);

export const deleteTransaction = (id) =>
  api.delete(`/transactions/${id}`).then((r) => r.data);
