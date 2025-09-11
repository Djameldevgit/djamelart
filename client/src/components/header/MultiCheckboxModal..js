import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateSettings } from "../../redux/actions/settingsAction";

const MultiCheckboxModal = ({ show, onClose }) => {
  const dispatch = useDispatch();
  const { settings, auth } = useSelector((state) => state);

  // Estado local sincronizado con Redux
  const [features, setFeatures] = useState(settings);

  // Cuando cambian settings globales → actualizamos el estado local
  useEffect(() => {
    setFeatures(settings);
  }, [settings]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setFeatures({ ...features, [name]: checked });
  };

  const handleSave = () => {
    dispatch(updateSettings(features, auth.token)); // 🔥 esto lanza el alert
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Actualizar Opciones</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Check
            type="checkbox"
            label="Imágenes"
            name="images"
            checked={features.images || false}
            onChange={handleChange}
          />
          <Form.Check
            type="checkbox"
            label="Estilo"
            name="style"
            checked={features.style || false}
            onChange={handleChange}
          />
          <Form.Check
            type="checkbox"
            label="E-commerce"
            name="ecommerce"
            checked={features.ecommerce || false}
            onChange={handleChange}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MultiCheckboxModal;
