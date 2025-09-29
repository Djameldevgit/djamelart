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
import { Navbar, Container, NavDropdown,  Badge } from 'react-bootstrap';
import { BsCartFill } from 'react-icons/bs';
import NotifyModal from '../NotifyModal';
import LanguageSelectorpc from '../LanguageSelectorpc';
import LanguageSelectorandroid from '../LanguageSelectorandroid'; // Asegúrate de importar este componente
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

  useEffect(() => {
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  if (!settings) {
    return (
      <nav className="navbar navbar-light bg-light">
        <span className="navbar-brand">Cargando...</span>
      </nav>
    );
  }

 
  const [showLanguageModal, setShowLanguageModal] = useState(false); // 🔹 NUEVO ESTADO

  const totalItems = cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const [showModal, setShowModal] = useState(false);
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
    handleCloseDrawer();
  };

  const toggleTheme = () => dispatch({ type: GLOBALTYPES.THEME, payload: !theme });
 
  const history = useHistory();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cerrar dropdown de notificaciones al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifyDropdownRef.current && !notifyDropdownRef.current.contains(event.target)) {
        setShowNotifyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const canProceed = () => {
    if (!auth.token || !auth.user) {
      closeModal();
      setShowModal(true);
      return false;
    }

    if (!auth.user.isVerified) {
      closeModal();
      setShowVerifyModal(true);
      return false;
    }

    if (auth.user.isActive === false) {
      closeModal();
      setShowDeactivatedModal(true);
      return false;
    }

    return true;
  };

  // Calcular notificaciones no leídas
  const unreadNotifications = notify.data.filter(n => !n.isRead).length;

  return (
    <div>
      <Navbar
        expand="lg"
        style={{
          zIndex: 1030,
          marginTop: isMobile ? '55px' : '0',
          backgroundColor: settings.style ? '#1e1e2f' : '#f8f9fa',
        }}
        className={settings.style ? "navbar-dark" : "navbar-light"}
      >
        <Container fluid className="align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center">
              
              <Link
                to="/"
                className="btn btn-outline-primary me-2"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '55px',
                  height: '55px'
                }}
              >
                <FaHome size={32} />
              </Link>
            </div>

            <Navbar.Brand href="/" className="py-2 d-none d-lg-block">
              <Card.Title>{t('appName')}</Card.Title>
            </Navbar.Brand>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="d-none d-lg-block">
              <LanguageSelectorpc />
            </div>

            {/* Icono de búsqueda con Link */}
            <Link to="/search" className="text-decoration-none">
              <FaSearch
                size={18}
                className="text-secondary cursor-pointer mr-2"
                title={t('search')}
                style={{ cursor: 'pointer' }}
              />
            </Link>

            {(auth.user?.role === "Super-utilisateur" || auth.user?.role === "admin") &&
              <i className='fas fa-plus' onClick={openStatusModal}> </i>
            }

            {/* Dropdown de notificaciones */}
            {auth.user && (
              <div className="position-relative" ref={notifyDropdownRef}>
                <FaBell
                  size={20}
                  className="text-dark cursor-pointer mx-2"
                  onClick={() => setShowNotifyDropdown(!showNotifyDropdown)}
                  style={{ cursor: 'pointer' }}
                />
                {unreadNotifications > 0 && (
                  <Badge
                    pill
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: '0.6rem' }}
                  >
                    {unreadNotifications}
                  </Badge>
                )}

                {/* Dropdown de notificaciones */}
                {showNotifyDropdown && (
                  <div
                    className="dropdown-menu show"
                    style={{
                      position: isMobile ? 'fixed' : 'absolute',
                      [isMobile ? 'left' : 'right']: isMobile ? '50%' : '0',
                      [isMobile ? 'top' : 'top']: isMobile ? '50%' : '100%',
                      transform: isMobile ? 'translate(-50%, -50%)' : 'translateX(-230px)',
                      width: isMobile ? '90vw' : '400px',
                      maxWidth: '400px',
                      maxHeight: isMobile ? '80vh' : '400px',
                      overflowY: 'auto',
                      zIndex: 1050,
                      marginTop: isMobile ? '0' : '5px',
                      marginRight: isMobile ? '0' : '-20px'
                    }}
                  >
                    <NotifyModal onClose={() => setShowNotifyDropdown(false)} />
                    {isMobile && (
                      <div className="text-center p-2 border-top">
                        <button
                          className="btn btn-sm btn-outline-secondary"
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

            {auth.user && (
              <Link to="/cart" className="position-relative text-decoration-none">
                <BsCartFill size={20} className="text-dark" />
                {totalItems > 0 && (
                  <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle" style={{ fontSize: '0.6rem' }}>
                    {cart.items?.length || 0}
                  </Badge>
                )}
              </Link>
            )}

            <NavDropdown
              align="end"
              title={
                auth.user ? (
                  <div className="d-flex dropdown-avatar">
                    <Avatar src={auth.user.avatar} size="medium-avatar" />
                  </div>
                ) : (
                  <FaUserCircle size={25} />
                )
              }
              id="nav-user-dropdown"
              className="custom-dropdown"
              key={`nav-role-${auth.user?.role}`}
            >
              <div className="dropdown-scroll-wrapper">
                {auth.user ? (
                  <>
                    <NavDropdown.Header> <span className='text-success'><i className='fas fa-user mr-1' ></i> </span> <span > <strong>{auth.user.username}</strong> </span> </NavDropdown.Header>
                    <NavDropdown.Header> <span className='text-success'><i className='fas fa-user mr-1' ></i> </span> <span >{t('role')}: <strong>{auth.user.role}</strong> </span> </NavDropdown.Header>
                    <NavDropdown.Header>
                      {auth.user?.isVerified ? (
                        <span className="text-success font-semibold flex items-center">
                          <i className="fas fa-user-check mr-2"></i>
                          ✅ {t('verified')}
                        </span>
                      ) : (
                        <ActivateButton onClose={() => console.log("Dropdown cerrado")} />
                      )}
                    </NavDropdown.Header>

                    {/* 🔹 ICONO DE IDIOMA PARA PANTALLAS PEQUEÑAS EN EL DROPDOWN */}
                    <div className="d-lg-none">
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={() => setShowLanguageModal(true)}>
                        <FaGlobe className="me-2" />
                        {t('changeLanguage')}
                      </NavDropdown.Item>
                    </div>

                    {(auth.user?.role === "Super-utilisateur" || auth.user?.role === "admin") && (
                      <NavDropdown.Item onClick={openStatusModal}>
                        <FaPlus className="me-2" />
                        {t('addPost')}
                      </NavDropdown.Item>
                    )}

                    <NavDropdown.Item as={Link} to="/encargos">
                      <FaEnvelope className="me-2" />
                      encargos
                    </NavDropdown.Item>

                    <NavDropdown.Item as={Link} to="/bloginfo">
                      <FaInfoCircle className="me-2" />
                      {t('appInfo')}
                    </NavDropdown.Item>

                    <NavDropdown.Item as={Link} to={`/profile/${auth.user._id}`}>
                      <FaUserCircle className="me-2" />
                      {t('profile')}
                    </NavDropdown.Item>

                    <NavDropdown.Item as={Link} to="/message">
                      <FaComments className="me-2" />
                      {t('conversations')}
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => setShowShareModal(true)}>
                      <FaShareAlt className="me-2" />
                      Compartir Aplicación
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/users/roles">
                      <FaTools className="me-2" />
                      {t('roles')}
                    </NavDropdown.Item>

                    {auth.user?.role === "admin" && (
                      <>
                        <NavDropdown.Divider />
                        <NavDropdown.Header>
                          <FaShieldAlt className="me-2" />
                          {t('adminPanel')}
                        </NavDropdown.Header>

                        <NavDropdown.Item as={Link} to="/users/privacidad">
                          ⚙️  Ajestes de privacidad
                        </NavDropdown.Item>

                        <NavDropdown.Item onClick={() => setShowFeaturesModal(true)}>
                          ⚙️ Configuración global
                        </NavDropdown.Item>

                        <NavDropdown.Item as={Link} to="/blog">
                          <FaBlog className="me-2" />
                          {t('blog')}
                        </NavDropdown.Item>

                        <NavDropdown.Item as={Link} to="/message">
                          <FaComments className="me-2" />
                          {t('chatWithAdmins')}
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

                    <NavDropdown.Item onClick={handleLogout}>
                      <FaSignOutAlt className="me-1 text-danger" />
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
                      ℹ️ {t('appInfo')}
                    </NavDropdown.Item>

                    <NavDropdown.Item onClick={() => setShowShareModal(true)}>
                      <FaShareAlt className="me-2" />
                      Compartir Aplicación
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                  </>
                )}
              </div>
            </NavDropdown>
          </div>
        </Container>
      </Navbar>

      {/* 🔹 MODAL DE IDIOMA PARA PANTALLAS PEQUEÑAS */}
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
        onClose={() => {
          setShowVerifyModal(false);
          closeModal();
        }}
        title={t('auth.verifyAccount')}
        message={t('auth.verifyRequired')}
        actionText={t('auth.resendVerification')}
        actionLink="/resend-verification"
        onActionSuccess={() => {
          setShowVerifyModal(false);
          closeModal();
        }}
      />

      <DesactivateModal
        show={showDeactivatedModal}
        onClose={() => setShowDeactivatedModal(false)}
        title={t('auth.accountDeactivated')}
        message={t('auth.contactAdmin')}
        actionText={t('auth.contactUs')}
        actionLink="/users/contactt"
      />

      <MultiCheckboxModal
        show={showFeaturesModal}
        onClose={() => setShowFeaturesModal(false)}
      />
      <ShareAppModal
        show={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
      {showAdminRedirectModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">🎉 {t('adminCongratulations')}</h5>
              </div>
              <div className="modal-body">
                <p>{t('adminMessage')}</p>
                <p className="text-muted small">{t('adminRedirect')}: {ADMIN_CLIENT_URL}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAdminRedirectModal(false)}
                >
                  {t('stayHere')}
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    window.location.href = ADMIN_CLIENT_URL;
                  }}
                >
                  {t('goToAdminPanel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar2;