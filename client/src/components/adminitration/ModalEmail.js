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
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { sendAdminEmail } from '../../redux/actions/authAction';

const ModalEmail = ({ show, handleClose, recipients }) => {
  const { auth, alert } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();

    if (!subject || !message) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: 'Título y mensaje son requeridos.' },
      });
    }

    setSending(true);

    dispatch(sendAdminEmail({
      recipients,
      subject,
      message,
      token: auth.token,
      onSuccess: () => {
        setSending(false);
        setSubject('');
        setMessage('');
        handleClose();
      }
    }));
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" backdrop="static">
      <Modal.Header className="bg-light position-relative">
        <Modal.Title className="w-100">
          <i className="fas fa-envelope me-2"></i>
          Enviar correo a {recipients.length} usuario(s)
          <CloseButton 
            onClick={handleClose}
            disabled={sending}
            className="position-absolute end-0 me-3"
            style={{ top: '1.25rem' }}
            aria-label="Cerrar modal"
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
            <Form.Label className="fw-bold">Asunto del correo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Actualización importante de la plataforma"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="py-2"
            />
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Contenido del mensaje</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="Escribe aquí el contenido detallado del mensaje..."
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
              Cancelar
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
                  Enviando...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  Enviar correo
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