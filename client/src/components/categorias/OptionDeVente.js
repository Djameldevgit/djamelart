import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function VenteOptionsSelect({ handleChangeInput, postData }) {
  const { t } = useTranslation();
  const { languageReducer } = useSelector(state => state);

  const optionsDeVente = [
    { value: 'originalWork', label: t('salesOptions.originalWork', { lng: languageReducer.language }) },
    { value: 'limitedEdition', label: t('salesOptions.limitedEdition', { lng: languageReducer.language }) },
    { value: 'artPrint', label: t('salesOptions.artPrint', { lng: languageReducer.language }) },
    { value: 'reproductionLicense', label: t('salesOptions.reproductionLicense', { lng: languageReducer.language }) },
    { value: 'rentalLeasing', label: t('salesOptions.rentalLeasing', { lng: languageReducer.language }) },
    { value: 'preOrder', label: t('salesOptions.preOrder', { lng: languageReducer.language }) },
  ];

  return (
    <Form.Group controlId="venteOptions" className="mb-3">
      <Form.Label>
        {t('labels.salesOptions', { lng: languageReducer.language })}
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
        placeholder={t('placeholders.conditionOfWork', { lng: languageReducer.language })}
      />
    </Form.Group>
  );
}
