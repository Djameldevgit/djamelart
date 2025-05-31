import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function VenteOptionsSelect({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('componentstatusmodal');  
  const lang = languageReducer.language || 'en'; 

  const optionsDeVente = [
    { value: 'originalWork', label: t('salesOptions.originalWork', { lng: lang }) },
    { value: 'limitedEdition', label: t('salesOptions.limitedEdition', { lng: lang }) },
    { value: 'artPrint', label: t('salesOptions.artPrint', { lng: lang }) },
    { value: 'reproductionLicense', label: t('salesOptions.reproductionLicense', { lng: lang }) },
    { value: 'rentalLeasing', label: t('salesOptions.rentalLeasing', { lng: lang }) },
    { value: 'preOrder', label: t('salesOptions.preOrder', { lng: lang }) },
  ];

  return (
    <Form.Group controlId="venteOptions" className="mb-3">
      <Form.Label>
        {t('labels.salesOptions', { lng: lang })}
      </Form.Label>

      <Select
        options={optionsDeVente}
        onChange={(selectedOption) =>
          handleChangeInput({
            target: {
              name: 'venteOption',
              value: selectedOption?.value || '',
              type: 'text',
            },
          })
        }
        name="venteOption"
        value={postData ? optionsDeVente.find(opt => opt.value === postData.venteOption) : null}
        placeholder={t('placeholders.conditionOfWork', { lng: lang })}
      />
    </Form.Group>
  );
}
