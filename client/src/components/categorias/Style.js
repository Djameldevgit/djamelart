import Select from 'react-select';
 
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsSubCategoryStyle({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');
  const lang = languageReducer.language || 'en';

  const groupedArtStyles = [
    // PINTURA
    {
      label: t('paintingg', { lng: lang }),
      options: [
        { value: "abstrait", label: t('abstrait', { lng: lang }) },
        { value: "impressionnisme", label: t('impressionnisme', { lng: lang }) },
        { value: "expressionnisme", label: t('expressionnisme', { lng: lang }) },
        { value: "cubisme", label: t('cubisme', { lng: lang }) },
        { value: "surrealisme", label: t('surrealisme', { lng: lang }) },
        { value: "hyperrealisme", label: t('hyperrealisme', { lng: lang }) },
        { value: "pop_art", label: t('pop_art', { lng: lang }) },
        { value: "fauvisme", label: t('fauvisme', { lng: lang }) },
        { value: "realisme", label: t('realisme', { lng: lang }) }
      ]
    },

    // ESCULTURA
    {
      label: t('sculptureee', { lng: lang }),
      options: [
        { value: "figuratif", label: t('figuratif', { lng: lang }) },
        { value: "abstrait", label: t('abstrait', { lng: lang }) },
        { value: "minimalisme", label: t('minimalisme', { lng: lang }) },
        { value: "art_conceptuel", label: t('art_conceptuel', { lng: lang }) },
        { value: "kinetique", label: t('kinetique', { lng: lang }) },
        { value: "land_art", label: t('land_art', { lng: lang }) }
      ]
    },

    // FOTOGRAFÍA
    {
      label: t('photographyyy', { lng: lang }),
      options: [
        { value: "documentaire", label: t('documentaire', { lng: lang }) },
        { value: "artistique", label: t('artistique', { lng: lang }) },
        { value: "portrait", label: t('portrait', { lng: lang }) },
        { value: "paysage", label: t('paysage', { lng: lang }) },
        { value: "noir_et_blanc", label: t('noir_et_blanc', { lng: lang }) },

        { value: "macrophotographie", label: t('macrophotographie', { lng: lang }) }
      ]
    },

    // DIBUJO
    {
      label: t('drawinggg', { lng: lang }),
      options: [
        { value: "croquis", label: t('croquis', { lng: lang }) },
        { value: "academique", label: t('academique', { lng: lang }) },
        { value: "manga", label: t('manga', { lng: lang }) },
        { value: "bande_dessinee", label: t('bande_dessinee', { lng: lang }) },
        { value: "caricature", label: t('caricature', { lng: lang }) }
      ]
    },

    // GRABADO
    {
      label: t('engravinggg', { lng: lang }),
      options: [
        { value: "xylographiee", label: t('xylographiee', { lng: lang }) },
        { value: "lithographiee", label: t('lithographiee', { lng: lang }) },
        { value: "serigraphiee", label: t('serigraphiee', { lng: lang }) },
        { value: "eau_fortee", label: t('eau_fortee', { lng: lang }) }
      ]
    },

    // ARTE DIGITAL
    {
      label: t('digital_arttt', { lng: lang }),
      options: [

        { value: "documentaire", label: t('documentaire', { lng: lang }) },
        { value: "nft", label: t('nft', { lng: lang }) },
        { value: "pixel_art", label: t('pixel_art', { lng: lang }) },
        { value: "vectoriel", label: t('vectoriel', { lng: lang }) },
        { value: "3d_modeling", label: t('3d_modeling', { lng: lang }) },
        { value: "motion_graphics", label: t('motion_graphics', { lng: lang }) }
      ]
    },

    // COLLAGE
    {
      label: t('collageee', { lng: lang }),
      options: [
        { value: "papier", label: t('papier', { lng: lang }) },
        { value: "numerique", label: t('numerique', { lng: lang }) },
        { value: "mixte", label: t('mixte', { lng: lang }) }
      ]
    },

    // ARTE TEXTIL
    {
      label: t('textile_arttt', { lng: lang }),
      options: [
        { value: "tissagee", label: t('tissagee', { lng: lang }) },
        { value: "broderiee", label: t('broderiee', { lng: lang }) },
        { value: "batikk", label: t('batikk', { lng: lang }) },
        { value: "patchworkk", label: t('patchworkk', { lng: lang }) }
      ]
    }
  ];

  return (
    <div className='form-group'>
    <label  > {t('select_style', { lng: lang })}</label>
      <Select
        options={groupedArtStyles}
        onChange={(selectedOption) => handleChangeInput({
          target: {
            name: 'style',
            value: selectedOption?.value || '',
            type: 'text'
          }
        })}
        value={groupedArtStyles
          .flatMap(group => group.options)
          .find(style => style.value === postData?.style)}
        placeholder={t('select_placeholder', { lng: lang })}
        isSearchable
        className="basic-select"
        classNamePrefix="select"
      />
    </div>
  );
}