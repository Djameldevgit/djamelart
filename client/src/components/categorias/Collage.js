import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsSubCategoryCollages({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('subcategorias');  
  const lang = languageReducer.language || 'en'; 

  const optionSubCategoryCollages = [
    { value: "abstrait", label: t("abstrait", { lng: lang }) },
    { value: "art_brut", label: t("art_brut", { lng: lang }) },
    { value: "art_conceptuel", label: t("art_conceptuel", { lng: lang }) },
    { value: "art_naif", label: t("art_naif", { lng: lang }) },
    { value: "art_oriental", label: t("art_oriental", { lng: lang }) },
    { value: "art_premier", label: t("art_premier", { lng: lang }) },
    { value: "art_spirituel", label: t("art_spirituel", { lng: lang }) },
    { value: "calligraphie", label: t("calligraphie", { lng: lang }) },
    { value: "classicisme", label: t("classicisme", { lng: lang }) },
    { value: "cubisme", label: t("cubisme", { lng: lang }) },
    { value: "expressionnisme", label: t("expressionnisme", { lng: lang }) },
    { value: "fauvisme", label: t("fauvisme", { lng: lang }) },
    { value: "figuratif", label: t("figuratif", { lng: lang }) },
    { value: "geometrique", label: t("geometrique", { lng: lang }) },
    { value: "hyperrealisme", label: t("hyperrealisme", { lng: lang }) },
    { value: "illustration", label: t("illustration", { lng: lang }) },
    { value: "impressionnisme", label: t("impressionnisme", { lng: lang }) },
    { value: "land_art", label: t("land_art", { lng: lang }) },
    { value: "minimalisme", label: t("minimalisme", { lng: lang }) },
    { value: "pop_art", label: t("pop_art", { lng: lang }) },
    { value: "street_art", label: t("street_art", { lng: lang }) },
    { value: "surrealisme", label: t("surrealisme", { lng: lang }) },
    { value: "symbolisme", label: t("symbolisme", { lng: lang }) },



    
  ];

  return (
    <div className="art-subcategory-wrapper mb-3">
      <Form.Label>{t("select_art_movement", { lng: lang })}</Form.Label>

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
        placeholder={t("categories", { lng: lang })}
        isDisabled={!postData?.category}
        className="art-movement-select"
        classNamePrefix="ams"
        isSearchable={true}
        noOptionsMessage={() => t("movement_not_available", { lng: lang })}
        loadingMessage={() => t("loading", { lng: lang })}
        menuPosition="fixed"
        styles={{
          menu: provided => ({ ...provided, zIndex: 9999 })
        }}
      />

      <small className='text-danger'>{t("field_required", { lng: lang })}</small>
    </div>
  );
}
