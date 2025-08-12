import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/actions/authAction'
import { GLOBALTYPES } from '../redux/actions/globalTypes'
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'
import Avatar from './Avatar'
import Card from 'react-bootstrap/Card'
import { FaBars, FaSignOutAlt, FaUserCircle, FaSignInAlt, FaUserPlus } from 'react-icons/fa'
import { Navbar, Container, NavDropdown, Offcanvas, Button, Badge } from 'react-bootstrap'
import { BsCartFill } from 'react-icons/bs'
import NotifyModal from './NotifyModal'
import VerifyModal from './authAndVerify/VerifyModal'
import DesactivateModal from './authAndVerify/DesactivateModal'
 
import LanguageSelectorpc from './LanguageSelectorpc'
import Acordion from './Acordion'
import { FaSearch } from 'react-icons/fa'
import Modalsearchhome from './Modalsearchhome'
import ActivateButton from '../auth/ActivateButton'
 

const Navbar2 = ({ onFiltersChange }) => {
  const { auth, theme, cart } = useSelector((state) => state)
  const dispatch = useDispatch()
  const { languageReducer } = useSelector(state => state)
  const { t } = useTranslation(['searchhome'])
  const lang = languageReducer.language || 'en'
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


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    title: '',
    theme: '',
    style: '',
    minPrice: '',
    maxPrice: '',
  });


  // Añade estas funciones
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);



  // Navbar2.js
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    // Notificar al componente padre sobre el cambio
    if (onFiltersChange) onFiltersChange(newFilters);  // Esta línea es crucial
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
    // Notificar al componente padre sobre el reset
    if (onFiltersChange) onFiltersChange(newFilters);
  };

  const canProceed = () => {
    if (!auth.token || !auth.user) {
      closeModal(); // Cierra el modal de búsqueda primero
      setShowModal(true); // Mostrar modal de "Conéctate o regístrate"
      return false;
    }
  
    if (!auth.user.isVerified) {
      closeModal(); // Cierra el modal de búsqueda primero
      setShowVerifyModal(true);
      return false;
    }
  
    if (auth.user.isActive === false) {
      closeModal(); // Cierra el modal de búsqueda primero
      setShowDeactivatedModal(true);
      return false;
    }
  
    return true;
  };


  return (
    <div>
        <Navbar expand="lg" className="navbar bg-body-tertiary mb-2 shadow-sm px-3">
      <Container fluid className="align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <Button onClick={handleShowDrawer} variant="outline-primary" className="me-2">
            {showDrawer ? '✖' : <FaBars size={20} />}
          </Button>
          <Navbar.Brand href="/" className="py-2 d-none d-lg-block">
            <Card.Title>{t('navbar:appName')}</Card.Title>
          </Navbar.Brand>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="d-none d-lg-block">
            <LanguageSelectorpc />
          </div>
          
          <div className="d-none d-lg-block">
            <FaSearch
              size={18}
              className="text-secondary cursor-pointer"
              onClick={openModal}
              title={t('navbar:search')}
              style={{ cursor: 'pointer' }}
            />
          </div>

          {auth.user && (
            <NavDropdown
              title={<i className="fas fa-bell text-danger" style={{ fontSize: '1.2rem' }} />}
            >
              <div className="mx-auto">
                <NotifyModal user={auth.user} />
              </div>
            </NavDropdown>
          )}

          {auth.user && (
            <Link to="/cart/cartcarrito" className="position-relative text-decoration-none">
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
            key={`nav-role-${auth.user?.role}`} // Doble clave de seguridad
    
          >
            <div className="dropdown-scroll-wrapper">
              {auth.user ? (
                <>
                  <NavDropdown.Header>{auth.user.username}</NavDropdown.Header>

                  <NavDropdown.Item onClick={openStatusModal}>
                    ➕ {t('navbar:addPost')}
                  </NavDropdown.Item>

                  <NavDropdown.Item as={Link} to="/contact">
                    📩 {t('navbar:contact')}
                  </NavDropdown.Item>

                  <NavDropdown.Item as={Link} to="/bloginfo">
                    ℹ️ {t('navbar:appInfo')}
                  </NavDropdown.Item>

                  <NavDropdown.Item as={Link} to={`/profile/${auth.user._id}`}>
                    <FaUserCircle className="me-2" />
                    {t('navbar:profile')}
                  </NavDropdown.Item>

                  <NavDropdown.Item as={Link} to="/message">
                    💬 {t('navbar:conversations')}
                  </NavDropdown.Item>

                  <NavDropdown.Item as={Link} to="/rolesuser">
                    🛠️ {t('navbar:roles')}
                  </NavDropdown.Item>

                  {/* Sección de Admin - Actualiza en tiempo real */}
                  {auth.user?.role === "admin" && (
  <>
    <NavDropdown.Divider />
    <NavDropdown.Header>🛡️ {t('navbar:panelAministrativo')}</NavDropdown.Header>
       
    <NavDropdown.Item as={Link} to="/blog"> blog</NavDropdown.Item>
                   

               
    <NavDropdown.Item as={Link} to="/messageadmin">
      💼 {t('navbar:chatear con los administradores')}
    </NavDropdown.Item>
    <NavDropdown.Item as={Link} to="/users/adminsendemail">
      {t('navbar:adminSendEmail')}
    </NavDropdown.Item>
    <NavDropdown.Item as={Link} to="/users/userss">
      {t('navbar:users')}
    </NavDropdown.Item>
    <NavDropdown.Item as={Link} to="/postspendientes">
      {t('navbar:pendingPosts')}
    </NavDropdown.Item>
    <NavDropdown.Item as={Link} to="/users/usersaction">
      {t('navbar:userActions')}
    </NavDropdown.Item>
    <NavDropdown.Item as={Link} to="/reportesusers">
      {t('navbar:userReports')}
    </NavDropdown.Item>
    <NavDropdown.Item as={Link} to="/users/bloqueos">
      {t('navbar:blockedUsers')}
    </NavDropdown.Item>
    <NavDropdown.Item as={Link} to="/cart/orderss">
      {t('navbar:orders')}
    </NavDropdown.Item>
  </>
)}

                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={toggleTheme}>
                    {theme ? '🌞 ' + t('navbar:lightMode') : '🌙 ' + t('navbar:darkMode')}
                  </NavDropdown.Item>

                  <NavDropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" />
                    {t('navbar:logout')}
                  </NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Item as={Link} to="/login">
                    <FaSignInAlt className="me-2" />
                    {t('navbar:login')}
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/register">
                    <FaUserPlus className="me-2" />
                    {t('navbar:register')}
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/bloginfo">
                    ℹ️ {t('navbar:appInfo')}
                  </NavDropdown.Item>
                </>
              )}
            </div>
          </NavDropdown>
        </div>
      </Container>
    </Navbar>
      {/* Drawer (Offcanvas) */}
      <Offcanvas
        show={showDrawer}
        onHide={handleCloseDrawer}
        placement="start"
        style={{ top: '56px', height: 'calc(100vh - 56px)', width: '270px' }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t('navbar:menu')}</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body style={{ overflowY: 'auto', padding: '0.5rem' }}>
          <div className="d-lg-none mb-3">
            {!auth.user ? (
              <div className="text-center">
                <Link to="/login" onClick={handleCloseDrawer} className="btn btn-outline-primary w-100 mb-2">
                  <FaSignInAlt className="me-2" /> {t('navbar:login')}
                </Link>
                <Link to="/register" onClick={handleCloseDrawer} className="btn btn-outline-secondary w-100">
                  <FaUserPlus className="me-2" /> {t('navbar:register')}
                </Link>
              </div>
            ) : (
              <div className="">
                <h6 className="text-center mb-3">{auth.user.username}</h6>
                <Link to={`/profile/${auth.user._id}`} onClick={handleCloseDrawer} className="btn btn-outline-success w-100 my-2">
                  <FaUserCircle className="me-2" /> {t('navbar:profile')}
                </Link>
                <Button variant="outline-danger" onClick={handleLogout} className="w-100">
                  <FaSignOutAlt className="me-2" /> {t('navbar:logout')}
                </Button>
              </div>
            )}
          </div>
<ActivateButton/>
          <Acordion />
        </Offcanvas.Body>
      </Offcanvas>

      <Modalsearchhome
        isOpen={isModalOpen}
        onClose={() => {
          closeModal();
          setShowAdvancedSearch(false);
        }}


      >
        <div className="filter-group">
          <h5 className='mx-auto'>{t('busqueda_de_obras_arte', { lng: lang })}</h5>
        </div>

        <div style={{
          direction: lang === 'ar' ? 'rtl' : 'ltr',
          textAlign: lang === 'ar' ? 'right' : 'left',
        }}>
          <div className="filter-group">
            <input
              type="text"
              name="search"
              placeholder={t('seleccione_titulo_busqueda', { lng: lang })}
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
                  t('hide_advanced_search', { lng: lang }) :
                  t('show_advanced_search', { lng: lang })}
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
                    <option value="">{t('select_category', { lng: lang })}</option>
                    <option value="painting">{t('category.painting', { lng: lang })}</option>
                    <option value="sculpture">{t('category.sculpture', { lng: lang })}</option>
                    <option value="photography">{t('category.photography', { lng: lang })}</option>
                    <option value="drawing">{t('category.drawing', { lng: lang })}</option>
                    <option value="engraving">{t('category.engraving', { lng: lang })}</option>
                    <option value="digital_art">{t('category.digital_art', { lng: lang })}</option>
                    <option value="collage">{t('category.collage', { lng: lang })}</option>
                    <option value="textile_art">{t('category.textile_art', { lng: lang })}</option>
                  </select>
                </div>

                <div className="filter-group">
                  <select
                    name="theme"
                    value={filters.theme}
                    onChange={handleFilterChange}
                    required
                  >
                    <option value="">{t('select_theme', { lng: lang })}</option>

                    {/* 🎨 أنماط */}
                    <optgroup label={t('theme_groups.styles', { lng: lang })}>
                      <option value="abstrait">{t('theme.abstrait', { lng: lang })}</option>
                      <option value="colore">{t('theme.colore', { lng: lang })}</option>
                      <option value="graffiti">{t('theme.graffiti', { lng: lang })}</option>
                      <option value="geometrique">{t('theme.geometrique', { lng: lang })}</option>
                      <option value="surrealisme">{t('theme.surrealisme', { lng: lang })}</option>
                      <option value="conceptuel">{t('theme.conceptuel', { lng: lang })}</option>
                      <option value="replica">{t('theme.replica', { lng: lang })}</option>
                      <option value="reproduction">{t('theme.reproduction', { lng: lang })}</option>
                    </optgroup>

                    {/* 🐾 حيوانات */}
                    <optgroup label={t('theme_groups.animaux', { lng: lang })}>
                      <option value="animal">{t('theme.animal', { lng: lang })}</option>
                      <option value="chat">{t('theme.chat', { lng: lang })}</option>
                      <option value="chien">{t('theme.chien', { lng: lang })}</option>
                      <option value="cheval">{t('theme.cheval', { lng: lang })}</option>
                      <option value="oiseau">{t('theme.oiseau', { lng: lang })}</option>
                      <option value="poisson">{t('theme.poisson', { lng: lang })}</option>
                    </optgroup>

                    {/* 🌳 طبيعة */}
                    <optgroup label={t('theme_groups.nature', { lng: lang })}>
                      <option value="paysage">{t('theme.paysage', { lng: lang })}</option>
                      <option value="foret">{t('theme.foret', { lng: lang })}</option>
                      <option value="montagne">{t('theme.montagne', { lng: lang })}</option>
                      <option value="fleurs">{t('theme.fleurs', { lng: lang })}</option>
                      <option value="mer">{t('theme.mer', { lng: lang })}</option>
                      <option value="ciel">{t('theme.ciel', { lng: lang })}</option>
                    </optgroup>

                    {/* 👤 إنسان */}
                    <optgroup label={t('theme_groups.humain', { lng: lang })}>
                      <option value="portrait">{t('theme.portrait', { lng: lang })}</option>
                      <option value="corps_humain">{t('theme.corps_humain', { lng: lang })}</option>
                      <option value="famille">{t('theme.famille', { lng: lang })}</option>
                    </optgroup>

                    {/* 🌍 ثقافة */}
                    <optgroup label={t('theme_groups.culture', { lng: lang })}>
                      <option value="culture_populaire">{t('theme.culture_populaire', { lng: lang })}</option>
                      <option value="bandes_dessinees">{t('theme.bandes_dessinees', { lng: lang })}</option>
                      <option value="cinema">{t('theme.cinema', { lng: lang })}</option>
                      <option value="dessin_anime">{t('theme.dessin_anime', { lng: lang })}</option>
                      <option value="jeu_video">{t('theme.jeu_video', { lng: lang })}</option>
                      <option value="mode">{t('theme.mode', { lng: lang })}</option>
                      <option value="mythologie">{t('theme.mythologie', { lng: lang })}</option>
                      <option value="religion">{t('theme.religion', { lng: lang })}</option>
                      <option value="histoire">{t('theme.histoire', { lng: lang })}</option>
                    </optgroup>

                    {/* 🧠 خيال */}
                    <optgroup label={t('theme_groups.imagination', { lng: lang })}>
                      <option value="fantastique">{t('theme.fantastique', { lng: lang })}</option>
                      <option value="science_fiction">{t('theme.science_fiction', { lng: lang })}</option>
                      <option value="onirique">{t('theme.onirique', { lng: lang })}</option>
                    </optgroup>

                    {/* 🏙️ مجتمع */}
                    <optgroup label={t('theme_groups.societe', { lng: lang })}>
                      <option value="ville">{t('theme.ville', { lng: lang })}</option>
                      <option value="architecture">{t('theme.architecture', { lng: lang })}</option>
                      <option value="societe">{t('theme.societe', { lng: lang })}</option>
                      <option value="technologie">{t('theme.technologie', { lng: lang })}</option>
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
                    <option value="">{t('styles.select_style', { lng: lang })}</option>

                    {/* Estilos Modernos */}
                    <optgroup label={t('groups.modernes', { lng: lang })}>
                      <option value="abstrait">{t('styles.abstrait', { lng: lang })}</option>
                      <option value="impressionnisme">{t('styles.impressionnisme', { lng: lang })}</option>
                      <option value="expressionnisme">{t('styles.expressionnisme', { lng: lang })}</option>
                      <option value="cubisme">{t('styles.cubisme', { lng: lang })}</option>
                      <option value="pop_art">{t('styles.pop_art', { lng: lang })}</option>
                    </optgroup>

                    {/* Estilos Contemporáneos */}
                    <optgroup label={t('groups.contemporains', { lng: lang })}>
                      <option value="art_conceptuel">{t('styles.art_conceptuel', { lng: lang })}</option>
                      <option value="street_art">{t('styles.street_art', { lng: lang })}</option>
                      <option value="pixel_art">{t('styles.pixel_art', { lng: lang })}</option>
                      <option value="nft">{t('styles.nft', { lng: lang })}</option>
                      <option value="generatif">{t('styles.generatif', { lng: lang })}</option>
                    </optgroup>

                    {/* Estilos Clásicos y Tradicionales */}
                    <optgroup label={t('groups.classique_traditionnel', { lng: lang })}>
                      <option value="figuratif">{t('styles.figuratif', { lng: lang })}</option>
                      <option value="classicisme">{t('styles.classicisme', { lng: lang })}</option>
                      <option value="baroque">{t('styles.baroque', { lng: lang })}</option>
                      <option value="croquis">{t('styles.croquis', { lng: lang })}</option>
                    </optgroup>

                    {/* Otros Estilos */}
                    <optgroup label={t('groups.autres_styles', { lng: lang })}>
                      <option value="documentaire">{t('styles.documentaire', { lng: lang })}</option>
                      <option value="noir_et_blanc">{t('styles.noir_et_blanc', { lng: lang })}</option>
                      <option value="tissagee">{t('textile_arttt.tissagee', { lng: lang })}</option>
                      <option value="mixte">{t('styles.mixte', { lng: lang })}</option>
                    </optgroup>
                  </select>
                </div>


                <div className="filter-group">
                  <small>{t('min_price', { lng: lang })}</small>
                  <input
                    type="number"
                    name="minPrice"
                    placeholder={t('min_price_placeholder', { lng: lang })}
                    onChange={handleFilterChange}
                    value={filters.minPrice}
                  />
                  <small>{t('max_price', { lng: lang })}</small>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder={t('max_price_placeholder', { lng: lang })}
                    onChange={handleFilterChange}
                    value={filters.maxPrice}
                  />
                </div>

                <div className="filter-group" style={{ gridColumn: '1 / -1' }}>
                  <button onClick={resetFilters} className="reset-button">
                    {t('reset_filters', { lng: lang })}
                  </button>
                </div>
              </div>)}
          </div>

        </div>

        
      </Modalsearchhome>

 
      {showModal && (
  <div className="modal">
    <div className="modal-content" style={{ position: 'relative' }}>
      {/* Botón de cierre arriba derecha */}
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

      <h4>{t("title2", { lng: languageReducer.language })}</h4>
      <p>{t("message2", { lng: languageReducer.language })}</p>
      
      <div className="modal-buttons">
        <button onClick={() => {
          setShowModal(false); // Cierra el modal primero
          setTimeout(() => history.push("/login"), 200); // Pequeño delay para mejor UX
        }}>
          {t("login2", { lng: languageReducer.language })}
        </button>
        
        <button onClick={() => {
          setShowModal(false); // Cierra el modal primero
          setTimeout(() => history.push("/register"), 200);
        }}>
          {t("register2", { lng: languageReducer.language })}
        </button>
        
        <button onClick={() => setShowModal(false)}>
          {t("close2", { lng: languageReducer.language })}
        </button>
      </div>
    </div>
  </div>
)}
 
 <VerifyModal
  show={showVerifyModal}
  onClose={() => {
    setShowVerifyModal(false);
    closeModal(); // Asegura que el modal de búsqueda también se cierre
  }}
  title={t('auth.verify_account', { lng: lang })}
  message={t('auth.verify_required', { lng: lang })}
  actionText={t('auth.resend_verification', { lng: lang })}
  actionLink="/resend-verification"
  onActionSuccess={() => {
    setShowVerifyModal(false);
    closeModal(); // Cierra ambos modales cuando la acción es exitosa
  }}
/>

{/* Modal para cuentas desactivadas */}
<DesactivateModal
  show={showDeactivatedModal}
  onClose={() => setShowDeactivatedModal(false)}
  title={t('auth.account_deactivated', { lng: lang })}
  message={t('auth.contact_admin', { lng: lang })}
  actionText={t('auth.contact_us', { lng: lang })}
  actionLink="/contact"
/>
    </div>
  )
}

export default Navbar2
