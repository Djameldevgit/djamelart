import React, { useMemo, useEffect, useState } from 'react';
import { Form, Row, Col, Alert } from 'react-bootstrap';
import Select from 'react-select';
import countryList from 'react-select-country-list';

function Chekout({
  values = {},
  onChange = () => {},
  namePrefix = 'artistLocation'
}) {
  const countries = useMemo(() => countryList().getData(), []);
  const [debugInfo, setDebugInfo] = useState('');

  // DEBUG: Verificar los valores y cambios
  useEffect(() => {
    const debugData = {
      currentValues: values,
      countrySelected: values?.country,
      normalizedCountry: normalizeCountry(values?.country),
      isAlgeria: isAlgeria()
    };
       setDebugInfo(JSON.stringify(debugData, null, 2));
  }, [values]);

  // Manejar cambios genéricos
  const handleChange = (field) => (e) => {
    const newValue = e.target.value;
    onChange({
      target: {
        name: `${namePrefix}.${field}`,
        value: newValue,
        type: 'text'
      }
    });
  };

  // Manejar cambio de país - versión robusta
  const handleCountryChange = (selectedOption) => {
    const countryValue = selectedOption ? selectedOption.label : '';
    
    onChange({
      target: {
        name: `${namePrefix}.country`,
        value: countryValue,
        type: 'text'
      }
    });
  };

  // Función de normalización ultra-robusta
  const normalizeCountry = (str) => {
    if (!str) return '';
    try {
      return str.toString().trim().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, ' ')
        .replace(/[^a-z]/g, "");
    } catch (error) {
      console.error('Error normalizando país:', error);
      return '';
    }
  };

  // Detección de país con múltiples variantes
  const isAlgeria = () => {
    const country = normalizeCountry(values?.country || '');
    const algeriaVariants = [
      'algerie', 'algeria', 'dz', 'dza', 
      'alger', 'algerienne', 'algérie'
    ];
    return algeriaVariants.includes(country);
  };

  // Obtener el valor actual para el Select
  const getSelectedCountry = () => {
    if (!values?.country) return null;
    return countries.find(c => 
      c.label.toLowerCase() === values.country.toLowerCase()
    ) || null;
  };

  return (
    <div className="artist-location-form mb-4">
      {/* Selector de país con feedback visual */}
      <Form.Group as={Row} className="mb-3" controlId="artistCountry">
        <Form.Label column sm={3}>Pays</Form.Label>
        <Col sm={9}>
          <Select
            options={countries}
            value={getSelectedCountry()}
            onChange={handleCountryChange}
            placeholder="Choisir un pays"
            isClearable
            className="country-selector"
            classNamePrefix="select"
          />
          <Form.Text>
            Sélection actuelle: {values?.country || 'Aucun'}
          </Form.Text>
        </Col>
      </Form.Group>

      {/* Área de depuración visible */}
      {process.env.NODE_ENV === 'development' && (
        <Alert variant="secondary" className="mt-3">
          <Alert.Heading>Debug Information</Alert.Heading>
          <pre>{debugInfo}</pre>
        </Alert>
      )}

      {/* Renderizado condicional MEJORADO */}
      {values?.country ? (
        <div className="location-details">
          {/* Campos de dirección */}
          <Form.Group as={Row} className="mb-3" controlId="artistRegion">
            <Form.Label column sm={3}>Région</Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                name={`${namePrefix}.region`}
                value={values?.region || ''}
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
                value={values?.city || ''}
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
                value={values?.postalCode || ''}
                onChange={handleChange('postalCode')}
                placeholder="75000"
              />
            </Col>
          </Form.Group>

          {/* Información bancaria con feedback visual */}
          <div 
            className={`bank-info mt-4 p-3 ${isAlgeria() ? 'algeria' : 'international'}`}
            style={{ 
              border: '2px solid',
              borderColor: isAlgeria() ? '#28a745' : '#007bff',
              backgroundColor: isAlgeria() ? '#f0fff0' : '#f0f8ff'
            }}
          >
            <h5 style={{ color: isAlgeria() ? '#28a745' : '#007bff' }}>
              {isAlgeria() ? (
                <>Informations Bancaires - CCP (Algérie)</>
              ) : (
                <>Informations Bancaires - SWIFT (International)</>
              )}
            </h5>
            
            {isAlgeria() ? (
              <div className="algeria-bank-details">
                <p><strong>Nom :</strong> Mohamed Benali</p>
                <p><strong>Compte CCP :</strong> 12345.78.90</p>
                <p><strong>Clé :</strong> 89</p>
                <p><strong>Adresse :</strong> Bureau de poste de Tizi Ouzou</p>
              </div>
            ) : (
              <div className="international-bank-details">
                <p><strong>Nom :</strong> Mohamed Benali</p>
                <p><strong>Banque :</strong> Société Générale</p>
                <p><strong>IBAN :</strong> FR76 3000 3036 2000 0500 0001 234</p>
                <p><strong>SWIFT :</strong> SOGEFRPP</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Alert variant="info" className="mt-3">
          <Alert.Heading>Action Requise</Alert.Heading>
          <p>Veuillez sélectionner un pays pour afficher les informations de paiement.</p>
        </Alert>
      )}
    </div>
  );
}

export default Chekout;