import Select from 'react-select';
 
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsTheme({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
  const lang = languageReducer.language || 'en';

  const themeOptions = [
   
      // 🎨 Style
      { value: "abstrait", label: t('theme.abstrait', { lng: lang }), group: "Style" },
      { value: "colore", label: t('theme.colore', { lng: lang }), group: "Style" },
      { value: "graffiti", label: t('theme.graffiti', { lng: lang }), group: "Style" },
      { value: "geometrique", label: t('theme.geometrique', { lng: lang }), group: "Style" },
      { value: "surrealisme", label: t('theme.surrealisme', { lng: lang }), group: "Style" },
      { value: "conceptuel", label: t('theme.conceptuel', { lng: lang }), group: "Style" },
    
      // 🐾 Animaux
      { value: "animal", label: t('theme.animal', { lng: lang }), group: "Animaux" },
      { value: "chat", label: t('theme.chat', { lng: lang }), group: "Animaux" },
      { value: "chien", label: t('theme.chien', { lng: lang }), group: "Animaux" },
      { value: "cheval", label: t('theme.cheval', { lng: lang }), group: "Animaux" },
      { value: "oiseau", label: t('theme.oiseau', { lng: lang }), group: "Animaux" },
      { value: "poisson", label: t('theme.poisson', { lng: lang }), group: "Animaux" },
    
      // 🌳 Nature
      { value: "paysage", label: t('theme.paysage', { lng: lang }), group: "Nature" },
      { value: "foret", label: t('theme.foret', { lng: lang }), group: "Nature" },
      { value: "montagne", label: t('theme.montagne', { lng: lang }), group: "Nature" },
      { value: "fleurs", label: t('theme.fleurs', { lng: lang }), group: "Nature" },
      { value: "mer", label: t('theme.mer', { lng: lang }), group: "Nature" },
      { value: "ciel", label: t('theme.ciel', { lng: lang }), group: "Nature" },
    
      // 👤 Humain
      { value: "portrait", label: t('theme.portrait', { lng: lang }), group: "Humain" },
      { value: "corps_humain", label: t('theme.corps_humain', { lng: lang }), group: "Humain" },
      { value: "famille", label: t('theme.famille', { lng: lang }), group: "Humain" },
    
      // 🌍 Culture
      { value: "culture_populaire", label: t('theme.culture_populaire', { lng: lang }), group: "Culture" },
      { value: "bandes_dessinees", label: t('theme.bandes_dessinees', { lng: lang }), group: "Culture" },
      { value: "cinema", label: t('theme.cinema', { lng: lang }), group: "Culture" },
      { value: "dessin_anime", label: t('theme.dessin_anime', { lng: lang }), group: "Culture" },
      { value: "jeu_video", label: t('theme.jeu_video', { lng: lang }), group: "Culture" },
      { value: "mode", label: t('theme.mode', { lng: lang }), group: "Culture" },
      { value: "mythologie", label: t('theme.mythologie', { lng: lang }), group: "Culture" },
      { value: "religion", label: t('theme.religion', { lng: lang }), group: "Culture" },
      { value: "histoire", label: t('theme.histoire', { lng: lang }), group: "Culture" },
    
      // 🧠 Imagination
      { value: "fantastique", label: t('theme.fantastique', { lng: lang }), group: "Imagination" },
      { value: "science_fiction", label: t('theme.science_fiction', { lng: lang }), group: "Imagination" },
      { value: "onirique", label: t('theme.onirique', { lng: lang }), group: "Imagination" },
    
      // 🏙️ Société
      { value: "ville", label: t('theme.ville', { lng: lang }), group: "Société" },
      { value: "architecture", label: t('theme.architecture', { lng: lang }), group: "Société" },
      { value: "societe", label: t('theme.societe', { lng: lang }), group: "Société" },
      { value: "technologie", label: t('theme.technologie', { lng: lang }), group: "Société" }
    ];
    
 

    const groupedOptions = [
      { label: t('theme_groups.styles', { lng: lang }), options: themeOptions.filter(opt => opt.group === "Style") },
      { label: t('theme_groups.animaux', { lng: lang }), options: themeOptions.filter(opt => opt.group === "Animaux") },
      { label: t('theme_groups.nature', { lng: lang }), options: themeOptions.filter(opt => opt.group === "Nature") },
      { label: t('theme_groups.humain', { lng: lang }), options: themeOptions.filter(opt => opt.group === "Humain") },
      { label: t('theme_groups.culture', { lng: lang }), options: themeOptions.filter(opt => opt.group === "Culture") },
      { label: t('theme_groups.imagination', { lng: lang }), options: themeOptions.filter(opt => opt.group === "Imagination") },
      { label: t('theme_groups.societe', { lng: lang }), options: themeOptions.filter(opt => opt.group === "Société") }
    ];
    

  return (
    <div className='form-group'>
   <label  > {t('theme.select_label', { lng: lang })}</label>
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
      />
    </div>
  );
}
