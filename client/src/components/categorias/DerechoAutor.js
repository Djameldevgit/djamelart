import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function Derechosdelautor({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
  const lang = languageReducer.language || 'en'; 

  const licencias = [
    { value: 'todos_los_derechos_reservados', label: t('licenses.allRightsReserved', { lng: lang }) },
    { value: 'cc_by', label: t('licenses.ccBy', { lng: lang }) },
    { value: 'cc_by_nc', label: t('licenses.ccByNc', { lng: lang }) },
    { value: 'cc_by_sa', label: t('licenses.ccBySa', { lng: lang }) },
    { value: 'cc0', label: t('licenses.cc0', { lng: lang }) },
    { value: 'uso_personal_unicamente', label: t('licenses.personalUseOnly', { lng: lang }) },
    { value: 'uso_comercial_autorizado', label: t('licenses.commercialUseAllowed', { lng: lang }) }
  ];

  const opcionSeleccionada = licencias.find(opt => opt.value === postData?.derechoautor) || null;

  return (
    <div className='form-group'>
   <label  > {t('labelss.licenseUsage', { lng: lang })}</label>

      <Select
        inputId="derechoautor-select"
        options={licencias}
        onChange={(selectedOption) => handleChangeInput({
          target: {
            name: 'derechoautor',
            value: selectedOption?.value || '',
            type: 'text'
          }
        })}
        name="derechoautor"
        value={opcionSeleccionada}
        placeholder={t('placeholderss.selectLicense', { lng: lang })}
        className="licence-select"
        classNamePrefix="lc"
        isSearchable={false}
        noOptionsMessage={() => t('messages.noLicensesAvailable', { lng: lang })}
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: '42px',
            borderColor: state.isFocused ? '#80bdff' : '#ced4da',
            boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,.25)' : 'none',
            '&:hover': { borderColor: '#80bdff' }
          })
        }}
      />

      {!postData?.derechoautor && (
        <Form.Text className="text-danger">
          {t('validation.requiredField', { lng: lang })}
        </Form.Text>
      )}
    </div>
  );
}
