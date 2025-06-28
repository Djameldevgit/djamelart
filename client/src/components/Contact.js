// Contact.jsx
import React, { useState } from 'react';
import { Form, Button, Card, Container } from 'react-bootstrap';
import { 
  EnvelopeFill, PersonFill, PencilFill, TextParagraph,
  SendFill, DoorOpenFill, HouseDoorFill
} from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const { languageReducer, auth } = useSelector(state => state);
  const { t } = useTranslation('aplicacion');
  const lang = languageReducer.language || 'en';

  const adminEmail = 'artealger2020argelia@gmail.com';
  const userEmail = auth?.user?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/contact-support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({
          title,
          message,
          lang
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert(t('messageSentSuccessfully', { lng: lang }));
        setTitle('');
        setMessage('');
      } else {
        alert(data.msg || 'Error al enviar el mensaje');
      }
    } catch (err) {
      console.error('Error al enviar:', err);
      alert('Error de red al enviar el mensaje');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="w-100" style={{ maxWidth: '600px' }}>
        <Card.Header className="text-center bg-primary text-white">
          <h2>{t('contactFormTitle', { lng: lang })}</h2>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label><EnvelopeFill className="me-2" />{t('adminEmailLabel', { lng: lang })}</Form.Label>
              <Form.Control type="email" value={adminEmail} readOnly className="bg-light" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label><PersonFill className="me-2" />{t('yourEmailLabel', { lng: lang })}</Form.Label>
              <Form.Control type="email" value={userEmail} readOnly className="bg-light" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label><PencilFill className="me-2" />{t('messageSubjectLabel', { lng: lang })}</Form.Label>
              <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label><TextParagraph className="me-2" />{t('yourMessageLabel', { lng: lang })}</Form.Label>
              <Form.Control as="textarea" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="danger" onClick={() => window.history.back()}>
                <DoorOpenFill className="me-2" />{t('exitButton', { lng: lang })}
              </Button>
              <Button variant="secondary" href="/" className="ms-2 me-2">
                <HouseDoorFill className="me-2" />{t('backToHomeButton', { lng: lang })}
              </Button>
              <Button variant="primary" type="submit">
                <SendFill className="me-2" />{t('sendButton', { lng: lang })}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Contact;
