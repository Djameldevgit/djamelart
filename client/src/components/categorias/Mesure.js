import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
export function MesureInput({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
  const lang = languageReducer.language || 'en'; 

  return (
    <div className='form-group'>
    <label  >  {t('mesure.labels.measurement', { lng: lang })}</label>   
      <Form.Control
        type="text"
        name="measurementValue"
        value={postData.measurementValue || ''}
        onChange={handleChangeInput}
        placeholder= {t('mesure.labels.medidas', { lng: lang })}
        min="0"
        step="any"
        className="measurement-input"
      />
    </div>
  );
}
