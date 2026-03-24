import React, { useState, useCallback } from 'react';
import { Plus, CheckCircle, Trash2, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import BackButton from '../components/BackButton';
import Modal from '../components/Modal';
import Loader from '../components/newloader';
import useCachedFetch from '../hooks/useCachedFetch';
import { getBills, getCachedBills, createBill, payBill, deleteBill } from '../api/bills';
import { getAccounts, getCachedAccounts } from '../api/accounts';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n ?? 0);

const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const getDueBadge = (dueDate, isPaid) => {
  if (isPaid) return { text: 'Paid', color: 'var(--success)', Icon: CheckCircle, cls: 'bill-paid' };
  const days = Math.ceil((new Date(dueDate) - Date.now()) / 86400000);
  if (days < 0) return { text: `${Math.abs(days)}d overdue`, color: 'var(--danger)', Icon: AlertCircle, cls: 'bill-overdue' };
  if (days <= 3) return { text: `Due in ${days}d`, color: 'var(--warning)', Icon: Clock, cls: 'bill-due-soon' };
  return { text: `Due in ${days}d`, color: 'var(--text-3)', Icon: Clock, cls: '' };
};

const EMPTY_FORM = { name: '', amount: '', category: 'Bills', dueDate: '', accountId: '', notes: '' };

const Bills = () => {
  const fetchBills = useCallback(getBills, []);
  const { data: bills, isLoading, refresh } = useCachedFetch(fetchBills, getCachedBills);
  const fetchAcc = useCallback(getAccounts, []);
  const { data: accounts } = useCachedFetch(fetchAcc, getCachedAccounts);

  const [modal, setModal] = useState(false);
  const [payModal, setPayModal] = useState(null);
  const [payAccountId, setPayAccountId] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await createBill({ ...form, amount: parseFloat(form.amount) }); setModal(false); refresh(); }
    catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handlePay = async () => {
    if (!payAccountId) return; setSaving(true);
    try { await payBill(payModal._id, { accountId: payAccountId }); setPayModal(null); refresh(); }
    catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this bill?')) return;
    await deleteBill(id); refresh();
  };

  if (isLoading && !bills?.length) return <Layout><div className="loading-overlay"><Loader /><p style={{ marginTop: 12, color: 'var(--text-3)', fontWeight: 600 }}>Connecting to server...</p></div></Layout>;

  const unpaid = (bills || []).filter(b => !b.isPaid);
  const paid   = (bills || []).filter(b =>  b.isPaid);

  return (
    <Layout>
      <div className="page-header">
        <div>
          <BackButton />
          <h1 className="page-title">Bills</h1>
          <p className="page-subtitle">{unpaid.length} unpaid · {paid.length} paid</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY_FORM); setModal(true); }}>
          <Plus size={16}/> Add Bill
        </button>
      </div>

      {!bills?.length ? (
        <div className="empty-state" style={{ marginTop: 48 }}>
          <div className="empty-state-icon">🧾</div>
          <h3>No bills yet</h3>
          <p>Track recurring expenses and due dates.</p>
          <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => { setForm(EMPTY_FORM); setModal(true); }}>
            <Plus size={16}/> Add Bill
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...unpaid, ...paid].map((bill) => {
            const { text, color, Icon, cls } = getDueBadge(bill.dueDate, bill.isPaid);
            return (
              <div key={bill._id} className={`bill-item fade-up ${cls}`}>
                <div style={{ width: 38, height: 38, borderRadius: 'var(--r-md)', background: color+'22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} style={{ color }}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: 'var(--text-1)' }}>{bill.name}</p>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 2 }}>
                    <span style={{ fontSize: '0.75rem', color }}>{text}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>· {fmtDate(bill.dueDate)}</span>
                    {bill.category && <span className="badge">{bill.category}</span>}
                  </div>
                </div>
                <span style={{ fontWeight: 700, color: bill.isPaid ? 'var(--text-3)' : 'var(--text-1)', fontSize: '1rem' }}>{fmt(bill.amount)}</span>
                {!bill.isPaid && (
                  <button className="btn btn-sm btn-success" onClick={() => { setPayModal(bill); setPayAccountId(bill.accountId?._id || ''); }}>Pay</button>
                )}
                <button className="btn btn-icon btn-danger" onClick={() => handleDelete(bill._id)} title="Delete"><Trash2 size={14}/></button>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Bill">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Bill Name *</label>
            <input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Netflix"/>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Amount *</label>
              <input className="form-input" type="number" required min="0.01" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}/>
            </div>
            <div className="form-group">
              <label className="form-label">Due Date *</label>
              <input className="form-input" type="date" required value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})}/>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Default Account</label>
            <select className="form-select" value={form.accountId} onChange={e => setForm({...form, accountId: e.target.value})}>
              <option value="">Select account</option>
              {(accounts||[]).map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Add Bill'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!payModal} onClose={() => setPayModal(null)} title={`Pay — ${payModal?.name}`} size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ color: 'var(--text-2)' }}>Paying <strong style={{ color: 'var(--text-1)' }}>{fmt(payModal?.amount)}</strong> from:</p>
          <select className="form-select" value={payAccountId} onChange={e => setPayAccountId(e.target.value)}>
            <option value="">Select account</option>
            {(accounts||[]).map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>This will create an expense transaction and update the account balance.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setPayModal(null)}>Cancel</button>
            <button className="btn btn-success" disabled={!payAccountId || saving} onClick={handlePay}>{saving ? 'Processing…' : 'Confirm Payment'}</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Bills;
