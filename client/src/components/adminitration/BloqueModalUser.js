import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Modal,
  Button,
  Form,
  Alert,
  CloseButton
} from "react-bootstrap";
import { 
  ExclamationTriangleFill,
  XCircleFill,
  Calendar2EventFill,
  InfoCircleFill
} from "react-bootstrap-icons";
import { bloquearUsuario } from "../../redux/actions/userBlockAction";

const BloqueModalUser = ({ show, handleClose, user }) => {
  const { auth } = useSelector(state => state);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const [datosBloqueo, setDatosBloqueo] = useState({
    motivo: "",
    content: "",
    fechaLimite: ""
  });

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setDatosBloqueo({ ...datosBloqueo, [name]: value });
  };

  const handleBloqueo = (e) => {
    e.preventDefault();
    setError(null);

    const { motivo, fechaLimite, content } = datosBloqueo;
 
    if (!motivo || !fechaLimite || !content) {
      setError("❌ Completa todos los campos, incluyendo la fecha y hora.");
      return;
    }
  
    dispatch(bloquearUsuario({ auth, datosBloqueo, user }));
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header className="bg-danger text-white position-relative">
        <Modal.Title className="d-flex align-items-center">
          <ExclamationTriangleFill className="me-2" />
          Confirmar bloqueo de usuario
        </Modal.Title>
        <CloseButton 
          variant="white"
          onClick={handleClose}
          aria-label="Cerrar modal"
          className="position-absolute end-0 me-2"
          style={{ top: '1rem' }}
        />
      </Modal.Header>
      
      <Form onSubmit={handleBloqueo}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="d-flex align-items-center">
              <XCircleFill className="me-2" />
              {error}
            </Alert>
          )}
          
          <Form.Group className="mb-3">
            <Form.Label>
              <InfoCircleFill className="me-2 text-warning" />
              Raison du blocage
            </Form.Label>
            <Form.Select 
              name="motivo" 
              value={datosBloqueo.motivo} 
              onChange={handleChangeInput} 
              required
            >
              <option value="">Sélectionner le motif</option>
              <option value="Comportement abusif">Comportement abusif</option>
              <option value="Spam">Spam</option>
              <option value="Violation des conditions d'utilisation">Violation des conditions d'utilisation</option>
              <option value="Langage offensant">Langage offensant</option>
              <option value="Fraude">Fraude</option>
              <option value="Usurpation d'identité">Usurpation d'identité</option>
              <option value="Contenu inapproprié">Contenu inapproprié</option>
              <option value="Violation de la vie privée">Violation de la vie privée</option>
              <option value="Interruption du service">Interruption du service</option>
              <option value="Activité suspecte">Activité suspecte</option>
              <option value="Autre">Autre</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Detalles adicionales</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="content"
              value={datosBloqueo.content}
              onChange={handleChangeInput}
              placeholder="Proporciona más detalles sobre el motivo del bloqueo"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <Calendar2EventFill className="me-2 text-primary" />
              Fecha límite del bloqueo
            </Form.Label>
            <Form.Control
              type="datetime-local"
              name="fechaLimite"
              value={datosBloqueo.fechaLimite}
              onChange={handleChangeInput}
              required
            />
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="danger" type="submit">
            Confirmar Bloqueo
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default BloqueModalUser;