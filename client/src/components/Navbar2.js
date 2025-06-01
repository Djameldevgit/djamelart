import {
  Navbar,
  Nav,Card,
  Container,
  Offcanvas,
  NavDropdown
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import { logout } from '../redux/actions/authAction';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { useState } from 'react';
import LanguageSelectorpc from './LanguageSelectorpc';
import { useTranslation } from 'react-i18next';

const Navbar2 = () => {
  const dispatch = useDispatch();
  const { auth, theme, languageReducer } = useSelector(state => state);
  const { t } = useTranslation(['navbar']);
  const lang = languageReducer?.language || 'fr';
  const [showDrawer, setShowDrawer] = useState(false);

  const handleCloseDrawer = () => setShowDrawer(false);
  const handleOpenDrawer = () => setShowDrawer(true);

  const handleLogout = () => {
    dispatch(logout());
    handleCloseDrawer();
  };

  const toggleTheme = () => {
    dispatch({ type: GLOBALTYPES.THEME, payload: !theme });
    handleCloseDrawer();
  };

  const openStatusModal = () => {
    dispatch({ type: GLOBALTYPES.STATUS, payload: true });
    handleCloseDrawer();
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="mb-3">
      <Container fluid className="px-3 px-lg-4">
        <div className="d-flex w-100 align-items-center justify-content-between">
          <Navbar.Brand href="/" className="py-2 me-0 me-lg-3">
          <Card.Title> {t('navbar:appName', { lng: lang })}</Card.Title>    
          </Navbar.Brand>

          <div className="d-flex align-items-center">
            <Navbar.Toggle
              aria-controls="navbar-offcanvas"
              className="border-0 p-2 ms-auto"
              style={{ marginRight: '-8px' }}
              onClick={handleOpenDrawer}
            />
          </div>
        </div>

        <Navbar.Offcanvas
          id="offcanvasNavbar"
          show={showDrawer}
          onHide={handleCloseDrawer}
          placement="end"
          style={{
            top: '56px',
            height: 'calc(100vh - 56px)'
          }}
        > 
          <Offcanvas.Header closeButton>
            {/* Puedes dejar el título vacío o agregar algo si quieres */}
          </Offcanvas.Header>

          <Offcanvas.Body className="position-relative">
            {/* Mostrar siempre el selector de idioma en pantallas grandes */}
            <div className="d-none d-lg-block mb-3">
              <LanguageSelectorpc />
            </div>

            <Nav className="flex-grow-1 justify-content-end mt-4">
              {auth.user ? (
                <>
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

                    <NavDropdown.Item as={Link} to="/informacionaplicacion" onClick={handleCloseDrawer}>
                      {t('navbar:appInfo', { lng: lang })}
                    </NavDropdown.Item>

                    <NavDropdown.Item as={Link} to="/message" onClick={handleCloseDrawer}>
                      {t('navbar:adminChat', { lng: lang })}
                    </NavDropdown.Item>

                    <NavDropdown.Item as={Link} to="/administration/roles" onClick={handleCloseDrawer}>
                      {t('navbar:roles', { lng: lang })}
                    </NavDropdown.Item>

                    {auth.user.role === 'admin' && (
                      <>
                        <NavDropdown.Item as={Link} to="/administration/users/reportuser" onClick={handleCloseDrawer}>
                          {t('navbar:reportedUsers', { lng: lang })}
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/administration/homepostspendientes" onClick={handleCloseDrawer}>
                          {t('navbar:pendingPosts', { lng: lang })}
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/administration/usersaction" onClick={handleCloseDrawer}>
                          {t('navbar:userActions', { lng: lang })}
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/administration/usersedicion" onClick={handleCloseDrawer}>
                          {t('navbar:userEditing', { lng: lang })}
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/administration/listadeusuariosbloqueadoss" onClick={handleCloseDrawer}>
                          {t('navbar:blockedUsers', { lng: lang })}
                        </NavDropdown.Item>
                      </>
                    )}

                    <NavDropdown.Item as={Link} to={`/profile/${auth.user._id}`} onClick={handleCloseDrawer}>
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
                </>
              ) : (
                <NavDropdown
                  align="end"
                  id="guest-dropdown"
                  title={<span className="text-white">{t('navbar:account', { lng: lang })}</span>}
                >
                  <NavDropdown.Item as={Link} to="/informacionaplicacion" onClick={handleCloseDrawer}>
                    {t('navbar:appInfo', { lng: lang })}
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/login" onClick={handleCloseDrawer}>
                    {t('navbar:login', { lng: lang })}
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/register" onClick={handleCloseDrawer}>
                    {t('navbar:register', { lng: lang })}
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Navbar2;