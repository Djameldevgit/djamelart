import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/actions/authAction';
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Alert, Tooltip, OverlayTrigger } from 'react-bootstrap';
import {
  FaUserCircle, FaEnvelope, FaInfoCircle, FaComments, FaShareAlt,
  FaTools, FaShieldAlt, FaCog, FaBlog, FaUsers, FaClipboardList,
  FaUserCog, FaUserSlash, FaFlag, FaBan, FaShoppingCart, FaSignOutAlt,
  FaPlus, FaCheckCircle, FaGlobe, FaSun, FaMoon,
  FaDownload, FaMobileAlt // ✅ Iconos PWA agregados
} from 'react-icons/fa';

// Componente MenuOption
const MenuOption = ({ icon: Icon, iconColor, title, onClick, to, danger, badge }) => {
  const history = useHistory();

  const handleClick = () => {
    if (to) {
      history.push(to);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <Card
      className="mb-3 border-0 shadow-sm"
      style={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        borderRadius: '12px',
        position: 'relative'
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      }}
    >
      <Card.Body className="d-flex align-items-center p-3">
        <div
          style={{
            width: '45px',
            height: '45px',
            borderRadius: '10px',
            backgroundColor: danger ? 'rgba(220, 53, 69, 0.1)' : `${iconColor}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '15px'
          }}
        >
          <Icon size={22} style={{ color: danger ? '#dc3545' : iconColor }} />
        </div>
        <span className={`fw-${danger ? 'bold' : '500'}`} style={{ color: danger ? '#dc3545' : 'inherit' }}>
          {title}
        </span>
        
        {/* Badge para indicadores */}
        {badge && (
          <span
            style={{
              position: 'absolute',
              top: '10px',
              right: '15px',
              background: badge.color || '#28a745',
              color: 'white',
              borderRadius: '10px',
              padding: '2px 8px',
              fontSize: '0.7rem',
              fontWeight: 'bold'
            }}
          >
            {badge.text}
          </span>
        )}
      </Card.Body>
    </Card>
  );
};

// Componente Section
const Section = ({ title, children, gradient }) => (
  <div className="mb-4">
    {title && (
      <div
        style={{
          background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '12px 20px',
          borderRadius: '10px',
          color: 'white',
          fontWeight: '700',
          fontSize: '0.95rem',
          marginBottom: '15px',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
        }}
      >
        {title}
      </div>
    )}
    {children}
  </div>
);

// ✅ Componente PWA Install Manager MEJORADO
const PWAInstallManager = ({ onInstallStatusChange }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const { t } = useTranslation('profile');

  useEffect(() => {
    // ✅ Detectar si estamos en localhost
    const checkLocalhost = () => {
      const isLocal = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('local');
      setIsLocalhost(isLocal);
      console.log('🌐 Environment:', isLocal ? 'localhost' : 'production');
      return isLocal;
    };

    // Detectar si es iOS
    const detectIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(detectIOS);

    // Verificar si ya está instalado
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = window.navigator.standalone;
      const installed = isStandalone || isIOSStandalone;
      
      console.log('🔍 PWA Check - Standalone:', isStandalone, 'iOS Standalone:', isIOSStandalone, 'Installed:', installed);
      
      setIsAppInstalled(installed);
      
      if (onInstallStatusChange) {
        onInstallStatusChange(installed);
      }

      // Ocultar botón si ya está instalado
      if (installed) {
        setShowInstallButton(false);
        setCanInstall(false);
      }
    };

    // Evento cuando la PWA puede instalarse
    const handleBeforeInstallPrompt = (e) => {
      console.log('🎯 PWA: beforeinstallprompt event captured');
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
      setShowInstallButton(true);
    };

    // Evento cuando la PWA se instala
    const handleAppInstalled = () => {
      console.log('✅ PWA: App installed successfully');
      setIsAppInstalled(true);
      setShowInstallButton(false);
      setCanInstall(false);
      setDeferredPrompt(null);
      
      if (onInstallStatusChange) {
        onInstallStatusChange(true);
      }
    };

    // Configurar event listeners
    const isLocal = checkLocalhost();
    checkIfInstalled();
    
    // ✅ Solo agregar event listeners si no estamos en localhost
    if (!isLocal) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
    } else {
      console.log('🚫 PWA: Localhost environment - installation disabled');
    }

    // Para iOS, siempre mostrar el botón (no tiene beforeinstallprompt)
    if (detectIOS && !isAppInstalled && !isLocal) {
      setShowInstallButton(true);
    }

    // Verificar periódicamente
    const interval = setInterval(checkIfInstalled, 10000);

    return () => {
      if (!isLocal) {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      }
      clearInterval(interval);
    };
  }, [onInstallStatusChange, isAppInstalled]);

  const handleInstallPWA = async () => {
    // ✅ No permitir instalación en localhost
    if (isLocalhost) {
      console.log('🚫 PWA: Installation blocked on localhost');
      return;
    }

    // Para iOS, mostrar instrucciones
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    // Para otros navegadores
    if (deferredPrompt && canInstall) {
      try {
        setIsInstalling(true);
        console.log('🚀 PWA: Triggering install prompt');
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log('📊 PWA: User choice:', outcome);
        
        if (outcome === 'accepted') {
          console.log('✅ PWA: User accepted installation');
        } else {
          console.log('❌ PWA: User declined installation');
          // Reaparecer el botón después de 30 segundos si el usuario declina
          setTimeout(() => {
            if (!isAppInstalled) {
              setShowInstallButton(true);
            }
          }, 30000);
        }
        
        setDeferredPrompt(null);
        setCanInstall(false);
        
      } catch (error) {
        console.error('❌ PWA: Error during installation:', error);
      } finally {
        setIsInstalling(false);
      }
    }
  };

  // ✅ No mostrar nada en localhost o si no se puede instalar o ya está instalado
  if (isLocalhost || !showInstallButton || isAppInstalled) {
    return null;
  }

  return (
    <>
      <MenuOption
        icon={isInstalling ? FaMobileAlt : FaDownload}
        iconColor={isInstalling ? "#f59e0b" : "#10b981"}
        title={isInstalling 
          ? (t('pwa_installing') || 'Instalando...') 
          : (isIOS 
              ? (t('pwa_add_to_home') || 'Agregar a Pantalla') 
              : (t('install_app') || 'Instalar App')
            )
        }
        onClick={handleInstallPWA}
        badge={isInstalling 
          ? { text: '⏳', color: '#f59e0b' } 
          : { text: '📱', color: '#10b981' }
        }
      />

      {/* Modal para instrucciones iOS */}
      <Modal show={showIOSModal} onHide={() => setShowIOSModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaMobileAlt className="me-2" />
            {t('pwa_ios_install_title') || 'Agregar a Pantalla de Inicio'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="p-3">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                   style={{ width: '30px', height: '30px', flexShrink: 0 }}>
                1
              </div>
              <span>{t('pwa_ios_step1') || 'Toca el botón compartir'}</span>
              <FaShareAlt className="ms-2 text-primary" />
            </div>
            
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                   style={{ width: '30px', height: '30px', flexShrink: 0 }}>
                2
              </div>
              <span>{t('pwa_ios_step2') || 'Selecciona "Agregar a Pantalla de Inicio"'}</span>
            </div>
            
            <div className="d-flex align-items-center">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                   style={{ width: '30px', height: '30px', flexShrink: 0 }}>
                3
              </div>
              <span>{t('pwa_ios_step3') || 'Confirma la instalación'}</span>
            </div>

            <Alert variant="info" className="mt-3 small">
              <FaInfoCircle className="me-2" />
              {t('pwa_ios_note') || 'Esta opción está disponible en Safari para iOS'}
            </Alert>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowIOSModal(false)}>
            {t('understand') || 'Entendido'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const ProfileInfoUser = () => {
  const { auth, theme, cart, notify, settings } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { languageReducer } = useSelector(state => state);
  const { t, i18n } = useTranslation('profile');
  const lang = languageReducer.language || 'es';
  const history = useHistory();
  const notifyDropdownRef = useRef(null);

  const [userRole, setUserRole] = useState(auth.user?.role);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  const [showNotifyDropdown, setShowNotifyDropdown] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifyDropdownRef.current && !notifyDropdownRef.current.contains(event.target)) {
        setShowNotifyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePWAInstallStatusChange = (installed) => {
    setIsPWAInstalled(installed);
  };

  const openStatusModal = () => dispatch({ type: GLOBALTYPES.STATUS, payload: true });

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleTheme = () => dispatch({ type: GLOBALTYPES.THEME, payload: !theme });

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLanguageModal(false);
  };

  if (!settings) {
    return (
      <nav className="navbar navbar-light bg-light">
        <span className="navbar-brand">{t('loading', 'Cargando...')}</span>
      </nav>
    );
  }

  const getRoleDisplay = () => {
    switch (userRole) {
      case 'admin':
        return t('adminRole', '👑 Admin');
      case 'Moderateur':
        return t('moderatorRole', '🛡️ Moderador');
      case 'Super-utilisateur':
        return t('superUserRole', '⭐ Super User');
      default:
        return t('userRole', '👤 Usuario');
    }
  };

  return (
    <div>
      <Container className="py-4" style={{
        direction: lang === 'ar' ? 'rtl' : 'ltr',
        textAlign: lang === 'ar' ? 'right' : 'left'
      }}>
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            {/* Header del Usuario */}
            <Card
              className="mb-4 border-0 shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '15px',
                overflow: 'hidden'
              }}
            >
              <Card.Body className="p-4">
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      border: '4px solid white',
                      padding: '3px',
                      background: 'white'
                    }} >
                    <Link to={`/profile/${auth.user?._id}`}>
                      <img
                        src={auth.user?.avatar}
                        alt="Avatar"
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }} />
                    </Link>
                  </div>
                  <div className="flex-grow-1">
                    <h3 className="text-white mb-2">{auth.user?.username}</h3>
                    <div
                      style={{
                        fontSize: '0.9rem',
                        backgroundColor: 'rgba(255,255,255,0.25)',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        display: 'inline-block',
                        color: 'white',
                        fontWeight: '600'
                      }}
                    >
                      {getRoleDisplay()}
                    </div>
                  </div>
                </div>

                {/* Estado de verificación */}
                <div className="mt-3">
                  {auth.user?.isVerified ? (
                    <div
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}
                    >
                      <FaCheckCircle className="me-2" size={18} />
                      {t('verifiedAccount', 'Cuenta Verificada')}
                    </div>
                  ) : (
                    <Button
                      variant="light"
                      className="w-100"
                      style={{ borderRadius: '10px', fontWeight: '600' }}
                    >
                      {t('verifyAccount', 'Verificar Cuenta')}
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>

            <Row>
              <Col lg={6}>
                {/* Configuración General */}
                <Section>
                  <MenuOption
                    icon={FaGlobe}
                    iconColor="#667eea"
                    title={t('changeLanguage', 'Cambiar Idioma')}
                    onClick={() => setShowLanguageModal(true)}
                  />
                  <MenuOption
                    icon={theme ? FaSun : FaMoon}
                    iconColor="#ffc107"
                    title={theme ? t('lightMode', 'Modo Claro') : t('darkMode', 'Modo Oscuro')}
                    onClick={toggleTheme}
                  />
                </Section>

                {/* ✅ SECCIÓN PWA - INSTALAR APP */}
                <Section title={t('pwaSection', '📱 Instalar App')}>
                  <PWAInstallManager onInstallStatusChange={handlePWAInstallStatusChange} />
                  
                  {/* Mensaje cuando ya está instalado */}
                  {isPWAInstalled && (
                    <MenuOption
                      icon={FaCheckCircle}
                      iconColor="#6b7280"
                      title={t('pwa_already_installed') || 'App instalada'}
                      badge={{ text: '✅', color: '#6b7280' }}
                    />
                  )}

                  {/* Información sobre PWA */}
                  <MenuOption
                    icon={FaInfoCircle}
                    iconColor="#6c757d"
                    title={t('pwa_info') || '¿Qué es una PWA?'}
                    to="/infoaplicacionn"
                    badge={{ text: 'ℹ️', color: '#6c757d' }}
                  />
                </Section>

                {/* ✅ Agregar Post (SOLO para usuarios autenticados con roles específicos) */}
                {auth.user && (userRole === "Super-utilisateur" || userRole === "admin") && (
                  <Section>
                    <MenuOption
                      icon={FaPlus}
                      iconColor="#667eea"
                      title={t('addPost', 'Agregar Post')}
                      onClick={openStatusModal}
                    />
                  </Section>
                )}

                {/* Menú Principal */}
                <Section title={t('mainSection', '📱 Principal')}>
                  <MenuOption
                    icon={FaEnvelope}
                    iconColor="#17a2b8"
                    title={t('commissions', 'Encargos')}
                    to="/encargos"
                  />
                  <MenuOption
                    icon={FaInfoCircle}
                    iconColor="#6c757d"
                    title={t('appInfo', 'Información')}
                    to="/infoaplicacionn"
                  />
                  
                  {/* ✅ Notificaciones - SOLO para usuarios autenticados */}
                  {auth.user && (
                    <MenuOption
                      icon={FaUserCircle}
                      iconColor="#667eea"
                      title={t('notifications', 'Notificaciones')}
                      to="/notify"
                    />
                  )}
                  
                  {/* ✅ Conversaciones - SOLO para usuarios autenticados */}
                  {auth.user && (
                    <MenuOption
                      icon={FaComments}
                      iconColor="#28a745"
                      title={t('conversations', 'Conversaciones')}
                      to="/message"
                    />
                  )}
                </Section>
              </Col>

              <Col lg={6}>
                {/* Compartir */}
                <Section>
                  <MenuOption
                    icon={FaShareAlt}
                    iconColor="#ffc107"
                    title={t('shareApp', 'Compartir Aplicación')}
                    onClick={() => setShowModal(true)}
                  />
                </Section>

                {/* Panel de Admin - SOLO para admin */}
                {auth.user && userRole === "admin" && (
                  <Section
                    title={
                      <div className="d-flex align-items-center">
                        <FaShieldAlt className="me-2" size={18} />
                        {t('adminPanel', 'Panel de Administración')}
                      </div>
                    }
                    gradient="linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)"
                  >
                    <MenuOption
                      icon={FaTools}
                      iconColor="#6c757d"
                      title={t('roles', 'Roles')}
                      to="/users/roles"
                    />
                    <MenuOption
                      icon={FaCog}
                      iconColor="#6c757d"
                      title={t('privacySettings', 'Ajustes de privacidad')}
                      to="/users/privacidad"
                    />
                    <MenuOption
                      icon={FaCog}
                      iconColor="#6c757d"
                      title={t('globalSettings', 'Configuración global')}
                      onClick={() => setShowFeaturesModal(true)}
                    />
                    <MenuOption
                      icon={FaEnvelope}
                      iconColor="#17a2b8"
                      title={t('adminSendEmail', 'Enviar Email')}
                      to="/mails"
                    />
                    <MenuOption
                      icon={FaUsers}
                      iconColor="#28a745"
                      title={t('users', 'Usuarios')}
                      to="/users"
                    />
                    <MenuOption
                      icon={FaClipboardList}
                      iconColor="#ffc107"
                      title={t('pendingPosts', 'Posts Pendientes')}
                      to="/postspendientes"
                    />
                    <MenuOption
                      icon={FaUserCog}
                      iconColor="#667eea"
                      title={t('userActions', 'Acciones de Usuario')}
                      to="/usersactionn"
                    />
                    <MenuOption
                      icon={FaUserSlash}
                      iconColor="#dc3545"
                      title={t('blockedUsersList', 'Usuarios Bloqueados')}
                      to="/listuserbloque"
                    />
                    <MenuOption
                      icon={FaFlag}
                      iconColor="#ff6b6b"
                      title={t('reportedUsers', 'Usuarios Denunciados')}
                      to="/listausariosdenunciadoss"
                    />
                    <MenuOption
                      icon={FaBan}
                      iconColor="#6c757d"
                      title={t('blockStatus', 'Estado de Bloqueos')}
                      to="/bloqueos"
                    />
                    <MenuOption
                      icon={FaShoppingCart}
                      iconColor="#28a745"
                      title={t('orders', 'Órdenes')}
                      to="/cart/orderss"
                    />
                  </Section>
                )}

                {/* ✅ Cerrar Sesión - SOLO para usuarios autenticados */}
                {auth.user && (
                  <Section>
                    <MenuOption
                      icon={FaSignOutAlt}
                      iconColor="#dc3545"
                      title={t('logout', 'Cerrar Sesión')}
                      onClick={handleLogout}
                      danger
                    />
                  </Section>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Modal de Compartir */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('shareApp', 'Compartir Aplicación')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('shareAppDescription', 'Comparte esta increíble aplicación con tus amigos y familiares.')}</p>
          <div className="d-grid gap-2">
            <Button variant="primary" onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Tassili Art',
                  text: t('shareAppText', '¡Mira esta increíble aplicación de arte!'),
                  url: window.location.origin,
                });
              } else {
                navigator.clipboard.writeText(window.location.origin);
                alert(t('linkCopied', 'Enlace copiado al portapapeles'));
              }
              setShowModal(false);
            }}>
              {t('shareNow', 'Compartir Ahora')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal de Configuración Global */}
      <Modal show={showFeaturesModal} onHide={() => setShowFeaturesModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t('globalSettings', 'Configuración Global')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('globalSettingsDescription', 'Configura las características globales de la aplicación.')}</p>
          {/* Aquí puedes agregar más opciones de configuración global */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFeaturesModal(false)}>
            {t('close', 'Cerrar')}
          </Button>
          <Button variant="primary">
            {t('saveChanges', 'Guardar Cambios')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Idioma */}
      <Modal show={showLanguageModal} onHide={() => setShowLanguageModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('selectLanguage', 'Seleccionar Idioma')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-grid gap-2">
            <Button variant="outline-primary" onClick={() => changeLanguage('es')}>
              Español 🇪🇸
            </Button>
            <Button variant="outline-primary" onClick={() => changeLanguage('en')}>
              English 🇺🇸
            </Button>
            <Button variant="outline-primary" onClick={() => changeLanguage('fr')}>
              Français 🇫🇷
            </Button>
            {/* Agrega más idiomas según necesites */}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProfileInfoUser;