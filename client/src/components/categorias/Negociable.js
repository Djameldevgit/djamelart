import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function Negociarprecio({ handleChangeInput, postData }) {
  const { t } = useTranslation();
  const { languageReducer } = useSelector(state => state);

  const optionsNegociar = [
    { value: '', label: t('negociable.selectOptionPlaceholder', { lng: languageReducer.language }) },
    { value: 'fixe', label: t('negociable.fixedPrice', { lng: languageReducer.language }) },
    { value: 'negociable', label: t('negociable.negotiablePrice', { lng: languageReducer.language }) }
  ];

  return (
    <Form.Group controlId="venteOptions" className="mb-3">
      <Form.Label className="mt-3">
        {t('negociable.negotiationPrice', { lng: languageReducer.language })}
      </Form.Label>
      <Select
        options={optionsNegociar}
        onChange={(selectedOption) => handleChangeInput({
          target: {
            name: 'negociable',
            value: selectedOption?.value || '',
            type: 'text',
            checked: undefined
          }
        })}
        name="negociable"
        value={postData ? optionsNegociar.find(opt => opt.value === postData.negociable) : null}
        placeholder={t('labels.selectOptionPlaceholder', { lng: languageReducer.language })}
        className="basic-select"
        classNamePrefix="select"
      />
    </Form.Group>
  );
}

