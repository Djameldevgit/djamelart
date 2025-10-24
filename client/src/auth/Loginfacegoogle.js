import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { socialLogin } from '../redux/actions/authAction';
import { showErrMsg, showSuccessMsg } from '../utils/notification/Notification';
import { useTranslation } from 'react-i18next';

const Loginfacegoogle = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { languageReducer } = useSelector(state => state);
  const lang = languageReducer.language || 'en';
  
  const { t, i18n } = useTranslation('auth');
  const [msg, setMsg] = useState({ err: '', success: '' });
  const googleButtonRef = useRef(null);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const handleGoogleCredentialResponse = async (response) => {
    try {
      const { credential } = response;
      console.log('ID Token recibido:', credential);
      
      await dispatch(socialLogin({ tokenId: credential }, 'google'));
      setMsg({ err: '', success: t('login_success_google') });
      setTimeout(() => history.push('/'), 1000);
    } catch (err) {
      console.error('Error en login Google:', err);
      setMsg({ err: t('login_error_google'), success: '' });
    }
  };

  // ✅ INICIALIZAR GOOGLE SIGN-IN CON BOTÓN OFICIAL
  const initializeGoogleSignIn = () => {
    if (!window.google || !googleButtonRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse,
        ux_mode: 'popup', // Asegurar que sea popup
      });

      // Renderizar el botón oficial de Google
      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: '100%', // Ancho completo
        }
      );

    } catch (error) {
      console.error('Error inicializando Google Sign-In:', error);
      setMsg({ err: 'Error configurando Google Sign-In', success: '' });
    }
  };

  // ✅ CARGAR GOOGLE API
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      script.onerror = () => {
        setMsg({ err: 'Error cargando Google Sign-In', success: '' });
      };
      document.head.appendChild(script);
    } else {
      // Si ya está cargado, inicializar después de un pequeño delay
      setTimeout(initializeGoogleSignIn, 100);
    }
  }, []);

  // Facebook (sin cambios)
  const handleFacebookResponse = async (response) => {
    try {
      const { accessToken, userID } = response;
      if (!accessToken || !userID) {
        setMsg({ err: t('auth_error_facebook'), success: '' });
        return;
      }
      await dispatch(socialLogin({ accessToken, userID }, 'facebook'));
      setMsg({ err: '', success: t('login_success_facebook') });
      setTimeout(() => history.push('/'), 1000);
    } catch (err) {
      setMsg({ err: t('login_error_facebook'), success: '' });
    }
  };

  return (
    <div className="login_page">
      {msg.err && showErrMsg(msg.err)}
      {msg.success && showSuccessMsg(msg.success)}

      {/* ✅ BOTÓN GOOGLE OFICIAL */}
      <div className="social mb-3">
        <div 
          ref={googleButtonRef}
          style={{ width: '100%' }}
        ></div>
      </div>

      {/* Facebook */}
      <div className="social">
        <FacebookLogin
          appId={process.env.REACT_APP_FACEBOOK_APP_ID}
          autoLoad={false}
          fields="name,email,picture"
          callback={handleFacebookResponse}
          render={renderProps => (
            <button
              className="btn btn-primary w-100"
              onClick={renderProps.onClick}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                height: '45px'
              }}
            >
              <img src="/facebook-icon.png" alt="Facebook" width="20" height="20" />
              {t('login_with_facebook')}
            </button>
          )}
        />
      </div>
    </div>
  );
};

export default Loginfacegoogle;