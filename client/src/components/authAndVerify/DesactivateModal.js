import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const DesactivateModal = ({ show, onClose, closeOnOverlayClick = true }) => {
  const { t } = useTranslation('authmodal')
  const { auth, languageReducer } = useSelector(state => state)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const lang = languageReducer?.language || 'es'
  const modalRef = useRef(null)

  // Función para cerrar al hacer clic fuera del modal
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose()
    }
  }

  // Función para cerrar con la tecla Escape
  const handleEscapeKey = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  useEffect(() => {
    if (show) {
      // Agregar event listeners cuando el modal se muestra
      document.addEventListener('mousedown', handleOverlayClick)
      document.addEventListener('keydown', handleEscapeKey)
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden'
    }

    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleOverlayClick)
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'unset'
    }
  }, [show, closeOnOverlayClick])

  const handleSendEmail = async () => {
    if (!message.trim()) {
      alert(t('messageRequired', { lng: lang }) || 'Debes escribir un mensaje.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/contact-activation-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({
          message,
          lang
        })
      })

      const data = await res.json()
      if (res.ok) {
        alert(t('messageSentSuccess', { lng: lang }) || 'Correo enviado con éxito.')
        setMessage('')
        onClose()
      } else {
        alert(data.msg || 'Error al enviar el mensaje.')
      }
    } catch (err) {
      console.error(err)
      alert(t('requestError', { lng: lang }) || 'Error al enviar la solicitud.')
    } finally {
      setLoading(false)
    }
  }

  if (!show) return null

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
          padding: "25px",
          borderRadius: "8px",
          width: "400px",
          maxWidth: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          cursor: "default",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
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
        >
          ×
        </button>

        <h4 style={{ margin: "0 0 15px 0", color: "#333", textAlign: "center" }}>
          {t('activationRequest', { lng: lang })}
        </h4>
        
        <p style={{ margin: "0 0 20px 0", color: "#666", textAlign: "center" }}>
          {t('activationMessage', { lng: lang })}
        </p>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            {t('userEmail', { lng: lang })}:
          </label>
          <input
            type="email"
            value={auth.user?.email || ''}
            readOnly
            style={{ 
              width: "100%", 
              padding: "10px", 
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "#f5f5f5"
            }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            {t('message', { lng: lang })}:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder={t('messagePlaceholder', { lng: lang })}
            style={{ 
              width: "100%", 
              padding: "10px", 
              border: "1px solid #ddd",
              borderRadius: "4px",
              resize: "vertical"
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button 
            onClick={handleSendEmail}
            disabled={loading}
            style={{
              padding: "12px 20px",
              backgroundColor: loading ? "#6c757d" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              minWidth: "120px"
            }}
          >
            {loading ? t('sending', { lng: lang }) : t('requestActivation', { lng: lang })}
          </button>
          
          <button 
            onClick={onClose}
            style={{
              padding: "12px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              minWidth: "80px"
            }}
          >
            {t('close', { lng: lang })}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DesactivateModal