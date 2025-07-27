import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsSubCategoryDesign({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
  const lang = languageReducer.language || 'en'; 
  const optionSubCategoryDessin = [
    // Técnicas tradicionales
    { value: "crayon", label: t("crayon") },
    { value: "fusain", label: t("fusain") },
    { value: "graphite", label: t("graphite") },
    { value: "encre", label: t("encre") },
    
    // Medios secos
    { value: "pastel", label: t("pastel") },
    { value: "conte", label: t("conte") },
    { value: "craie", label: t("craie") },
    
    // Herramientas modernas
    { value: "marqueur", label: t("marqueur") },
    { value: "stylo_bille", label: t("stylo_bille") },
    { value: "stylo_gel", label: t("stylo_gel") },
    
    // Técnicas especiales
    { value: "carte_a_gratter", label: t("carte_a_gratter") },
    { value: "pochoir", label: t("pochoir") },
    { value: "pointe_d_argent", label: t("pointe_d_argent") },
    
    // Genérico
    { value: "autre", label: t("autre") }
  ];
  return (
    <Form.Group className="mb-3">
      <Form.Label>
        {t("select_drawing_technique", { lng: lang })}
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
