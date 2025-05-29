import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Container, Nav, Offcanvas, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import { logout } from '../redux/actions/authAction';
import LanguageSelectorpc from './LanguageSelectorpc';
import Avatar from './Avatar';

const Navbar2 = () => {
  const { auth, theme } = useSelector((state) => state);
  const { languageReducer } = useSelector(state => state);
  const dispatch = useDispatch();
  const { t: tAplicacion } = useTranslation('aplicacion');

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  return (
    <Navbar expand="md">
      <Container fluid>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          {tAplicacion('art_painting', { lng: languageReducer.language })}
        </Navbar.Brand>

        <Navbar.Toggle onClick={handleShow} />

        {auth.user && (
          <div className="d-none d-md-flex align-items-center gap-2 ms-md-auto">
            <LanguageSelectorpc />
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" id="dropdown-avatar-desktop" className="p-0">
                <Avatar src={auth.user.avatar} size="medium-avatar" />
              </Dropdown.Toggle>
              <Dropdown.Menu align="end" className="text-center">
                <Dropdown.Item onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: true })}>
                  Ajouter un annonce
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/informacionaplicacion">
                  Info aplicación
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/message">
                  Chat administración
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/administration/roles">
                  Roles
                </Dropdown.Item>

                {auth.user.role === 'admin' && (
                  <>
                    <Dropdown.Item as={Link} to="/administration/users/reportuser">
                      Reports user
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/administration/homepostspendientes">
                      Posts pendientes
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/administration/usersaction">
                      Usuarios acción
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/administration/usersedicion">
                      Edición de usuarios
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/administration/listadeusuariosbloqueadoss">
                      Usuarios bloqueados
                    </Dropdown.Item>
                  </>
                )}

                <Dropdown.Item as={Link} to={`/profile/${auth.user._id}`}>
                  Profile
                </Dropdown.Item>

                <Dropdown.Item onClick={() => dispatch({ type: GLOBALTYPES.THEME, payload: !theme })}>
                  Cambiar Tema
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item as={Link} to="/" onClick={() => dispatch(logout())}>
                  Desconexión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}

        <Navbar.Offcanvas
          show={showOffcanvas}
          onHide={handleClose}
          id="offcanvasNavbar-expand-md"
          aria-labelledby="offcanvasNavbarLabel-expand-md"
          placement="start"
          style={{ top: '56px', height: 'calc(100% - 56px)' }}
          className="custom-offcanvas"
        >
          <Offcanvas.Body>
            {/* Ícono ❌ de cierre arriba derecha */}
            <div className="text-end">
              <span
                onClick={handleClose}
                style={{
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                }}
              >
              &times;
              </span>
            </div>

            <Nav className="flex-column w-100 gap-3">
              <div className="d-flex d-md-none flex-column">
                <LanguageSelectorpc />
                {auth.user ? (
                  <>
                    <Nav.Link onClick={() => { dispatch({ type: GLOBALTYPES.STATUS, payload: true }); handleClose(); }}>
                      Ajouter un annonce
                    </Nav.Link>
                    <Nav.Link as={Link} to="/informacionaplicacion" onClick={handleClose}>
                      Info aplicación
                    </Nav.Link>
                    <Nav.Link as={Link} to="/message" onClick={handleClose}>
                      Chat administración
                    </Nav.Link>
                    <Nav.Link as={Link} to="/administration/roles" onClick={handleClose}>
                      Roles
                    </Nav.Link>

                    {auth.user.role === 'admin' && (
                      <>
                        <Nav.Link as={Link} to="/administration/users/reportuser" onClick={handleClose}>
                          Reports user
                        </Nav.Link>
                        <Nav.Link as={Link} to="/administration/homepostspendientes" onClick={handleClose}>
                          Posts pendientes
                        </Nav.Link>
                        <Nav.Link as={Link} to="/administration/usersaction" onClick={handleClose}>
                          Usuarios acción
                        </Nav.Link>
                        <Nav.Link as={Link} to="/administration/usersedicion" onClick={handleClose}>
                          Edición de usuarios
                        </Nav.Link>
                        <Nav.Link as={Link} to="/administration/listadeusuariosbloqueadoss" onClick={handleClose}>
                          Usuarios bloqueados
                        </Nav.Link>
                      </>
                    )}

                    <Nav.Link as={Link} to={`/profile/${auth.user._id}`} onClick={handleClose}>
                      Profile
                    </Nav.Link>

                    <Nav.Link onClick={() => { dispatch({ type: GLOBALTYPES.THEME, payload: !theme }); handleClose(); }}>
                      Cambiar Tema
                    </Nav.Link>

                    <hr />

                    <Nav.Link as={Link} to="/" onClick={() => { dispatch(logout()); handleClose(); }}>
                      Desconexión
                    </Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/informacionaplicacion" onClick={handleClose}>
                      Info aplicación
                    </Nav.Link>
                    <Nav.Link as={Link} to="/login" onClick={handleClose}>
                      Se connecter
                    </Nav.Link>
                    <hr />
                    <Nav.Link as={Link} to="/register" onClick={handleClose}>
                      S'inscrire
                    </Nav.Link>
                  </>
                )}
              </div>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Navbar2;
