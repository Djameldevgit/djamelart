import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Spinner, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const Contact = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const { auth, languageReducer } = useSelector(state => state);
  const lang = languageReducer.language || 'es';

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

      setFeedback({ type: 'success', msg: 'Mensaje enviado correctamente.' });
      setTitle('');
      setMessage('');
    } catch (err) {
      console.error('❌ Error:', err.response?.data || err.message);
      setFeedback({
        type: 'danger',
        msg: err.response?.data?.msg || 'Error al enviar el mensaje.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-5" style={{ Width: 'auto' }}>
      <h3 className="mb-4 text-center">Formulario de Contacto</h3>

      {feedback && (
        <Alert variant={feedback.type} dismissible onClose={() => setFeedback(null)}>
          {feedback.msg}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Asunto</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Escribe el asunto"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje aquí"
            required
          />
        </Form.Group>

        <Button type="submit" disabled={isSubmitting} variant="primary" className="w-100">
          {isSubmitting ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              Enviando...
            </>
          ) : (
            'Enviar Mensaje'
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default Contact;
