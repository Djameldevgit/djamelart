import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import * as languageActions from '../redux/actions/languageAction';
import { Dropdown, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function LanguageSelectorandroid() {
  const dispatch = useDispatch();
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('language');
  const [cookies, setCookie] = useCookies(['language']);
  const lang = languageReducer?.language || 'fr';

  // Función mejorada para obtener rutas de banderas
  const flagPath = (langCode) => {
    // Manejo especial para Kabyle
    if (langCode === 'kab') {
      return '/flags/kab.png';
    }
    // Código estándar para chino
    if (langCode === 'chino') {
      return '/flags/chino.png';
    }
    return `/flags/${langCode}.png`;
  };

  const flagStyle = {
    width: '20px',
    height: '14px',
    objectFit: 'cover',
    marginRight: '8px',
    borderRadius: '2px',
    verticalAlign: 'middle'
  };

  const handleLanguageChange = useCallback((language) => {
    switch (language) {
      case 'en':
        dispatch(languageActions.inglishLanguage(language));
        break;
      case 'fr':
        dispatch(languageActions.franchLanguage(language));
        break;
      case 'ar':
        dispatch(languageActions.arabLanguage(language));
        break;
      case 'es':
        dispatch(languageActions.spanishLanguage(language));
        break;
      case 'ru':
        dispatch(languageActions.russianLanguage(language));
        break;
      case 'kab':
        dispatch(languageActions.kabyleLanguage(language));
        break;
      case 'chino': // Código estándar para chino
        dispatch(languageActions.chineseLanguage(language));
        break;
      default:
        dispatch(languageActions.synchronizeLanguage(language));
    }
    setCookie('language', language, { path: '/' });
    
    // Actualizar dirección del documento para RTL
    if (language === 'ar' || language === 'kab') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [dispatch, setCookie]);

  useEffect(() => {
    const defaultLanguage = cookies.language || 'fr';
    if (defaultLanguage !== lang) {
      handleLanguageChange(defaultLanguage);
    }
  }, [cookies.language, handleLanguageChange, lang]);

  // Nombres de idiomas traducidos con códigos consistentes
  const languageNames = {
    en: t('language.en', { lng: lang }),
    fr: t('language.fr', { lng: lang }),
    ar: t('language.ar', { lng: lang }),
    es: t('language.es', { lng: lang }),
    ru: t('language.ru', { lng: lang }),
    kab: t('language.kab', { lng: lang }),
    chino: t('language.chino', { lng: lang }) // Corregido a 'chino'
  };

  return (
    <div className="d-block d-md-none" style={{ width: '100%', padding: 0, margin: 0 }}>
      <div style={{ display: 'flex', width: '100%', gap: '3px' }}>

        <Link to="/"  >
          <h3 className='ml-4 mt-2 w-100 ' style={{ flex: '1 1 0' }} >
         <i className='fas fa-home'></i>   {t('Tassili', { lng: lang })}
          </h3>
        </Link>

        {/* Selector de idioma */}
        <div style={{ flex: '1 1 0' }}>
          <Dropdown as={ButtonGroup} className="w-100">
            <Dropdown.Toggle   id="dropdown-language" >
              <img 
                src={flagPath(lang)} 
                alt={t('flagAlt', { langName: languageNames[lang] })} 
                style={flagStyle} 
              />
              {languageNames[lang]}
            </Dropdown.Toggle>

            <Dropdown.Menu   >
       
              {['ar', 'fr', 'en', 'es', 'ru', 'kab', 'chino'].map((langCode) => (
                <Dropdown.Item key={langCode} onClick={() => handleLanguageChange(langCode)}>
                  <img 
                    src={flagPath(langCode)} 
                    alt={t('flagAlt', { langName: languageNames[langCode] })} 
                    style={flagStyle} 
                  />
                  {languageNames[langCode]}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default LanguageSelectorandroid;