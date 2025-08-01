import React from 'react';
import { Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export function TitleInput({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');   
  const lang = languageReducer.language || 'en'; 

  return (
    <div className='form-group'>
    <label  > {t('titleDeLaObra', { lng: lang })}</label>

      <Form.Control
        type="text"
        name="title"
        value={postData.title}
        onChange={handleChangeInput}
        placeholder={t('introduceUnTituloParaLaObra', { lng: lang })}
      />
    </div>
  );
}
