import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widths = { sm: '420px', md: '560px', lg: '700px' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        style={{ maxWidth: widths[size] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: fadeIn 0.15s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-box {
          background: var(--bg-overlay);
          border: 1px solid var(--border-hover);
          border-radius: var(--r-xl);
          width: 100%;
          box-shadow: var(--shadow-lg);
          animation: slideUp 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)  scale(1);    }
        }
        .modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px 16px;
          border-bottom: 1px solid var(--border);
        }
        .modal-title { font-size: 1.1rem; font-weight: 700; color: var(--text-1); }
        .modal-close {
          background: var(--bg-elevated); border: 1px solid var(--border);
          color: var(--text-2); border-radius: var(--r-sm);
          padding: 6px; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          transition: all var(--transition);
        }
        .modal-close:hover { background: var(--danger-dim); color: var(--danger); border-color: transparent; }
        .modal-body { padding: 20px 24px 24px; }
      `}</style>
    </div>
  );
};

export default Modal;
