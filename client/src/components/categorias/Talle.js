import React from 'react';
 
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function TalleSelect({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
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
    <div className='form-group'>
   <label  > {t('size.talle', { lng: lang })}</label>
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
    </div>
  );
}
