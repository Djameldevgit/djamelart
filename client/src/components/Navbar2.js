
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/actions/authAction'
import { GLOBALTYPES } from '../redux/actions/globalTypes'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import Card from 'react-bootstrap/Card'
import { FaBars, FaSignOutAlt, FaUserCircle, FaSignInAlt, FaUserPlus } from 'react-icons/fa'
import {
  Navbar,
  Container,
  NavDropdown,
  Offcanvas,
  Button,

  Badge
} from 'react-bootstrap'
import { BsCartFill } from 'react-icons/bs'
import NotifyModal from './NotifyModal'
import LanguageSelectorpc from './LanguageSelectorpc'
import Acordion from './Acordion'
//import ActivateButton from '../auth/ActivateButton'

const Navbar2 = () => {
  const { auth, theme, cart } = useSelector((state) => state)
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
    handleCloseDrawer()
  }

  const toggleTheme = () => {
    dispatch({ type: GLOBALTYPES.THEME, payload: !theme })
  }

  const handleCloseDrawer = () => setShowDrawer(false)
  const handleShowDrawer = () => setShowDrawer(true)

  return (
    <div>
      <Navbar expand="lg" className="navbar bg-body-tertiary mb-2 shadow-sm px-3">
        <Container fluid className="align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Button onClick={handleShowDrawer} variant="outline-primary" className="me-2">
              {showDrawer ? '✖' : <FaBars size={20} />}
            </Button>
            <Navbar.Brand href="/" className="py-2 d-none d-lg-block">
              <Card.Title>{t('appName', { lng: lang })}</Card.Title>
            </Navbar.Brand>

          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="d-none d-lg-block">
              <LanguageSelectorpc />
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
              title={auth.user ? (
                <div className="d-flex dropdown-avatar">
                  <Avatar src={auth.user.avatar} size="medium-avatar" />
                </div>
              ) : (
                <FaUserCircle size={25} />
              )}
              id="nav-user-dropdown"
            >
              {auth.user ? (
                <>
                  <NavDropdown.Item onClick={openStatusModal}>{t('addPost', { lng: lang })}</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/informacionaplicacion">{t('appInfo', { lng: lang })}</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/message">{t('adminChat', { lng: lang })}</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/rolesuser">{t('roles', { lng: lang })}</NavDropdown.Item>
                  {auth.user.role === 'admin' && (
                    <>
                      <NavDropdown.Item as={Link} to="/users/adminsendemail">send email admin</NavDropdown.Item>


                      <NavDropdown.Item as={Link} to="/users/userss">{t('users', { lng: lang })}</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/postspendientes">{t('pendingPosts', { lng: lang })}</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/users/usersaction">users action</NavDropdown.Item>

                      <NavDropdown.Item as={Link} to="/users/bloqueos">obtener users bloqueados</NavDropdown.Item>

                      <NavDropdown.Item as={Link} to="/cart/orderss">{t('orders', { lng: lang })}</NavDropdown.Item>
                    </>
                  )}
                  <NavDropdown.Item as={Link} to={`/profile/${auth.user._id}`}>{t('profile', { lng: lang })}</NavDropdown.Item>
                  <NavDropdown.Item onClick={toggleTheme}>{theme ? t('lightMode', { lng: lang }) : t('darkMode', { lng: lang })}</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>{t('logout', { lng: lang })}</NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Item as={Link} to="/login">{t('login', { lng: lang })}</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/register">{t('register', { lng: lang })}</NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          </div>
        </Container>
      </Navbar>

      {/* Drawer (Offcanvas) que aparece en cualquier tamaño de pantalla */}
      <Offcanvas
        show={showDrawer}
        onHide={handleCloseDrawer}
        placement="start"
        style={{ top: '56px', height: 'calc(100vh - 56px)', width: '270px' }}
      >
        <Offcanvas.Header closeButton>

        </Offcanvas.Header>

        <Offcanvas.Body style={{ overflowY: 'auto', padding: '0.5rem' }}>
          {/* Mostrar login/register o cuenta según autenticación (solo móviles) */}
          <div className="d-lg-none mb-3">
            {!auth.user ? (
              <div className="text-center">
                <Link to="/login" onClick={handleCloseDrawer} className="btn btn-outline-primary w-100 mb-2">
                  <FaSignInAlt className="me-2" /> {t('login', { lng: lang })}
                </Link>
                <Link to="/register" onClick={handleCloseDrawer} className="btn btn-outline-secondary w-100">
                  <FaUserPlus className="me-2" /> {t('register', { lng: lang })}
                </Link>
              </div>
            ) : (
              <div className="">
                <h6 className=""> </h6>
                <Link to={`/profile/${auth.user._id}`} onClick={handleCloseDrawer} className="btn btn-outline-success w-100 my-2">
                  <FaUserCircle className="me-2" /> {t('profile', { lng: lang })}
                </Link>
                <Button variant="outline-danger" onClick={handleLogout} className="w-100">
                  <FaSignOutAlt className="me-2" /> {t('logout', { lng: lang })}
                </Button>
              </div>
            )}
          </div>

          <Acordion />
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}

export default Navbar2;