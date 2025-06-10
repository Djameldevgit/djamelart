import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/actions/authAction'
import { GLOBALTYPES } from '../redux/actions/globalTypes'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import Card from 'react-bootstrap/Card'
import { FaBars } from 'react-icons/fa'
import {
  Navbar,
  Container,
  NavDropdown,
  Offcanvas,
  Button,
  Dropdown,
  Badge
} from 'react-bootstrap'
import { FaUserCircle } from 'react-icons/fa'
import { BsCartFill } from 'react-icons/bs'
import NotifyModal from './NotifyModal'
import LanguageSelectorpc from './LanguageSelectorpc'
import SearchAcordion from './SearchAcordion'
 

const Navbar2 = () => {
  const { auth, theme,cart } = useSelector((state) => state)
  const dispatch = useDispatch()
  const { languageReducer } = useSelector(state => state)
  const { t } = useTranslation('navbar')
  const lang = languageReducer.language || 'en'
  const [showDrawer, setShowDrawer] = useState(false)

  const totalItems = cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;


  const openStatusModal = () => {
    dispatch({ type: GLOBALTYPES.STATUS, payload: true })
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  const toggleTheme = () => {
    dispatch({ type: GLOBALTYPES.THEME, payload: !theme })
  }

  const handleCloseDrawer = () => setShowDrawer(false)
  const handleShowDrawer = () => setShowDrawer(true)



  return (
    <div>
      <Navbar expand="lg" className="navbar bg-body-tertiary mb-2 shadow-sm px-3">
        <Container fluid className="align-items-center">
          <div className="d-flex align-items-center">
            <div className="d-block d-lg-none">
              {auth.user ? (
                <NavDropdown
                  id="user-dropdown-mobile"
                  align="start"
                  title={
                    <div className="d-flex dropdown-avatar">
                      <Avatar src={auth.user.avatar} size="medium-avatar" />
                    </div>
                  }
                >
                  <NavDropdown.Item onClick={openStatusModal}>
                    {t('addPost', { lng: lang })}
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/informacionaplicacion" onClick={handleCloseDrawer}>
                    {t('appInfo', { lng: lang })}
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/message" onClick={handleCloseDrawer}>
                    {t('adminChat', { lng: lang })}
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/administration/roles" onClick={handleCloseDrawer}>
                    {t('roles', { lng: lang })}
                  </NavDropdown.Item>
                  {auth.user.role === 'admin' && (
                    <>
                      <NavDropdown.Item as={Link} to="/administration/users/reportuser" onClick={handleCloseDrawer}>
                        {t('reportedUsers', { lng: lang })}
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/postspendientes" onClick={handleCloseDrawer}>
                        {t('pendingPosts', { lng: lang })}
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/administration/usersaction" onClick={handleCloseDrawer}>
                        {t('userActions', { lng: lang })}
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/administration/usersedicion" onClick={handleCloseDrawer}>
                        {t('userEditing', { lng: lang })}
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/administration/listadeusuariosbloqueadoss" onClick={handleCloseDrawer}>
                        {t('blockedUsers', { lng: lang })}
                      </NavDropdown.Item>
                    </>
                  )}
                  <NavDropdown.Item as={Link} to={`/profile/${auth.user._id}`} onClick={handleCloseDrawer}>
                    {t('profile', { lng: lang })}
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={toggleTheme}>
                    {theme ? t('lightMode', { lng: lang }) : t('darkMode', { lng: lang })}
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    {t('logout', { lng: lang })}
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavDropdown
                  align="start"
                  title={<FaUserCircle size={25} />}
                  id="guest-dropdown-mobile"
                >
                  <NavDropdown.Item as={Link} to="/login">
                    {t('login', { lng: lang })}
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/register">
                    {t('register', { lng: lang })}
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </div>

            <Navbar.Brand href="/" className="py-2 me-0 me-lg-3 d-none d-lg-block">
              <Card.Title>{t('appName', { lng: lang })}</Card.Title>
            </Navbar.Brand>
          </div>

          <div className="d-flex align-items-center justify-content-center gap-3">
            <div className="d-none d-lg-block ms-3">
              <LanguageSelectorpc />
            </div>


            <Dropdown
              title={
                <div className="position-relative">
                  <i className="fas fa-bell text-danger" style={{ fontSize: '1.2rem', cursor: 'pointer' }} />
                </div>
              }
            >
              <Dropdown />
    
                <span  >
                  <i className="fas fa-search"></i>
                  <span className="ml-1">
                    {t('Search', { lng: languageReducer.language })}
                  </span>
                </span>
 
            </Dropdown>

            {auth.user && (
              <NavDropdown
                title={
                  <div className="position-relative">
                    <i className="fas fa-bell text-danger" style={{ fontSize: '1.2rem', cursor: 'pointer' }} />
                  </div>
                }
              >
                <NavDropdown.Item>
                  <NotifyModal user={auth.user} />
                </NavDropdown.Item>
              </NavDropdown>
            )}

            {auth.user && (
                 <Link to="/cart/cartcarrito" className="position-relative text-decoration-none mx-2">
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

            <Button className="d-lg-none" onClick={handleShowDrawer} variant="outline-primary">
              <FaBars size={20} />
            </Button>

            <div className="d-none d-lg-block">
              {auth.user ? (
                <NavDropdown
                  id="user-dropdown"
                  align="end"
                  title={
                    <div className="d-flex dropdown-avatar">
                      <Avatar src={auth.user.avatar} size="medium-avatar" />
                    </div>
                  }
                >
                  <NavDropdown.Item onClick={openStatusModal}>
                    {t('navbar:addPost', { lng: lang })}
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/informacionaplicacion">
                    {t('navbar:appInfo', { lng: lang })}
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/message">
                    {t('navbar:adminChat', { lng: lang })}
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/rolesuser">
                    {t('navbar:rolesuser', { lng: lang })}
                  </NavDropdown.Item>
                  {auth.user.role === 'admin' && (
                    <>
                      <NavDropdown.Item as={Link} to="/users">
                        {t('navbar:users', { lng: lang })}
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/postspendientes">
                        {t('navbar:pendingPosts', { lng: lang })}
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/rolesuser">
                        {t('navbar:rorlesUsers', { lng: lang })}
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/usersaction">
                        {t('navbar:userActions', { lng: lang })}
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/usersedicion">
                        {t('navbar:userEditing', { lng: lang })}
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/administration/listadeusuariosbloqueadoss">
                        {t('navbar:blockedUsers', { lng: lang })}
                      </NavDropdown.Item>
                    </>
                  )}
                  <NavDropdown.Item as={Link} to={`/profile/${auth.user._id}`}>
                    {t('navbar:profile', { lng: lang })}
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={toggleTheme}>
                    {theme ? t('navbar:lightMode', { lng: lang }) : t('navbar:darkMode', { lng: lang })}
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    {t('navbar:logout', { lng: lang })}
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavDropdown
                  align="end"
                  title={<FaUserCircle size={25} />}
                  id="guest-dropdown-desktop"
                >
                  <NavDropdown.Item as={Link} to="/login">
                    {t('navbar:login', { lng: lang })}
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/register">
                    {t('navbar:register', { lng: lang })}
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </div>
          </div>
        </Container>
      </Navbar>

      <Offcanvas
        show={showDrawer}
        onHide={handleCloseDrawer}
        placement="start"
        style={{
          top: '56px',
          height: 'calc(100vh - 56px)',
          width: '270px'
        }}
      >
          <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-`}>
                  Offcanvas
                </Offcanvas.Title>
              </Offcanvas.Header>
        <Offcanvas.Body
          style={{
            maxHeight: 'calc(70vh - 60px)',
            overflowY: 'auto',
            padding: '0.5rem'
          }}
        >
          <SearchAcordion />
        </Offcanvas.Body>
      </Offcanvas>

    </div>


  )


}

export default Navbar2
