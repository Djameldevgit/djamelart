import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export function ItemsSubCategoryGravures({ handleChangeInput, postData }) {
  const { t } = useTranslation();
  const { languageReducer } = useSelector(state => state);

  const optionSubCategoryGravures = [
    { value: "collagraphie", label: t("collagraphie", { lng: languageReducer.language }) },
    { value: "eau_forte", label: t("eau_forte", { lng: languageReducer.language }) },
    { value: "embossage", label: t("embossage", { lng: languageReducer.language }) },
    { value: "gravure", label: t("gravure", { lng: languageReducer.language }) },
    { value: "impression_numerique", label: t("impression_numerique", { lng: languageReducer.language }) },
    { value: "linogravures", label: t("linogravures", { lng: languageReducer.language }) },
    { value: "lithographie", label: t("lithographie", { lng: languageReducer.language }) },
    { value: "monotype", label: t("monotype", { lng: languageReducer.language }) },
    { value: "serigraphie", label: t("serigraphie", { lng: languageReducer.language }) },
    { value: "tirage_argentique", label: t("tirage_argentique", { lng: languageReducer.language }) },
    { value: "xylographie", label: t("xylographie", { lng: languageReducer.language }) },
  ];

  return (
    <div className='mb-3'>
      <Form.Label>
        {t("select_engraving_technique", { lng: languageReducer.language })}
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
        placeholder={t("categories", { lng: languageReducer.language })}
        isDisabled={!postData?.category}
        className="basic-select"
        classNamePrefix="select"
      />

      <small className='text-danger'>
        {t("field_required", { lng: languageReducer.language })}
      </small>
    </div>
  );
}
