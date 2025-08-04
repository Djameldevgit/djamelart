import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Spinner, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const { auth, languageReducer } = useSelector(state => state);
  const { t, i18n } = useTranslation('aplicacion');

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
          userEmail: auth.user.email
        },
        {
          headers: {
            Authorization: auth.token
          }
        }
      );

      console.log('✅ Respuesta:', res.data);

      setFeedback({ type: 'success', msg: t('mensajeenviadoconexito') });
      setTitle('');
      setMessage('');
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

  return (
    <Container className="py-5" style={{
    direction: lang === 'ar' ? 'rtl' : 'ltr',
      textAlign: lang === 'ar' ? 'right' : 'left',
    }}>
      <h3 className="mb-4 text-center">{t('contact_form')}</h3>

      {feedback && (
        <Alert variant={feedback.type} dismissible onClose={() => setFeedback(null)}>
          {feedback.msg}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            type="email"
            value={auth.user?.email || ''}
            readOnly
            plaintext
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t('subjectt')}</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('write_subject')}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t('messagee')}</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('write_message')}
            required
          />
        </Form.Group>

        <Button type="submit" disabled={isSubmitting} variant="primary" className="w-100">
          {isSubmitting ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              {t('sendingg')}...
            </>
          ) : (
            t('send_message')
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default Contact;
