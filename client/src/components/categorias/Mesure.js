import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
export function MesureInput({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('componentstatusmodal');  
  const lang = languageReducer.language || 'en'; 

  return (
    <Form.Group controlId="measurementInput" className="mb-3">
      <Form.Label> {t('mesure.labels.measurement', { lng: lang })}</Form.Label>   
      <Form.Control
        type="number"
        name="measurementValue"
        value={postData.measurementValue || ''}
        onChange={handleChangeInput}
        placeholder= {t('mesure.labels.medidas', { lng: lang })}
        min="0"
        step="any"
        className="measurement-input"
      />
    </Form.Group>
  );
}
