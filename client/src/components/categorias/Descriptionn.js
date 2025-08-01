import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function DescriptionInput({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
  const lang = languageReducer.language || 'en'; 

  return (
    <div className='form-group'>
    <Form.Group controlId="numberInput" className="mb-3">
  <label>{t('description1', { lng: lang })}</label>
      <Form.Control
        as="textarea"
        name="description"
        value={postData.description}
        onChange={handleChangeInput}
        placeholder={t('placeholdersss.description', { lng: lang })}
        rows={3}
        style={{ resize: 'vertical' }}
      />
    </Form.Group></div>
  );
}
