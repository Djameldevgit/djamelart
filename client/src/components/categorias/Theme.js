import Select from 'react-select';
import { useMemo } from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsTheme({ handleChangeInput, postData}) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('componentstatusmodal');  
  const lang = languageReducer.language || 'en'; 

    const themeOptions = useMemo(() => [
        // Estilos
        { value: "abstrait", label: t('theme.abstrait', { lng: lang }), group: "Style" },
        { value: "colore", label: t('theme.colore', { lng: lang }), group: "Style" },
        { value: "graffiti", label: t('theme.graffiti', { lng: lang }), group: "Style" },
        { value: "geometrique", label: t('theme.geometrique', { lng: lang }), group: "Style" },
      
        // Animales
        { value: "animal", label: t('theme.animal', { lng: lang }), group: "Animaux" },
        { value: "chat", label: t('theme.chat', { lng: lang }), group: "Animaux" },
        { value: "cheval", label: t('theme.cheval', { lng: lang }), group: "Animaux" },
        { value: "chien", label: t('theme.chien', { lng: lang }), group: "Animaux" },
        { value: "oiseau", label: t('theme.oiseau', { lng: lang }), group: "Animaux" },
        { value: "poisson", label: t('theme.poisson', { lng: lang }), group: "Animaux" },
      
        // Cultura Pop
        { value: "culture_populaire", label: t('theme.culture_populaire', { lng: lang }), group: "Culture" },
        { value: "bandes_dessinees", label: t('theme.bandes_dessinees', { lng: lang }), group: "Culture" },
        { value: "cinema", label: t('theme.cinema', { lng: lang }), group: "Culture" },
        { value: "dessin_anime", label: t('theme.dessin_anime', { lng: lang }), group: "Culture" },
        { value: "jeu_video", label: t('theme.jeu_video', { lng: lang }), group: "Culture" },
        { value: "mode", label: t('theme.mode', { lng: lang }), group: "Culture" }
      ], [t, languageReducer.language]);
      

      const groupedOptions = useMemo(() => [
        {
          label: t('theme_groups.styles', { lng: lang }),
          options: themeOptions.filter(opt => opt.group === "Style")
        },
        {
          label: t('theme_groups.animaux', { lng: lang }),
          options: themeOptions.filter(opt => opt.group === "Animaux")
        },
        {
          label: t('theme_groups.culture', { lng: lang }),
          options: themeOptions.filter(opt => opt.group === "Culture")
        }
      ], [themeOptions, t, languageReducer.language]);
      

    return (
        <div className="theme-select-container mb-3">
            <Form.Label>{t('theme.select_label', { lng: lang })}</Form.Label>
            <Select
                options={groupedOptions}
                onChange={(selectedOption) => handleChangeInput({
                    target: {
                        name: 'theme',
                        value: selectedOption?.value || '',
                        type: 'text'
                    }
                })}
                name="theme"
                value={themeOptions.find(opt => opt.value === (postData?.theme || ''))}
                placeholder={t('theme.placeholder', { lng: lang })}
                
                className="theme-select"
                classNamePrefix="theme-select"
                isSearchable={true}
                noOptionsMessage={() => t('theme.no_options', { lng: lang })}
                // ... (resto de tus props y estilos)
            />
        </div>
    );
}