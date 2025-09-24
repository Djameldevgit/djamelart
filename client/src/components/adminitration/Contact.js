import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Spinner, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const Contact = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const { auth, languageReducer } = useSelector(state => state);
  const { t, i18n } = useTranslation('contact');
  const location = useLocation();

  // Efecto para pre-llenar cuando viene de encargos
  useEffect(() => {
    if (location.state?.fromEncargos) {
      setTitle(location.state.prefillTitle || t('commissionDefaultTitle'));
      setMessage(location.state.prefillMessage || t('commissionDefaultMessage'));
    }
  }, [location.state, t]);

  // Cambiar el idioma activamente si es diferente
  const lang = languageReducer.language || 'es';
  if (i18n.language !== lang) i18n.changeLanguage(lang);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      const res = await axios.post(
        '/api/contact-support',
        {
          title,
          message,
          lang,
          userEmail: auth.user?.email || '',
          isCommission: location.state?.fromEncargos || false
        },
        {
          headers: {
            Authorization: auth.token || ''
          }
        }
      );

      console.log('✅ Respuesta:', res.data);

      setFeedback({ 
        type: 'success', 
        msg: location.state?.fromEncargos 
          ? t('commissionRequestSent') 
          : t('mensajeenviadoconexito') 
      });
      
      // Limpiar solo si no viene de encargos
      if (!location.state?.fromEncargos) {
        setTitle('');
        setMessage('');
      }
    } catch (err) {
      console.error('❌ Error:', err.response?.data || err.message);
      setFeedback({
        type: 'danger',
        msg: err.response?.data?.msg || t('erroralenviarmensaje')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCommissionRequest = location.state?.fromEncargos;

  return (
    <Container className="py-5" style={{
      direction: lang === 'ar' ? 'rtl' : 'ltr',
      textAlign: lang === 'ar' ? 'right' : 'left'
    }}>
      
      {/* Header especial para encargos */}
      {isCommissionRequest && (
        <Alert variant="info" className="mb-4">
          <h5>🎨 {t('commissionHeader')}</h5>
          <p className="mb-0">{t('commissionSubheader')}</p>
        </Alert>
      )}

      <h3 className="mb-4 text-center">
        {isCommissionRequest ? t('commissionTitle') : t('contact_form')}
      </h3>

      {feedback && (
        <Alert variant={feedback.type} dismissible onClose={() => setFeedback(null)}>
          {feedback.msg}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Email del usuario (solo lectura) */}
        <Form.Group className="mb-3">
          <Form.Label><strong>{t('emailLabel')}</strong></Form.Label>
          <Form.Control
            type="email"
            value={auth.user?.email || t('guestUser')}
            readOnly
            plaintext
            className="border-bottom pb-1"
          />
          <Form.Text className="text-muted">
            {isCommissionRequest ? t('commissionEmailHelp') : t('regularEmailHelp')}
          </Form.Text>
        </Form.Group>

        {/* Asunto */}
        <Form.Group className="mb-3">
          <Form.Label><strong>{t('subjectt')}</strong></Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('write_subject')}
            required
          />
        </Form.Group>

        {/* Mensaje */}
        <Form.Group className="mb-3">
          <Form.Label><strong>{t('messagee')}</strong></Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isCommissionRequest ? t('commissionPlaceholder') : t('write_message')}
            required
          />
          {isCommissionRequest && (
            <Form.Text className="text-muted">
              {t('commissionHelpText')}
            </Form.Text>
          )}
        </Form.Group>

        <Button 
          type="submit" 
          disabled={isSubmitting} 
          variant={isCommissionRequest ? "success" : "primary"} 
          size="lg"
          className="w-100"
        >
          {isSubmitting ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              {isCommissionRequest ? t('sendingCommission') : t('sendingg')}
            </>
          ) : (
            isCommissionRequest ? t('sendCommissionButton') : t('send_message')
          )}
        </Button>
      </Form>

      {/* Información adicional para encargos */}
      {isCommissionRequest && (
        <Alert variant="light" className="mt-4">
          <h6>📋 {t('commissionIncludesTitle')}</h6>
          <ul className="mb-0">
            <li>{t('commissionIncludes.price')}</li>
            <li>{t('commissionIncludes.materials')}</li>
            <li>{t('commissionIncludes.delivery')}</li>
            <li>{t('commissionIncludes.shipping')}</li>
            <li>{t('commissionIncludes.modifications')}</li>
          </ul>
        </Alert>
      )}
    </Container>
  );
};

export default Contact;