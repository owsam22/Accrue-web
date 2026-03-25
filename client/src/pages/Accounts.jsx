import React, { useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Wallet, CreditCard, PiggyBank, Landmark } from 'lucide-react';
import Layout from '../components/Layout';
import BackButton from '../components/BackButton';
import Modal from '../components/Modal';
import Loader from '../components/newloader';
import useCachedFetch from '../hooks/useCachedFetch';
import { getAccounts, getCachedAccounts, createAccount, updateAccount, deleteAccount } from '../api/accounts';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n ?? 0);

const typeIcons = { bank: Landmark, cash: Wallet, other: Wallet };
const typeColors = {
  bank: '#4F46E5', cash: '#059669', other: '#64748B',
};

const EMPTY_FORM = { name: '', type: 'bank', specifiedType: 'other', balance: '', currency: 'INR', specifiedCurrency: 'other', color: '' };

const Accounts = () => {
  const fetch = useCallback(getAccounts, []);
  const { data: accounts, isLoading, refresh } = useCachedFetch(fetch, getCachedAccounts);

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModal(true); };
  const openEdit = (acc) => {
    setEditing(acc);
    setForm({ name: acc.name, type: acc.type, specifiedType: acc.specifiedType || 'other', balance: acc.balance, currency: acc.currency, specifiedCurrency: acc.specifiedCurrency || 'other', color: acc.color });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { 
        name: form.name, 
        type: form.type, 
        specifiedType: form.type === 'other' ? form.specifiedType : 'other',
        currency: form.currency, 
        specifiedCurrency: form.currency === 'Other' ? form.specifiedCurrency : 'other',
        color: form.color || typeColors[form.type] 
      };
      
      if (editing) {
        await updateAccount(editing._id, payload);
      } else {
        await createAccount({ ...payload, balance: parseFloat(form.balance) || 0 });
      }
      setModal(false);
      refresh();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Archive this account?')) return;
    await deleteAccount(id);
    refresh();
  };

  if (isLoading && !accounts?.length) {
    return <Layout><div className="loading-overlay"><Loader /><p style={{ marginTop: 12, color: 'var(--text-3)', fontWeight: 600 }}>Connecting to server...</p></div></Layout>;
  }

  const totalBalance = (accounts || []).reduce((s, a) => s + a.balance, 0);

  return (
    <Layout>
      <div className="page-header">
        <div>
          <BackButton />
          <h1 className="page-title">Accounts</h1>
          <p className="page-subtitle">Total: {fmt(totalBalance)}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Account
        </button>
      </div>

      {!accounts?.length ? (
        <div className="empty-state" style={{ marginTop: 48 }}>
          <div className="empty-state-icon">🏦</div>
          <h3>No accounts yet</h3>
          <p>Add your first wallet or bank account to get started.</p>
          <button className="btn btn-primary" onClick={openCreate} style={{ marginTop: 8 }}>
            <Plus size={16} /> Add Account
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {accounts.map((acc) => {
            const Icon = typeIcons[acc.type] || Wallet;
            const color = acc.color || typeColors[acc.type];
            return (
              <div key={acc._id} className="account-card fade-up" style={{ background: `linear-gradient(135deg, ${color}22, var(--bg-surface))`, borderColor: `${color}44` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--r-md)', background: `${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} style={{ color }} />
                    </div>
                    <div>
                      <p className="account-name">{acc.name}</p>
                      <span className="account-type-badge">{acc.type}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-icon btn-secondary" onClick={() => openEdit(acc)} title="Edit"><Pencil size={14} /></button>
                    <button className="btn btn-icon btn-danger" onClick={() => handleDelete(acc._id)} title="Archive"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 4 }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>BALANCE</p>
                    {acc.balance < 1000 && !acc.isArchived && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--danger)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 2 }}>
                        ⚠️ LOW BALANCE
                      </span>
                    )}
                  </div>
                  <p className="account-balance" style={{ color }}>{fmt(acc.balance)}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{acc.currency}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Account' : 'Add Account'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Account Name *</label>
            <input className="form-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. HDFC Savings" />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {['bank', 'cash', 'other'].map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            {form.type === 'other' && (
              <div className="form-group">
                <label className="form-label">Type Specifies</label>
                <input className="form-input" required value={form.specifiedType} onChange={(e) => setForm({ ...form, specifiedType: e.target.value })} placeholder="e.g. Crypto" />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Currency</label>
              <select className="form-select" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                <option value="INR">Rupee (₹)</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {form.currency === 'Other' && (
              <div className="form-group">
                <label className="form-label">Currency Specifies</label>
                <input className="form-input" required value={form.specifiedCurrency} onChange={(e) => setForm({ ...form, specifiedCurrency: e.target.value })} placeholder="e.g. USD, EUR" />
              </div>
            )}
          </div>
          {!editing && (
            <div className="form-group">
              <label className="form-label">Opening Balance</label>
              <input className="form-input" type="number" min="0" step="0.01" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} placeholder="0.00" />
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: 6 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default Accounts;
