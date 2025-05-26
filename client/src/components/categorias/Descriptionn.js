import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function DescriptionInput({ handleChangeInput, postData }) {
  const { t } = useTranslation();
  const { languageReducer } = useSelector(state => state);

  return (
    <Form.Group controlId="numberInput" className="mb-3">
      <Form.Label>{t('labelsss.description1', { lng: languageReducer.language })}</Form.Label>
      <Form.Control
        as="textarea"
        name="description"
        value={postData.description}
        onChange={handleChangeInput}
        placeholder={t('placeholdersss.description', { lng: languageReducer.language })}
        rows={5}
        style={{ resize: 'vertical' }}
      />
    </Form.Group>
  );
}
