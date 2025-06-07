import Select from 'react-select';
import { useMemo } from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsSubCategoryStyle({ handleChangeInput, postData, category }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('componentstatusmodal');  
  const lang = languageReducer.language || 'en'; 
  const filteredStyles = useMemo(() => ({
    Painting: [
      { value: "abstrait", label: t('styles.abstrait', { lng: lang }), group: "Moderne" },
      { value: "impressionnisme", label: t('styles.impressionnisme', { lng: lang }), group: "Moderne" },
      { value: "expressionnisme", label: t('styles.expressionnisme', { lng: lang }), group: "Moderne" },
      { value: "cubisme", label: t('styles.cubisme', { lng: lang }), group: "Avant-garde" },
      { value: "surrealisme", label: t('styles.surrealisme', { lng: lang }), group: "Avant-garde" },
      { value: "hyperrealisme", label: t('styles.hyperrealisme', { lng: lang }), group: "Contemporain" },
      { value: "figuratif", label: t('styles.figuratif', { lng: lang }), group: "Traditionnel" },
      { value: "classicisme", label: t('styles.classicisme', { lng: lang }), group: "Classique" },
      { value: "pop_art", label: t('styles.pop_art', { lng: lang }), group: "Contemporain" },
      { value: "tachisme", label: t('styles.tachisme', { lng: lang }), group: "Moderne" },
      { value: "baroque", label: t('styles.baroque', { lng: lang }), group: "Classique" }
    ],
    Sculpture: [
      { value: "figuratif", label: t('styles.figuratif', { lng: lang }), group: "Traditionnel" },
      { value: "abstrait", label: t('styles.abstrait', { lng: lang }), group: "Moderne" },
      { value: "minimalisme", label: t('styles.minimalisme', { lng: lang }), group: "Moderne" },
      { value: "art_conceptuel", label: t('styles.art_conceptuel', { lng: lang }), group: "Conceptuel" },
      { value: "land_art", label: t('styles.land_art', { lng: lang }), group: "Contemporain" },
      { value: "art_brut", label: t('styles.art_brut', { lng: lang }), group: "Contemporain" },
      { value: "kinetique", label: t('styles.art_cinetique', { lng: lang }), group: "Moderne" }
    ],
    Photographie: [
      { value: "documentaire", label: t('styles.documentaire', { lng: lang }), group: "Traditionnel" },
      { value: "conceptuel", label: t('styles.conceptuel', { lng: lang }), group: "Conceptuel" },
      { value: "abstrait", label: t('styles.abstrait', { lng: lang }), group: "Moderne" },
      { value: "surrealisme", label: t('styles.surrealisme', { lng: lang }), group: "Avant-garde" },
      { value: "street_art", label: t('styles.street_art', { lng: lang }), group: "Urbain" },
      { value: "noir_et_blanc", label: t('styles.noir_et_blanc', { lng: lang }), group: "Classique" }
    ],
    Art_Numérique: [
      { value: "abstrait", label: t('styles.abstrait', { lng: lang }), group: "Moderne" },
      { value: "futurisme", label: t('styles.futurisme', { lng: lang }), group: "Avant-garde" },
      { value: "glitch_art", label: t('styles.glitch_art', { lng: lang }), group: "Contemporain" },
      { value: "pixel_art", label: t('styles.pixel_art', { lng: lang }), group: "Digital" },
      { value: "nft", label: t('styles.nft', { lng: lang }), group: "Contemporain" },
      { value: "generatif", label: t('styles.generatif', { lng: lang }), group: "Digital" }
    ],
    Dessin: [
      { value: "croquis", label: t('styles.croquis', { lng: lang }), group: "Traditionnel" },
      { value: "manga", label: t('styles.manga', { lng: lang }), group: "Contemporain" },
      { value: "caricature", label: t('styles.caricature', { lng: lang }), group: "Traditionnel" }
    ],
    Art_textile: [
      { value: "tradicional", label: t('styles.tradicional', { lng: lang }) },
      { value: "contemporaneo", label: t('styles.contemporaneo', { lng: lang }) },
      { value: "abstracto", label: t('styles.abstracto', { lng: lang }) },
      { value: "minimalista", label: t('styles.minimalista', { lng: lang }) },
      { value: "folclorico", label: t('styles.folclorico', { lng: lang }) }
    ],
    default: [
      { value: "autre", label: t('styles.autre', { lng: lang }), group: "Autres" },
      { value: "mixte", label: t('styles.mixte', { lng: lang }), group: "Autres" }
    ]
  }), [languageReducer.language, t]);

  const groupedOptions = useMemo(() => {
    const styles = filteredStyles[category] || filteredStyles.default;

    const groups = {
      "Moderne": [],
      "Avant-garde": [],
      "Contemporain": [],
      "Classique/Traditionnel": [],
      "Autres": []
    };

    styles.forEach(style => {
      if (style.group === "Moderne") groups["Moderne"].push(style);
      else if (style.group === "Avant-garde") groups["Avant-garde"].push(style);
      else if (style.group === "Contemporain") groups["Contemporain"].push(style);
      else if (["Classique", "Traditionnel"].includes(style.group)) groups["Classique/Traditionnel"].push(style);
      else groups["Autres"].push(style);
    });

    return [
      { label: t('groups.modernes', { lng: lang }), options: groups["Moderne"] },
      { label: t('groups.avantgardes', { lng: lang }), options: groups["Avant-garde"] },
      { label: t('groups.contemporains', { lng: lang }), options: groups["Contemporain"] },
      { label: t('groups.classique_traditionnel', { lng: lang }), options: groups["Classique/Traditionnel"] },
      ...(groups["Autres"].length > 0 ? [{ label: t('groups.autres_styles', { lng: lang }), options: groups["Autres"] }] : [])
    ].filter(group => group.options.length > 0);
  }, [filteredStyles, category, languageReducer.language, t]);

  const currentStyles = filteredStyles[category] || filteredStyles.default;

  return (
    <div className="style-select-container mb-3">
      <Form.Label>{t('labels0.style', { lng: lang })}</Form.Label>
      <Select
        options={groupedOptions}
        onChange={(selectedOption) =>
          handleChangeInput({
            target: {
              name: 'style',
              value: selectedOption?.value || '',
              type: 'text'
            }
          })
        }
        value={currentStyles.find(style => style.value === postData?.style)}
        placeholder={category
          ? t('placeholders0.selectStyle', { lng: lang })
          : t('placeholders0.selectCategoryFirst', { lng: lang })}
        isDisabled={!category}
        className="style-select"
        classNamePrefix="style-select"
        isSearchable
        noOptionsMessage={() => t('messages.noStylesFound', { lng: lang })}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: base => ({ ...base, zIndex: 9999 }),
          control: (base, { isFocused }) => ({
            ...base,
            borderColor: isFocused ? '#6366f1' : '#e5e7eb',
            boxShadow: isFocused ? '0 0 0 1px #6366f1' : 'none',
            '&:hover': { borderColor: '#818cf8' },
            minHeight: '44px',
            borderRadius: '8px'
          }),
          groupHeading: base => ({
            ...base,
            fontWeight: 600,
            color: '#4338ca',
            fontSize: '0.875rem'
          }),
          option: (base, { isSelected, isFocused }) => ({
            ...base,
            backgroundColor: isSelected ? '#4f46e5' : isFocused ? '#e0e7ff' : 'white',
            color: isSelected ? 'white' : '#1f2937',
            '&:active': { backgroundColor: '#6366f1' }
          })
        }}
        components={{
          IndicatorSeparator: () => null,
          DropdownIndicator: ({ innerProps }) => (
            <div {...innerProps} className="text-indigo-600 pr-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          )
        }}
      />
    </div>
  );
}
