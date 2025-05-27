import { GLOBALTYPES } from '../redux/actions/globalTypes';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Nav, Container, Offcanvas, Dropdown } from 'react-bootstrap';
import Avatar from './Avatar';
import { logout } from '../redux/actions/authAction';

//import NotifyModal from './NotifyModal';<NotifyModal />
import { useTranslation } from 'react-i18next';
import LanguageSelectorpc from './LanguageSelectorpc';

const Navbar2 = () => {
  const { auth, theme } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { languageReducer } = useSelector(state => state);
 
   const { t: tAplicacion } = useTranslation('aplicacion');
  return (
    
    <Navbar expand="md" className="bg-body-tertiary mb-3">
      <Container fluid>
        <Navbar.Brand href="/" className="d-flex align-items-center">
     
       
        {tAplicacion('art_painting', { lng: languageReducer.language })}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="offcanvasNavbar-expand-md" />

  
                      <Dropdown.Item onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: true })}>
                        Ajouter un annonce
                      </Dropdown.Item>
                   
        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-md"
          aria-labelledby="offcanvasNavbarLabel-expand-md"
          placement="start"
          style={{ top: '56px', height: 'calc(100% - 56px)' }} // Ajuste altura offcanvas
          className="custom-offcanvas"
        >


          <Offcanvas.Body>
            <Nav className="flex-column flex-md-row align-items-start align-items-md-center w-100 gap-3 justify-content-md-end">



              <div className="d-none d-md-flex align-items-center gap-2 ms-md-auto">
                <LanguageSelectorpc />
                {auth.user ? (
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="link" id="dropdown-avatar" className="p-0">
                      <Avatar src={auth.user.avatar} size="medium-avatar" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end" className="w-100 text-center">
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
                ) : (
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="link" id="dropdown-user" className="p-0">
                      <i className="fas fa-user user-icon" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end">
                      <Dropdown.Item as={Link} to="/informacionaplicacion">
                        Info aplicación
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/login">
                        Se connecter
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item as={Link} to="/register">
                        S'inscrire
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
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
