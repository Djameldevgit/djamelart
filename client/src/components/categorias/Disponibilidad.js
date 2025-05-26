import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function DisponibiliteOeuvre({ handleChangeInput, postData }) {
  const { t } = useTranslation();
  const { languageReducer } = useSelector(state => state);

  const disponibilites = [
    { value: 'disponible', label: t('availability.disponible', { lng: languageReducer.language }) },
    { value: 'vendue', label: t('availability.vendue', { lng: languageReducer.language }) },
    { value: 'reservee', label: t('availability.reservee', { lng: languageReducer.language }) },
    { value: 'non_disponible', label: t('availability.non_disponible', { lng: languageReducer.language }) },
    { value: 'pas_a_vendre', label: t('availability.pas_a_vendre', { lng: languageReducer.language }) },
    { value: 'exposition_uniquement', label: t('availability.exposition_uniquement', { lng: languageReducer.language }) }
  ];

  return (
    <div className="availability-selector-container mb-3">
      <Form.Label>{t('availability.label', { lng: languageReducer.language })}</Form.Label>

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
        placeholder={t('availability.placeholder', { lng: languageReducer.language })}
        className="availability-select"
        classNamePrefix="av"
        isSearchable={false}
        noOptionsMessage={() => t('availability.noOptions', { lng: languageReducer.language })}
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