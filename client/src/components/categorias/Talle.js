import React from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function TalleSelect({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation();

  const sizes = [
    {
      value: 'petit',
      label: t('size.petit', { lng: languageReducer.language })
    },
    {
      value: 'moyen',
      label: t('size.moyen', { lng: languageReducer.language })
    },
    {
      value: 'grand',
      label: t('size.grand', { lng: languageReducer.language })
    },
    {
      value: 'tres_grand',
      label: t('size.tres_grand', { lng: languageReducer.language })
    }
  ];

  return (
    <Form.Group controlId="numberInput" className="mb-3">
      <Form.Label>{t('size.talle.label', { lng: languageReducer.language })}</Form.Label>
      <Select
        options={sizes}
        onChange={(selectedOption) =>
          handleChangeInput({
            target: {
              name: 'talle',
              value: selectedOption?.value || '',
              type: 'text'
            }
          })
        }
        name="talle"
        value={postData ? sizes.find(opt => opt.value === postData.talle) : null}
        placeholder={t('size.placeholder', { lng: languageReducer.language })}
      />
    </Form.Group>
  );
}
