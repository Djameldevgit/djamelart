import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsSubCategorySculpture({ handleChangeInput, postData }) {
  const { t } = useTranslation();
  const { languageReducer } = useSelector(state => state);

  const optionSubCategorySculpture = [
    { value: "acier_inoxydable", label: t("acier_inoxydable", { lng: languageReducer.language }) },
    { value: "aluminium", label: t("aluminium", { lng: languageReducer.language }) },
    { value: "argile", label: t("argile", { lng: languageReducer.language }) },
    { value: "autre", label: t("autre", { lng: languageReducer.language }) },
    { value: "beton", label: t("beton", { lng: languageReducer.language }) },
    { value: "beton_cellulaire", label: t("beton_cellulaire", { lng: languageReducer.language }) },
    { value: "bois", label: t("bois", { lng: languageReducer.language }) },
    { value: "bronze", label: t("bronze", { lng: languageReducer.language }) },
    { value: "carton", label: t("carton", { lng: languageReducer.language }) },
    { value: "ceramique", label: t("ceramique", { lng: languageReducer.language }) },
    { value: "ciment", label: t("ciment", { lng: languageReducer.language }) },
    { value: "coulage", label: t("coulage", { lng: languageReducer.language }) },
    { value: "cuir", label: t("cuir", { lng: languageReducer.language }) },
    { value: "fil_de_fer", label: t("fil_de_fer", { lng: languageReducer.language }) },
    { value: "glace", label: t("glace", { lng: languageReducer.language }) },
    { value: "metaux", label: t("metaux", { lng: languageReducer.language }) },
    { value: "mosaique", label: t("mosaique", { lng: languageReducer.language }) },
    { value: "os", label: t("os", { lng: languageReducer.language }) },
    { value: "papier", label: t("papier", { lng: languageReducer.language }) },
    { value: "papier_mache", label: t("papier_mache", { lng: languageReducer.language }) },
    { value: "pate_polymere", label: t("pate_polymere", { lng: languageReducer.language }) },
    { value: "pierre", label: t("pierre", { lng: languageReducer.language }) },
    { value: "plastique", label: t("plastique", { lng: languageReducer.language }) },
    { value: "platre", label: t("platre", { lng: languageReducer.language }) },
    { value: "resine", label: t("resine", { lng: languageReducer.language }) },
    { value: "sable", label: t("sable", { lng: languageReducer.language }) },
    { value: "savon", label: t("savon", { lng: languageReducer.language }) },
    { value: "terre_cuite", label: t("terre_cuite", { lng: languageReducer.language }) },
    { value: "verre", label: t("verre", { lng: languageReducer.language }) },
  ];

  return (
    <div className='mb-3'>
      <Form.Label>
        {t("select_material", { lng: languageReducer.language })}
      </Form.Label>

      <Select
        options={optionSubCategorySculpture}
        onChange={(selectedOption) => handleChangeInput({
          target: {
            name: 'subcategory',
            value: selectedOption?.value || '',
            type: 'text',
          }
        })}
        name="subcategory"
        value={postData ? optionSubCategorySculpture.find(opt => opt.value === postData.subcategory) : null}
        placeholder={t("categories", { lng: languageReducer.language })}
        isDisabled={!postData?.category}
      />

      <small className='text-danger'>
        {t("field_required", { lng: languageReducer.language })}
      </small>
    </div>
  );
}
