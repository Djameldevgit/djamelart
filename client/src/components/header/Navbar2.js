import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import Avatar from '../Avatar';
import Card from 'react-bootstrap/Card';
import {
  FaPlus,
  FaEnvelope,
  FaInfoCircle,
  FaComments,
  FaTools,
  FaShieldAlt,
  FaBlog,
  FaUsers,
  FaClipboardList,
  FaUserCog,
  FaUserSlash,
  FaFlag,
  FaBan,
  FaShoppingCart,
  FaHome,
  FaSignOutAlt,
  FaUserCircle,
  FaSignInAlt,
  FaUserPlus,
  FaSearch,
  FaBell,
  FaShareAlt,
  FaGlobe,
} from 'react-icons/fa';
import { Navbar, Container, NavDropdown, Badge } from 'react-bootstrap';
import { BsCartFill } from 'react-icons/bs';
import NotifyModal from '../NotifyModal';
import LanguageSelectorpc from '../LanguageSelectorpc';
import LanguageSelectorandroid from '../LanguageSelectorandroid';
import ActivateButton from '../../auth/ActivateButton';
import VerifyModal from '../authAndVerify/VerifyModal';
import DesactivateModal from '../authAndVerify/DesactivateModal';
import MultiCheckboxModal from './MultiCheckboxModal.';
import ShareAppModal from '../shareAppModal';

const Navbar2 = () => {
  const { auth, theme, cart, notify, settings } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { languageReducer } = useSelector(state => state);
  const { t, i18n } = useTranslation('navbar');
  const lang = languageReducer.language || 'es';
  const [showShareModal, setShowShareModal] = useState(false);

  // 🔥 CRÍTICO: Estado local para forzar re-render cuando cambia el rol
  const [userRole, setUserRole] = useState(auth.user?.role);

  useEffect(() => {
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // 🔥 SOLUCIÓN: Detectar cambios en el rol del usuario
  useEffect(() => {
    if (auth.user?.role && auth.user.role !== userRole) {
      setUserRole(auth.user.role);
    }
  }, [auth.user?.role, userRole]);

  if (!settings) {
    return (
      <nav className="navbar navbar-light bg-light">
        <span className="navbar-brand">Cargando...</span>
      </nav>
    );
  }

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const totalItems = cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);
  const [showAdminRedirectModal, setShowAdminRedirectModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [showNotifyDropdown, setShowNotifyDropdown] = useState(false);

  const notifyDropdownRef = useRef(null);
  const openStatusModal = () => dispatch({ type: GLOBALTYPES.STATUS, payload: true });

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleTheme = () => dispatch({ type: GLOBALTYPES.THEME, payload: !theme });
  const history = useHistory();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifyDropdownRef.current && !notifyDropdownRef.current.contains(event.target)) {
        setShowNotifyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifications = notify.data.filter(n => !n.isRead).length;

  return (
    <div>
      <Navbar
        expand="lg"
        style={{
          zIndex: 1030,
          marginTop: isMobile ? '55px' : '0',
          backgroundColor: settings.style ? '#1e1e2f' : '#f8f9fa',
          padding: isMobile ? '8px 0' : '12px 0'
        }}
        className={settings.style ? "navbar-dark" : "navbar-light"}
      >
        <Container fluid className="align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Link
              to="/"
              className="btn btn-outline-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? '45px' : '55px',
                height: isMobile ? '45px' : '55px',
                padding: '0',
                marginRight: isMobile ? '8px' : '12px'
              }}
            >
              <FaHome size={isMobile ? 24 : 32} />
            </Link>

            <Navbar.Brand href="/" className="py-2 d-none d-lg-block mb-0">
              <Card.Title className="mb-0">{t('appName')}</Card.Title>
            </Navbar.Brand>
          </div>

          <div className="d-flex align-items-center" style={{ gap: isMobile ? '12px' : '16px' }}>
            {/* Selector de idioma para desktop */}
            <div className="d-none d-lg-block">
              <LanguageSelectorpc />
            </div>

            {/* Búsqueda - Mejorado para móvil */}
            <Link 
              to="/search" 
              className="text-decoration-none d-flex align-items-center justify-content-center"
              style={{
                width: isMobile ? '40px' : 'auto',
                height: isMobile ? '40px' : 'auto'
              }}
            >
              <FaSearch
                size={isMobile ? 20 : 18}
                className="text-secondary"
                title={t('search')}
                style={{ cursor: 'pointer' }}
              />
            </Link>

            {/* Botón Agregar Post - Mejorado */}
            {(userRole === "Super-utilisateur" || userRole === "admin") && (
              <div
                onClick={openStatusModal}
                className="d-flex align-items-center justify-content-center"
                style={{
                  cursor: 'pointer',
                  width: isMobile ? '40px' : 'auto',
                  height: isMobile ? '40px' : 'auto',
                  padding: isMobile ? '0' : '8px'
                }}
              >
                <FaPlus 
                  size={isMobile ? 20 : 18} 
                  className="text-primary"
                  title={t('addPost')}
                />
              </div>
            )}

            {/* Notificaciones - Mejorado para móvil */}
            {auth.user && (
              <div 
                className="position-relative d-flex align-items-center justify-content-center" 
                ref={notifyDropdownRef}
                style={{
                  width: isMobile ? '40px' : 'auto',
                  height: isMobile ? '40px' : 'auto'
                }}
              >
                <FaBell
                  size={isMobile ? 22 : 20}
                  className="text-dark cursor-pointer"
                  onClick={() => setShowNotifyDropdown(!showNotifyDropdown)}
                  style={{ cursor: 'pointer' }}
                />
                {unreadNotifications > 0 && (
                  <Badge
                    pill
                    bg="danger"
                    className="position-absolute"
                    style={{ 
                      fontSize: '0.6rem',
                      top: isMobile ? '-2px' : '0',
                      right: isMobile ? '-2px' : '0',
                      padding: '3px 6px'
                    }}
                  >
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </Badge>
                )}

                {showNotifyDropdown && (
                  <div
                    className="dropdown-menu show shadow-lg"
                    style={{
                      position: isMobile ? 'fixed' : 'absolute',
                      [isMobile ? 'left' : 'right']: isMobile ? '50%' : '0',
                      [isMobile ? 'top' : 'top']: isMobile ? '50%' : '100%',
                      transform: isMobile ? 'translate(-50%, -50%)' : 'translateX(-230px)',
                      width: isMobile ? '90vw' : '400px',
                      maxWidth: '400px',
                      maxHeight: isMobile ? '80vh' : '500px',
                      overflowY: 'auto',
                      zIndex: 1050,
                      marginTop: isMobile ? '0' : '8px',
                      borderRadius: '12px'
                    }}
                  >
                    <NotifyModal onClose={() => setShowNotifyDropdown(false)} />
                    {isMobile && (
                      <div className="text-center p-2 border-top">
                        <button
                          className="btn btn-sm btn-outline-secondary rounded-pill px-4"
                          onClick={() => setShowNotifyDropdown(false)}
                        >
                          Cerrar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Carrito - Mejorado para móvil */}
            {auth.user && (
              <Link 
                to="/cart" 
                className="position-relative text-decoration-none d-flex align-items-center justify-content-center"
                style={{
                  width: isMobile ? '40px' : 'auto',
                  height: isMobile ? '40px' : 'auto'
                }}
              >
                <BsCartFill size={isMobile ? 22 : 20} className="text-dark" />
                {totalItems > 0 && (
                  <Badge 
                    pill 
                    bg="danger" 
                    className="position-absolute"
                    style={{ 
                      fontSize: '0.6rem',
                      top: isMobile ? '-2px' : '0',
                      right: isMobile ? '-2px' : '0',
                      padding: '3px 6px'
                    }}
                  >
                    {cart.items?.length > 9 ? '9+' : cart.items?.length || 0}
                  </Badge>
                )}
              </Link>
            )}

            {/* Dropdown de usuario - Mejorado */}
            <NavDropdown
              align="end"
              title={
                auth.user ? (
                  <div 
                    className="d-flex dropdown-avatar" 
                    style={{
                      width: isMobile ? '40px' : '45px',
                      height: isMobile ? '40px' : '45px'
                    }}
                  >
                    <Avatar 
                      src={auth.user.avatar} 
                      size="medium-avatar"
                      style={{
                        border: '2px solid #667eea',
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                      }}
                    />
                  </div>
                ) : (
                  <FaUserCircle size={isMobile ? 28 : 25} />
                )
              }
              id="nav-user-dropdown"
              className="custom-dropdown"
              key={`nav-role-${userRole}`}
            >
              <div className="dropdown-scroll-wrapper" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {auth.user ? (
                  <>
                    <NavDropdown.Header className="bg-light">
                      <div className="d-flex align-items-center gap-2">
                        <div 
                          style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            padding: '2px'
                          }}
                        >
                          <Avatar src={auth.user.avatar} size="medium-avatar" />
                        </div>
                        <div>
                          <div className="fw-bold">{auth.user.username}</div>
                          <small className="text-muted">
                            {userRole === 'admin' ? '👑 Admin' :
                             userRole === 'Moderateur' ? '🛡️ Moderador' :
                             userRole === 'Super-utilisateur' ? '⭐ Super User' :
                             '👤 Usuario'}
                          </small>
                        </div>
                      </div>
                    </NavDropdown.Header>

                    <NavDropdown.Header>
                      {auth.user?.isVerified ? (
                        <span className="text-success fw-semibold d-flex align-items-center">
                          <i className="fas fa-user-check me-2"></i>
                          ✅ {t('verified')}
                        </span>
                      ) : (
                        <ActivateButton onClose={() => console.log("Dropdown cerrado")} />
                      )}
                    </NavDropdown.Header>

                    <div className="d-lg-none">
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={() => setShowLanguageModal(true)}>
                        <FaGlobe className="me-2" />
                        {t('changeLanguage')}
                      </NavDropdown.Item>
                    </div>

                    {(userRole === "Super-utilisateur" || userRole === "admin") && (
                      <>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={openStatusModal}>
                          <FaPlus className="me-2 text-primary" />
                          {t('addPost')}
                        </NavDropdown.Item>
                      </>
                    )}

                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/encargos">
                      <FaEnvelope className="me-2 text-info" />
                      Encargos
                    </NavDropdown.Item>

                    <NavDropdown.Item as={Link} to="/bloginfo">
                      <FaInfoCircle className="me-2 text-secondary" />
                      {t('appInfo')}
                    </NavDropdown.Item>

                    <NavDropdown.Item as={Link} to={`/profile/${auth.user._id}`}>
                      <FaUserCircle className="me-2 text-primary" />
                      {t('profile')}
                    </NavDropdown.Item>

                    <NavDropdown.Item as={Link} to="/message">
                      <FaComments className="me-2 text-success" />
                      {t('conversations')}
                    </NavDropdown.Item>

                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => setShowShareModal(true)}>
                      <FaShareAlt className="me-2 text-warning" />
                      Compartir Aplicación
                    </NavDropdown.Item>

                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/users/roles">
                      <FaTools className="me-2" />
                      {t('roles')}
                    </NavDropdown.Item>

                    {userRole === "admin" && (
                      <>
                        <NavDropdown.Divider />
                        <NavDropdown.Header className="bg-danger text-white">
                          <FaShieldAlt className="me-2" />
                          {t('adminPanel')}
                        </NavDropdown.Header>

                        <NavDropdown.Item as={Link} to="/users/privacidad">
                          ⚙️ Ajustes de privacidad
                        </NavDropdown.Item>

                        <NavDropdown.Item onClick={() => setShowFeaturesModal(true)}>
                          ⚙️ Configuración global
                        </NavDropdown.Item>

                        <NavDropdown.Item as={Link} to="/blog">
                          <FaBlog className="me-2" />
                          {t('blog')}
                        </NavDropdown.Item>

                        <NavDropdown.Item as={Link} to="/mails">
                          <FaEnvelope className="me-2" />
                          {t('adminSendEmail')}
                        </NavDropdown.Item>

                        <NavDropdown.Item as={Link} to="/users">
                          <FaUsers className="me-2" />
                          {t('users')}
                        </NavDropdown.Item>

                        <NavDropdown.Item as={Link} to="/postspendientes">
                          <FaClipboardList className="me-2" />
                          {t('pendingPosts')}
                        </NavDropdown.Item>

                        <NavDropdown.Item as={Link} to="/usersactionn">
                          <FaUserCog className="me-2" />
                          {t('userActions')}
                        </NavDropdown.Item>

                        <NavDropdown.Item as={Link} to="/listuserbloque">
                          <FaUserSlash className="me-2" />
                          {t('blockedUsersList')}
                        </NavDropdown.Item>

                        <NavDropdown.Item as={Link} to="/listausariosdenunciadoss">
                          <FaFlag className="me-2" />
                          {t('usariosdenunciados')}
                        </NavDropdown.Item>

                        <NavDropdown.Item as={Link} to="/bloqueos">
                          <FaBan className="me-2" />
                          {t('estadodeusuariosrespectoalbloqueo')}
                        </NavDropdown.Item>

                        <NavDropdown.Item as={Link} to="/cart/orderss">
                          <FaShoppingCart className="me-2" />
                          {t('orders')}
                        </NavDropdown.Item>
                      </>
                    )}

                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={toggleTheme}>
                      {theme ? '🌞 ' + t('lightMode') : '🌙 ' + t('darkMode')}
                    </NavDropdown.Item>

                    <NavDropdown.Item onClick={handleLogout} className="text-danger fw-semibold">
                      <FaSignOutAlt className="me-2" />
                      {t('logout')}
                    </NavDropdown.Item>
                  </>
                ) : (
                  <>
                    <NavDropdown.Item as={Link} to="/login">
                      <FaSignInAlt className="me-2 text-success" />
                      {t('login')}
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/register">
                      <FaUserPlus className="me-2 text-success" />
                      {t('register')}
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/bloginfo">
                      <FaInfoCircle className="me-2" />
                      {t('appInfo')}
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => setShowShareModal(true)}>
                      <FaShareAlt className="me-2" />
                      Compartir Aplicación
                    </NavDropdown.Item>
                  </>
                )}
              </div>
            </NavDropdown>
          </div>
        </Container>
      </Navbar>

      {showLanguageModal && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
          onClick={() => setShowLanguageModal(false)}
        >
          <div 
            className="modal-dialog modal-dialog-centered" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">🌍 {t('selectLanguage', 'Seleccionar Idioma')}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowLanguageModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <LanguageSelectorandroid />
              </div>
            </div>
          </div>
        </div>
      )}

      <VerifyModal
        show={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
      />

      <DesactivateModal
        show={showDeactivatedModal}
        onClose={() => setShowDeactivatedModal(false)}
      />

      <MultiCheckboxModal
        show={showFeaturesModal}
        onClose={() => setShowFeaturesModal(false)}
      />

      <ShareAppModal
        show={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
};

export default Navbar2;