import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ActivateButton from '../../auth/ActivateButton';

const VerifyModal = ({ show, onClose, closeOnOverlayClick = true }) => {
  const { t } = useTranslation('authmodal');
  const { languageReducer } = useSelector(state => state);
  const lang = languageReducer?.language || 'es';
  const modalRef = useRef(null);

  // Función para cerrar al hacer clic fuera del modal
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Función para cerrar con la tecla Escape
  const handleEscapeKey = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (show) {
      // Agregar event listeners cuando el modal se muestra
      document.addEventListener('mousedown', handleOverlayClick);
      document.addEventListener('keydown', handleEscapeKey);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleOverlayClick);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [show, closeOnOverlayClick]);

  if (!show) return null;

  return (
    <div className="modal-overlay" style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      cursor: closeOnOverlayClick ? 'pointer' : 'default'
    }}>
      <div 
        ref={modalRef}
        className="modal-content" 
        style={{
          backgroundColor: "white",
          padding: "30px 25px 25px 25px",
          borderRadius: "8px",
          width: "350px",
          maxWidth: "90%",
          textAlign: "center",
          cursor: "default",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "#999",
            padding: "5px",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onMouseOver={(e) => e.target.style.color = "#333"}
          onMouseOut={(e) => e.target.style.color = "#999"}
          title={t('close', { lng: lang })}
          aria-label={t('close', { lng: lang })}
        >
          ×
        </button>

        {/* Título del modal */}
        <h4 style={{ 
          margin: "0 0 15px 0", 
          color: "#333",
          fontSize: "1.3rem"
        }}>
          {t('verificationRequired', { lng: lang })}
        </h4>

        {/* Mensaje explicativo */}
        <p style={{ 
          margin: "0 0 25px 0", 
          color: "#666",
          lineHeight: "1.5"
        }}>
          {t('verificationMessage', { lng: lang })}
        </p>

        {/* Botón de activación */}
        <div className="modal-buttons">
          <ActivateButton onClose={onClose} />
        </div>

        {/* Mensaje adicional */}
        <p style={{ 
          margin: "20px 0 0 0", 
          color: "#999",
          fontSize: "0.9rem",
          fontStyle: "italic"
        }}>
          {t('verificationNote', { lng: lang })}
        </p>
      </div>
    </div>
  );
};

export default VerifyModal;