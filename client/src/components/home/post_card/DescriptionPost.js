import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const DescriptionPost = ({ post }) => {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation();

  return (
    <div className="artwork-details-container">
      <div className="artwork-metadata">
        {post.category && (
          <div className="metadata-item">
            <i className="fas fa-layer-group"></i>
            <span className="metadata-label">{t('category', { lng: languageReducer.language })}:</span>
            <span className="metadata-value">{t(post.category, { lng: languageReducer.language })}</span>
          </div>
        )}
        {post.title && (
          <div className="metadata-item">
            <i className="fas fa-heading"></i>
            <span className="metadata-label">{t('title', { lng: languageReducer.language })}:</span>
            <span className="metadata-value">{post.title}</span>
          </div>
        )}
        {post.theme && (
          <div className="metadata-item">
            <i className="fas fa-image"></i>
            <span className="metadata-label">{t('theme', { lng: languageReducer.language })}:</span>
            <span className="metadata-value">{post.theme}</span>
          </div>
        )}
        {post.subcategory && (
          <div className="metadata-item">
            <i className="fas fa-brush"></i>
            <span className="metadata-label">{t('technique', { lng: languageReducer.language })}:</span>
            <span className="metadata-value">{t(post.subcategory, { lng: languageReducer.language })}</span>
          </div>
        )}
        {post.suporte && (
          <div className="metadata-item">
            <i className="fas fa-brush"></i>
            <span className="metadata-label">{t('support', { lng: languageReducer.language })}:</span>
            <span className="metadata-value">{post.suporte}</span>
          </div>
        )}
        {post.artStyle && (
          <div className="metadata-item">
            <i className="fas fa-paint-brush"></i>
            <span className="metadata-label">{t('art_style', { lng: languageReducer.language })}:</span>
            <span className="metadata-value">{post.artStyle}</span>
          </div>
        )}
        {post.envolverobra && (
          <div className="metadata-item">
            <i className="fas fa-box-open"></i>
            <span className="metadata-label">{t('packaging', { lng: languageReducer.language })}:</span>
            <span className="metadata-value">{post.envolverobra}</span>
          </div>
        )}
        {post.derechoautor && (
          <div className="metadata-item">
            <i className="fas fa-copyright"></i>
            <span className="metadata-label">{t('copyright', { lng: languageReducer.language })}:</span>
            <span className="metadata-value">{post.derechoautor}</span>
          </div>
        )}
        {post.measurementValue && (
          <div className="metadata-item">
            <i className="fas fa-ruler-combined"></i>
            <span className="metadata-label">{t('measurements', { lng: languageReducer.language })}:</span>
            <span className="metadata-value">{post.measurementValue}</span>
          </div>
        )}
        {post.measurementUnit && (
          <div className="metadata-item">
            <i className="fas fa-ruler"></i>
            <span className="metadata-label">{t('unit', { lng: languageReducer.language })}:</span>
            <span className="metadata-value">{post.measurementUnit}</span>
          </div>
        )}
        {post.venteOption && (
          <div className="metadata-item">
            <i className="fas fa-hand-holding-usd"></i>
            <span className="metadata-label">{t('sale_option', { lng: languageReducer.language })}:</span>
            <span className="metadata-value">{post.venteOption}</span>
          </div>
        )}
        {post.price && (
          <div className="metadata-item">
            <i className="fas fa-euro-sign"></i>
            <span className="metadata-label">{t('price', { lng: languageReducer.language })}:</span>
            <span className="metadata-value">{post.price} {post.devisvente} {post.negociable}</span>
          </div>
        )}
        {post.disponibilidad && (
          <div className="metadata-item">
            <i className="fas fa-check-circle"></i>
            <span className="metadata-label">{t('availability', { lng: languageReducer.language })}:</span>
            <span className="metadata-value">{post.disponibilidad}</span>
          </div>
        )}
        {post.talle && (
          <div className="metadata-item">
            <i className="fas fa-expand-arrows-alt"></i>
            <span className="metadata-label">{t('size', { lng: languageReducer.language })}:</span>
            <span className="metadata-value">{post.talle}</span>
          </div>
        )}
        {post.description && (
          <div className="metadata-item">
            <i className="fas fa-align-left"></i>
            <span className="metadata-label">{t('description', { lng: languageReducer.language })}:</span>
            <span className="metadata-value">{post.description}</span>
          </div>
        )}
        {post.wilaya && (
          <div className="metadata-item">
            <i className="fas fa-map-marker-alt"></i>
            <span className="metadata-label">{t('region', { lng: languageReducer.language })}:</span>
            <span className="metadata-value">{post.wilaya}</span>
          </div>
        )}
        {post.commune && (
          <div className="metadata-item">
            <i className="fas fa-city"></i>
            <span className="metadata-label">{t('city', { lng: languageReducer.language })}:</span>
            <span className="metadata-value">{post.commune}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptionPost;
