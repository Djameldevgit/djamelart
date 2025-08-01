import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsSubCategoryStyle({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');
  const lang = languageReducer.language || 'en';

  // Estructura de estilos basada en el JSON de "style.json"
  const groupedArtStyles = [
    // Estilos modernos (ejemplo: pintura, digital)
    {
      label: t('groups.modernes', { lng: lang }), // "حديث" (moderno)
      options: [
        { value: "abstrait", label: t('styles.abstrait', { lng: lang }) },
        { value: "impressionnisme", label: t('styles.impressionnisme', { lng: lang }) },
        { value: "expressionnisme", label: t('styles.expressionnisme', { lng: lang }) },
        { value: "cubisme", label: t('styles.cubisme', { lng: lang }) },
        { value: "pop_art", label: t('styles.pop_art', { lng: lang }) }
      ]
    },
    // Estilos contemporáneos (ejemplo: digital, collage)
    {
      label: t('groups.contemporains', { lng: lang }), // "معاصر" (contemporáneo)
      options: [
        { value: "art_conceptuel", label: t('styles.art_conceptuel', { lng: lang }) },
        { value: "street_art", label: t('styles.street_art', { lng: lang }) },
        { value: "pixel_art", label: t('styles.pixel_art', { lng: lang }) },
        { value: "nft", label: t('styles.nft', { lng: lang }) },
        { value: "generatif", label: t('styles.generatif', { lng: lang }) }
      ]
    },
    // Estilos clásicos/tradicionales (ejemplo: escultura, dibujo)
    {
      label: t('groups.classique_traditionnel', { lng: lang }), // "كلاسيكي / تقليدي"
      options: [
        { value: "figuratif", label: t('styles.figuratif', { lng: lang }) },
        { value: "classicisme", label: t('styles.classicisme', { lng: lang }) },
        { value: "baroque", label: t('styles.baroque', { lng: lang }) },
        { value: "croquis", label: t('styles.croquis', { lng: lang }) }
      ]
    },
    // Otros estilos (ejemplo: fotografía, textil)
    {
      label: t('groups.autres_styles', { lng: lang }), // "أنماط أخرى"
      options: [
        { value: "documentaire", label: t('styles.documentaire', { lng: lang }) },
        { value: "noir_et_blanc", label: t('styles.noir_et_blanc', { lng: lang }) },
        { value: "tissagee", label: t('textile_arttt.tissagee', { lng: lang }) }, // Ejemplo de arte textil
        { value: "mixte", label: t('styles.mixte', { lng: lang }) }
      ]
    }
  ];

  return (
    <div className='form-group'>
      <label>{t('styles.select_style', { lng: lang })}</label>
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
        placeholder={t('styles.select_placeholder', { lng: lang })}
        isSearchable
        className="basic-select"
        classNamePrefix="select"
      />
    </div>
  );
}