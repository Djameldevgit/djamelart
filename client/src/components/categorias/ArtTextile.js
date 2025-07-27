import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
 
export function ItemsSubCategoryArtTextile({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
  const lang = languageReducer.language || 'en'; 
  const optionSubCategoryArtTextile = [
    { value: "broderie", label: t('broderie', { lng: lang }) },
    { value: "fibre_textile", label: t('fibre_textile', { lng: lang }) },
    { value: "fil", label: t('fil', { lng: lang }) },
    { value: "patchwork", label: t('patchwork', { lng: lang }) },
    { value: "string_art", label: t('string_art', { lng: lang }) },
    { value: "tapisserie", label: t('tapisserie', { lng: lang }) },
    { value: "tissu", label: t('tissu', { lng: lang }) },
  ];



  return (
    <Form.Group className="mb-3">
      <Form.Label>{t('categorias:select_textile_technique', { lng: lang })}</Form.Label>

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
        placeholder={t('categorias:placeholder_categories', { lng: lang })}
        isDisabled={!postData?.category}
        className="textile-select"
        classNamePrefix="tx-select"
        isSearchable={true}
        noOptionsMessage={() => t('categorias:no_options', { lng: lang })}
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
      <small className='text-danger'>{t('field_required', { lng: lang })}</small>
    </Form.Group>
  );
}
