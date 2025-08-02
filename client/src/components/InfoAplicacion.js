import React from "react";
import { 
  Container, 
  Card, 
  ListGroup,
  Badge,
  Row,
  Col,
  Button
} from "react-bootstrap";
import { 
  Palette,
  PersonCircle,
  Facebook,
  Google,
  EnvelopeFill,
  CheckCircleFill,
  ShieldShaded,
  Hourglass,
  FlagFill,
  Send,
  HeartFill,
  ChatSquareText,
  Cart,
  Brush,
  Easel,
  Camera,
  Scissors,
  CodeSlash,
  Globe,
  Award,
  Lock,
  Unlock,
  ExclamationTriangleFill
} from "react-bootstrap-icons";
import { useTranslation } from 'react-i18next';

const FeatureCard = ({ icon, title, children, color = "primary" }) => (
  <Card className="h-100 border-0 shadow-sm">
    <Card.Body className="text-center p-4">
      <div className={`icon-lg bg-${color}-subtle text-${color} rounded-circle mb-3 mx-auto`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <h3 className="h5">{title}</h3>
      <p className="text-muted mb-0">{children}</p>
    </Card.Body>
  </Card>
);

const InfoAplicacion = () => {
  const { t } = useTranslation('aplicacion');
  
  return (
    <Container className="my-5 py-4">
      {/* Hero Section */}
      <section className="text-center mb-5 px-3">
        <Badge pill bg="primary" className="mb-3 fw-normal">
          <Palette className="me-1" /> {t('hero.badge')}
        </Badge>
        <h1 className="display-4 fw-bold mb-3">
          {t('hero.title')} <span className="text-primary">{t('hero.titleHighlight1')}</span> {t('hero.and')} <span className="text-primary">{t('hero.titleHighlight2')}</span>
        </h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
          {t('hero.subtitle')}
        </p>
      </section>

      {/* Access Section */}
      <section className="mb-5">
        <h2 className="text-center mb-4 fw-bold">
          <PersonCircle className="me-2 text-primary" />
          {t('access.title')}
        </h2>
        <Row className="g-4">
          <Col md={4}>
            <FeatureCard 
              icon={<Facebook />} 
              title={t('access.methods.facebook.title')} 
              color="primary"
            >
              {t('access.methods.facebook.description')}
            </FeatureCard>
          </Col>
          <Col md={4}>
            <FeatureCard 
              icon={<Google />} 
              title={t('access.methods.google.title')} 
              color="danger"
            >
              {t('access.methods.google.description')}
            </FeatureCard>
          </Col>
          <Col md={4}>
            <FeatureCard 
              icon={<EnvelopeFill />} 
              title={t('access.methods.email.title')} 
              color="success"
            >
              {t('access.methods.email.description')}
            </FeatureCard>
          </Col>
        </Row>
        <div className="text-center mt-4">
          <p className="text-muted">
            <CheckCircleFill className="text-success me-1" />
            {t('access.verification')}
          </p>
        </div>
      </section>

      {/* Security Section */}
      <Card className="mb-5 border-primary border-2 bg-primary bg-opacity-10">
        <Card.Body className="p-4">
          <div className="d-flex align-items-start">
            <ShieldShaded size={32} className="text-primary me-3 mt-1" />
            <div>
              <h2 className="h4 mb-3">{t('security.title')}</h2>
              <ul className="list-unstyled">
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
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Features Section */}
      <section className="mb-5">
        <h2 className="text-center mb-4 fw-bold">
          <ChatSquareText className="me-2 text-primary" />
          {t('features.title')}
        </h2>
        <Row className="g-4">
          <Col lg={3} md={6}>
            <FeatureCard 
              icon={<HeartFill />} 
              title={t('features.items.likes.title')} 
              color="danger"
            >
              {t('features.items.likes.description')}
            </FeatureCard>
          </Col>
          <Col lg={3} md={6}>
            <FeatureCard 
              icon={<Brush />} 
              title={t('features.items.publishing.title')} 
              color="success"
            >
              {t('features.items.publishing.description')}
            </FeatureCard>
          </Col>
          <Col lg={3} md={6}>
            <FeatureCard 
              icon={<Cart />} 
              title={t('features.items.cart.title')} 
              color="warning"
            >
              {t('features.items.cart.description')}
            </FeatureCard>
          </Col>
          <Col lg={3} md={6}>
            <FeatureCard 
              icon={<ChatSquareText />} 
              title={t('features.items.chat.title')} 
              color="info"
            >
              {t('features.items.chat.description')}
            </FeatureCard>
          </Col>
        </Row>
      </section>

      {/* Art Types Section */}
      <section className="mb-5">
        <h2 className="text-center mb-4 fw-bold">
          <Brush className="me-2 text-primary" />
          {t('artTypes.title')}
        </h2>
  
      </section>

      {/* Technology Section */}
      <Card className="mb-5 bg-dark text-white overflow-hidden">
        <div className="row g-0">
          <div className="col-lg-6 p-4 p-md-5 d-flex align-items-center">
            <div>
              <h2 className="display-5 fw-bold mb-4">
                <CodeSlash className="me-2" />
                {t('technology.title')}
              </h2>
              <p className="lead mb-4">
                {t('technology.description')}
              </p>
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

      {/* Founder Section */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="row g-0">
          <div className="col-md-4 bg-primary text-white d-flex align-items-center p-4">
            <div>
              <h3 className="fw-bold mb-3">{t('founder.title')}</h3>
              <p className="mb-0">
                {t('founder.name')}
              </p>
            </div>
          </div>
          <div className="col-md-8">
            <Card.Body className="p-4">
              <blockquote className="mb-4">
                <p className="lead font-italic">
                  {t('founder.quote')}
                </p>
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

      {/* Call to Action */}
      <div className="text-center mt-5 pt-4">
        <h2 className="mb-4">{t('cta.title')}</h2>
        <Button variant="primary" size="lg" className="me-3">
          {t('cta.register')}
        </Button>
        <Button variant="outline-primary" size="lg">
          {t('cta.gallery')}
        </Button>
      </div>
    </Container>
  );
};

export default InfoAplicacion;