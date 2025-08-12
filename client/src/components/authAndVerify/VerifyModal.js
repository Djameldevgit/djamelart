import React from 'react';
import ActivateButton from '../../auth/ActivateButton';
 
const VerifyModal = ({ show, onClose }) => {
  if (!show) return null;
 
  return (
    <div className="modal">
      <div className="modal-content" style={{ position: 'relative' }}>

        {/* Botón de cierre visible arriba a la derecha */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '2px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '1.8rem',
            color: '#333',
            cursor: 'pointer',
            fontWeight: 'bold',
            lineHeight: '1',
          }}
          aria-label="Cerrar"
        >
          ×
        </button>

        <div className="modal-buttons">
          {/* ✅ Pasamos la prop onClose */}
          <ActivateButton onClose={onClose} />
        </div>

      </div>
    </div>
  );
};

export default VerifyModal;
