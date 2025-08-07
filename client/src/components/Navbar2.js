import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/actions/authAction'
import { GLOBALTYPES } from '../redux/actions/globalTypes'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import Card from 'react-bootstrap/Card'
import { FaBars, FaSignOutAlt, FaUserCircle, FaSignInAlt, FaUserPlus } from 'react-icons/fa'
import { Navbar, Container, NavDropdown, Offcanvas, Button, Badge } from 'react-bootstrap'
import { BsCartFill } from 'react-icons/bs'
import NotifyModal from './NotifyModal'
import LanguageSelectorpc from './LanguageSelectorpc'
import Acordion from './Acordion'
import { FaSearch } from 'react-icons/fa'
import Modalsearchhome from './Modalsearchhome'


const Navbar2 = ({ onFiltersChange }) => {
  const { auth, theme, cart } = useSelector((state) => state)
  const dispatch = useDispatch()
  const { languageReducer } = useSelector(state => state)
  const { t } = useTranslation(['navbar', 'common'])
  const lang = languageReducer.language || 'en'
  const [showDrawer, setShowDrawer] = useState(false)

  const totalItems = cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  // Funciones existentes (sin cambios)
  const openStatusModal = () => dispatch({ type: GLOBALTYPES.STATUS, payload: true })
  const handleLogout = () => {
    dispatch(logout())
    handleCloseDrawer()
  }
  const toggleTheme = () => dispatch({ type: GLOBALTYPES.THEME, payload: !theme })
  const handleCloseDrawer = () => setShowDrawer(false)
  const handleShowDrawer = () => setShowDrawer(true)





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
            <div className="d-lg-none mb-3 text-center">
              <div >
                <i className='fas fa-search mt-4'  ></i>
              </div>


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
                  <Badge
                    pill
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: '0.6rem' }}
                  >
                    <span>{cart.items?.length || 0}</span>
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

                    <NavDropdown.Item as={Link} to="/informacionaplicacionn">
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

                    {/* Admin only */}
                    {auth.user.role === 'admin' && (
                      <>
                        <NavDropdown.Divider />
                        <NavDropdown.Header>🛡️ {t('navbar:panelAministrativo')}</NavDropdown.Header>

                        <NavDropdown.Item as={Link} to="/messageadmin">💼 {t('navbar:chatear con los administradores')}</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/users/adminsendemail">{t('navbar:adminSendEmail')}</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/users/userss">{t('navbar:users')}</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/postspendientes">{t('navbar:pendingPosts')}</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/users/usersaction">{t('navbar:userActions')}</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/reportesusers">{t('navbar:userReports')}</NavDropdown.Item>

                        <NavDropdown.Item as={Link} to="/users/bloqueos">{t('navbar:blockedUsers')}</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/cart/orderss">{t('navbar:orders')}</NavDropdown.Item>
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
                    <NavDropdown.Item as={Link} to="/informacionaplicacionn">
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

          <Acordion />
        </Offcanvas.Body>
      </Offcanvas>

      <Modalsearchhome isOpen={isModalOpen} onClose={closeModal}>
        <div className="modalcontentsearch">
          <div className="titlebusqueda">
            <h5>{t('advanced_search_title', { lng: lang })}</h5>
            <button className="modalclosesearch" onClick={closeModal}>
              &times;
            </button>
          </div>
          <div className="filters-container">
            <div className="filter-group">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                required
              >
                <option value="">{t('select_category', { lng: lang })}</option>
                <option value="Painting">{t('category.painting', { lng: lang })}</option>
                <option value="Sculpture">{t('category.sculpture', { lng: lang })}</option>
                <option value="Photography">{t('category.photography', { lng: lang })}</option>
                <option value="drawing">{t('category.drawing', { lng: lang })}</option>
                <option value="Engraving">{t('category.engraving', { lng: lang })}</option>
                <option value="Digital_art">{t('category.digital_art', { lng: lang })}</option>
                <option value="Collage">{t('category.collage', { lng: lang })}</option>
                <option value="Textile_art">{t('category.textile_art', { lng: lang })}</option>
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

                {/* Pintura */}
                <optgroup label={t('painting', { lng: lang })}>
                  <option value="landscape">{t('landscape', { lng: lang })}</option>
                  <option value="portrait">{t('portrait', { lng: lang })}</option>
                  <option value="animals">{t('animals', { lng: lang })}</option>
                  <option value="seascape">{t('seascape', { lng: lang })}</option>
                  <option value="urban">{t('urban', { lng: lang })}</option>
                  <option value="abstract">{t('abstract', { lng: lang })}</option>
                  <option value="still_life">{t('still_life', { lng: lang })}</option>
                  <option value="botanical">{t('botanical', { lng: lang })}</option>
                </optgroup>

                {/* Escultura */}
                <optgroup label={t('sculpture', { lng: lang })}>
                  <option value="human_figure">{t('human_figure', { lng: lang })}</option>
                  <option value="animals_sculpture">{t('animals_sculpture', { lng: lang })}</option>
                  <option value="abstract_sculpture">{t('abstract_sculpture', { lng: lang })}</option>
                  <option value="mythological">{t('mythological', { lng: lang })}</option>
                  <option value="kinetic">{t('kinetic', { lng: lang })}</option>
                  <option value="minimalist">{t('minimalist', { lng: lang })}</option>
                </optgroup>

                {/* Fotografía */}
                <optgroup label={t('photography', { lng: lang })}>
                  <option value="portrait_photo">{t('portrait_photo', { lng: lang })}</option>
                  <option value="wildlife">{t('wildlife', { lng: lang })}</option>
                  <option value="street">{t('street', { lng: lang })}</option>
                  <option value="architectural">{t('architectural', { lng: lang })}</option>
                  <option value="conceptual">{t('conceptual', { lng: lang })}</option>
                </optgroup>

                {/* Arte Textil */}
                <optgroup label={t('textile', { lng: lang })}>
                  <option value="tapestry_patterns">{t('tapestry_patterns', { lng: lang })}</option>
                  <option value="ethnic">{t('ethnic', { lng: lang })}</option>
                  <option value="abstract_textile">{t('abstract_textile', { lng: lang })}</option>
                  <option value="nature_inspired">{t('nature_inspired', { lng: lang })}</option>
                </optgroup>

                {/* Arte Digital */}
                <optgroup label={t('digital', { lng: lang })}>
                  <option value="fantasy">{t('fantasy', { lng: lang })}</option>
                  <option value="sci_fi">{t('sci_fi', { lng: lang })}</option>
                  <option value="concept_art">{t('concept_art', { lng: lang })}</option>
                  <option value="pop_culture">{t('pop_culture', { lng: lang })}</option>
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
                <option value="">{t('style.select_style', { lng: lang })}</option>

                {/* Estilos Universales */}
                <optgroup label={t('style.group_universal', { lng: lang })}>
                  <option value="realism">{t('style.realism', { lng: lang })}</option>
                  <option value="impressionism">{t('style.impressionism', { lng: lang })}</option>
                  <option value="abstract">{t('style.abstract', { lng: lang })}</option>
                  <option value="surrealism">{t('style.surrealism', { lng: lang })}</option>
                  <option value="cubism">{t('style.cubism', { lng: lang })}</option>
                  <option value="minimalism">{t('style.minimalism', { lng: lang })}</option>
                </optgroup>

                {/* Estilos para Pintura */}
                <optgroup label={t('style.group_painting', { lng: lang })}>
                  <option value="oil_technique">{t('style.oil_technique', { lng: lang })}</option>
                  <option value="watercolor_style">{t('style.watercolor_style', { lng: lang })}</option>
                  <option value="fresco">{t('style.fresco', { lng: lang })}</option>
                  <option value="hyperrealism">{t('style.hyperrealism', { lng: lang })}</option>
                  <option value="graffiti_style">{t('style.graffiti_style', { lng: lang })}</option>
                </optgroup>

                {/* Estilos para Escultura */}
                <optgroup label={t('style.group_sculpture', { lng: lang })}>
                  <option value="figurative">{t('style.figurative', { lng: lang })}</option>
                  <option value="kinetic_style">{t('style.kinetic_style', { lng: lang })}</option>
                  <option value="organic_abstraction">{t('style.organic_abstraction', { lng: lang })}</option>
                  <option value="neoclassical">{t('style.neoclassical', { lng: lang })}</option>
                  <option value="assemblage">{t('style.assemblage', { lng: lang })}</option>
                </optgroup>

                {/* Estilos para Fotografía */}
                <optgroup label={t('style.group_photography', { lng: lang })}>
                  <option value="vintage">{t('style.vintage', { lng: lang })}</option>
                  <option value="conceptual_photo">{t('style.conceptual_photo', { lng: lang })}</option>
                  <option value="documentary">{t('style.documentary', { lng: lang })}</option>
                  <option value="tilt_shift">{t('style.tilt_shift', { lng: lang })}</option>
                </optgroup>

                {/* Estilos para Arte Digital */}
                <optgroup label={t('style.group_digital', { lng: lang })}>
                  <option value="vector_art">{t('style.vector_art', { lng: lang })}</option>
                  <option value="pixel_art">{t('style.pixel_art', { lng: lang })}</option>
                  <option value="cyberpunk">{t('style.cyberpunk', { lng: lang })}</option>
                  <option value="vaporwave">{t('style.vaporwave', { lng: lang })}</option>
                </optgroup>

                {/* Estilos para Arte Textil */}
                <optgroup label={t('style.group_textile', { lng: lang })}>
                  <option value="batik">{t('style.batik', { lng: lang })}</option>
                  <option value="japanese_sashiko">{t('style.japanese_sashiko', { lng: lang })}</option>
                  <option value="abstract_weaving">{t('style.abstract_weaving', { lng: lang })}</option>
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
          </div>
        </div>
      </Modalsearchhome>

    </div>
  )
}

export default Navbar2
