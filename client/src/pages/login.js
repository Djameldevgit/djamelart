import React, { useState,useEffect } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import { useDispatch,useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { login } from '../redux/actions/authAction';
import Loginfacegoogle from '../auth/Loginfacegoogle';
import { useHistory } from 'react-router-dom';
 
 
const Login = () => {
  const { auth } = useSelector(state => state)
    const dispatch = useDispatch()
    const history = useHistory()
 
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const [typePass, setTypePass] = useState(false);
  const { email, password } = userData;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  useEffect(() => {
    if(auth.token) history.push("/")
}, [auth.token, history])

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(userData));
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card className="shadow-lg" style={{ width: '100%', maxWidth: '420px', borderRadius: '20px' }}>
        <Card.Body className="p-3 p-md-4">
          <h3
            className="text-center fw-bold mb-4"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {t('loginTitle', { lng: lang }) || 'Iniciar sesión'}
          </h3>

          {/* ✅ LOGIN CON GOOGLE */}
          <div
            className="mb-4"
            onClick={(e) => e.stopPropagation()}
            style={{ textAlign: 'center' }}
          >
            <Loginfacegoogle />
          </div>

          {/* Divisor */}
          <div className="position-relative mb-4">
            <hr style={{ margin: 0, borderTop: '1px solid #e2e8f0' }} />
            <span
              className="position-absolute top-50 start-50 translate-middle px-3"
              style={{
                background: 'white',
                color: '#a0aec0',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              {t('orContinueWith', { lng: lang }) || 'o continúa con'}
            </span>
          </div>

          {/* ✅ LOGIN MANUAL */}
          <Form onSubmit={handleSubmit}>
            {/* Email */}
            <Form.Group className="mb-4">
              <Form.Label
                className="fw-semibold"
                style={{ color: '#4a5568', fontSize: '0.95rem' }}
              >
                {t('emailAddress', { lng: lang }) || 'Correo electrónico'}
              </Form.Label>
              <InputGroup>
                <InputGroup.Text
                  style={{
                    background:
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '12px 0 0 12px',
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChangeInput}
                  placeholder="example@gmail.com"
                  required
                />
              </InputGroup>
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3">
              <Form.Label
                className="fw-semibold"
                style={{ color: '#4a5568', fontSize: '0.95rem' }}
              >
                {t('password', { lng: lang }) || 'Contraseña'}
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type={typePass ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={handleChangeInput}
                  placeholder="••••••••"
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setTypePass(!typePass)}
                  style={{
                    borderRadius: '0 12px 12px 0',
                    borderLeft: 'none',
                    background: 'white',
                    color: '#667eea',
                  }}
                >
                  {typePass
                    ? t('hide', { lng: lang }) || 'Ocultar'
                    : t('show', { lng: lang }) || 'Mostrar'}
                </Button>
              </InputGroup>
            </Form.Group>

            <Button
              type="submit"
              className="w-100 fw-bold text-uppercase"
              style={{
                background:
                  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '0.875rem',
              }}
            >
              {t('login', { lng: lang }) || 'Entrar'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
