import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const DesactivateModal = ({ show, onClose }) => {
  const { t } = useTranslation('cardbodycarousel')
  const { auth, languageReducer } = useSelector(state => state)
  const [message, setMessage] = useState('')
  const lang = languageReducer?.language || 'es'

  if (!show) return null

  const handleSendEmail = async () => {
    if (!message.trim()) {
      alert(t('messageRequired', { lng: lang }) || 'Debes escribir un mensaje.')
      return
    }

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
      alert('Error al enviar la solicitud.')
    }
  }

  return (
    <div className="modal">
      <div className="modal-content" style={{ position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ×
        </button>

        <h4>{t('title')}</h4>
        <p>{t('message')}</p>

        <div style={{ marginBottom: '1rem' }}>
          <label>Email del usuario:</label>
          <input
            type="email"
            value={auth.user?.email || ''}
            readOnly
            style={{ width: '100%', padding: '5px', marginTop: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Mensaje:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder={t('messagePlaceholder') || 'Escribe tu solicitud aquí...'}
            style={{ width: '100%', padding: '5px', marginTop: '4px' }}
          />
        </div>

        <button onClick={handleSendEmail}>
          {t('requestActivation') || 'Solicitar activación'}
        </button>

        <button onClick={onClose} style={{ marginLeft: '10px' }}>
          {t('close')}
        </button>
      </div>
    </div>
  )
}

export default DesactivateModal
