import React from 'react';
import Select from 'react-select';
 
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function Negociarprecio({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
  const lang = languageReducer.language || 'en'; 

  const optionsNegociar = [
    { value: '', label: t('negociable.selectOptionPlaceholder', { lng: lang }) },
    { value: 'fixe', label: t('negociable.fixedPrice', { lng: lang }) },
    { value: 'negociable', label: t('negociable.negotiablePrice', { lng: lang }) }
  ];

  return (
    <div className='form-group'>
    <label  > 
        {t('negociable.negotiationPrice', { lng: lang })}
      </label>
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
        placeholder={t('labels.selectOptionPlaceholder', { lng: lang })}
        className="basic-select"
        classNamePrefix="select"
      />
    </div>
  );
}

