import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import * as languageActions from '../redux/actions/languageAction';
import { Dropdown, ButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function LanguageSelectorpc() {
  const dispatch = useDispatch();
  const { auth, languageReducer } = useSelector(state => state);
  const { t } = useTranslation();
  const [cookies, setCookie] = useCookies(['language']);

  const handleLanguageChange = useCallback((language) => {
    if (!auth || !auth.token) return;

    switch (language) {
      case 'en':
        dispatch(languageActions.inglishLanguage(language, auth));
        break;
      case 'fr':
        dispatch(languageActions.franchLanguage(language, auth));
        break;
      case 'ar':
        dispatch(languageActions.arabLanguage(language, auth));
        break;
      case 'es':
        dispatch(languageActions.synchronizeLanguage(language, auth));
        break;
      case 'ru':
        dispatch(languageActions.synchronizeLanguage(language, auth));
        break;
      case 'kab':
        dispatch(languageActions.synchronizeLanguage(language, auth));
        break;
      case 'chino':
        dispatch(languageActions.synchronizeLanguage(language, auth));
        break;
      default:
        dispatch(languageActions.synchronizeLanguage(language, auth));
        break;
    }

    setCookie('language', language, { path: '/' });
  }, [auth, dispatch, setCookie]);

  useEffect(() => {
    const defaultLanguage = cookies.language || 'fr';
    handleLanguageChange(defaultLanguage);
  }, [cookies.language, handleLanguageChange]);

  return (
    
          <Dropdown as={ButtonGroup} className="w-100">
            <Dropdown.Toggle variant="secondary" id="dropdown-language" className="w-100">
              🌐 {t(languageReducer.language.toUpperCase())}
            </Dropdown.Toggle>

            <Dropdown.Menu className="w-100">
              <Dropdown.Item onClick={() => handleLanguageChange('ar')}>
                {t('AR', { lng: languageReducer.language })}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleLanguageChange('fr')}>
                {t('FR', { lng: languageReducer.language })}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleLanguageChange('en')}>
                {t('EN', { lng: languageReducer.language })}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleLanguageChange('es')}>
                {t('ES', { lng: languageReducer.language })}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleLanguageChange('ru')}>
                {t('RU', { lng: languageReducer.language })}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleLanguageChange('kab')}>
                {t('KAB', { lng: languageReducer.language })}
              </Dropdown.Item>

              <Dropdown.Item onClick={() => handleLanguageChange('chino')}>
                {t('CHINO', { lng: languageReducer.language })}
              </Dropdown.Item>

            </Dropdown.Menu>
          </Dropdown>
      
    

  );
}

export default LanguageSelectorpc;

