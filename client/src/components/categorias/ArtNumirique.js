import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsSubCategoryArtsNumeriques({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias'); // namespace correcto

  const lang = languageReducer.language || 'en'; // fallback por si acaso

 const optionSubCategoryArtsNumeriques = [
  // Técnicas principales
  { value: "peinture_numerique", label: t('peinture_numerique') },
  { value: "modelisation_3d", label: t('modelisation_3d') },
  
  // IA y generativo
  { value: "image_generee_ia", label: t('image_generee_ia') },
  
  // Técnicas compositivas
  { value: "collage_numerique", label: t('collage_numerique') },
  { value: "photo_montage", label: t('photo_montage') },
  
  // Formatos
  { value: "video", label: t('video') },
  { value: "style", label: t('style') }
];

  return (
    <Form.Group className="mb-3">
      <Form.Label>{t('select_digital_art_type', { lng: lang })}</Form.Label>

      <Select
        options={optionSubCategoryArtsNumeriques}
        onChange={(selectedOption) => handleChangeInput({
          target: {
            name: 'subcategory',
            value: selectedOption?.value || '',
            type: 'text',
            checked: undefined
          }
        })}
        name="subcategory"
        value={postData ? optionSubCategoryArtsNumeriques.find(opt => opt.value === postData.subcategory) : null}
        placeholder={t('categories', { lng: lang })}
        isDisabled={!postData?.category}
        className="art-select"
        classNamePrefix="art-select"
        noOptionsMessage={() => t('categorias:no_options', { lng: lang })}
        isSearchable={true}
      />
      <small className='text-danger'>{t('field_required', { lng: lang })}</small>
    </Form.Group>
  );
}
