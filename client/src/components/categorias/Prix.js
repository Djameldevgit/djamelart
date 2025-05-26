import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function PriceInput({ handleChangeInput, postData }) {
  const { t } = useTranslation();
  const { languageReducer } = useSelector(state => state);

  return (
    <Form.Group controlId="numberInput" className="mb-3">
      <Form.Label>
        {t('price.labelsprice', { lng: languageReducer.language })}
      </Form.Label>

      <Form.Control
        type="number"
        name="price"
        value={postData.price || ''}
        onChange={handleChangeInput}
        placeholder={t('price.placeholders', { lng: languageReducer.language })}
        step="0.01"
        min="0"
      />

      
    </Form.Group>
  );
}
