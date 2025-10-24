// components/OptionsModal.js
import React from 'react';

const OptionsModal = ({ 
  show, 
  onClose, // ✅ Asegurar que recibe onClose
  innerRef,
  isAdmin,
  isPostOwner,
  saved,
  saveLoad,
  t,
  onOptionClick,
  onAprove,
  onChatWithAdmin
}) => {
  if (!show) return null;

  // ✅ Función para manejar clicks en opciones
  const handleOptionSelect = (option) => {
    onOptionClick(option);
    // El cierre ahora se maneja en el componente padre
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={onClose} // ✅ Cerrar al hacer click fuera
    >
      <div
        ref={innerRef}
        style={{
          background: 'white',
          width: '100%',
          maxWidth: '500px',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '20px 0',
          transform: 'translateY(0)',
          animation: 'slideUp 0.3s ease',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()} // ✅ Prevenir cierre al hacer click dentro
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {/* ✅ Opciones para admin */}
          {isAdmin && (
            <button
              onClick={() => handleOptionSelect('approve')}
              style={{
                background: 'none',
                border: 'none',
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '16px',
                color: '#333',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <span className="material-icons" style={{ color: '#666' }}>
                check_circle
              </span>
              {t('approvePublication')}
            </button>
          )}

          {/* ✅ Opciones para el dueño del post O admin */}
          {(isPostOwner || isAdmin) && (
            <>
              <button
                onClick={() => handleOptionSelect('edit')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '16px 24px',
                  textAlign: 'left',
                  fontSize: '16px',
                  color: '#333',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <span className="material-icons" style={{ color: '#666' }}>
                  edit
                </span>
                {t('editPublication')}
              </button>

              <button
                onClick={() => handleOptionSelect('delete')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '16px 24px',
                  textAlign: 'left',
                  fontSize: '16px',
                  color: '#e74c3c',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(231, 76, 60, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <span className="material-icons" style={{ color: '#e74c3c' }}>
                  delete
                </span>
                {t('deletePublication')}
              </button>
            </>
          )}

          {/* ... resto de las opciones ... */}

          {/* ✅ Botón para cerrar - MEJORADO */}
          <div style={{ padding: '8px 16px', marginTop: '8px' }}>
            <button
              onClick={onClose} // ✅ Usar onClose directamente
              style={{
                background: 'rgba(0, 0, 0, 0.05)',
                border: 'none',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '16px',
                color: '#333',
                cursor: 'pointer',
                width: '100%',
                fontWeight: '600',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsModal;