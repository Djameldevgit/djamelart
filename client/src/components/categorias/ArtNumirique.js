import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsSubCategoryArtsNumeriques({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('subcategorias'); // namespace correcto

  const lang = languageReducer.language || 'en'; // fallback por si acaso

  const optionSubCategoryArtsNumeriques = [
    { value: "collage_numerique", label: t('collage_numerique', { lng: lang }) },
    { value: "image_generee_ia", label: t('image_generee_ia', { lng: lang }) },
    { value: "modelisation_3d", label: t('modelisation_3d', { lng: lang }) },
    { value: "peinture_numerique", label: t('peinture_numerique', { lng: lang }) },
    { value: "photo_montage", label: t('photo_montage', { lng: lang }) },
    { value: "travail_numerique_2d", label: t('travail_numerique_2d', { lng: lang }) },
    { value: "video", label: t('video', { lng: lang }) },
    { value: "style", label: t('style', { lng: lang }) }
  ];

  return (
    <div className="art-subcategory-container mb-3">
      <Form.Label>{t('categorias:select_digital_art_type', { lng: lang })}</Form.Label>

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
        placeholder={t('categorias:placeholder_categories', { lng: lang })}
        isDisabled={!postData?.category}
        className="art-select"
        classNamePrefix="art-select"
        noOptionsMessage={() => t('categorias:no_options', { lng: lang })}
        isSearchable={true}
      />
      <small className='text-danger'>{t('categorias:field_required', { lng: lang })}</small>
    </div>
  );
}
