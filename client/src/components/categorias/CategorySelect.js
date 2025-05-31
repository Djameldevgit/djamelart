import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsCategory({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
  const lang = languageReducer.language || 'en'; 

  const artCategories = [
    { value: "Painting", label: t('categorias:painting', { lng: lang }) },
    { value: "Sculpture", label: t('categorias:sculpture', { lng: lang }) },
    { value: "Photography", label: t('categorias:photography', { lng: lang }) },
    { value: "drawing", label: t('categorias:drawing', { lng: lang }) },
    { value: "Engraving", label: t('categorias:engraving', { lng: lang }) },
    { value: "Digital_art", label: t('categorias:digital_art', { lng: lang }) },
    { value: "Collage", label: t('categorias:collage', { lng: lang }) },
    { value: "Textile_art", label: t('categorias:textile_art', { lng: lang }) }
  ];

  return (
    <Form.Group className="mb-3">
       
      <Form.Label>{t('selecionarcategoriaartistica', { lng: lang })}</Form.Label>
      <Select
        options={artCategories}
        onChange={(selectedOption) =>
          handleChangeInput({
            target: {
              name: 'category',
              value: selectedOption?.value || '',
              type: 'text'
            }
          })
        }
        name="category"
        value={
          postData
            ? artCategories.find(opt => opt.value === postData.category)
            : null
        }
        placeholder={t('categorie_placeholder', { lng: lang })}
        className="basic-select"
        classNamePrefix="select"
      />
      <small className="text-danger">{t('categorie_required', { lng: lang })}</small>
    </Form.Group>
  );
}
