import React, { useState } from 'react';
import { 
  Form, 
  Button, 
  Card, 
  Container, 
  Alert, 
  Spinner,
  OverlayTrigger,
  Tooltip,
  FloatingLabel
} from 'react-bootstrap';
import { 
  EnvelopeFill, 
  PersonFill, 
  PencilFill, 
  TextParagraph,
  SendFill, 
  DoorOpenFill, 
  HouseDoorFill,
  InfoCircleFill
} from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { languageReducer, auth } = useSelector(state => state);
  const { t } = useTranslation('aplicacion');
  const lang = languageReducer.language || 'en';

  const adminEmail = 'artealger2020argelia@gmail.com';
  const userEmail = auth?.user?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

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
          lang,
          userEmail // Incluir el email del usuario en el cuerpo
        })
      });

      const data = await res.json();
      if (res.ok) {
        setShowSuccess(true);
        setTitle('');
        setMessage('');
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        setError(data.msg || t('sendErrorMessage', { lng: lang }));
      }
    } catch (err) {
      console.error('Error al enviar:', err);
      setError(t('networkErrorMessage', { lng: lang }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTooltip = (text) => (
    <Tooltip id="button-tooltip">
      {text}
    </Tooltip>
  );

  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Card className="w-100 shadow-lg" style={{ maxWidth: '657px' }}>
        <Card.Header className="text-center bg-primary text-white py-3">
          <h2 className="mb-0">
            <EnvelopeFill className="me-2" />
            {t('contactFormTitle', { lng: lang })}
          </h2>
        </Card.Header>
        
        <Card.Body className="p-4">
          {showSuccess && (
            <Alert variant="success" dismissible onClose={() => setShowSuccess(false)}>
              {t('messageSentSuccessfully', { lng: lang })}
            </Alert>
          )}
          
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <FloatingLabel controlId="adminEmail" label={t('adminEmailLabel', { lng: lang })} className="mb-3">
              <Form.Control 
                type="email" 
                value={adminEmail} 
                readOnly 
                className="bg-light"
                style={{ height: 'calc(3.5rem + 2px)' }}
              />
              <div className="position-absolute end-0 top-0 h-100 d-flex align-items-center pe-3">
                <OverlayTrigger
                  placement="top"
                  overlay={renderTooltip(t('adminEmailTooltip', { lng: lang }))}
                >
                  <InfoCircleFill className="text-muted" />
                </OverlayTrigger>
              </div>
            </FloatingLabel>

            <FloatingLabel controlId="userEmail" label={t('yourEmailLabel', { lng: lang })} className="mb-3">
              <Form.Control 
                type="email" 
                value={userEmail} 
                readOnly 
                className="bg-light"
                style={{ height: 'calc(3.5rem + 2px)' }}
              />
            </FloatingLabel>

            <FloatingLabel controlId="messageTitle" label={t('messageSubjectLabel', { lng: lang })} className="mb-3">
              <Form.Control 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
                maxLength={100}
                style={{ height: 'calc(3.5rem + 2px)' }}
              />
              <Form.Text className="text-muted">
                {title.length}/100 {t('characters', { lng: lang })}
              </Form.Text>
            </FloatingLabel>

            <Form.Group className="mb-4">
              <Form.Label className="d-flex align-items-center">
                <TextParagraph className="me-2" />
                {t('yourMessageLabel', { lng: lang })}
                <OverlayTrigger
                  placement="top"
                  overlay={renderTooltip(t('messageContentTooltip', { lng: lang }))}
                >
                  <InfoCircleFill className="ms-2 text-muted" size={14} />
                </OverlayTrigger>
              </Form.Label>
              <Form.Control 
                as="textarea" 
                rows={5} 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                required 
                minLength={20}
                maxLength={1000}
                className="mb-2"
              />
              <div className="d-flex justify-content-between">
                <Form.Text className="text-muted">
                  {message.length}/1000 {t('characters', { lng: lang })}
                </Form.Text>
                {message.length > 0 && message.length < 20 && (
                  <Form.Text className="text-danger">
                    {t('minCharactersWarning', { lng: lang, count: 20 })}
                  </Form.Text>
                )}
              </div>
            </Form.Group>

            <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
              <Button 
                variant="outline-danger" 
                onClick={() => window.history.back()}
                className="flex-grow-1"
              >
                <DoorOpenFill className="me-2" />
                {t('exitButton', { lng: lang })}
              </Button>
              
              <Button 
                variant="outline-secondary" 
                href="/"
                className="flex-grow-1"
              >
                <HouseDoorFill className="me-2" />
                {t('backToHomeButton', { lng: lang })}
              </Button>
              
              <Button 
                variant="primary" 
                type="submit"
                disabled={isSubmitting || message.length < 20 || title.length < 5}
                className="flex-grow-1"
              >
                {isSubmitting ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    {t('sendingButton', { lng: lang })}
                  </>
                ) : (
                  <>
                    <SendFill className="me-2" />
                    {t('sendButton', { lng: lang })}
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
        
        <Card.Footer className="text-center text-muted small py-2">
          {t('contactFooterMessage', { lng: lang })}
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default Contact;
