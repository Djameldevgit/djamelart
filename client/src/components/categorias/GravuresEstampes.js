import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export function ItemsSubCategoryGravures({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
  const lang = languageReducer.language || 'en'; 

  const optionSubCategoryGravures = [
    // Técnicas tradicionales
    { value: "xylographie", label: t("xylographie") },
    { value: "lithographie", label: t("lithographie") },
    
    // Técnicas químicas
    { value: "eau_forte", label: t("eau_forte") },
    
    // Técnicas modernas
    { value: "serigraphie", label: t("serigraphie") },
    { value: "impression_numerique", label: t("impression_numerique") },
    
    // Técnicas especiales
    { value: "monotype", label: t("monotype") }
  ];

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        {t("select_engraving_technique", { lng: lang })}
      </Form.Label>

      <Select
        options={optionSubCategoryGravures}
        onChange={(selectedOption) =>
          handleChangeInput({
            target: {
              name: 'subcategory',
              value: selectedOption?.value || '',
              type: 'text',
              checked: undefined
            }
          })
        }
        name="subcategory"
        value={
          postData
            ? optionSubCategoryGravures.find(opt => opt.value === postData.subcategory)
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
