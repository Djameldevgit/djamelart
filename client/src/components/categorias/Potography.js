import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsSubCategoryPhotographie({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
  const lang = languageReducer.language || 'en'; 

  const optionSubCategoryPhotographie = [
    { value: "light_painting", label: t("light_painting", { lng: lang }) },
    { value: "photographie_argentique", label: t("photographie_argentique", { lng: lang }) },
    { value: "photographie_manipulee", label: t("photographie_manipulee", { lng: lang }) },
    { value: "photographie_non_manipulee", label: t("photographie_non_manipulee", { lng: lang }) },
    { value: "photographie_numerique", label: t("photographie_numerique", { lng: lang }) },
  
  
  
  
  ];

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        {t("select_photography_type", { lng: lang })}
      </Form.Label>

      <Select
        options={optionSubCategoryPhotographie}
        onChange={(selectedOption) => handleChangeInput({
          target: {
            name: 'subcategory',
            value: selectedOption?.value || '',
            type: 'text',
            checked: undefined
          }
        })}
        name="subcategory"
        value={
          postData
            ? optionSubCategoryPhotographie.find(opt => opt.value === postData.subcategory)
            : null
        }
        placeholder={t("categories", { lng: lang })}
        isDisabled={!postData?.category}
        className="basic-select"
        classNamePrefix="select"
      />

      <small className='text-danger'>
        {t("field_required", { lng: lang })}
      </small>
    </Form.Group>
  );
}
