import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

const DescriptionPost = ({ post }) => {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('postDetail');
  const [readMore, setReadMore] = useState(false);
  const lang = languageReducer.language || 'en';

  // Formatear números grandes
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}k`;
    return `${(num / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="artwork-details-container" style={{
      direction: lang === 'ar' ? 'rtl' : 'ltr',
      textAlign: lang === 'ar' ? 'right' : 'left',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
      borderRadius: '16px',
      padding: '10px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      marginBottom: '15px'
    }}>
      
      {/* HEADER CON ESTADÍSTICAS */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '2px solid rgba(0, 0, 0, 0.06)',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Estadísticas principales */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          {/* Vistas */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(103, 58, 183, 0.1)',
            padding: '8px 16px',
            borderRadius: '12px',
            minWidth: '80px'
          }}>
            <span className="material-icons" style={{
              fontSize: '20px',
              color: '#673ab7'
            }}>
              visibility
            </span>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#673ab7'
              }}>
                {formatNumber(post.views || 0)}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#666',
                opacity: 0.8
              }}>
                {t('views', { lng: lang })}
              </div>
            </div>
          </div>

          {/* Likes */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(244, 67, 54, 0.1)',
            padding: '8px 16px',
            borderRadius: '12px',
            minWidth: '80px'
          }}>
            <span className="material-icons" style={{
              fontSize: '20px',
              color: '#f44336'
            }}>
              favorite
            </span>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#f44336'
              }}>
                {formatNumber(post.likes?.length || 0)}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#666',
                opacity: 0.8
              }}>
                {t('likes', { lng: lang })}
              </div>
            </div>
          </div>

          {/* Comentarios */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(33, 150, 243, 0.1)',
            padding: '8px 16px',
            borderRadius: '12px',
            minWidth: '80px'
          }}>
            <span className="material-icons" style={{
              fontSize: '20px',
              color: '#2196f3'
            }}>
              chat_bubble
            </span>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#2196f3'
              }}>
                {formatNumber(post.comments?.length || 0)}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#666',
                opacity: 0.8
              }}>
                {t('comments', { lng: lang })}
              </div>
            </div>
          </div>
        </div>

        {/* Fechas */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#666'
          }}>
            <span className="material-icons" style={{ fontSize: '14px', color: '#4caf50' }}>
              schedule
            </span>
            <span>{t('published', { lng: lang })}: {moment(post.createdAt).format('DD MMM YYYY')}</span>
          </div>
          {post.updatedAt && post.updatedAt !== post.createdAt && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#666'
            }}>
              <span className="material-icons" style={{ fontSize: '14px', color: '#ff9800' }}>
                edit
              </span>
              <span>{t('updated', { lng: lang })}: {moment(post.updatedAt).format('DD MMM YYYY')}</span>
            </div>
          )}
        </div>
      </div>

      {/* INFORMACIÓN PRINCIPAL DE LA OBRA */}
      <div className="artwork-metadata" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px'
      }}>
        
        {/* Sección: Información Básica */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span className="material-icons" style={{ color: '#2196f3' }}>
              info
            </span>
            {t('basic_info', { lng: lang })}
          </h3>

          {post.category && (
            <div className="metadata-item" style={metadataItemStyle}>
              <span className="material-icons" style={iconStyle('#673ab7')}>
                category
              </span>
              <span className="metadata-label" style={labelStyle}>{t('category', { lng: lang })}:</span>
              <span className="metadata-value" style={valueStyle}>{t(post.category, { lng: lang })}</span>
            </div>
          )}

          {post.title && (
            <div className="metadata-item" style={metadataItemStyle}>
              <span className="material-icons" style={iconStyle('#ff9800')}>
                title
              </span>
              <span className="metadata-label" style={labelStyle}>{t('title', { lng: lang })}:</span>
              <span className="metadata-value" style={valueStyle}>{post.title}</span>
            </div>
          )}

          {post.theme && (
            <div className="metadata-item" style={metadataItemStyle}>
              <span className="material-icons" style={iconStyle('#e91e63')}>
                palette
              </span>
              <span className="metadata-label" style={labelStyle}>{t('theme', { lng: lang })}:</span>
              <span className="metadata-value" style={valueStyle}>{post.theme}</span>
            </div>
          )}
        </div>

        {/* Sección: Detalles Técnicos */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span className="material-icons" style={{ color: '#4caf50' }}>
                build
              </span>
            {t('technical_details', { lng: lang })}
          </h3>

          {post.subcategory && (
            <div className="metadata-item" style={metadataItemStyle}>
              <span className="material-icons" style={iconStyle('#009688')}>
                brush
              </span>
              <span className="metadata-label" style={labelStyle}>{t('technique', { lng: lang })}:</span>
              <span className="metadata-value" style={valueStyle}>{t(post.subcategory, { lng: lang })}</span>
            </div>
          )}

          {post.style && (
            <div className="metadata-item" style={metadataItemStyle}>
              <span className="material-icons" style={iconStyle('#795548')}>
                style
              </span>
              <span className="metadata-label" style={labelStyle}>{t('art_style', { lng: lang })}:</span>
              <span className="metadata-value" style={valueStyle}>{post.style}</span>
            </div>
          )}

          {post.support && (
            <div className="metadata-item" style={metadataItemStyle}>
              <span className="material-icons" style={iconStyle('#607d8b')}>
                layers
              </span>
              <span className="metadata-label" style={labelStyle}>{t('support', { lng: lang })}:</span>
              <span className="metadata-value" style={valueStyle}>{post.support}</span>
            </div>
          )}

          {post.measurementValue && (
            <div className="metadata-item" style={metadataItemStyle}>
              <span className="material-icons" style={iconStyle('#ff5722')}>
                straighten
              </span>
              <span className="metadata-label" style={labelStyle}>{t('measurements', { lng: lang })}:</span>
              <span className="metadata-value" style={valueStyle}>
                {post.measurementValue} {post.measurementUnit && post.measurementUnit}
              </span>
            </div>
          )}

          {post.talle && (
            <div className="metadata-item" style={metadataItemStyle}>
              <span className="material-icons" style={iconStyle('#9c27b0')}>
                aspect_ratio
              </span>
              <span className="metadata-label" style={labelStyle}>{t('size', { lng: lang })}:</span>
              <span className="metadata-value" style={valueStyle}>{post.talle}</span>
            </div>
          )}
        </div>

        {/* Sección: Comercialización */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span className="material-icons" style={{ color: '#f44336' }}>
              shopping_cart
            </span>
            {t('commercial_info', { lng: lang })}
          </h3>

          {post.venteOption && (
            <div className="metadata-item" style={metadataItemStyle}>
              <span className="material-icons" style={iconStyle('#ff5722')}>
                local_offer
              </span>
              <span className="metadata-label" style={labelStyle}>{t('sale_option', { lng: lang })}:</span>
              <span className="metadata-value" style={valueStyle}>{post.venteOption}</span>
            </div>
          )}

          {post.price && (
            <div className="metadata-item" style={metadataItemStyle}>
              <span className="material-icons" style={iconStyle('#4caf50')}>
                euro_symbol
              </span>
              <span className="metadata-label" style={labelStyle}>{t('price', { lng: lang })}:</span>
              <span className="metadata-value" style={{...valueStyle, fontWeight: '600', color: '#2e7d32'}}>
                {post.price} {post.devisvente} {post.negociable && `(${post.negociable})`}
              </span>
            </div>
          )}

          {post.envolverobra && (
            <div className="metadata-item" style={metadataItemStyle}>
              <span className="material-icons" style={iconStyle('#795548')}>
                inventory_2
              </span>
              <span className="metadata-label" style={labelStyle}>{t('packaging', { lng: lang })}:</span>
              <span className="metadata-value" style={valueStyle}>{post.envolverobra}</span>
            </div>
          )}
        </div>

        {/* Sección: Ubicación y Derechos */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span className="material-icons" style={{ color: '#2196f3' }}>
              place
            </span>
            {t('location_rights', { lng: lang })}
          </h3>

          {post.wilaya && (
            <div className="metadata-item" style={metadataItemStyle}>
              <span className="material-icons" style={iconStyle('#f44336')}>
                location_on
              </span>
              <span className="metadata-label" style={labelStyle}>{t('region', { lng: lang })}:</span>
              <span className="metadata-value" style={valueStyle}>{post.wilaya}</span>
            </div>
          )}

          {post.commune && (
            <div className="metadata-item" style={metadataItemStyle}>
              <span className="material-icons" style={iconStyle('#ff9800')}>
                location_city
              </span>
              <span className="metadata-label" style={labelStyle}>{t('city', { lng: lang })}:</span>
              <span className="metadata-value" style={valueStyle}>{post.commune}</span>
            </div>
          )}

          {post.derechoautor && (
            <div className="metadata-item" style={metadataItemStyle}>
              <span className="material-icons" style={iconStyle('#9c27b0')}>
                copyright
              </span>
              <span className="metadata-label" style={labelStyle}>{t('copyright', { lng: lang })}:</span>
              <span className="metadata-value" style={valueStyle}>{post.derechoautor}</span>
            </div>
          )}
        </div>
      </div>

      {/* DESCRIPCIÓN (Full width) */}
      {post.description && (
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          marginTop: '20px'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span className="material-icons" style={{ color: '#2196f3' }}>
              description
            </span>
            {t('description', { lng: lang })}
          </h3>
          
          <div className="cardbodycontent" style={{
            lineHeight: '1.6',
            color: '#555',
            fontSize: '15px'
          }}>
            <span>
              {
                post.description.length < 200
                  ? post.description
                  : readMore ? post.description + ' ' : post.description.slice(0, 200) + '...'
              }
            </span>
            {
              post.description.length > 200 &&
              <span 
                className="readMore" 
                onClick={() => setReadMore(!readMore)}
                style={{
                  color: '#2196f3',
                  cursor: 'pointer',
                  fontWeight: '600',
                  marginLeft: '8px',
                  textDecoration: 'underline'
                }}
              >
                {readMore ? t('read_less', { lng: lang }) : t('read_more', { lng: lang })}
              </span>
            }
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos reutilizables
const metadataItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 0',
  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
  transition: 'background-color 0.2s ease'
};

const iconStyle = (color) => ({
  fontSize: '18px',
  color: color,
  minWidth: '24px'
});

const labelStyle = {
  fontWeight: '600',
  color: '#666',
  minWidth: '120px',
  fontSize: '14px'
};

const valueStyle = {
  color: '#333',
  fontSize: '14px',
  flex: 1
};

export default DescriptionPost;