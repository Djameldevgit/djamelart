import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsSubCategoryCollages({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
  const lang = languageReducer.language || 'en'; 

  const optionSubCategoryCollages = [
    // Técnicas principales
    { value: "collage_papier", label: t("collage_papier") },
    { value: "collage_photo", label: t("collage_photo") },
    
    // Técnicas especializadas
    { value: "collage_assemblege", label: t("collage_assemblege") },
    { value: "collage_digital", label: t("collage_digital") },
    
    // Estilos (opcional)
    { value: "collage_surrealiste", label: t("collage_surrealiste") }
  ];


    
 

  return (
    <Form.Group className="mb-3">
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
    </Form.Group>
  );
}
