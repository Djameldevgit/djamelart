import Select from 'react-select';
import { useMemo } from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsTheme({ handleChangeInput, postData}) {
    const { t } = useTranslation();
    const { languageReducer } = useSelector(state => state);

    const themeOptions = useMemo(() => [
        // Estilos
        { value: "abstrait", label: t('theme.abstrait', { lng: languageReducer.language }), group: "Style" },
        { value: "colore", label: t('theme.colore', { lng: languageReducer.language }), group: "Style" },
        { value: "graffiti", label: t('theme.graffiti', { lng: languageReducer.language }), group: "Style" },
        { value: "geometrique", label: t('theme.geometrique', { lng: languageReducer.language }), group: "Style" },
      
        // Animales
        { value: "animal", label: t('theme.animal', { lng: languageReducer.language }), group: "Animaux" },
        { value: "chat", label: t('theme.chat', { lng: languageReducer.language }), group: "Animaux" },
        { value: "cheval", label: t('theme.cheval', { lng: languageReducer.language }), group: "Animaux" },
        { value: "chien", label: t('theme.chien', { lng: languageReducer.language }), group: "Animaux" },
        { value: "oiseau", label: t('theme.oiseau', { lng: languageReducer.language }), group: "Animaux" },
        { value: "poisson", label: t('theme.poisson', { lng: languageReducer.language }), group: "Animaux" },
      
        // Cultura Pop
        { value: "culture_populaire", label: t('theme.culture_populaire', { lng: languageReducer.language }), group: "Culture" },
        { value: "bandes_dessinees", label: t('theme.bandes_dessinees', { lng: languageReducer.language }), group: "Culture" },
        { value: "cinema", label: t('theme.cinema', { lng: languageReducer.language }), group: "Culture" },
        { value: "dessin_anime", label: t('theme.dessin_anime', { lng: languageReducer.language }), group: "Culture" },
        { value: "jeu_video", label: t('theme.jeu_video', { lng: languageReducer.language }), group: "Culture" },
        { value: "mode", label: t('theme.mode', { lng: languageReducer.language }), group: "Culture" }
      ], [t, languageReducer.language]);
      

      const groupedOptions = useMemo(() => [
        {
          label: t('theme_groups.styles', { lng: languageReducer.language }),
          options: themeOptions.filter(opt => opt.group === "Style")
        },
        {
          label: t('theme_groups.animaux', { lng: languageReducer.language }),
          options: themeOptions.filter(opt => opt.group === "Animaux")
        },
        {
          label: t('theme_groups.culture', { lng: languageReducer.language }),
          options: themeOptions.filter(opt => opt.group === "Culture")
        }
      ], [themeOptions, t, languageReducer.language]);
      

    return (
        <div className="theme-select-container mb-3">
            <Form.Label>{t('theme.select_label', { lng: languageReducer.language })}</Form.Label>
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
                placeholder={t('theme.placeholder', { lng: languageReducer.language })}
                
                className="theme-select"
                classNamePrefix="theme-select"
                isSearchable={true}
                noOptionsMessage={() => t('theme.no_options', { lng: languageReducer.language })}
                // ... (resto de tus props y estilos)
            />
        </div>
    );
}