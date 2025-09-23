import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function DisponibilidadOeuvre({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
  const lang = languageReducer.language || 'en'; 

  const disponibilites = [
    { value: 'disponible', label: t('availability.disponible', { lng: lang }) },
    { value: 'vendue', label: t('availability.vendue', { lng: lang }) },
    { value: 'non_disponible', label: t('availability.non_disponible', { lng: lang }) },
    { value: 'pas_a_vendre', label: t('availability.pas_a_vendre', { lng: lang }) },
    { value: 'exposition_uniquement', label: t('availability.exposition_uniquement', { lng: lang }) }
  ];

  const mostrarPrecio = postData?.disponibilidad === 'disponible';

  return (
    <>
      {/* Select de Disponibilidad */}
      <div className='form-group'>
        <label>{t('availability.label', { lng: lang })}</label>
        <Select
          options={disponibilites}
          onChange={(selectedOption) => handleChangeInput({
            target: {
              name: 'disponibilidad',
              value: selectedOption?.value || '',
              type: 'text'
            }
          })}
          name="disponibilidad"
          value={disponibilites.find(opt => opt.value === postData?.disponibilidad) || null}
          placeholder={t('availability.placeholder', { lng: lang })}
          className="availability-select"
          classNamePrefix="av"
          isSearchable={false}
          noOptionsMessage={() => t('availability.noOptions', { lng: lang })}
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

      {/* Input de Precio - Solo muestra cuando disponibilidad es "disponible" */}
      {mostrarPrecio && (
        <div className='form-group'>
          <label>{t('price.labelsprice', { lng: lang })}</label>
          <Form.Control
            type="number"
            name="price"
            value={postData.price || ''}
            onChange={handleChangeInput}
            placeholder={t('price.placeholders', { lng: lang })}
            step="0.01"
            min="0"
          />
        </div>
      )}
    </>
  );
}