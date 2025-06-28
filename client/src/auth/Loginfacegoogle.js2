import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { socialLogin } from '../redux/actions/authAction';
import { showErrMsg, showSuccessMsg } from '../utils/notification/Notification';

const Loginfacegoogle = () => {
  const [msg, setMsg] = useState({ err: '', success: '' });
  const dispatch = useDispatch();
  const history = useHistory();

  const handleGoogleSuccess = async (credentialResponse) => {
    const tokenId = credentialResponse.credential;
    if (tokenId) {
      try {
        await dispatch(socialLogin({ tokenId }, 'google'));
        setMsg({ err: '', success: 'Inicio de sesión exitoso' });
        history.push('/');
      } catch (err) {
        setMsg({ err: 'Error al procesar el login', success: '' });
      }
    }
  };

  const handleGoogleError = () => {
    setMsg({ err: 'Inicio de sesión cancelado o fallido con Google', success: '' });
  };

  return (
    <div className="login_page">
      <h2>Iniciar Sesión</h2>

      {msg.err && showErrMsg(msg.err)}
      {msg.success && showSuccessMsg(msg.success)}

      <div className="hr">Iniciar sesión con</div>

      <div className="social">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
        />
      </div>
    </div>
  );
};

export default Loginfacegoogle;
