import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsSubCategoryArtsNumeriques({ handleChangeInput, postData }) {
  const { t } = useTranslation();
  const { languageReducer } = useSelector(state => state);

  const optionSubCategoryArtsNumeriques = [
    { value: "collage_numerique", label: t('categorias:subcategorias_arts_numeriques.collage_numerique', { lng: languageReducer.language }) },
    { value: "image_generee_ia", label: t('categorias:subcategorias_arts_numeriques.image_generee_ia', { lng: languageReducer.language }) },
    { value: "modelisation_3d", label: t('categorias:subcategorias_arts_numeriques.modelisation_3d', { lng: languageReducer.language }) },
    { value: "peinture_numerique", label: t('categorias:subcategorias_arts_numeriques.peinture_numerique', { lng: languageReducer.language }) },
    { value: "photo_montage", label: t('categorias:subcategorias_arts_numeriques.photo_montage', { lng: languageReducer.language }) },
    { value: "travail_numerique_2d", label: t('categorias:subcategorias_arts_numeriques.travail_numerique_2d', { lng: languageReducer.language }) },
    { value: "video", label: t('categorias:subcategorias_arts_numeriques.video', { lng: languageReducer.language }) },
    { value: "style", label: t('categorias:subcategorias_arts_numeriques.style', { lng: languageReducer.language }) }
  ];

  return (
    <div className="art-subcategory-container mb-3">
      <Form.Label>{t('categorias:select_digital_art_type', { lng: languageReducer.language })}</Form.Label>

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
        placeholder={t('categorias:placeholder_categories', { lng: languageReducer.language })}
        isDisabled={!postData?.category}
        className="art-select"
        classNamePrefix="art-select"
        noOptionsMessage={() => t('categorias:no_options', { lng: languageReducer.language })}
        isSearchable={true}
      />
      <small className='text-danger'>{t('categorias:field_required', { lng: languageReducer.language })}</small>
    </div>
  );
}
