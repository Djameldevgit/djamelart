import React, { useState, useEffect } from 'react';

const ReportModal = ({ show, onHide, onSubmit, t, initialReason = '' }) => {
  const [reportReason, setReportReason] = useState(initialReason);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      setReportReason(initialReason);
      setError('');
    }
  }, [show, initialReason]);

  if (!show) return null;

  const handleSubmit = () => {
    if (!reportReason.trim()) {
      setError(t('reportRequired'));
      return;
    }
    onSubmit(reportReason);
    setReportReason('');
    setError('');
  };

  const handleCancel = () => {
    setReportReason('');
    setError('');
    onHide();
  };

  const reportOptions = [
    { value: '', label: t('selectReason') },
    { value: 'abuse', label: t('harassmentOrAbuse'), icon: 'report' },
    { value: 'spam', label: t('spam'), icon: 'block' },
    { value: 'terms', label: t('termsViolation'), icon: 'gavel' },
    { value: 'offensive', label: t('offensiveContent'), icon: 'warning' },
    { value: 'fraud', label: t('fraudOrScam'), icon: 'shield' },
    { value: 'impersonation', label: t('identityTheft'), icon: 'person_outline' },
    { value: 'inappropriate', label: t('inappropriateContent'), icon: 'remove_circle' },
    { value: 'privacy', label: t('privacyViolation'), icon: 'lock' },
    { value: 'disruption', label: t('serviceDisruption'), icon: 'error' },
    { value: 'suspicious', label: t('suspiciousActivity'), icon: 'visibility_off' },
    { value: 'other', label: t('other'), icon: 'more_horiz' }
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease',
          padding: '20px'
        }}
        onClick={handleCancel}
      >
        {/* Modal */}
        <div 
          style={{
            background: 'white',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            animation: 'slideUp 0.3s ease'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span className="material-icons" style={{ color: '#e74c3c', fontSize: '28px' }}>
                flag
              </span>
              <h3 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '600',
                color: '#333'
              }}>
                {t('reportPublication')}
              </h3>
            </div>
            <button
              onClick={handleCancel}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <span className="material-icons" style={{ fontSize: '24px', color: '#666' }}>
                close
              </span>
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '24px' }}>
            {/* Mensaje informativo */}
            <div style={{
              backgroundColor: '#fff3cd',
              borderLeft: '4px solid #ffc107',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              gap: '10px'
            }}>
              <span className="material-icons" style={{ fontSize: '20px', color: '#856404' }}>
                info
              </span>
              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#856404',
                lineHeight: '1.5'
              }}>
                Tu reporte será revisado por nuestro equipo. Toda la información es confidencial.
              </p>
            </div>

            {/* Error alert */}
            {error && (
              <div style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                animation: 'shake 0.3s ease'
              }}>
                <span className="material-icons" style={{ fontSize: '20px' }}>
                  error
                </span>
                <span>{error}</span>
              </div>
            )}

            {/* Select de razones */}
            <div>
              <label style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '10px',
                display: 'block'
              }}>
                {t('reportReason')}
              </label>
              
              <div style={{
                position: 'relative'
              }}>
                <select
                  value={reportReason}
                  onChange={(e) => {
                    setReportReason(e.target.value);
                    setError('');
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    paddingRight: '40px',
                    borderRadius: '8px',
                    border: error ? '2px solid #e74c3c' : '1px solid #e0e0e0',
                    backgroundColor: 'white',
                    fontSize: '14px',
                    cursor: 'pointer',
                    appearance: 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    if (!error) e.target.style.borderColor = '#0095f6';
                  }}
                  onBlur={(e) => {
                    if (!error) e.target.style.borderColor = '#e0e0e0';
                  }}
                >
                  {reportOptions.map((option, index) => (
                    <option 
                      key={index} 
                      value={option.value}
                      disabled={index === 0}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <span 
                  className="material-icons" 
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#666',
                    fontSize: '24px'
                  }}
                >
                  expand_more
                </span>
              </div>

              {/* Descripción de la razón seleccionada */}
              {reportReason && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <span className="material-icons" style={{ 
                    fontSize: '20px', 
                    color: '#666',
                    marginTop: '2px'
                  }}>
                    {reportOptions.find(opt => opt.value === reportReason)?.icon || 'info'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      margin: 0,
                      fontSize: '13px',
                      color: '#666',
                      lineHeight: '1.5'
                    }}>
                      Has seleccionado: <strong>{reportOptions.find(opt => opt.value === reportReason)?.label}</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <button
              onClick={handleCancel}
              style={{
                padding: '10px 24px',
                backgroundColor: 'white',
                color: '#666',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f8f9fa';
                e.target.style.borderColor = '#666';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.borderColor = '#e0e0e0';
              }}
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!reportReason}
              style={{
                padding: '10px 24px',
                backgroundColor: reportReason ? '#e74c3c' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: reportReason ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                opacity: reportReason ? 1 : 0.6
              }}
              onMouseEnter={(e) => {
                if (reportReason) e.target.style.backgroundColor = '#c0392b';
              }}
              onMouseLeave={(e) => {
                if (reportReason) e.target.style.backgroundColor = '#e74c3c';
              }}
            >
              {t('submitReport')}
            </button>
          </div>
        </div>
      </div>

      {/* Estilos CSS */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(20px); 
            }
            to { 
              opacity: 1;
              transform: translateY(0); 
            }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
        `}
      </style>
    </>
  );
};

export default ReportModal;