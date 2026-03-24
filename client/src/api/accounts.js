import api from './axios';

const CACHE_KEY = 'accrue_accounts';

const save = (data) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
};

export const getAccounts = async () => {
  const res = await api.get('/accounts');
  save(res.data);
  return res.data;
};

export const getCachedAccounts = () => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || []; } catch { return []; }
};

export const createAccount = (data) =>
  api.post('/accounts', data).then((r) => r.data);

export const updateAccount = (id, data) =>
  api.put(`/accounts/${id}`, data).then((r) => r.data);

export const deleteAccount = (id) =>
  api.delete(`/accounts/${id}`).then((r) => r.data);
