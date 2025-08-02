import React, { useState } from 'react';
import { 
  Modal, 
  Button, 
  Form, 
  Alert,
  Spinner,
  Stack,
  CloseButton
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { sendAdminEmail } from '../../redux/actions/authAction';

const ModalEmail = ({ show, handleClose, recipients }) => {
  const { auth, alert, languageReducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { t } = useTranslation('modales');
  const lang = languageReducer.language || 'es';

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();

    if (!subject || !message) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: t('errors.requiredFields', { lng: lang }) },
      });
    }

    setSending(true);

    dispatch(sendAdminEmail({
      recipients,
      subject,
      message,
      url: '#',
      token: auth.token,
      onSuccess: () => {
        setSending(false);
        setSubject('');
        setMessage('');
        handleClose(); // Cierre del modal al completar el envío
      },
      onError: () => {
        setSending(false); // Asegura que el spinner se detenga en caso de error
      }
    }));
  };

  return (
    <Modal 
      show={show} 
      onHide={() => {
        if (!sending) { // Solo permite cerrar si no está enviando
          handleClose();
        }
      }} 
      centered 
      size="lg" 
      backdrop="static"
    >
      <Modal.Header closeButton className="bg-light position-relative">
        <Modal.Title className="w-100">
          <i className="fas fa-envelope me-2"></i>
          {t('header.title', { count: recipients.length, lng: lang })}
          <CloseButton 
            onClick={() => {
              if (!sending) { // Solo permite cerrar si no está enviando
                handleClose();
              }
            }}
            disabled={sending}
            className="position-absolute end-0 me-3"
            style={{ top: '1.25rem' }}
            aria-label={t('actions.close', { lng: lang })}
          />
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="pt-4">
        {alert.error && (
          <Alert variant="danger" dismissible 
            onClose={() => dispatch({ type: GLOBALTYPES.ALERT, payload: {} })}
            className="mb-4"
          >
            {alert.error}
          </Alert>
        )}
        
        <Form onSubmit={handleSend}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">{t('form.subjectLabel', { lng: lang })}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('form.subjectPlaceholder', { lng: lang })}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="py-2"
            />
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">{t('form.messageLabel', { lng: lang })}</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              placeholder={t('form.messagePlaceholder', { lng: lang })}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="py-2"
              style={{ minHeight: '150px' }}
            />
          </Form.Group>
          
          <Stack direction="horizontal" gap={3} className="justify-content-end mt-4">
            <Button 
              variant="outline-secondary" 
              onClick={handleClose}
              disabled={sending}
              size="lg"
            >
              {t('actions.cancel', { lng: lang })}
            </Button>
            
            <Button 
              variant="primary" 
              type="submit" 
              disabled={sending}
              className="d-flex align-items-center gap-2"
              size="lg"
            >
              {sending ? (
                <>
                  <Spinner animation="border" size="sm" />
                  {t('actions.sending', { lng: lang })}
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  {t('actions.send', { lng: lang })}
                </>
              )}
            </Button>
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalEmail;