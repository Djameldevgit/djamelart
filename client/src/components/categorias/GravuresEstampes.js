import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export function ItemsSubCategoryGravures({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('subcategorias');  
  const lang = languageReducer.language || 'en'; 

  const optionSubCategoryGravures = [
    { value: "collagraphie", label: t("collagraphie", { lng: lang }) },
    { value: "eau_forte", label: t("eau_forte", { lng: lang }) },
    { value: "embossage", label: t("embossage", { lng: lang }) },
    { value: "gravure", label: t("gravure", { lng: lang }) },
    { value: "impression_numerique", label: t("impression_numerique", { lng: lang }) },
    { value: "linogravures", label: t("linogravures", { lng: lang }) },
    { value: "lithographie", label: t("lithographie", { lng: lang }) },
    { value: "monotype", label: t("monotype", { lng: lang }) },
    { value: "serigraphie", label: t("serigraphie", { lng: lang }) },
    { value: "tirage_argentique", label: t("tirage_argentique", { lng: lang }) },
    { value: "xylographie", label: t("xylographie", { lng: lang }) },
  ];

  return (
    <div className='mb-3'>
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
    </div>
  );
}
