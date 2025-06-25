// src/components/admin/ModalEmail.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { sendAdminEmail } from '../../redux/actions/authAction'; // ✅ NUEVO

const ModalEmail = ({ show, handleClose, recipients }) => {
  const { auth } = useSelector((state) => state);
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
        handleClose();
      }
    }));
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Enviar correo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSend}>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              placeholder="Asunto del correo"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mensaje</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Escribe el contenido del mensaje"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={sending}>
            {sending ? 'Enviando...' : 'Enviar'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalEmail;
