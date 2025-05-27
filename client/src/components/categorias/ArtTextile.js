import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
 
export function ItemsSubCategoryArtTextile({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation();

  const optionSubCategoryArtTextile = [
    { value: "broderie", label: t('postDetail:broderie', { lng: languageReducer.language }) },
    { value: "fibre_textile", label: t('postDetail:fibre_textile', { lng: languageReducer.language }) },
    { value: "fil", label: t('postDetail:fil', { lng: languageReducer.language }) },
    { value: "patchwork", label: t('postDetail:patchwork', { lng: languageReducer.language }) },
    { value: "string_art", label: t('postDetail:string_art', { lng: languageReducer.language }) },
    { value: "tapisserie", label: t('postDetail:tapisserie', { lng: languageReducer.language }) },
    { value: "tissu", label: t('postDetail:tissu', { lng: languageReducer.language }) },
  ];



  return (
    <div className="art-category-container mb-3">
      <Form.Label>{t('categorias:select_textile_technique', { lng: languageReducer.language })}</Form.Label>

      <Select
        options={optionSubCategoryArtTextile}
        onChange={(selectedOption) => handleChangeInput({
          target: {
            name: 'subcategory',
            value: selectedOption?.value || '',
            type: 'text'
          }
        })}
        name="subcategory"
        value={optionSubCategoryArtTextile.find(opt => opt.value === (postData?.subcategory || ''))}
        placeholder={t('categorias:placeholder_categories', { lng: languageReducer.language })}
        isDisabled={!postData?.category}
        className="textile-select"
        classNamePrefix="tx-select"
        isSearchable={true}
        noOptionsMessage={() => t('categorias:no_options', { lng: languageReducer.language })}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: base => ({ ...base, zIndex: 9999 }),
          control: (base) => ({
            ...base,
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            minHeight: '44px'
          })
        }}
      />
      <small className='text-danger'>{t('categorias:field_required', { lng: languageReducer.language })}</small>
    </div>
  );
}
