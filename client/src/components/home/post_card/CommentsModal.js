// components/home/post_card/CommentsModal.js
import React from 'react';
import Comments from '../Comments';
import InputComment from '../InputComment';

const CommentsModal = ({ 
  show, 
  onHide, 
  post, 
  t = (key) => key // Default translation function
}) => {
  if (!show) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }} 
      onClick={onHide} // Cerrar al hacer click fuera
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }} 
        onClick={(e) => e.stopPropagation()} // Prevenir cierre al hacer click dentro
      >
        {/* Header del modal */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8f9fa'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '18px', 
            color: '#333',
            fontWeight: '600'
          }}>
            {t('comments') || 'Comentarios'}
          </h3>
          <button 
            onClick={onHide}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '4px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.1)';
              e.target.style.color = '#333';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none';
              e.target.style.color = '#666';
            }}
          >
            ×
          </button>
        </div>
        
        {/* Cuerpo del modal con comentarios */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
          background: '#ffffff'
        }}>
          <Comments post={post} />
        </div>
        
        {/* Input para comentarios */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid #e0e0e0',
          background: '#f8f9fa'
        }}>
          <InputComment post={post} />
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;