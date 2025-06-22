import React from 'react';
import { useTranslation } from 'react-i18next';

const DesactivateModal = ({ show, onClose }) => {
  const { t } = useTranslation('cardbodycarousel');

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content" style={{ position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '10px', right: '10px',
            background: 'none', border: 'none', fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
        <h4>{t('title')}</h4>
        <p>{t('message')}</p>
        <button onClick={onClose}>{t('close')}</button>
      </div>
    </div>
  );
};

export default DesactivateModal;
