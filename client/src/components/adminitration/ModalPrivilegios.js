import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { updatePrivilegios } from '../../redux/actions/userAction';

const opcionesDisponibles = [
  { value: 'archivos', label: 'Permitir subida de archivos' },
  { value: 'lenguaje', label: 'Permitir lenguaje' },
  { value: 'chat', label: 'Permitir chat' },
  { value: 'interfaz', label: 'Actualización de la interfaz' },
];

const ModalPrivilegios = ({ user, setShowModal, token }) => {
  const dispatch = useDispatch();

  const [seleccionados, setSeleccionados] = useState(
    Array.isArray(user?.opcionesUser) ? user.opcionesUser : []
  );

  const handleToggle = (value) => {
    setSeleccionados((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = () => {
    dispatch(updatePrivilegios(user._id, seleccionados, token));
    setShowModal(false);
  };

  return (
    <Modal show onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Privilegios de {user.username}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            {opcionesDisponibles.map((opt) => (
              <Col xs={12} key={opt.value} className="mb-2">
                <Form.Check
                  type="checkbox"
                  label={opt.label}
                  checked={seleccionados.includes(opt.value)}
                  onChange={() => handleToggle(opt.value)}
                />
              </Col>
            ))}
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPrivilegios;
