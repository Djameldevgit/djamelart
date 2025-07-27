import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsSubCategoryPeinture({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
  const lang = languageReducer.language || 'en';  

  const optionSubCategoryPeinture = [
   
      // Técnicas pictóricas principales
      { value: "huile", label: t('huile') },
      { value: "acrylique", label: t('acrylique') },
      { value: "aquarelle", label: t('aquarelle') },
      { value: "gouache", label: t('gouache') },
      
      // Técnicas especializadas
      { value: "tempera", label: t('tempera') },
      { value: "encaustique", label: t('encaustique') },
      { value: "peinture_vitrail", label: t('peinture_vitrail') },
      
      // Herramientas/efectos
      { value: "aerographe", label: t('aerographe') },
      { value: "bombe_aerosol", label: t('bombe_aerosol') },
      { value: "pochoir", label: t('pochoir') },
      
      // Genérico
      { value: "autre", label: t('autre') }
    ];
  
  return (
    <Form.Group className="mb-3">
      <Form.Label>{t('tecnicaparapintura', { lng: lang })}</Form.Label>

      <Select
        options={optionSubCategoryPeinture}
        onChange={(selectedOption) => handleChangeInput({
          target: {
            name: 'subcategory',
            value: selectedOption?.value || '',
            type: 'text'
          }
        })}
        name="subcategory"
        value={postData ? optionSubCategoryPeinture.find(opt => opt.value === postData.subcategory) : null}
        placeholder={t('placeholder_peinture', { lng: lang })}
        isDisabled={!postData?.category}
      />
      <small className='text-danger'>{t('field_required', { lng: lang })}</small>
    </Form.Group>
  );
}
