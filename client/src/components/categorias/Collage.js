import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsSubCategoryCollages({ handleChangeInput, postData }) {
  const { t } = useTranslation();
  const { languageReducer } = useSelector(state => state);

  const optionSubCategoryCollages = [
    { value: "abstrait", label: t("abstrait", { lng: languageReducer.language }) },
    { value: "art_brut", label: t("art_brut", { lng: languageReducer.language }) },
    { value: "art_conceptuel", label: t("art_conceptuel", { lng: languageReducer.language }) },
    { value: "art_naif", label: t("art_naif", { lng: languageReducer.language }) },
    { value: "art_oriental", label: t("art_oriental", { lng: languageReducer.language }) },
    { value: "art_premier", label: t("art_premier", { lng: languageReducer.language }) },
    { value: "art_spirituel", label: t("art_spirituel", { lng: languageReducer.language }) },
    { value: "calligraphie", label: t("calligraphie", { lng: languageReducer.language }) },
    { value: "classicisme", label: t("classicisme", { lng: languageReducer.language }) },
    { value: "cubisme", label: t("cubisme", { lng: languageReducer.language }) },
    { value: "expressionnisme", label: t("expressionnisme", { lng: languageReducer.language }) },
    { value: "fauvisme", label: t("fauvisme", { lng: languageReducer.language }) },
    { value: "figuratif", label: t("figuratif", { lng: languageReducer.language }) },
    { value: "geometrique", label: t("geometrique", { lng: languageReducer.language }) },
    { value: "hyperrealisme", label: t("hyperrealisme", { lng: languageReducer.language }) },
    { value: "illustration", label: t("illustration", { lng: languageReducer.language }) },
    { value: "impressionnisme", label: t("impressionnisme", { lng: languageReducer.language }) },
    { value: "land_art", label: t("land_art", { lng: languageReducer.language }) },
    { value: "minimalisme", label: t("minimalisme", { lng: languageReducer.language }) },
    { value: "pop_art", label: t("pop_art", { lng: languageReducer.language }) },
    { value: "street_art", label: t("street_art", { lng: languageReducer.language }) },
    { value: "surrealisme", label: t("surrealisme", { lng: languageReducer.language }) },
    { value: "symbolisme", label: t("symbolisme", { lng: languageReducer.language }) },
  ];

  return (
    <div className="art-subcategory-wrapper mb-3">
      <Form.Label>{t("select_art_movement", { lng: languageReducer.language })}</Form.Label>

      <Select
        options={optionSubCategoryCollages}
        onChange={(selectedOption) => handleChangeInput({
          target: {
            name: 'subcategory',
            value: selectedOption?.value || '',
            type: 'text'
          }
        })}
        name="subcategory"
        value={optionSubCategoryCollages.find(opt => opt.value === (postData?.subcategory || ''))}
        placeholder={t("categories", { lng: languageReducer.language })}
        isDisabled={!postData?.category}
        className="art-movement-select"
        classNamePrefix="ams"
        isSearchable={true}
        noOptionsMessage={() => t("movement_not_available", { lng: languageReducer.language })}
        loadingMessage={() => t("loading", { lng: languageReducer.language })}
        menuPosition="fixed"
        styles={{
          menu: provided => ({ ...provided, zIndex: 9999 })
        }}
      />

      <small className='text-danger'>{t("field_required", { lng: languageReducer.language })}</small>
    </div>
  );
}
