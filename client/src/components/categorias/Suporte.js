import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function SuporteDeLaObra({ handleChangeInput, postData, technique, category }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('componentstatusmodal');  
  const lang = languageReducer.language || 'en'; 
  
  const opcionesMediosPorCategoria = {
    Painting: {
      default: [
        { value: "canvas", label: t('canvas', { lng: lang }) },
        { value: "wood_panel", label: t('wood_panel', { lng: lang }) },
        { value: "paper", label: t('paper', { lng: lang }) },
        { value: "metal", label: t('metal', { lng: lang }) },
        { value: "cardboard", label: t('cardboard', { lng: lang }) }
      ],
      acrylic: [
        { value: "linen_canvas", label: t('acrylic.linen_canvas', { lng: lang }) },
        { value: "mdf_board", label: t('acrylic.mdf_board', { lng: lang }) },
        { value: "cotton_canvas", label: t('acrylic.cotton_canvas', { lng: lang }) }
      ],
      oil: [
        { value: "linen_canvas_oil", label: t('oil.linen_canvas', { lng: lang }) },
        { value: "copper_plate", label: t('oil.copper_plate', { lng: lang }) },
        { value: "wood_mounted", label: t('oil.wood_mounted', { lng: lang }) }
      ],
      watercolor: [
        { value: "watercolor_paper", label: t('watercolor.paper', { lng: lang }) },
        { value: "arches_paper", label: t('watercolor.arches', { lng: lang }) }
      ]
    },
    sculpture: [
      { value: "bronze", label: t('bronze', { lng: lang }) },
      { value: "marble", label: t('marble', { lng: lang }) },
      { value: "resin", label: t('resin', { lng: lang }) },
      { value: "wood", label: t('wood', { lng: lang }) },
      { value: "ceramic", label: t('ceramic', { lng: lang }) }
    ],
    Photography: [
      { value: "photo_paper", label: t('photo_paper', { lng: lang }) },
      { value: "aluminum_dibond", label: t('aluminum', { lng: lang }) },
      { value: "acrylic_glass", label: t('acrylic', { lng: lang }) }
    ],
    Drawing: [
      { value: "drawing_paper", label: t('drawing.paper', { lng: lang }) },
      { value: "parchment", label: t('drawing.parchment', { lng: lang }) },
      { value: "vellum", label: t('drawing.vellum', { lng: lang }) }
    ],
    Digital_art: [
      { value: "digital_file", label: t('digital.file', { lng: lang }) },
      { value: "canvas_print", label: t('digital.canvas_print', { lng: lang }) },
      { value: "acrylic_print", label: t('digital.acrylic_print', { lng: lang }) }
    ],
    Textile_art: [
      { value: "fabric", label: t('textile.fabric', { lng: lang }) },
      { value: "tapestry", label: t('textile.tapestry', { lng: lang }) },
      { value: "embroidery", label: t('textile.embroidery', { lng: lang }) }
    ],
    default: [
      { value: "other", label: t('other', { lng: lang }) },
      { value: "mixed", label: t('mixed', { lng: lang }) }
    ]
  };

  const obtenerOpciones = () => {
    if (!category) return opcionesMediosPorCategoria.default;
    const opcionesCategoria = opcionesMediosPorCategoria[category] || opcionesMediosPorCategoria.default;
    return (category === "Painting" && technique && opcionesCategoria[technique]) 
      ? opcionesCategoria[technique] 
      : Array.isArray(opcionesCategoria) 
        ? opcionesCategoria 
        : opcionesCategoria.default;
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>{t('select_label', { lng: lang })}</Form.Label>
      <Select
        options={obtenerOpciones()}
        onChange={(selectedOption) => handleChangeInput({
          target: {
            name: 'support',
            value: selectedOption?.value || '',
            type: 'text'
          }
        })}
        value={obtenerOpciones().find(opt => opt.value === postData?.support)}
        placeholder={category ? t('placeholders.selectSupport', { lng: lang }) : t('debesSeleccionarUnacategory')}
        isDisabled={!category}
        className="basic-select"
        classNamePrefix="select"
        isSearchable
      />
    </Form.Group>
  );
}