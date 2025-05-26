import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsSubCategoryDesign({ handleChangeInput, postData }) {
  const { t } = useTranslation();
  const { languageReducer } = useSelector(state => state);

  const optionSubCategoryDessin = [
    { value: "acrylique", label: t("acrylique", { lng: languageReducer.language }) },
    { value: "aerographe", label: t("aerographe", { lng: languageReducer.language }) },
    { value: "aquarelle", label: t("aquarelle", { lng: languageReducer.language }) },
    { value: "autre", label: t("autre", { lng: languageReducer.language }) },
    { value: "bombe_aerosol", label: t("bombe_aerosol", { lng: languageReducer.language }) },
    { value: "carte_a_gratter", label: t("carte_a_gratter", { lng: languageReducer.language }) },
    { value: "cire", label: t("cire", { lng: languageReducer.language }) },
    { value: "conte", label: t("conte", { lng: languageReducer.language }) },
    { value: "craie", label: t("craie", { lng: languageReducer.language }) },
    { value: "crayon", label: t("crayon", { lng: languageReducer.language }) },
    { value: "email", label: t("email", { lng: languageReducer.language }) },
    { value: "encaustique", label: t("encaustique", { lng: languageReducer.language }) },
    { value: "encre", label: t("encre", { lng: languageReducer.language }) },
    { value: "fusain", label: t("fusain", { lng: languageReducer.language }) },
    { value: "gouache", label: t("gouache", { lng: languageReducer.language }) },
    { value: "graphite", label: t("graphite", { lng: languageReducer.language }) },
    { value: "huile", label: t("huile", { lng: languageReducer.language }) },
    { value: "laque", label: t("laque", { lng: languageReducer.language }) },
    { value: "marqueur", label: t("marqueur", { lng: languageReducer.language }) },
    { value: "pastel", label: t("pastel", { lng: languageReducer.language }) },
    { value: "peinture_vitrail", label: t("peinture_vitrail", { lng: languageReducer.language }) },
    { value: "pigments", label: t("pigments", { lng: languageReducer.language }) },
    { value: "pochoir", label: t("pochoir", { lng: languageReducer.language }) },
    { value: "pointe_d_argent", label: t("pointe_d_argent", { lng: languageReducer.language }) },
    { value: "stylo_bille", label: t("stylo_bille", { lng: languageReducer.language }) },
    { value: "stylo_gel", label: t("stylo_gel", { lng: languageReducer.language }) },
    { value: "tempera", label: t("tempera", { lng: languageReducer.language }) },
  ];

  return (
    <div className='mb-3'>
      <Form.Label>
        {t("select_drawing_technique", { lng: languageReducer.language })}
      </Form.Label>

      <Select
        options={optionSubCategoryDessin}
        onChange={(selectedOption) => handleChangeInput({
          target: {
            name: 'subcategory',
            value: selectedOption?.value || '',
            type: 'text',
            checked: undefined
          }
        })}
        name="subcategory"
        value={postData
          ? optionSubCategoryDessin.find(opt => opt.value === postData.subcategory)
          : null}
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
