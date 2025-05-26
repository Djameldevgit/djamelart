import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function Derechosdelautor({ handleChangeInput, postData }) {
  const { t } = useTranslation();
  const { languageReducer } = useSelector(state => state);

  const licencias = [
    { value: 'todos_los_derechos_reservados', label: t('licenses.allRightsReserved', { lng: languageReducer.language }) },
    { value: 'cc_by', label: t('licenses.ccBy', { lng: languageReducer.language }) },
    { value: 'cc_by_nc', label: t('licenses.ccByNc', { lng: languageReducer.language }) },
    { value: 'cc_by_sa', label: t('licenses.ccBySa', { lng: languageReducer.language }) },
    { value: 'cc0', label: t('licenses.cc0', { lng: languageReducer.language }) },
    { value: 'uso_personal_unicamente', label: t('licenses.personalUseOnly', { lng: languageReducer.language }) },
    { value: 'uso_comercial_autorizado', label: t('licenses.commercialUseAllowed', { lng: languageReducer.language }) }
  ];

  const opcionSeleccionada = licencias.find(opt => opt.value === postData?.derechoautor) || null;

  return (
    <Form.Group controlId="derechoautor-select" className="mb-3">
      <Form.Label>{t('labelss.licenseUsage', { lng: languageReducer.language })}</Form.Label>

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
        placeholder={t('placeholderss.selectLicense', { lng: languageReducer.language })}
        className="licence-select"
        classNamePrefix="lc"
        isSearchable={false}
        noOptionsMessage={() => t('messages.noLicensesAvailable', { lng: languageReducer.language })}
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
          {t('validation.requiredField', { lng: languageReducer.language })}
        </Form.Text>
      )}
    </Form.Group>
  );
}
