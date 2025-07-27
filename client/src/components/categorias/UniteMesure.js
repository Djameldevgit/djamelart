import React from 'react';
import Select from 'react-select';
 
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function UniteMesure({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
  const lang = languageReducer.language || 'en'; 

  const measurementUnits = [
    { value: 'cm', label: t('unit.cm', { lng: lang }) },
    { value: 'm', label: t('unit.m', { lng: lang }) },
    { value: 'cm2', label: t('unit.cm2', { lng: lang }) },
    { value: 'm2', label: t('unit.m2', { lng: lang }) },
    { value: 'mm', label: t('unit.mm', { lng: lang }) },
    { value: 'in', label: t('unit.in', { lng: lang }) }
  ];

  return (
    <div className='form-group'>
   <label  > {t('unit.label', { lng: lang })}</label>
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
        placeholder={t('unit.placeholder', { lng: lang })}
        className="unit-select"
        classNamePrefix="us"
        isSearchable={false}
        noOptionsMessage={() => t('unit.noOptions', { lng: lang })}
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
