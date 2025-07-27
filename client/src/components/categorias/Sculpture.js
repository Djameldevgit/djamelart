import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsSubCategorySculpture({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  

  const lang = languageReducer.language || 'en'; // fallback por si acaso


  const optionSubCategorySculpture = [
    { value: "acier_inoxydable", label: t("acier_inoxydable", { lng: lang }) },
    { value: "aluminium", label: t("aluminium", { lng: lang }) },
    { value: "argile", label: t("argile", { lng: lang }) },
    { value: "autre", label: t("autre", { lng: lang }) },
    { value: "beton", label: t("beton", { lng: lang }) },
    { value: "beton_cellulaire", label: t("beton_cellulaire", { lng: lang }) },
    { value: "bois", label: t("bois", { lng: lang }) },
    { value: "bronze", label: t("bronze", { lng: lang }) },
    { value: "carton", label: t("carton", { lng: lang }) },
    { value: "ceramique", label: t("ceramique", { lng: lang }) },
    { value: "ciment", label: t("ciment", { lng: lang }) },
    { value: "coulage", label: t("coulage", { lng: lang }) },
    { value: "cuir", label: t("cuir", { lng: lang }) },
    { value: "fil_de_fer", label: t("fil_de_fer", { lng: lang }) },
    { value: "glace", label: t("glace", { lng: lang }) },
    { value: "metaux", label: t("metaux", { lng: lang }) },
    { value: "mosaique", label: t("mosaique", { lng: lang }) },
    { value: "os", label: t("os", { lng: lang }) },
    { value: "papier", label: t("papier", { lng: lang }) },
    { value: "papier_mache", label: t("papier_mache", { lng: lang }) },
    { value: "pate_polymere", label: t("pate_polymere", { lng: lang }) },
    { value: "pierre", label: t("pierre", { lng: lang }) },
    { value: "plastique", label: t("plastique", { lng: lang }) },
    { value: "platre", label: t("platre", { lng: lang }) },
    { value: "resine", label: t("resine", { lng: lang }) },
    { value: "sable", label: t("sable", { lng: lang }) },
    { value: "savon", label: t("savon", { lng: lang }) },
    { value: "terre_cuite", label: t("terre_cuite", { lng: lang }) },
    { value: "verre", label: t("verre", { lng: lang }) },
  ];

  return (
    <Form.Group className="mb-3">
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
        placeholder={t("categories", { lng: lang })}
        isDisabled={!postData?.category}
      />

      <small className='text-danger'>
        {t("field_required", { lng: lang })}
      </small>
    </Form.Group>
  );
}
