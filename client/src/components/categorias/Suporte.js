import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export function SuporteDeLaObra({ handleChangeInput, postData, technique, category }) {
    const { t } = useTranslation();
  const opcionesMediosPorCategoria = {
    Painting: {
      default: [
        { value: "canvas", label: t('support.canvas') },
        { value: "wood_panel", label: t('support.wood_panel') },
        { value: "paper", label: t('support.paper') },
        { value: "metal", label: t('support.metal') },
        { value: "cardboard", label: t('support.cardboard') }
      ],
      acrylic: [
        { value: "linen_canvas", label: t('support.acrylic.linen_canvas') },
        { value: "mdf_board", label: t('support.acrylic.mdf_board') },
        { value: "cotton_canvas", label: t('support.acrylic.cotton_canvas') }
      ],
      oil: [
        { value: "linen_canvas_oil", label: t('support.oil.linen_canvas') },
        { value: "copper_plate", label: t('support.oil.copper_plate') },
        { value: "wood_mounted", label: t('support.oil.wood_mounted') }
      ],
      watercolor: [
        { value: "watercolor_paper", label: t('support.watercolor.paper') },
        { value: "arches_paper", label: t('support.watercolor.arches') }
      ]
    },
    Sculpture: [
      { value: "bronze", label: t('support.sculpture.bronze') },
      { value: "marble", label: t('support.sculpture.marble') },
      { value: "resin", label: t('support.sculpture.resin') },
      { value: "wood", label: t('support.sculpture.wood') },
      { value: "ceramic", label: t('support.sculpture.ceramic') }
    ],
    Photography: [
      { value: "photo_paper", label: t('support.photography.photo_paper') },
      { value: "aluminum_dibond", label: t('support.photography.aluminum') },
      { value: "acrylic_glass", label: t('support.photography.acrylic') }
    ],
    Drawing: [
      { value: "drawing_paper", label: t('support.drawing.paper') },
      { value: "parchment", label: t('support.drawing.parchment') },
      { value: "vellum", label: t('support.drawing.vellum') }
    ],
    Digital_art: [
      { value: "digital_file", label: t('support.digital.file') },
      { value: "canvas_print", label: t('support.digital.canvas_print') },
      { value: "acrylic_print", label: t('support.digital.acrylic_print') }
    ],
    Textile_art: [
      { value: "fabric", label: t('support.textile.fabric') },
      { value: "tapestry", label: t('support.textile.tapestry') },
      { value: "embroidery", label: t('support.textile.embroidery') }
    ],
    default: [
      { value: "other", label: t('support.other') },
      { value: "mixed", label: t('support.mixed') }
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
      <Form.Label>{t('support.select_label')}</Form.Label>
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
        placeholder={category ? t('placeholders.selectSupport') : t('debesSeleccionarUnacategory')}
        isDisabled={!category}
        className="basic-select"
        classNamePrefix="select"
        isSearchable
      />
    </Form.Group>
  );
}