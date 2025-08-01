import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsCategory({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
  const lang = languageReducer.language || 'en'; 

  const artCategories = [
    { value: "painting", label: t('categorias:painting', { lng: lang }) },
    { value: "sculpture", label: t('categorias:sculpture', { lng: lang }) },
    { value: "photography", label: t('categorias:photography', { lng: lang }) },
    { value: "drawing", label: t('categorias:drawingg', { lng: lang }) },
    { value: "engraving", label: t('categorias:engraving', { lng: lang }) },
    { value: "digital_art", label: t('categorias:digital_art', { lng: lang }) },
    { value: "collage", label: t('categorias:collage', { lng: lang }) },
    { value: "textile_art", label: t('categorias:textile_art', { lng: lang }) }
  ];
  
  return (
    <div className='form-group'>
    <label  > {t('selecionarcategoriaartistica', { lng: lang })}</label>
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
    </div>
  );
}
