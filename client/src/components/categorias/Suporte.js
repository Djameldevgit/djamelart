import Select from 'react-select';
 
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function SuporteDeLaObra({ handleChangeInput, postData,   category }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');
  const lang = languageReducer.language || 'en';

  const supportOptions = [
    {
      value: 'painting',
      label: t('painting', { lng: lang }),
      options: [
        { value: "canvas", label: t('pint_canvas', { lng: lang }) },
        { value: "wood_panel", label: t('pint_wood_panel', { lng: lang }) },
        { value: "paper", label: t('pint_paper', { lng: lang }) },
        { value: "metal", label: t('pint_metal', { lng: lang }) },
        { value: "cardboard", label: t('pint_cardboard', { lng: lang }) },
        { value: "glass", label: t('pint_glass', { lng: lang }) },
        { value: "wall", label: t('pint_wall', { lng: lang }) },
        { value: "linen_canvas", label: t('pint_linen_canvas', { lng: lang }) },
        { value: "cotton_canvas", label: t('pint_cotton_canvas', { lng: lang }) },
        { value: "mdf_board", label: t('pint_mdf_board', { lng: lang }) },
        { value: "acrylic_paper", label: t('pint_acrylic_paper', { lng: lang }) },
        { value: "aluminum_panel", label: t('pint_aluminum_panel', { lng: lang }) },
        { value: "linen_canvas_oil", label: t('pint_linen_canvas_oil', { lng: lang }) },
        { value: "copper_plate", label: t('pint_copper_plate', { lng: lang }) },
        { value: "wood_mounted", label: t('pint_wood_mounted', { lng: lang }) },
        { value: "gesso_board", label: t('pint_gesso_board', { lng: lang }) },
        { value: "linoleum", label: t('pint_linoleum', { lng: lang }) },
        { value: "watercolor_paper", label: t('pint_watercolor_paper', { lng: lang }) },
        { value: "arches_paper", label: t('pint_arches_paper', { lng: lang }) },
        { value: "silk", label: t('pint_silk', { lng: lang }) },
        { value: "clayboard", label: t('pint_clayboard', { lng: lang }) }
      ]
    },
    {
      value: 'sculpture',
      label: t('sculpture', { lng: lang }),
      options: [
        { value: "bronze", label: t('sculp_bronze', { lng: lang }) },
        { value: "marble", label: t('sculp_marble', { lng: lang }) },
        { value: "resin", label: t('sculp_resin', { lng: lang }) },
        { value: "wood", label: t('sculp_wood', { lng: lang }) },
        { value: "ceramic", label: t('sculp_ceramic', { lng: lang }) },
        { value: "stone", label: t('sculp_stone', { lng: lang }) },
        { value: "glass", label: t('sculp_glass', { lng: lang }) },
        { value: "ice", label: t('sculp_ice', { lng: lang }) },
        { value: "recycled_materials", label: t('sculp_recycled_materials', { lng: lang }) }
      ]
    },
    {
      value: 'collage',
      label: t('collage', { lng: lang }),
      options: [
        { value: "paper", label: t('collage_paper', { lng: lang }) },
        { value: "canvas", label: t('collage_canvas', { lng: lang }) },
        { value: "cardboard", label: t('collage_cardboard', { lng: lang }) },
        { value: "wood_panel", label: t('collage_wood_panel', { lng: lang }) },
        { value: "fabric", label: t('collage_fabric', { lng: lang }) },
        { value: "mixed_media_board", label: t('collage_mixed_media_board', { lng: lang }) },
        { value: "recycled_materials", label: t('collage_recycled_materials', { lng: lang }) }
      ]
    },
    

    {
      value: 'photography',
      label: t('photography', { lng: lang }),
      options: [
        { value: "photo_paper", label: t('photo_photo_paper', { lng: lang }) },
        { value: "aluminum_dibond", label: t('photo_aluminum_dibond', { lng: lang }) },
        { value: "acrylic_glass", label: t('photo_acrylic_glass', { lng: lang }) },
        { value: "canvas", label: t('photo_canvas', { lng: lang }) },
        { value: "baryta_paper", label: t('photo_baryta_paper', { lng: lang }) },
        { value: "metal_prints", label: t('photo_metal_prints', { lng: lang }) },
        { value: "dibond", label: t('photo_dibond', { lng: lang }) }
      ]
    },
    {
      value: 'drawing',
      label: t('drawing', { lng: lang }),
      options: [
        { value: "drawing_paper", label: t('draw_drawing_paper', { lng: lang }) },
        { value: "parchment", label: t('draw_parchment', { lng: lang }) },
        { value: "vellum", label: t('draw_vellum', { lng: lang }) },
        { value: "bristol_board", label: t('draw_bristol_board', { lng: lang }) },
        { value: "toned_paper", label: t('draw_toned_paper', { lng: lang }) },
        { value: "charcoal_paper", label: t('draw_charcoal_paper', { lng: lang }) },
        { value: "sandpaper", label: t('draw_sandpaper', { lng: lang }) }
      ]
    },
    {
      value: 'digital_art',

      label: t('digital_art', { lng: lang }),
      options: [
        { value: "digital_file", label: t('digi_digital_file', { lng: lang }) },
        { value: "canvas_print", label: t('digi_canvas_print', { lng: lang }) },
        { value: "acrylic_print", label: t('digi_acrylic_print', { lng: lang }) },
        { value: "led_panel", label: t('digi_led_panel', { lng: lang }) },
        { value: "epoxy_print", label: t('digi_epoxy_print', { lng: lang }) },
        { value: "nft", label: t('digi_nft_format', { lng: lang }) },
        { value: "video_loop", label: t('digi_video_loop', { lng: lang }) }
      ]
    },
    {
      value: 'textile_art',
      label: t('textile_art', { lng: lang }),
      options: [
        { value: "fabric", label: t('text_fabric', { lng: lang }) },
        { value: "tapestry", label: t('text_tapestry', { lng: lang }) },
        { value: "embroidery", label: t('text_embroidery', { lng: lang }) },
        { value: "knitting", label: t('text_knitting', { lng: lang }) },
        { value: "crochet", label: t('text_crochet', { lng: lang }) },
        { value: "batik", label: t('text_batik', { lng: lang }) },
        { value: "quilt", label: t('text_quilt', { lng: lang }) },
        { value: "handmade_paper", label: t('text_textile_paper', { lng: lang }) }
      ]
    },
    {
      value: 'otras_categorias',
      label: t('otras_categorias', { lng: lang }),
      options: [
        { value: "other", label: t('other_other', { lng: lang }) },
        { value: "mixed", label: t('other_mixed', { lng: lang }) },
        { value: "found_objects", label: t('other_found_objects', { lng: lang }) },
        { value: "installation", label: t('other_installation', { lng: lang }) }
      ]
    }
  ];
  
  const obtenerOpciones = () => {
    if (!category) {
      const fallback = supportOptions.find((opt) => opt.value === 'otras_categorias');
      return fallback?.options || [];
    }

    const categoriaEncontrada = supportOptions.find(
      (opt) => opt.value === category.toLowerCase()
    );

    return categoriaEncontrada?.options || [];
  };

  const options = obtenerOpciones();

  return (
    <div className='form-group'>
    <label  > {t('select_support', { lng: lang })}</label>
    <Select
      options={supportOptions}
      onChange={(selectedOption) =>
        handleChangeInput({
          target: {
            name: 'support',
            value: selectedOption?.value || '',
            type: 'text',
          }
        })
      }
      value={
        supportOptions
          .flatMap(group => group.options)
          .find(option => option.value === postData.support)
      }
      placeholder={t('placeholderssuporte', { lng: lang })}
      isDisabled={!category}
      className="basic-select"
      classNamePrefix="select"
      isSearchable
      noOptionsMessage={() => t('no_options', { lng: lang })}
    />
  </div>
  );
}
