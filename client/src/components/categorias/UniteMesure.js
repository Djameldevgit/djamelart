import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function UniteMesure({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation();

  const measurementUnits = [
    { value: 'cm', label: t('unit.cm', { lng: languageReducer.language }) },
    { value: 'm', label: t('unit.m', { lng: languageReducer.language }) },
    { value: 'cm2', label: t('unit.cm2', { lng: languageReducer.language }) },
    { value: 'm2', label: t('unit.m2', { lng: languageReducer.language }) },
    { value: 'mm', label: t('unit.mm', { lng: languageReducer.language }) },
    { value: 'in', label: t('unit.in', { lng: languageReducer.language }) }
  ];

  return (
    <div className="unit-selector-container mb-3">
      <Form.Label>{t('unit.label', { lng: languageReducer.language })}</Form.Label>
      <Select
        options={measurementUnits}
        onChange={(selectedOption) =>
          handleChangeInput({
            target: {
              name: 'measurementUnit',
              value: selectedOption?.value || '',
              type: 'text'
            }
          })
        }
        name="measurementUnit"
        value={measurementUnits.find(opt => opt.value === postData?.measurementUnit) || null}
        placeholder={t('unit.placeholder', { lng: languageReducer.language })}
        className="unit-select"
        classNamePrefix="us"
        isSearchable={false}
        noOptionsMessage={() => t('unit.noOptions', { lng: languageReducer.language })}
        styles={{
          control: (base) => ({
            ...base,
            minHeight: '42px',
            borderColor: '#ced4da',
            '&:hover': { borderColor: '#80bdff' }
          })
        }}
      />
    </div>
  );
}
