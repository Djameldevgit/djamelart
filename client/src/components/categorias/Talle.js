import React from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function TalleSelect({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('componentstatusmodal');  
  const lang = languageReducer.language || 'en'; 

  const sizes = [
    {
      value: 'petit',
      label: t('size.petit', { lng: lang })
    },
    {
      value: 'moyen',
      label: t('size.moyen', { lng: lang })
    },
    {
      value: 'grand',
      label: t('size.grand', { lng: lang })
    },
    {
      value: 'tres_grand',
      label: t('size.tres_grand', { lng: lang })
    }
  ];

  return (
    <Form.Group controlId="numberInput" className="mb-3">
      <Form.Label>{t('size.talle.label', { lng: lang })}</Form.Label>
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
        placeholder={t('size.placeholder', { lng: lang })}
      />
    </Form.Group>
  );
}
