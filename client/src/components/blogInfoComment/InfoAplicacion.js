import React, { useRef, useEffect } from "react";
import { Container, Card, Badge, Row, Col, Button } from "react-bootstrap";
import {
  PersonCircle, CheckCircleFill,
  ShieldShaded, Hourglass, FlagFill, Send, HeartFill, ChatSquareText,
  Cart, Brush, CodeSlash, Globe, Award, Lock, Unlock, ExclamationTriangleFill
} from "react-bootstrap-icons";
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import Actualizaciones from "./folder/Actualizaciones";
import Admin from "./folder/Admin";
import BlogPortafolio from "./folder/BlogPortaforlio";
import ContactoComunicacion from "./folder/ContactoComunicacion";
import IntroMarketplace from "./folder/IntroMarketplace";
import Language from "./folder/Language";
import PublicacionesInfo from "./folder/PublicacionesInfo";
import Registro from "./folder/Registro";
import Search from "./folder/Search";
import SeguridadInfo from "./folder/SeguridadInfo";

const FeatureCard = ({ icon, title, children, color = "primary" }) => (
  <Card className="h-100 border-0 shadow-sm">
    <Card.Body className="text-center p-4">
      <div
        className={`d-inline-flex align-items-center justify-content-center bg-${color}-subtle text-${color} rounded-circle mb-3`}
        style={{ width: 48, height: 48 }}
      >
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <h3 className="h5">{title}</h3>
      <p className="text-muted mb-0">{children}</p>
    </Card.Body>
  </Card>
);

const InfoAplicacion = () => {
  const { languageReducer } = useSelector(state => state);
  const { t, i18n } = useTranslation('aplicacion');

  const lang = languageReducer.language || 'en';
  if (i18n.language !== lang) i18n.changeLanguage(lang);

  // ---- Refs que coinciden con BlogInfoIndex ----
  const registroRef = useRef(null);
  const loginRef = useRef(null);
  const activarCuentaRef = useRef(null);
  const recuperarPasswordRef = useRef(null);
  const tecnologiasRef = useRef(null);
  const novedadesRef = useRef(null);
  const blogRef = useRef(null);
  const publicacionesRef = useRef(null);
 
  const location = useLocation();

  useEffect(() => {
    const target = location.state && location.state.scrollTo;
    if (!target) return;

    const map = {
      registro: registroRef,
      login: loginRef,
      activarCuenta: activarCuentaRef,
      recuperarPassword: recuperarPasswordRef,
      tecnologias: tecnologiasRef,
      novedades: novedadesRef,
      blog: blogRef,
   
publicaciones: publicacionesRef
    
    };

    const ref = map[target];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location]);

  return (
    <Container className="my-5 py-4" style={{
      direction: lang === 'ar' ? 'rtl' : 'ltr',
      textAlign: lang === 'ar' ? 'right' : 'left',
    }}>
      {/* Secciones importadas */}
      <IntroMarketplace />
      <Registro ref={registroRef} />
     
      <SeguridadInfo />
      <PublicacionesInfo ref={publicacionesRef} />
      <ContactoComunicacion />
      <Language />
      <Admin />
      <BlogPortafolio />
      <Actualizaciones />

      {/* USO DE LA APLICACIÓN */}
      <section className="mb-5">
        <h2 className="text-center mb-4 fw-bold">
          <PersonCircle className="me-2 text-primary" /> {t('access.title')}
        </h2>
        <div className="text-center mt-4">
          <p className="text-muted">
            <CheckCircleFill className="text-success me-1" /> {t('access.verification')}
          </p>
        </div>
      </section>

      {/* SEGURIDAD */}
      <section className="mb-5">
        <h2 className="text-center mb-4 fw-bold">
          <ShieldShaded className="me-2 text-primary" /> {t('security.title')}
        </h2>

        <h3 ref={activarCuentaRef} className="h5 mb-2">Activación de cuenta</h3>
        <p className="text-muted">{t('security.features.verification.description')}</p>

        <h3 ref={recuperarPasswordRef} className="h5 mt-4 mb-2">Recuperar contraseña</h3>
        <p className="text-muted mb-3">{t('security.features.appeals.description')}</p>

        <Card className="border-primary border-2 bg-primary bg-opacity-10">
          <Card.Body className="p-4">
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Hourglass className="text-warning me-2" />
                <strong>{t('security.features.verification.title')}:</strong> {t('security.features.verification.description')}
              </li>
              <li className="mb-2">
                <FlagFill className="text-danger me-2" />
                <strong>{t('security.features.reporting.title')}:</strong> {t('security.features.reporting.description')}
              </li>
              <li>
                <Send className="text-info me-2" />
                <strong>{t('security.features.appeals.title')}:</strong> {t('security.features.appeals.description')}
              </li>
            </ul>
          </Card.Body>
        </Card>
      </section>

      {/* FUNCIONALIDADES */}
      <section className="mb-5">
        <h2 className="text-center mb-4 fw-bold">
          <ChatSquareText className="me-2 text-primary" /> {t('features.title')}
        </h2>
        <Row className="g-4">
          <Col lg={3} md={6}><FeatureCard icon={<HeartFill />} title={t('features.items.likes.title')} color="danger">{t('features.items.likes.description')}</FeatureCard></Col>
          <Col lg={3} md={6}><FeatureCard icon={<Brush />} title={t('features.items.publishing.title')} color="success">{t('features.items.publishing.description')}</FeatureCard></Col>
          <Col lg={3} md={6}><FeatureCard icon={<Cart />} title={t('features.items.cart.title')} color="warning">{t('features.items.cart.description')}</FeatureCard></Col>
          <Col lg={3} md={6}><FeatureCard icon={<ChatSquareText />} title={t('features.items.chat.title')} color="info">{t('features.items.chat.description')}</FeatureCard></Col>
        </Row>
      </section>

      {/* TIPOS DE ARTE */}
      <section className="mb-5">
        <h2 className="text-center mb-4 fw-bold">
          <Brush className="me-2 text-primary" /> {t('artTypes.title')}
        </h2>
      </section>

      {/* DESARROLLO */}
      <section className="mb-5">
        <h2 className="text-center mb-4 fw-bold">
          <CodeSlash className="me-2" /> {t('technology.title')}
        </h2>

        <h3 ref={tecnologiasRef} className="h5 mb-2">Tecnologías usadas</h3>
        <p className="text-muted">{t('technology.description')}</p>

        <h3 ref={novedadesRef} className="h5 mt-4 mb-2">Novedades y actualizaciones</h3>
        <p className="text-muted mb-4">{t('features.items.chat.description')}</p>

        <Card className="bg-dark text-white overflow-hidden">
          <div className="row g-0">
            <div className="col-lg-6 p-4 p-md-5 d-flex align-items-center">
              <div>
                <div className="d-flex align-items-center mb-3">
                  <Lock size={20} className="me-2 text-success" />
                  <span>{t('technology.features.security')}</span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <Globe size={20} className="me-2 text-info" />
                  <span>{t('technology.features.translations')}</span>
                </div>
                <div className="d-flex align-items-center">
                  <Award size={20} className="me-2 text-warning" />
                  <span>{t('technology.features.moderation')}</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div className="bg-art-pattern h-100"></div>
            </div>
          </div>
        </Card>
      </section>

      {/* BLOG */}
      <section className="mb-5">
        <h2 className="text-center mb-4 fw-bold">
          Blog del artista
        </h2>
        <Card.Title ref={blogRef}>Ver blog</Card.Title>

        <h3 ref={publicacionesRef} className="h5 mb-2">Nueva publicación</h3>
        <p className="text-muted mb-4">{t('features.items.publishing.description')}</p>
      </section>

      {/* FUNDADOR */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="row g-0">
          <div className="col-md-4 bg-primary text-white d-flex align-items-center p-4">
            <div>
              <h3 className="fw-bold mb-3">{t('founder.title')}</h3>
              <p className="mb-0">{t('founder.name')}</p>
            </div>
          </div>
          <div className="col-md-8">
            <Card.Body className="p-4">
              <blockquote className="mb-4">
                <p className="lead font-italic">{t('founder.quote')}</p>
              </blockquote>
              <div className="d-flex flex-wrap gap-2">
                <Badge pill bg="light" text="dark" className="fw-normal">
                  <ExclamationTriangleFill className="me-1" /> {t('founder.badges.moderated')}
                </Badge>
                <Badge pill bg="light" text="dark" className="fw-normal">
                  <CheckCircleFill className="me-1" /> {t('founder.badges.secure')}
                </Badge>
                <Badge pill bg="light" text="dark" className="fw-normal">
                  <Unlock className="me-1" /> {t('founder.badges.noCommissions')}
                </Badge>
              </div>
            </Card.Body>
          </div>
        </div>
      </Card>

      {/* CTA */}
      <div className="text-center mt-5 pt-4">
        <h2 className="mb-4">{t('cta.title')}</h2>
        <Button as={Link} to="/register" variant="primary" size="lg" className="me-3">
          {t('cta.register')}
        </Button>
        <Button as={Link} to="/" variant="outline-primary" size="lg">
          {t('cta.gallery')}
        </Button>
      </div>
    </Container>
  );
};

export default InfoAplicacion;
