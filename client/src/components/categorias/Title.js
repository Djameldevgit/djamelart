import React from 'react';
import { Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export function TitleInput({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');   
  const lang = languageReducer.language || 'en'; 

  return (
    <Form.Group controlId="numberInput" className="mb-3">
      <Form.Label>{t('titleDeLaObra', { lng: lang })}</Form.Label>

      <Form.Control
        type="text"
        name="title"
        value={postData.title}
        onChange={handleChangeInput}
        placeholder={t('introduceUnTituloParaLaObra', { lng: lang })}
      />
    </Form.Group>
  );
}
