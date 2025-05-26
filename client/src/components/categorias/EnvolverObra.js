import React from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function Envolverlaobra({ handleChangeInput, postData }) {
  const { t } = useTranslation();
  const { languageReducer } = useSelector(state => state);

  const Optionsenvolverobra = [
    { value: 'toile', label: t('packaging.toile', { lng: languageReducer.language }) },
    { value: 'toile_encadree', label: t('packaging.toile_encadree', { lng: languageReducer.language }) },
    { value: 'papier', label: t('packaging.papier', { lng: languageReducer.language }) },
    { value: 'papier_plaque', label: t('packaging.papier_plaque', { lng: languageReducer.language }) },
    { value: 'boite', label: t('packaging.boite', { lng: languageReducer.language }) },
    { value: 'tube', label: t('packaging.tube', { lng: languageReducer.language }) },
    { value: 'caisse', label: t('packaging.caisse', { lng: languageReducer.language }) },
    { value: 'sculpture_boite', label: t('packaging.sculpture_boite', { lng: languageReducer.language }) },
    { value: 'montage_plexi', label: t('packaging.montage_plexi', { lng: languageReducer.language }) },
    { value: 'autre', label: t('packaging.autre', { lng: languageReducer.language }) }
  ];

  return (
    <div className='mb-3'>
      <Form.Label>
        {t('packaging.label', { lng: languageReducer.language })}
      </Form.Label>

      <Select
        options={Optionsenvolverobra}
        onChange={(selectedOption) => handleChangeInput({
          target: {
            name: 'envolverobra',
            value: selectedOption?.value || '',
            type: 'text',
            checked: undefined
          }
        })}
        name="envolverobra"
        value={postData ? Optionsenvolverobra.find(opt => opt.value === postData.envolverobra) : null}
        placeholder={t('packaging.placeholder', { lng: languageReducer.language })}
      />
    </div>
  );
}