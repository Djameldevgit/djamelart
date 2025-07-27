import React from 'react';
 
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function Envolverlaobra({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
  const lang = languageReducer.language || 'en'; 

  const Optionsenvolverobra = [
    { value: 'toile', label: t('packaging.toile', { lng: lang }) },
    { value: 'toile_encadree', label: t('packaging.toile_encadree', { lng: lang }) },
    { value: 'papier', label: t('packaging.papier', { lng: lang }) },
    { value: 'papier_plaque', label: t('packaging.papier_plaque', { lng: lang }) },
    { value: 'boite', label: t('packaging.boite', { lng: lang }) },
    { value: 'tube', label: t('packaging.tube', { lng: lang }) },
    { value: 'caisse', label: t('packaging.caisse', { lng: lang }) },
    { value: 'sculpture_boite', label: t('packaging.sculpture_boite', { lng: lang }) },
    { value: 'montage_plexi', label: t('packaging.montage_plexi', { lng: lang }) },
    { value: 'autre', label: t('packaging.autre', { lng: lang }) }
  ];

  return (
    <div className='form-group'>
   <label  > 
        {t('packaging.label', { lng: lang })}
      </label>

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
        placeholder={t('packaging.placeholder', { lng: lang })}
      />
    </div>
  );
}