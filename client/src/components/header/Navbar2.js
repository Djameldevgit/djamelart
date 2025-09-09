import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/actions/authAction'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'
import Avatar from '../Avatar'
import Card from 'react-bootstrap/Card'
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
  FaShoppingCart
} from 'react-icons/fa';

import { FaBars, FaSignOutAlt, FaUserCircle, FaSignInAlt, FaUserPlus, FaSearch, FaBell } from 'react-icons/fa'
import { Navbar, Container, NavDropdown, Offcanvas, Button, Badge } from 'react-bootstrap'
import { BsCartFill } from 'react-icons/bs'
import NotifyModal from '../NotifyModal'
import LanguageSelectorpc from '../LanguageSelectorpc'
import ActivateButton from '../../auth/ActivateButton'
import VerifyModal from '../authAndVerify/VerifyModal';
import Acordion from '../Acordion';
import Modalsearchhome from './Modalsearchhome';
import DesactivateModal from '../authAndVerify/DesactivateModal';

const Navbar2 = ({ onFiltersChange }) => {
  const { auth, theme, cart, notify } = useSelector((state) => state)
  const dispatch = useDispatch()
  const { languageReducer } = useSelector(state => state)
  const { t, i18n } = useTranslation('navbar');
  const lang = languageReducer.language || 'es';
  useEffect(() => {
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);


  const [showDrawer, setShowDrawer] = useState(false)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const totalItems = cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const [showModal, setShowModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);

  const openStatusModal = () => dispatch({ type: GLOBALTYPES.STATUS, payload: true })
  const handleLogout = () => {
    dispatch(logout())
    handleCloseDrawer()
  }
  const toggleTheme = () => dispatch({ type: GLOBALTYPES.THEME, payload: !theme })
  const handleCloseDrawer = () => setShowDrawer(false)
  const handleShowDrawer = () => setShowDrawer(true)

  const history = useHistory();
  const [showAdminRedirectModal, setShowAdminRedirectModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    title: '',
    theme: '',
    style: '',
    minPrice: '',
    maxPrice: '',
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    if (onFiltersChange) onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const newFilters = {
      category: '',
      title: '',
      theme: '',
      style: '',
      minPrice: '',
      maxPrice: '',
    };
    setFilters(newFilters);
    if (onFiltersChange) onFiltersChange(newFilters);
  };

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
  //fixed-top
  return (
    <div>
      <Navbar
        expand="lg"
        className="bg-body-tertiary"
        style={{
          zIndex: 1030,
          marginTop: isMobile ? '55px' : '0'
        }}
      >
        <Container fluid className="align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Button onClick={handleShowDrawer} variant="outline-primary" className="me-2">
              {showDrawer ? '✖' : <FaBars size={20} />}
            </Button>

            <Navbar.Brand href="/" className="py-2 d-none d-lg-block  ">
              <Card.Title>{t('appName')} </Card.Title>
            </Navbar.Brand>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="d-none d-lg-block">
              <LanguageSelectorpc />
            </div>

            <FaSearch
              size={18}
              className="text-secondary cursor-pointer mr-2"
              onClick={openModal}
              title={t('search')}
              style={{ cursor: 'pointer' }}
            />

            {(auth.user?.role === "Super-utilisateur" || auth.user?.role === "admin") &&
              <i className='fas fa-plus' onClick={openStatusModal}> </i>
            }

            {
              auth.user && (
                <NavDropdown
                  align="end"
                  title={
                    <div>
                      <FaBell size={20} color={notify.data.length > 0 ? "crimson" : "black"} />
                      {notify.data.length > 0 && (
                        <Badge
                          pill
                          bg="danger"
                          className="position-absolute top-3 start-100 translate-middle"
                          style={{ fontSize: '0.6rem', minWidth: '15px', height: '15px' }}
                        >
                          {notify.data.length}
                        </Badge>
                      )}
                    </div>
                  }
                  id="nav-notify-dropdown"
                  drop="down"
                  className="notification-dropdown"
                >
                  <NavDropdown.Header className="fw-bold">🔔 {t('notifications')}</NavDropdown.Header>
                  <NavDropdown.Divider />

                  <div style={{
                    overflowY: 'auto',
                    padding: '0',
                    position: 'auto',
                  }}>
                    <NotifyModal />
                  </div>
                </NavDropdown>

              )



            }

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

                    {(auth.user?.role === "Super-utilisateur" || auth.user?.role === "admin") && (
                      <NavDropdown.Item onClick={openStatusModal}>
                        <FaPlus className="me-2" />
                        {t('addPost')}
                      </NavDropdown.Item>
                    )}

                    <NavDropdown.Item as={Link} to="/contactt">
                      <FaEnvelope className="me-2" />
                      {t('contact')}
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

                    <NavDropdown.Item as={Link} to="/roles">
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
                  </>
                )}
              </div>
            </NavDropdown>
          </div>
        </Container>
      </Navbar>

      <Offcanvas
        show={showDrawer}
        onHide={handleCloseDrawer}
        placement="start"
        style={{ top: '56px', height: 'calc(100vh - 56px)', width: '270px' }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t('menu')}</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body style={{ overflowY: 'auto', padding: '0.5rem' }}>
          <div className="d-lg-none mb-3">
            {!auth.user ? (
              <div className="text-center">
                <Link to="/login" onClick={handleCloseDrawer} className="btn btn-outline-primary w-100 mb-2">
                  <FaSignInAlt className="me-2" /> {t('login')}
                </Link>
                <Link to="/register" onClick={handleCloseDrawer} className="btn btn-outline-secondary w-100">
                  <FaUserPlus className="me-2" /> {t('register')}
                </Link>
              </div>
            ) : (
              <div className="">
                <h6 className="text-center mb-3">{auth.user.username}</h6>
                <Link to={`/profile/${auth.user._id}`} onClick={handleCloseDrawer} className="btn btn-outline-success w-100 my-2">
                  <FaUserCircle className="me-2" /> {t('profile')}
                </Link>
                <Button variant="outline-danger" onClick={handleLogout} className="w-100">
                  <FaSignOutAlt className="me-2" /> {t('logout')}
                </Button>
              </div>
            )}
          </div>
          <ActivateButton />
          <Acordion />
        </Offcanvas.Body>
      </Offcanvas>

      <Modalsearchhome
        isOpen={isModalOpen}
        onClose={() => {
          closeModal();
          setShowAdvancedSearch(false);

        }}

        style={{
          zIndex: 5000,

        }}




      >

        <div className="filter-group">
          <h5 className='mx-auto'>{t('artworkSearch')}</h5>
        </div>

        <div style={{
          direction: lang === 'ar' ? 'rtl' : 'ltr',
          textAlign: lang === 'ar' ? 'right' : 'left',
          zIndex: 5000,
        }}          >
          <div className="filter-group">
            <input
              type="text"
              name="search"
              placeholder={t('searchTitlePlaceholder')}
              onChange={handleFilterChange}
              value={filters.search}
            />
          </div>

          <div className="modalcontentsearch">
            <div className="titlebusqueda">
              <button
                className="modalclosesearch"
                onClick={() => {
                  closeModal();
                  setShowAdvancedSearch(false);
                }}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.8rem',
                  color: '#333',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  lineHeight: '1',
                }}
              >
                &times;
              </button>
            </div>
            <div className="titlebusqueda">
              <Button
                variant="link"
                onClick={() => {
                  if (canProceed()) {
                    setShowAdvancedSearch(!showAdvancedSearch);
                  }
                }}
                className="p-0 text-decoration-none"
              >
                {showAdvancedSearch ?
                  t('hideAdvancedSearch') :
                  t('showAdvancedSearch')}
              </Button>
            </div>
            {showAdvancedSearch && (
              <div className="filters-container">
                <div className="filter-group">
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    required
                  >
                    <option value="">{t('selectCategory')}</option>
                    <option value="painting">{t('categories.painting')}</option>
                    <option value="sculpture">{t('categories.sculpture')}</option>
                    <option value="photography">{t('categories.photography')}</option>
                    <option value="drawing">{t('categories.drawing')}</option>
                    <option value="engraving">{t('categories.engraving')}</option>
                    <option value="digital_art">{t('categories.digital_art')}</option>
                    <option value="collage">{t('categories.collage')}</option>
                    <option value="textile_art">{t('categories.textile_art')}</option>
                  </select>
                </div>

                <div className="filter-group">
                  <select
                    name="theme"
                    value={filters.theme}
                    onChange={handleFilterChange}
                    required
                  >
                    <option value="">{t('selectTheme')}</option>
                    <optgroup label={t('themeGroups.styles')}>
                      <option value="abstrait">{t('themes.abstrait')}</option>
                      <option value="colore">{t('themes.colore')}</option>
                      <option value="graffiti">{t('themes.graffiti')}</option>
                      <option value="geometrique">{t('themes.geometrique')}</option>
                      <option value="surrealisme">{t('themes.surrealisme')}</option>
                      <option value="conceptuel">{t('themes.conceptuel')}</option>
                      <option value="replica">{t('themes.replica')}</option>
                      <option value="reproduction">{t('themes.reproduction')}</option>
                    </optgroup>

                    <optgroup label={t('themeGroups.animals')}>
                      <option value="animal">{t('themes.animal')}</option>
                      <option value="chat">{t('themes.chat')}</option>
                      <option value="chien">{t('themes.chien')}</option>
                      <option value="cheval">{t('themes.cheval')}</option>
                      <option value="oiseau">{t('themes.oiseau')}</option>
                      <option value="poisson">{t('themes.poisson')}</option>
                    </optgroup>

                    <optgroup label={t('themeGroups.nature')}>
                      <option value="paysage">{t('themes.paysage')}</option>
                      <option value="foret">{t('themes.foret')}</option>
                      <option value="montagne">{t('themes.montagne')}</option>
                      <option value="fleurs">{t('themes.fleurs')}</option>
                      <option value="mer">{t('themes.mer')}</option>
                      <option value="ciel">{t('themes.ciel')}</option>
                    </optgroup>

                    <optgroup label={t('themeGroups.human')}>
                      <option value="portrait">{t('themes.portrait')}</option>
                      <option value="corps_humain">{t('themes.corps_humain')}</option>
                      <option value="famille">{t('themes.famille')}</option>
                    </optgroup>

                    <optgroup label={t('themeGroups.culture')}>
                      <option value="culture_populaire">{t('themes.culture_populaire')}</option>
                      <option value="bandes_dessinees">{t('themes.bandes_dessinees')}</option>
                      <option value="cinema">{t('themes.cinema')}</option>
                      <option value="dessin_anime">{t('themes.dessin_anime')}</option>
                      <option value="jeu_video">{t('themes.jeu_video')}</option>
                      <option value="mode">{t('themes.mode')}</option>
                      <option value="mythologie">{t('themes.mythologie')}</option>
                      <option value="religion">{t('themes.religion')}</option>
                      <option value="histoire">{t('themes.histoire')}</option>
                    </optgroup>

                    <optgroup label={t('themeGroups.imagination')}>
                      <option value="fantastique">{t('themes.fantastique')}</option>
                      <option value="science_fiction">{t('themes.science_fiction')}</option>
                      <option value="onirique">{t('themes.onirique')}</option>
                    </optgroup>

                    <optgroup label={t('themeGroups.society')}>
                      <option value="ville">{t('themes.ville')}</option>
                      <option value="architecture">{t('themes.architecture')}</option>
                      <option value="societe">{t('themes.societe')}</option>
                      <option value="technologie">{t('themes.technologie')}</option>
                    </optgroup>
                  </select>
                </div>

                <div className="filter-group">
                  <select
                    name="style"
                    value={filters.style}
                    onChange={handleFilterChange}
                    required
                  >
                    <option value="">{t('selectStyle')}</option>
                    <optgroup label={t('styleGroups.modern')}>
                      <option value="abstrait">{t('styles.abstrait')}</option>
                      <option value="impressionnisme">{t('styles.impressionnisme')}</option>
                      <option value="expressionnisme">{t('styles.expressionnisme')}</option>
                      <option value="cubisme">{t('styles.cubisme')}</option>
                      <option value="pop_art">{t('styles.pop_art')}</option>
                    </optgroup>

                    <optgroup label={t('styleGroups.contemporary')}>
                      <option value="art_conceptuel">{t('styles.art_conceptuel')}</option>
                      <option value="street_art">{t('styles.street_art')}</option>
                      <option value="pixel_art">{t('styles.pixel_art')}</option>
                      <option value="nft">{t('styles.nft')}</option>
                      <option value="generatif">{t('styles.generatif')}</option>
                    </optgroup>

                    <optgroup label={t('styleGroups.classic_traditional')}>
                      <option value="figuratif">{t('styles.figuratif')}</option>
                      <option value="classicisme">{t('styles.classicisme')}</option>
                      <option value="baroque">{t('styles.baroque')}</option>
                      <option value="croquis">{t('styles.croquis')}</option>
                    </optgroup>

                    <optgroup label={t('styleGroups.other_styles')}>
                      <option value="documentaire">{t('styles.documentaire')}</option>
                      <option value="noir_et_blanc">{t('styles.noir_et_blanc')}</option>
                      <option value="tissagee">{t('textile_arttt.tissagee')}</option>
                      <option value="mixte">{t('styles.mixte')}</option>
                    </optgroup>
                  </select>
                </div>

                <div className="filter-group">
                  <small>{t('minPrice')}</small>
                  <input
                    type="number"
                    name="minPrice"
                    placeholder={t('minPricePlaceholder')}
                    onChange={handleFilterChange}
                    value={filters.minPrice}
                  />
                  <small>{t('maxPrice')}</small>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder={t('maxPricePlaceholder')}
                    onChange={handleFilterChange}
                    value={filters.maxPrice}
                  />
                </div>

                <div className="filter-group" style={{ gridColumn: '1 / -1' }}>
                  <button onClick={resetFilters} className="reset-button">
                    {t('resetFilters')}
                  </button>
                </div>
              </div>)}
          </div>
        </div>
      </Modalsearchhome>

      {showModal && (
        <div className="modal">
          <div className="modal-content" style={{ position: 'relative' }}>
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '1.8rem',
                color: '#333',
                cursor: 'pointer',
                fontWeight: 'bold',
                lineHeight: '1',
              }}
              aria-label="Cerrar"
            >
              ×
            </button>

            <h4>{t("connectRequired")}</h4>
            <p>{t("connectMessage")}</p>

            <div className="modal-buttons">
              <button onClick={() => {
                setShowModal(false);
                setTimeout(() => history.push("/login"), 200);
              }}>
                {t("login")}
              </button>

              <button onClick={() => {
                setShowModal(false);
                setTimeout(() => history.push("/register"), 200);
              }}>
                {t("register")}
              </button>

              <button onClick={() => setShowModal(false)}>
                {t("close")}
              </button>
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
        actionLink="/contact"
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
  )
}

export default Navbar2