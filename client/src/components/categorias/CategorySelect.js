import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsCategory({ handleChangeInput, postData }) {
  const { t } = useTranslation();
  const { languageReducer } = useSelector(state => state);

  const artCategories = [
    { value: "Painting", label: t('categorias:painting', { lng: languageReducer.language }) },
    { value: "Sculpture", label: t('categorias:sculpturee', { lng: languageReducer.language }) },
    { value: "Photography", label: t('categorias:photography', { lng: languageReducer.language }) },
    { value: "drawing", label: t('categorias:drawing', { lng: languageReducer.language }) },
    { value: "Engraving", label: t('categorias:engraving', { lng: languageReducer.language }) },
    { value: "Digital_art", label: t('categorias:digital_art', { lng: languageReducer.language }) },
    { value: "Collage", label: t('categorias:collage', { lng: languageReducer.language }) },
    { value: "Textile_art", label: t('categorias:textile_art', { lng: languageReducer.language }) }
  ];

  return (
    <Form.Group className="mb-3">
       
      <Form.Label>{t('selecionarcategoriaartistica', { lng: languageReducer.language })}</Form.Label>
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
        placeholder={t('categorie_placeholder', { lng: languageReducer.language })}
        className="basic-select"
        classNamePrefix="select"
      />
      <small className="text-danger">{t('categorie_required', { lng: languageReducer.language })}</small>
    </Form.Group>
  );
}
