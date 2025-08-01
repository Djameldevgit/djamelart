import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function PriceInput({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
  const lang = languageReducer.language || 'en'; 
  return (
    <div className='form-group'>
    <label  > 
        {t('price.labelsprice', { lng: lang })}
      </label>

      <Form.Control
        type="number"
        name="price"
        value={postData.price || ''}
        onChange={handleChangeInput}
        placeholder={t('price.placeholders', { lng: lang })}
        step="0.01"
        min="0"
      />

      
    </div>
  );
}
