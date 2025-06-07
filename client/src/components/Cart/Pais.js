import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const Pais = ({
  values = {},
  onChange,
  namePrefix = 'artistLocation'
}) => {
  const handleChange = (field) => (e) => {
    onChange({
      target: {
        name: `${namePrefix}.${field}`,
        value: e.target.value,
        type: 'text'
      }
    });
  };

  return (
    <div className="artist-location-form mb-3">

      <Form.Group as={Row} className="mb-3" controlId="artistCountry">
        <Form.Label column sm={3}>Localisation de l'artiste</Form.Label>
        <Col sm={9}>
          <Form.Control
            type="text"
            name={`${namePrefix}.country`}
            value={values.country || ''}
            onChange={handleChange('country')}
            placeholder="Pays"
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="artistRegion">
        <Form.Label column sm={3}>Région</Form.Label>
        <Col sm={9}>
          <Form.Control
            type="text"
            name={`${namePrefix}.region`}
            value={values.region || ''}
            onChange={handleChange('region')}
            placeholder="Île-de-France"
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="artistCity">
        <Form.Label column sm={3}>Ville</Form.Label>
        <Col sm={9}>
          <Form.Control
            type="text"
            name={`${namePrefix}.city`}
            value={values.city || ''}
            onChange={handleChange('city')}
            placeholder="Paris"
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="artistPostalCode">
        <Form.Label column sm={3}>Code Postal</Form.Label>
        <Col sm={9}>
          <Form.Control
            type="text"
            name={`${namePrefix}.postalCode`}
            value={values.postalCode || ''}
            onChange={handleChange('postalCode')}
            placeholder="75000"
            pattern="[0-9]{5}"
            maxLength="5"
          />
          <Form.Text muted>Format: 5 chiffres</Form.Text>
        </Col>
      </Form.Group>

    </div>
  );
};

export default Pais;
