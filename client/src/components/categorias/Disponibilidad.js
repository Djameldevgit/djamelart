import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function DisponibiliteOeuvre({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
  const lang = languageReducer.language || 'en'; 

  const disponibilites = [
    { value: 'disponible', label: t('availability.disponible', { lng: lang }) },
    { value: 'vendue', label: t('availability.vendue', { lng: lang }) },
    { value: 'reservee', label: t('availability.reservee', { lng: lang }) },
    { value: 'non_disponible', label: t('availability.non_disponible', { lng: lang }) },
    { value: 'pas_a_vendre', label: t('availability.pas_a_vendre', { lng: lang }) },
    { value: 'exposition_uniquement', label: t('availability.exposition_uniquement', { lng: lang }) }
  ];

  return (
    <div className='form-group'>
    <label  > {t('availability.label', { lng: lang })}</label>

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
  );
}