import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

const VARIANTS = {
  info: { icon: Info, color: '#5c9fe0' },
  success: { icon: CheckCircle2, color: '#5ce08c' },
  error: { icon: XCircle, color: '#e05c5c' },
  confirm: { icon: AlertTriangle, color: '#e0b95c' },
};

// Modal genérico para alertas e confirmações, substituindo alert()/confirm() do navegador.
export default function Modal({
  open,
  variant = 'info',
  title,
  message,
  confirmText = 'OK',
  cancelText,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  const { icon: Icon, color } = VARIANTS[variant] || VARIANTS.info;
  const isConfirm = Boolean(cancelText);

  const handleBackdropClick = () => {
    if (onCancel) onCancel();
    else onConfirm?.();
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
          position: 'relative',
        }}
      >
        {onCancel && (
          <button
            onClick={onCancel}
            aria-label="Fechar"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
          >
            <X size={18} />
          </button>
        )}

        <Icon size={40} color={color} style={{ marginBottom: '1rem' }} />

        {title && <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem' }}>{title}</h3>}
        {message && (
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            {message}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'center' }}>
          {isConfirm && (
            <button className="btn btn-outline" onClick={onCancel} style={{ minWidth: '110px' }}>
              {cancelText}
            </button>
          )}
          <button className="btn btn-primary" onClick={onConfirm} style={{ minWidth: '110px' }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
