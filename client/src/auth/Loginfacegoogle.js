import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

import { showErrMsg, showSuccessMsg } from '../utils/notification/Notification';

const Loginfacegoogle = () => {
  const history = useHistory();
  const [msg, setMsg] = useState({ err: '', success: '' });

  const responseGoogle = async (response) => {
    try {
      const res = await axios.post('/user/google_login', {
        tokenId: response.tokenId,
      });

      setMsg({ err: '', success: res.data.msg });
      localStorage.setItem('firstLogin', true);

      history.push('/');
    } catch (err) {
      setMsg({
        err: err.response?.data?.msg || 'Error al iniciar sesión con Google',
        success: '',
      });
    }
  };

  const responseFacebook = async (response) => {
    try {
      const { accessToken, userID } = response;
      const res = await axios.post('/user/facebook_login', {
        accessToken,
        userID,
      });

      setMsg({ err: '', success: res.data.msg });
      localStorage.setItem('firstLogin', true);

      history.push('/');
    } catch (err) {
      setMsg({
        err: err.response?.data?.msg || 'Error al iniciar sesión con Facebook',
        success: '',
      });
    }
  };

  return (
    <div className="login_page">
      <h2>Iniciar Sesión</h2>

      {msg.err && showErrMsg(msg.err)}
      {msg.success && showSuccessMsg(msg.success)}

      <div className="hr">Iniciar sesión con</div>

      <div className="social">
        <GoogleLogin
          clientId="TU_GOOGLE_CLIENT_ID"
          buttonText="Google"
          onSuccess={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />

        <FacebookLogin
          appId="TU_FACEBOOK_APP_ID"
          autoLoad={false}
          fields="name,email,picture"
          callback={responseFacebook}
          icon="fa-facebook"
        />
      </div>
    </div>
  );
};

export default Loginfacegoogle;
