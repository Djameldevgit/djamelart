import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  ListGroup, 
  Badge,
  Button
} from 'react-bootstrap';

const DescriptionPostPage = ({ post }) => {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('postDetail');
  const [readMore, setReadMore] = useState(false);
  const lang = languageReducer.language || 'en';

  // Función para renderizar cada item de metadata
  const renderMetadataItem = (icon, label, value, condition = true, isDescription = false) => {
    if (!condition || !value) return null;

    if (isDescription) {
      return (
        <ListGroup.Item className="border-0 px-0 py-3">
          <Row className="align-items-start">
            <Col xs={12} className="d-flex align-items-start">
              <div className="d-flex align-items-center me-3" style={{ minWidth: '120px' }}>
                <i className={`${icon} me-2 text-primary`}></i>
                <strong className="metadata-label">{label}:</strong>
              </div>
              <div className="metadata-value flex-grow-1">
                <div className="card-body-content">
                  <span>
                    {value.length < 60
                      ? value
                      : readMore ? value + ' ' : value.slice(0, 60) + '.....'}
                  </span>
                  {value.length > 60 && (
                    <Button 
                      variant="link" 
                      className="read-more-btn p-0 ms-2 text-decoration-none"
                      onClick={() => setReadMore(!readMore)}
                    >
                      {readMore ? t('show_less', { lng: lang }) : t('read_more', { lng: lang })}
                    </Button>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </ListGroup.Item>
      );
    }

    return (
      <ListGroup.Item className="border-0 px-0 py-3">
        <Row className="align-items-center">
          <Col xs={12} className="d-flex align-items-center">
            <div className="d-flex align-items-center me-3" style={{ minWidth: '120px' }}>
              <i className={`${icon} me-2 text-primary`}></i>
              <strong className="metadata-label">{label}:</strong>
            </div>
            <span className="metadata-value">
              {typeof value === 'string' && value.includes('t(') 
                ? t(value.replace('t(', '').replace(')', ''), { lng: lang })
                : value
              }
            </span>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  };

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={8}>
          <Card 
            className="shadow-sm border-0" 
            style={{
              direction: lang === 'ar' ? 'rtl' : 'ltr',
              textAlign: lang === 'ar' ? 'right' : 'left',
            }}
          >
            <Card.Header className="bg-primary text-white py-3">
              <Row className="align-items-center">
                <Col>
                  <h4 className="mb-0">
                    <i className="fas fa-info-circle me-2"></i>
                    {t('artwork_details', { lng: lang })}
                  </h4>
                </Col>
                {post.category && (
                  <Col xs="auto">
                    <Badge bg="light" text="dark" className="fs-6">
                      {t(post.category, { lng: lang })}
                    </Badge>
                  </Col>
                )}
              </Row>
            </Card.Header>

            <Card.Body className="p-4">
              <ListGroup variant="flush">
                {/* Título */}
                {post.title && renderMetadataItem(
                  'fas fa-heading',
                  t('title', { lng: lang }),
                  post.title
                )}

                {/* Categoría */}
                {post.category && renderMetadataItem(
                  'fas fa-layer-group',
                  t('category', { lng: lang }),
                  t(post.category, { lng: lang })
                )}

                {/* Descripción */}
                {post.description && renderMetadataItem(
                  'fas fa-align-left',
                  t('description', { lng: lang }),
                  post.description,
                  true,
                  true
                )}

                {/* Tema */}
                {post.theme && renderMetadataItem(
                  'fas fa-image',
                  t('theme', { lng: lang }),
                  post.theme
                )}

                {/* Técnica/Subcategoría */}
                {post.subcategory && renderMetadataItem(
                  'fas fa-brush',
                  t('technique', { lng: lang }),
                  t(post.subcategory, { lng: lang })
                )}

                {/* Soporte */}
                {post.support && renderMetadataItem(
                  'fas fa-palette',
                  t('support', { lng: lang }),
                  post.support
                )}

                {/* Estilo artístico */}
                {post.style && renderMetadataItem(
                  'fas fa-paint-brush',
                  t('art_style', { lng: lang }),
                  post.style
                )}

                {/* Embalaje */}
                {post.envolverobra && renderMetadataItem(
                  'fas fa-box-open',
                  t('packaging', { lng: lang }),
                  post.envolverobra
                )}

                {/* Derechos de autor */}
                {post.derechoautor && renderMetadataItem(
                  'fas fa-copyright',
                  t('copyright', { lng: lang }),
                  post.derechoautor
                )}

                {/* Medidas */}
                {post.measurementValue && renderMetadataItem(
                  'fas fa-ruler-combined',
                  t('measurements', { lng: lang }),
                  post.measurementValue
                )}

                {/* Unidad de medida */}
                {post.measurementUnit && renderMetadataItem(
                  'fas fa-ruler',
                  t('unit', { lng: lang }),
                  post.measurementUnit
                )}

                {/* Opción de venta */}
                {post.venteOption && renderMetadataItem(
                  'fas fa-hand-holding-usd',
                  t('sale_option', { lng: lang }),
                  post.venteOption
                )}

                {/* Precio */}
                {post.price && renderMetadataItem(
                  'fas fa-euro-sign',
                  t('price', { lng: lang }),
                  `${post.price} ${post.devisvente || ''} ${post.negociable || ''}`
                )}

                {/* Tamaño */}
                {post.talle && renderMetadataItem(
                  'fas fa-expand-arrows-alt',
                  t('size', { lng: lang }),
                  post.talle
                )}

                {/* Región */}
                {post.wilaya && renderMetadataItem(
                  'fas fa-map-marker-alt',
                  t('region', { lng: lang }),
                  post.wilaya
                )}

                {/* Ciudad */}
                {post.commune && renderMetadataItem(
                  'fas fa-city',
                  t('city', { lng: lang }),
                  post.commune
                )}
              </ListGroup>
            </Card.Body>

            <Card.Footer className="bg-light py-3">
              <Row className="align-items-center">
                <Col>
                  <small className="text-muted">
                    <i className="fas fa-clock me-1"></i>
                    {t('last_updated', { lng: lang })}: {new Date().toLocaleDateString(lang)}
                  </small>
                </Col>
                <Col xs="auto">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => window.print()}
                  >
                    <i className="fas fa-print me-1"></i>
                    {t('print', { lng: lang })}
                  </Button>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DescriptionPostPage;