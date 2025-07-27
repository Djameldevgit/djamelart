import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ArtistLocationInput({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');
  const lang = languageReducer.language || 'en';

  // Debug: Verificamos los valores actuales
 
  return (
    <div className="artist-location-form mb-3">
      <Form.Group as={Row} className="mb-3" controlId="artistCountry">
        <Form.Label column sm={3}>{t('artistLocation', { lng: lang })}</Form.Label>
        <Col sm={9}>
          <Form.Control
            type="text"
            name="artistLocation.country"
            value={postData?.artistLocation?.country || ''}
            onChange={handleChangeInput}
            placeholder={t('country', { lng: lang })}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="artistRegion">
        <Form.Label column sm={3}>{t('region', { lng: lang })}</Form.Label>
        <Col sm={9}>
          <Form.Control
            type="text"
            name="artistLocation.region"
            value={postData?.artistLocation?.region || ''}
            onChange={handleChangeInput}
            placeholder={t('artistLocation.placeholders.region', { lng: lang })}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="artistCity">
        <Form.Label column sm={3}>{t('artistLocation.labels.city', { lng: lang })}</Form.Label>
        <Col sm={9}>
          <Form.Control
            type="text"
            name="artistLocation.city"
            value={postData?.artistLocation?.city || ''}
            onChange={handleChangeInput}
            placeholder={t('artistLocation.placeholders.city', { lng: lang })}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="artistPostalCode">
        <Form.Label column sm={3}>{t('artistLocation.labels.postalCode', { lng: lang })}</Form.Label>
        <Col sm={9}>
          <Form.Control
            type="text"
            name="artistLocation.postalCode"
            value={postData?.artistLocation?.postalCode || ''}
            onChange={handleChangeInput}
            placeholder={t('artistLocation.placeholders.postalCode', { lng: lang })}
            pattern="[0-9]{5}"
            maxLength="5"
          />
          <Form.Text muted>{t('artistLocation.formats.postalCode', { lng: lang })}</Form.Text>
        </Col>
      </Form.Group>
    </div>
  );
}