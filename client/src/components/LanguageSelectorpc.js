import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import * as languageActions from '../redux/actions/languageAction';
import { Dropdown, ButtonGroup } from 'react-bootstrap';

function LanguageSelectorpc() {
  const dispatch = useDispatch();
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('language');
  const [cookies, setCookie] = useCookies(['language']);
  const lang = languageReducer?.language || 'fr';

  const handleLanguageChange = useCallback((language) => {
    if (language === lang) return;

    dispatch(languageActions.changeLanguage(language));
    setCookie('language', language, { path: '/' });
  }, [dispatch, setCookie, lang]);

  useEffect(() => {
    const defaultLanguage = cookies.language || 'fr';
  
    if (defaultLanguage !== languageReducer?.language) {
      handleLanguageChange(defaultLanguage);
    }
  }, [cookies.language, languageReducer?.language, handleLanguageChange]);
  

  const flagPath = (lang) => `/flags/${lang}.png`;

  const flagStyle = {
    width: '20px',
    height: '14px',
    objectFit: 'cover',
    marginRight: '8px',
    borderRadius: '2px',
    verticalAlign: 'middle'
  };

  const languageNames = {
    en: t('language.en', { lng: lang }),
    fr: t('language.fr', { lng: lang }),
    ar: t('language.ar', { lng: lang }),
    es: t('language.es', { lng: lang }),
    ru: t('language.ru', { lng: lang }),
    kab: t('language.kab', { lng: lang }),
    chino: t('language.chino', { lng: lang })
  };

  return (
    <Dropdown as={ButtonGroup} className="w-100">
      <Dropdown.Toggle variant="secondary" id="dropdown-language" className="w-100">
        <img src={flagPath(lang)} alt={t('flagAlt', { lng: lang })} style={flagStyle} />
        {languageNames[lang]}
      </Dropdown.Toggle>

      <Dropdown.Menu className="w-100">
        {['ar', 'fr', 'en', 'es', 'ru', 'kab', 'chino'].map((langCode) => (
          <Dropdown.Item key={langCode} onClick={() => handleLanguageChange(langCode)}>
            <img src={flagPath(langCode)} alt={`${langCode} flag`} style={flagStyle} />
            {languageNames[langCode]}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default LanguageSelectorpc;
