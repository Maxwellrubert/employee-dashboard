import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} style={{ color: '#10b981' }} />;
      case 'error':
        return <XCircle size={20} style={{ color: '#ef4444' }} />;
      case 'warning':
        return <AlertTriangle size={20} style={{ color: '#f59e0b' }} />;
      default:
        return <CheckCircle size={20} style={{ color: '#10b981' }} />;
    }
  };

  return (
    <div className={`toast ${type}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {getIcon()}
        <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: '500' }}>
          {message}
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '0.25rem',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
