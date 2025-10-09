// components/OptionsModal.js
import React from 'react';

const OptionsModal = ({ 
  show, 
  onClose, 
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

  return (
    <div style={{
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
    }}>
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
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {/* Opciones para admin */}
          {isAdmin && (
            <button
              onClick={onAprove}
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
            >
              <span className="material-icons" style={{ color: '#666' }}>
                check_circle
              </span>
              {t('approvePublication')}
            </button>
          )}

          {/* Opciones para el dueño del post o admin */}
          {(isPostOwner || isAdmin) && (
            <>
              <button
                onClick={() => onOptionClick('edit')}
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
              >
                <span className="material-icons" style={{ color: '#666' }}>
                  edit
                </span>
                {t('editPublication')}
              </button>

              <button
                onClick={() => onOptionClick('delete')}
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
              >
                <span className="material-icons" style={{ color: '#e74c3c' }}>
                  delete
                </span>
                {t('deletePublication')}
              </button>
            </>
          )}

          {/* Opciones para todos los usuarios */}
          <button
            onClick={() => onOptionClick('contact')}
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
          >
            <span className="material-icons" style={{ color: '#666' }}>
              chat
            </span>
            {t('contactArtist')}
          </button>

          <button
            onClick={() => onOptionClick('share')}
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
          >
            <span className="material-icons" style={{ color: '#666' }}>
              share
            </span>
            {t('sharePublication')}
          </button>

          <button
            onClick={() => onOptionClick('save')}
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
          >
            <span className="material-icons" style={{ color: '#666' }}>
              {saved ? 'bookmark' : 'bookmark_border'}
            </span>
            {saved ? t('saved') : t('savePublication')}
          </button>

          {/* Contactar con Admin */}
          <button
            onClick={onChatWithAdmin}
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
          >
            <span className="material-icons" style={{ color: '#666' }}>
              admin_panel_settings
            </span>
            {t('contactAdmin')}
          </button>

          {/* Opción de denuncia (si no es el dueño) */}
          {!isPostOwner && (
            <button
              onClick={() => onOptionClick('report')}
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
            >
              <span className="material-icons" style={{ color: '#e74c3c' }}>
                flag
              </span>
              {t('reportPublication')}
            </button>
          )}

          {/* Botón para cerrar */}
          <div style={{ padding: '8px 16px', marginTop: '8px' }}>
            <button
              onClick={onClose}
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