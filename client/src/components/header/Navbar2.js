import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar';
import Card from 'react-bootstrap/Card';
import {
  FaPlus,
  FaHome,
  FaUserCircle,
  FaSignInAlt,
  FaUserPlus,
  FaSearch,
  FaBell,
  FaShareAlt,
  FaInfoCircle,
  FaFacebookMessenger,
} from 'react-icons/fa';
import { Navbar, Container, NavDropdown, Badge } from 'react-bootstrap';
import { BsCartFill } from 'react-icons/bs';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import LanguageSelectorpc from '../LanguageSelectorpc';

const Navbar2 = () => {
  const { auth, cart, notify, settings } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { languageReducer } = useSelector(state => state);
  const { t, i18n } = useTranslation('navbar2');
  const lang = languageReducer.language || 'es';
  
  const [showShareModal, setShowShareModal] = useState(false);
  const [userRole, setUserRole] = useState(auth.user?.role);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);

  useEffect(() => {
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  useEffect(() => {
    if (auth.user?.role && auth.user.role !== userRole) {
      setUserRole(auth.user.role);
    }
  }, [auth.user?.role, userRole]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!settings) {
    return (
      <nav className="navbar navbar-light bg-light">
        <span className="navbar-brand">{t('loading')}</span>
      </nav>
    );
  }

  const openStatusModal = () => dispatch({ type: GLOBALTYPES.STATUS, payload: true });
  const unreadNotifications = notify.data.filter(n => !n.isRead).length;
  
  // Simular mensajes no leídos (puedes conectarlo a tu store real)
  const unreadMessages = 0; // Aquí conectas tu lógica de mensajes no leídos

  // MenuItem simplificado solo para dropdown de usuarios NO autenticados
  const MenuItem = ({ icon: Icon, iconColor, to, onClick, children }) => (
    <NavDropdown.Item
      as={to ? Link : 'button'}
      to={to}
      onClick={onClick}
      className="custom-menu-item"
      style={{
        padding: '12px 20px',
        transition: 'all 0.2s ease',
        borderRadius: '8px',
        margin: '2px 8px',
        display: 'flex',
        alignItems: 'center',
        fontWeight: '500',
        direction: lang === 'ar' ? 'rtl' : 'ltr',
        textAlign: lang === 'ar' ? 'right' : 'left'
      }}
    >
      <Icon className={lang === 'ar' ? "ms-3" : "me-3"} style={{ color: iconColor, fontSize: '1.1rem' }} />
      <span>{children}</span>
    </NavDropdown.Item>
  );

  return (
    <div>
      <Navbar
        expand="lg"
        style={{
          zIndex: 1030,
          marginTop: isMobile ? '55px' : '0',
          background: settings.style
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          padding: isMobile ? '6px 0' : '10px 0', // ✅ Reducido padding
          boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
          minHeight: isMobile ? '60px' : '70px' // ✅ Altura mínima consistente
        }}
        className={settings.style ? "navbar-dark" : "navbar-light"}
      >
        <Container fluid className="align-items-center justify-content-between" style={{
          paddingLeft: isMobile ? '12px' : '16px',
          paddingRight: isMobile ? '12px' : '16px'
        }}>
          {/* Logo y título - CORREGIDO */}
          <div className="d-flex align-items-center" style={{
            minWidth: isMobile ? 'auto' : '200px', // ✅ Ancho consistente
            flex: isMobile ? '0 0 auto' : '0 1 auto'
          }}>
            <Link
              to="/"
              className="btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? '42px' : '50px', // ✅ Tamaño ajustado
                height: isMobile ? '42px' : '50px',
                marginLeft: lang === 'ar' ? (isMobile ? '4px' : '8px') : '0',
                marginRight: lang === 'ar' ? '0' : (isMobile ? '8px' : '12px'),
                padding: '0',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                flexShrink: 0 // ✅ Evita que se reduzca
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
              }}
            >
              <FaHome size={isMobile ? 22 : 26} style={{ color: 'white' }} /> {/* ✅ Tamaño ajustado */}
            </Link>

            {/* ✅ Navbar.Brand SOLO cuando no es móvil y con margen ajustado */}
            {!isMobile && (
              <Navbar.Brand 
                href="/" 
                className="py-2 mb-0"
                style={{
                  marginLeft: lang === 'ar' ? '12px' : '0',
                  marginRight: lang === 'ar' ? '0' : '0',
                  flexShrink: 1,
                  minWidth: 0 // ✅ Permite que se reduzca si es necesario
                }}
              >
                <Card.Title
                  className="mb-0"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold',
                    fontSize: '1.4rem', // ✅ Tamaño ajustado
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {t('appName')}
                </Card.Title>
              </Navbar.Brand>
            )}
          </div>

          {/* Iconos de navegación - CORREGIDO */}
          <div className="d-flex align-items-center" style={{ 
            gap: isMobile ? '6px' : '12px', // ✅ Espacio reducido
            flexShrink: 0,
            minWidth: 0
          }}>
            {/* Selector de idioma para desktop */}
            <div className="d-none d-lg-block">
              <LanguageSelectorpc />
            </div>

            {/* Búsqueda */}
            <Link
              to="/search"
              className="text-decoration-none d-flex align-items-center justify-content-center icon-button"
              style={{
                width: isMobile ? '38px' : '42px', // ✅ Tamaño consistente
                height: isMobile ? '38px' : '42px',
                borderRadius: '10px', // ✅ Bordes ligeramente más pequeños
                transition: 'all 0.3s ease',
                backgroundColor: settings.style ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.1)',
                flexShrink: 0
              }}
              title={t('search')}
            >
              <FaSearch
                size={isMobile ? 16 : 18} // ✅ Iconos más pequeños
                style={{ color: '#667eea' }}
              />
            </Link>

            {auth.user && (
  <div
              onClick={openStatusModal}
              className="d-flex align-items-center justify-content-center icon-button"
              style={{
                cursor: 'pointer',
                width: isMobile ? '38px' : '42px',
                height: isMobile ? '38px' : '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                flexShrink: 0
              }}
              title={t('addPost')}
            >
              <FaPlus
                size={isMobile ? 16 : 18}
                style={{ color: 'white' }}
              />
            </div>


            )}
          
            {/* Messenger (solo usuarios autenticados) */}
            {auth.user && (
              <Link
                to="/message"
                className="position-relative d-flex align-items-center justify-content-center icon-button text-decoration-none"
                style={{
                  width: isMobile ? '38px' : '42px',
                  height: isMobile ? '38px' : '42px',
                  borderRadius: '10px',
                  backgroundColor: settings.style ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.1)',
                  transition: 'all 0.3s ease',
                  flexShrink: 0
                }}
                title={t('messages')}
              >
                <FaFacebookMessenger
                  size={isMobile ? 18 : 20} // ✅ Tamaño ajustado
                  style={{ color: unreadMessages > 0 ? '#00b2ff' : '#667eea' }}
                />
                {unreadMessages > 0 && (
                  <Badge
                    pill
                    style={{
                      fontSize: '0.6rem', // ✅ Tamaño reducido
                      position: 'absolute',
                      top: '-2px',
                      [lang === 'ar' ? 'left' : 'right']: '-2px',
                      padding: '3px 6px',
                      background: 'linear-gradient(135deg, #00b2ff 0%, #006aff 100%)',
                      border: '2px solid' + (settings.style ? '#16213e' : '#ffffff'),
                      boxShadow: '0 2px 6px rgba(0, 178, 255, 0.4)'
                    }}
                  >
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </Badge>
                )}
              </Link>
            )}

            {/* Notificaciones (solo usuarios autenticados) */}
            {auth.user && (
              <Link
                to="/notify"
                className="position-relative d-flex align-items-center justify-content-center icon-button text-decoration-none"
                style={{
                  width: isMobile ? '38px' : '42px',
                  height: isMobile ? '38px' : '42px',
                  borderRadius: '10px',
                  backgroundColor: settings.style ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.1)',
                  transition: 'all 0.3s ease',
                  flexShrink: 0
                }}
                title={t('notifications')}
              >
                <FaBell
                  size={isMobile ? 18 : 20}
                  style={{ color: unreadNotifications > 0 ? '#f5576c' : '#667eea' }}
                />
                {unreadNotifications > 0 && (
                  <Badge
                    pill
                    style={{
                      fontSize: '0.6rem',
                      position: 'absolute',
                      top: '-2px',
                      [lang === 'ar' ? 'left' : 'right']: '-2px',
                      padding: '3px 6px',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      border: '2px solid' + (settings.style ? '#16213e' : '#ffffff'),
                      boxShadow: '0 2px 6px rgba(245, 87, 108, 0.4)'
                    }}
                  >
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </Badge>
                )}
              </Link>
            )}

            {/* Carrito (solo usuarios autenticados) */}
            {auth.user && (
              <Link
                to="/cart"
                className="position-relative text-decoration-none d-flex align-items-center justify-content-center icon-button"
                style={{
                  width: isMobile ? '38px' : '42px',
                  height: isMobile ? '38px' : '42px',
                  borderRadius: '10px',
                  backgroundColor: settings.style ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.1)',
                  transition: 'all 0.3s ease',
                  flexShrink: 0
                }}
                title={t('cart')}
              >
                <BsCartFill size={isMobile ? 18 : 20} style={{ color: '#667eea' }} />
                {cart.items?.length > 0 && (
                  <Badge
                    pill
                    style={{
                      fontSize: '0.6rem',
                      position: 'absolute',
                      top: '-2px',
                      [lang === 'ar' ? 'left' : 'right']: '-2px',
                      padding: '3px 6px',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      border: '2px solid' + (settings.style ? '#16213e' : '#ffffff'),
                      boxShadow: '0 2px 6px rgba(245, 87, 108, 0.4)'
                    }}
                  >
                    {cart.items?.length > 9 ? '9+' : cart.items?.length || 0}
                  </Badge>
                )}
              </Link>
            )}

            {/* Avatar o Dropdown según autenticación */}
            {auth.user ? (
              <Link
                to="/profileinfouser"
                className="text-decoration-none"
                title={t('profile')}
                style={{ flexShrink: 0 }}
              >
                <div
                  className="dropdown-avatar icon-button"
                  style={{
                    width: isMobile ? '38px' : '42px',
                    height: isMobile ? '38px' : '42px',
                    borderRadius: '10px',
                    padding: '0',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}
                >
                  <Avatar
                    src={auth.user.avatar}
                    size="medium-avatar"
                    style={{
                      borderRadius: '8px', // ✅ Bordes más pequeños
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                      margin: '0',
                      padding: '0',
                      display: 'block'
                    }}
                  />
                </div>
              </Link>
            ) : (
              <NavDropdown
                align="end"
                title={
                  <div
                    style={{
                      width: isMobile ? '38px' : '42px',
                      height: isMobile ? '38px' : '42px',
                      borderRadius: '10px',
                      backgroundColor: settings.style ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      flexShrink: 0
                    }}
                    className="icon-button"
                  >
                    <FaUserCircle size={isMobile ? 22 : 24} style={{ color: '#667eea' }} /> {/* ✅ Tamaño ajustado */}
                  </div>
                }
                id="nav-guest-dropdown"
                className="custom-dropdown"
              >
                <MenuItem icon={FaSignInAlt} iconColor="#28a745" to="/login">
                  {t('login')}
                </MenuItem>
                <MenuItem icon={FaUserPlus} iconColor="#667eea" to="/register">
                  {t('register')}
                </MenuItem>
                <NavDropdown.Divider style={{ margin: '8px 16px' }} />
                <MenuItem icon={FaInfoCircle} iconColor="#6c757d" to="/infoaplicacionn">
                  {t('appInfo')}
                </MenuItem>
              </NavDropdown>
            )}
          </div>
        </Container>
      </Navbar>

      {/* CSS personalizado MEJORADO */}
      <style jsx>{`
        .icon-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3) !important;
        }

        .custom-menu-item:hover {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%) !important;
          transform: translateX(4px);
        }

        .dropdown-menu {
          border: none !important;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15) !important;
          border-radius: 15px !important;
        }

        /* ✅ Eliminar espacios innecesarios del Navbar */
        .navbar {
          line-height: 1 !important;
        }
        
        .navbar-brand {
          padding: 0 !important;
          margin: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default Navbar2;