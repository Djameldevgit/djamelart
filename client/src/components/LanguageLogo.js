import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const LanguageLogo = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <img src="/logo.png" alt="Logo" width="40" />
        </Navbar.Brand>
        <Nav className="ms-auto">
          <NavDropdown title="🌐 Language" id="language-selector">
            <NavDropdown.Item onClick={() => changeLanguage('en')}>
              🇬🇧 English
            </NavDropdown.Item>
            <NavDropdown.Item onClick={() => changeLanguage('es')}>
              🇪🇸 Español
            </NavDropdown.Item>
            <NavDropdown.Item onClick={() => changeLanguage('fr')}>
              🇫🇷 Français
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default LanguageLogo;
