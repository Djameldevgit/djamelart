import React, { useState, useEffect } from 'react';
import { useParams,   Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Badge, Spinner } from 'react-bootstrap';
import { FaArrowLeft, FaPlay, FaDownload, FaShare } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

// Importar el mismo JSON de obras
import obrasData from './obrasData.json';

const DetailVideo = () => {
  const { obraId } = useParams();
 
  const [obra, setObra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { t, i18n } = useTranslation('galeria');
  const { languageReducer } = useSelector(state => state);
  const lang = languageReducer?.language || 'es';

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // Buscar la obra por ID
  useEffect(() => {
    const findObra = () => {
      try {
        if (obrasData.works) {
          // Buscar en todas las categorías
          for (const theme of Object.keys(obrasData.works)) {
            for (const obraKey of Object.keys(obrasData.works[theme])) {
              const currentObraId = `${theme}-${obraKey}`;
              
              if (currentObraId === obraId) {
                const obraFound = obrasData.works[theme][obraKey];
                return {
                  id: currentObraId,
                  theme: theme,
                  title: t(`works.${theme}.${obraKey}.title`, { defaultValue: obraFound.title }),
                  description: t(`works.${theme}.${obraKey}.description`, { defaultValue: obraFound.description }),
                  image: obraFound.image,
                  videoUrl: obraFound.videoUrl,
                  videoDescription: obraFound.videoDescription || 'Video demostrativo de la obra'
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
      setError('Obra no encontrada');
    }
    
    setLoading(false);
  }, [obraId, t, lang]);

  // Función para compartir
  const shareVideo = () => {
    if (navigator.share) {
      navigator.share({
        title: obra.title,
        text: obra.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando video...</p>
      </Container>
    );
  }

  if (error || !obra) {
    return (
      <Container className="py-5 text-center">
        <h2>⚠️ Obra no encontrada</h2>
        <p>La obra que buscas no existe o ha sido removida.</p>
        <Button as={Link} to="/galeria" variant="primary">
          <FaArrowLeft className="me-2" />
          Volver a la Galería
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
            to="/galeria" 
            variant="outline-primary" 
            className="mb-3"
          >
            <FaArrowLeft className="me-2" />
            {t('backToGallery')}
          </Button>
          
          <h1 className="display-6 fw-bold text-primary">
            {obra.title}
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
                    srcLang="es"
                    label="Spanish"
                  />
                  Tu navegador no soporta el elemento video.
                </video>
              </div>
            </Card.Body>
          </Card>
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
                
                <div>
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    className="me-2"
                    onClick={shareVideo}
                  >
                    <FaShare className="me-1" />
                    Compartir
                  </Button>
                </div>
              </div>

              <h5>🎬 Demostración en Video</h5>
              <p className="text-muted">
                {obra.videoDescription || "Video demostrativo del proceso creativo de esta obra."}
              </p>

              <div className="mt-4">
                <h6>📋 Detalles Técnicos</h6>
                <ul className="list-unstyled">
                  <li><strong>Duración:</strong> 30 segundos</li>
                  <li><strong>Formato:</strong> MP4 HD</li>
                  <li><strong>Técnica:</strong> {t('techniques.oil', { defaultValue: "Óleo sobre lienzo" })}</li>
                  <li><strong>Categoría:</strong> {t(`themes.${obra.theme}`, { defaultValue: obra.theme })}</li>
                </ul>
              </div>

              {/* Llamada a la acción */}
              <Card className="mt-3 bg-light">
                <Card.Body>
                  <h6>💡 ¿Te gustó esta obra?</h6>
                  <p className="mb-2">
                    Puedes solicitar una obra similar o personalizada basada en este estilo.
                  </p>
                  <Button variant="success" size="sm">
                    Solicitar Obra Personalizada
                  </Button>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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
          }
        `}
      </style>
    </Container>
  );
};

export default DetailVideo;