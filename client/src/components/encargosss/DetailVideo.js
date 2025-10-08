import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Badge, Spinner, Modal } from 'react-bootstrap';
import { 
  FaArrowLeft, 
  FaPlayCircle, 
  FaShare, 
  FaComments, 
  FaEnvelope, 
  FaFacebook, 
  FaInstagram, 
  FaTiktok, 
  FaTwitter,
  FaWhatsapp,
  FaLink
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import obrasData from './obrasData.json';

const DetailVideo = () => {
  const { obraId } = useParams();
  const [obra, setObra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  
  // CORREGIDO: Usa el namespace correcto
  const { t, i18n } = useTranslation('encargos');
  const { languageReducer } = useSelector(state => state);
  const lang = languageReducer?.language || 'es';

  // Efecto para cambiar idioma
  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // Buscar la obra por ID - FUNCIÓN CORREGIDA
  useEffect(() => {
    const findObra = () => {
      try {
        if (obrasData.works) {
          for (const theme of Object.keys(obrasData.works)) {
            for (const obraKey of Object.keys(obrasData.works[theme])) {
              const currentObraId = `${theme}-${obraKey}`;
              
              if (currentObraId === obraId) {
                const obraFound = obrasData.works[theme][obraKey];
                return {
                  id: currentObraId,
                  theme: theme,
                  title: obraFound.title, // Usar título directo del JSON
                  description: obraFound.description, // Usar descripción directa
                  image: obraFound.image,
                  videoUrl: obraFound.videoUrl,
                  videoDescription: obraFound.videoDescription || t('videoDescriptionDefault', 'Video demostrativo')
                };
              }
            }
          }
        }
        return null;
      } catch (err) {
        console.error('Error buscando obra:', err);
        return null;
      }
    };

    const obraEncontrada = findObra();
    
    if (obraEncontrada) {
      setObra(obraEncontrada);
    } else {
      setError(t('workNotFound', 'Obra no encontrada'));
    }
    
    setLoading(false);
  }, [obraId, lang]); // Removí 't' de las dependencias para evitar loops

  // Compartir en redes sociales
  const shareOnSocialMedia = (platform) => {
    const currentUrl = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(obra?.title || '');
    const text = encodeURIComponent(obra?.description || '');
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${currentUrl}`,
      whatsapp: `https://wa.me/?text=${title}%20${currentUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  // Compartir nativo
  const shareVideo = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: obra?.title || '',
          text: obra?.description || '',
          url: window.location.href
        });
      } catch (err) {
        console.log('Error al compartir:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t('linkCopied', 'Enlace copiado'));
    }
  };

  // Abrir chat directo
  const openChat = () => {
    const phoneNumber = "+1234567890";
    const message = t('whatsappMessage', { title: obra?.title || '' });
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Redes sociales del artista
  const artistSocialMedia = {
    tiktok: t('socialLinks.tiktok', 'https://tiktok.com/@artista'),
    instagram: t('socialLinks.instagram', 'https://instagram.com/artista'), 
    facebook: t('socialLinks.facebook', 'https://facebook.com/artista'),
    twitter: t('socialLinks.twitter', 'https://twitter.com/artista')
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">{t('loadingVideo', 'Cargando video...')}</p>
      </Container>
    );
  }

  if (error || !obra) {
    return (
      <Container className="py-5 text-center">
        <h2>⚠️ {t('workNotFoundTitle', 'Obra no encontrada')}</h2>
        <p>{t('workNotFoundDescription', 'La obra que buscas no existe o fue removida.')}</p>
        <Button as={Link} to="/djamelartgaleria" variant="primary">
          <FaArrowLeft className="me-2" />
          {t('backToGallery', 'Volver a galería')}
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{
      direction: lang === 'ar' ? 'rtl' : 'ltr',
      textAlign: lang === 'ar' ? 'right' : 'left'
    }}>
      {/* Header con navegación */}
      <Row className="mb-4">
        <Col>
          <Button 
            as={Link} 
            to="/djamelartgaleria" 
            variant="outline-primary" 
            className="mb-3"
          >
            <FaArrowLeft className="me-2" />
            {t('backToGallery', 'Volver a galería')}
          </Button>
          
          <h1 className="display-6 fw-bold text-primary">
            {obra.title} - {t('videoDemo', 'Demo de video')}
          </h1>
          <p className="lead text-muted">{obra.description}</p>
        </Col>
      </Row>

      {/* Video Player */}
      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <Card className="shadow-lg">
            <Card.Body className="p-0">
              <div className="video-container">
                <video 
                  controls 
                  autoPlay={false}
                  preload="metadata"
                  style={{ width: '100%', maxHeight: '70vh' }}
                  poster={obra.image}
                >
                  <source src={obra.videoUrl} type="video/mp4" />
                  <track
                    kind="captions"
                    srcLang={lang}
                    label={t('language')}
                  />
                  {t('browserNotSupported')}
                </video>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Botones de Acción Principal */}
      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <Button 
              variant="success" 
              size="lg"
              onClick={openChat}
              className="me-md-2 mb-2"
            >
              <FaComments className="me-2" />
              {t('chatWithArtist')}
            </Button>
            
            <Button 
              as={Link}
              to="/contacto"
              state={{ obraSeleccionada: obra }}
              variant="primary" 
              size="lg"
              className="me-md-2 mb-2"
            >
              <FaEnvelope className="me-2" />
              {t('requestOrder')}
            </Button>
            
            <Button 
              variant="info" 
              size="lg"
              onClick={() => setShowSocialModal(true)}
              className="mb-2"
            >
              <FaShare className="me-2" />
              {t('shareVideo')}
            </Button>
          </div>
        </Col>
      </Row>

      {/* Información del Video */}
      <Row>
        <Col lg={8} className="mx-auto">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <Badge bg="primary" className="me-2">
                    {t(`themes.${obra.theme}`, { defaultValue: obra.theme })}
                  </Badge>
                  <Badge bg="secondary">
                    {t('techniques.oil', { defaultValue: "Óleo sobre lienzo" })}
                  </Badge>
                </div>
              </div>

              <h5>🎬 {t('videoDemoTitle')}</h5>
              <p className="text-muted">
                {obra.videoDescription}
              </p>

              <div className="mt-4">
                <h6>📋 {t('technicalDetails')}</h6>
                <ul className="list-unstyled">
                  <li><strong>{t('duration')}:</strong> 30 {t('seconds')}</li>
                  <li><strong>{t('format')}:</strong> MP4 HD</li>
                  <li><strong>{t('technique')}:</strong> {t('techniques.oil', { defaultValue: "Óleo sobre lienzo" })}</li>
                  <li><strong>{t('category')}:</strong> {t(`themes.${obra.theme}`, { defaultValue: obra.theme })}</li>
                </ul>
              </div>

              {/* Redes Sociales del Artista */}
              <Card className="mt-4 bg-light">
                <Card.Body>
                  <h6>👨‍🎨 {t('followArtist')}</h6>
                  <div className="d-flex gap-2 flex-wrap mt-3">
                    <Button 
                      variant="outline-dark" 
                      size="sm"
                      href={artistSocialMedia.tiktok}
                      target="_blank"
                    >
                      <FaTiktok className="me-1" />
                      TikTok
                    </Button>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      href={artistSocialMedia.facebook}
                      target="_blank"
                    >
                      <FaFacebook className="me-1" />
                      Facebook
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      href={artistSocialMedia.instagram}
                      target="_blank"
                    >
                      <FaInstagram className="me-1" />
                      Instagram
                    </Button>
                    <Button 
                      variant="outline-info" 
                      size="sm"
                      href={artistSocialMedia.twitter}
                      target="_blank"
                    >
                      <FaTwitter className="me-1" />
                      Twitter
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para Compartir en Redes Sociales */}
      <Modal show={showSocialModal} onHide={() => setShowSocialModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('shareVideo')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-3">{t('shareDescription')}</p>
          
          <div className="row g-2">
            <div className="col-6">
              <Button 
                variant="outline-primary" 
                className="w-100 d-flex align-items-center justify-content-center"
                onClick={() => shareOnSocialMedia('facebook')}
              >
                <FaFacebook className="me-2" />
                Facebook
              </Button>
            </div>
            <div className="col-6">
              <Button 
                variant="outline-info" 
                className="w-100 d-flex align-items-center justify-content-center"
                onClick={() => shareOnSocialMedia('twitter')}
              >
                <FaTwitter className="me-2" />
                Twitter
              </Button>
            </div>
            <div className="col-6">
              <Button 
                variant="outline-success" 
                className="w-100 d-flex align-items-center justify-content-center"
                onClick={() => shareOnSocialMedia('whatsapp')}
              >
                <FaWhatsapp className="me-2" />
                WhatsApp
              </Button>
            </div>
            <div className="col-6">
              <Button 
                variant="outline-secondary" 
                className="w-100 d-flex align-items-center justify-content-center"
                onClick={shareVideo}
              >
                <FaLink className="me-2" />
                {t('copyLink')}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal de Chat con Artista */}
      <Modal show={showChatModal} onHide={() => setShowChatModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>💬 {t('chatWithArtist')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('chatDescription')}</p>
          <div className="d-grid gap-2">
            <Button 
              variant="success" 
              onClick={openChat}
              className="d-flex align-items-center justify-content-center"
            >
              <FaWhatsapp className="me-2" />
              {t('whatsappDirect')}
            </Button>
            <Button 
              variant="primary" 
              as={Link}
              to="/contacto"
              state={{ obraSeleccionada: obra }}
              className="d-flex align-items-center justify-content-center"
            >
              <FaEnvelope className="me-2" />
              {t('contactForm')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Estilos */}
      <style>
        {`
          .video-container {
            position: relative;
            background: #000;
          }
          
          video {
            border-radius: 8px 8px 0 0;
          }
          
          @media (max-width: 768px) {
            .video-container video {
              max-height: 50vh;
            }
            
            .d-md-flex {
              flex-direction: column;
            }
          }
        `}
      </style>
    </Container>
  );
};

export default DetailVideo;