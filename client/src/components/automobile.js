import { Form } from 'react-bootstrap';

export const Title2Input = ({ postData, handleChangeInput }) => (
  <Form.Group controlId="title2Input" className="mb-3">
    <Form.Label>Titre</Form.Label>
    <Form.Control
      type="text"
      name="title2"
      value={postData.attributes.title2}
      onChange={handleChangeInput}
      placeholder="Titre"
    />
  </Form.Group>
);

export const MarqueInput = ({ postData, handleChangeInput }) => (
  <Form.Group controlId="marqueInput" className="mb-3">
    <Form.Label>Marque</Form.Label>
    <Form.Control
      type="text"
      name="marque"
      value={postData.attributes.marque}
      onChange={handleChangeInput}
      placeholder="Marque"
    />
  </Form.Group>
);

export const ModelInput = ({ postData, handleChangeInput }) => (
  <Form.Group controlId="modelInput" className="mb-3">
    <Form.Label>Modèle</Form.Label>
    <Form.Control
      type="text"
      name="model"
      value={postData.attributes.model}
      onChange={handleChangeInput}
      placeholder="Modèle"
    />
  </Form.Group>
);
