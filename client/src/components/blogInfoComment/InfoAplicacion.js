import React, { useRef, useEffect } from "react";
import { Nav, Form, Button, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';

// Importar todos los componentes
import IntroMarketplace from "./folder/IntroMarketplace";
import Registro from "./folder/Registro";
import SeguridadInfo from "./folder/SeguridadInfo";
import PublicacionesInfo from "./folder/PublicacionesInfo";
import Search from "./folder/Search";
import ContactoComunicacion from "./folder/ContactoComunicacion";
import Language from "./folder/Language";
import Admin from "./folder/Admin";
import Actualizaciones from "./folder/Actualizaciones";
import BlogPortafolio from "./folder/BlogPortaforlio";

// JSON de traducción en árabe


const InfoAplicacion = () => {
  const { languageReducer } = useSelector(state => state);
  const lang = languageReducer.language || "es";
  const { t, i18n } = useTranslation("info");
  const location = useLocation();

  // Cargar traducciones árabes si no están ya cargadas
  useEffect(() => {
    if (!i18n.hasResourceBundle('ar', 'info')) {
      i18n.addResourceBundle('ar', 'info', arabicTranslations.info);
    }
  }, [i18n]);

  // Refs para cada sección
  const introRef = useRef(null);
  const registroRef = useRef(null);
  const seguridadRef = useRef(null);
  const publicacionesRef = useRef(null);
  const searchRef = useRef(null);
  const contactoRef = useRef(null);
  const languageRef = useRef(null);
  const adminRef = useRef(null);
  const blogRef = useRef(null);
  const actualizacionesRef = useRef(null);
  const tecnologiasRef = useRef(null);

  // Mapeo de secciones a refs
  const sectionRefs = {
    intro: introRef,
    registro: registroRef,
    seguridadInfo: seguridadRef,
    publicaciones: publicacionesRef,
    busqueda: searchRef,
    contacto: contactoRef,
    lenguaje: languageRef,
    admin: adminRef,
    blog: blogRef,
    actualizaciones: actualizacionesRef,
    tecnologias: tecnologiasRef,


  };

  // useEffect para manejar el scroll automático
  useEffect(() => {
    const scrollTarget = location.state?.scrollTo;

    if (scrollTarget && sectionRefs[scrollTarget]?.current) {
      setTimeout(() => {
        sectionRefs[scrollTarget].current.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 100);
    }
  }, [location, sectionRefs]);

  // Función para scroll manual
  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  // Aplicar estilos RTL si el idioma es árabe
  const isRTL = lang === "ar";

  return (
    <div   >
      <Container className="my-4 mt-4" dir={isRTL ? "rtl" : "ltr"}  >
 
        <Form className="bg-light p-3 rounded shadow-sm mb-4">
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">
              {t("navegacionRapida", { lng: lang })}
            </Form.Label>
            <Nav className="flex-column">
              <Nav.Item className="mb-2">
                <Button
                  variant="outline-primary"
                  className="w-100 text-start"
                  onClick={() => scrollToSection(introRef)}

                >
                  📋 {t("introMarketplace", { lng: lang })}
                </Button>
              </Nav.Item>

              <Nav.Item className="mb-2">
                <Button
                  variant="outline-primary"
                  className="w-100 text-start"
                  onClick={() => scrollToSection(registroRef)}
                >
                  👤 {t("registroo", { lng: lang })}
                </Button>
              </Nav.Item>

              <Nav.Item className="mb-2">
                <Button
                  variant="outline-primary"
                  className="w-100 text-start"
                  onClick={() => scrollToSection(seguridadRef)}
                >
                  🔒 {t("seguridad", { lng: lang })}
                </Button>
              </Nav.Item>

              <Nav.Item className="mb-2">
                <Button
                  variant="outline-primary"
                  className="w-100 text-start"
                  onClick={() => scrollToSection(publicacionesRef)}
                >
                  📝 {t("publicaciones", { lng: lang })}
                </Button>
              </Nav.Item>

              <Nav.Item className="mb-2">
                <Button
                  variant="outline-primary"
                  className="w-100 text-start"
                  onClick={() => scrollToSection(searchRef)}
                >
                  🔍 {t("busqueda", { lng: lang })}
                </Button>
              </Nav.Item>

              <Nav.Item className="mb-2">
                <Button
                  variant="outline-primary"
                  className="w-100 text-start"
                  onClick={() => scrollToSection(contactoRef)}
                >
                  📞 {t("contacto", { lng: lang })}
                </Button>
              </Nav.Item>

              <Nav.Item className="mb-2">
                <Button
                  variant="outline-primary"
                  className="w-100 text-start"
                  onClick={() => scrollToSection(languageRef)}
                >
                  🌐 {t("idioma", { lng: lang })}
                </Button>
              </Nav.Item>

              <Nav.Item className="mb-2">
                <Button
                  variant="outline-primary"
                  className="w-100 text-start"
                  onClick={() => scrollToSection(adminRef)}
                >
                  ⚙️ {t("administracion", { lng: lang })}
                </Button>
              </Nav.Item>

              <Nav.Item className="mb-2">
                <Button
                  variant="outline-primary"
                  className="w-100 text-start"
                  onClick={() => scrollToSection(blogRef)}
                >
                  📰 {t("blogPortafolio", { lng: lang })}
                </Button>
              </Nav.Item>

              <Nav.Item className="mb-2">
                <Button
                  variant="outline-primary"
                  className="w-100 text-start"
                  onClick={() => scrollToSection(actualizacionesRef)}
                >
                  🔄 {t("actualizaciones", { lng: lang })}
                </Button>
              </Nav.Item>

              <Nav.Item className="mb-2">
                <Button
                  variant="outline-primary"
                  className="w-100 text-start"
                  onClick={() => scrollToSection(tecnologiasRef)}
                >
                  💻 {t("tecnologiass", { lng: lang })}
                </Button>
              </Nav.Item>
            </Nav>
          </Form.Group>
        </Form>

        {/* Secciones con refs */}
        <div ref={introRef}>
          <IntroMarketplace />
        </div>

        <div ref={registroRef}>
          <Registro />
        </div>

        <div ref={seguridadRef}>
          <SeguridadInfo />
        </div>

        <div ref={publicacionesRef}>
          <PublicacionesInfo />
        </div>

        <div ref={searchRef}>
          <Search />
        </div>

        <div ref={contactoRef}>
          <ContactoComunicacion />
        </div>

        <div ref={languageRef}>
          <Language />
        </div>

        <div ref={adminRef}>
          <Admin />
        </div>

        <div ref={blogRef}>
          <BlogPortafolio />
        </div>

        <div ref={actualizacionesRef}>
          <Actualizaciones />
        </div>

        <div ref={tecnologiasRef}>
          <div className="card mt-4">
            <div className="card-body">
              <h3 className="card-title">💻 {t("tecnologiasTitulo", { lng: lang })}</h3>
              <p className="card-text">
                {t("tecnologiasDescripcion", { lng: lang })}
              </p>
              <ul>
                <li>React.js</li>
                <li>React Bootstrap</li>
                <li>React Router</li>
                <li>React i18next</li>
                <li>Redux</li>
                <li>Node.js</li>
                <li>Express</li>
                <li>MongoDB</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
      
      </div>
  );
};

export default InfoAplicacion;