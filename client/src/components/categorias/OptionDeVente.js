import React from 'react';
import Select from 'react-select';
 
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function VenteOptionsSelect({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
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
    <div className='form-group'>
   <label  > 
        {t('labels.salesOptions', { lng: lang })}
      </label>

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
    </div>
  );
}
