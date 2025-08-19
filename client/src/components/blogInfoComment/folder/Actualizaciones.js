import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Actualizaciones = () => {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('info');
  const lang = languageReducer.language || 'es';

  return (
    <div className="my-4">
      <Row className="justify-content-center">
        <Col md={12}>
          <Card className="shadow-lg border-0 rounded-4">
            <div className="p-4">
              <h2 className="fw-bold text-center mb-4">
                🚀 {t('tituloPrincip', { lng: lang })}
              </h2>
              <p className="text-muted text-center fs-5 mb-4">
                {t('descripcionMejoras', { lng: lang })}
              </p>

              <ul className="fs-6">
                <li>
                  🔔 <strong>{t('notificacionesTiempoReal', { lng: lang })}:</strong> {t('descNotificaciones', { lng: lang })}
                </li>
                <li>
                  💾 <strong>{t('favoritosColecciones', { lng: lang })}:</strong> {t('descFavoritos', { lng: lang })}
                </li>
                <li>
                  🔍 <strong>{t('buscadorAvanza', { lng: lang })}:</strong> {t('descBuscador', { lng: lang })}
                </li>
                <li>
                  🎨 <strong>{t('panelArtistas', { lng: lang })}:</strong> {t('descPanelArtistas', { lng: lang })}
                </li>
                <li>
                  💬 <strong>{t('mensajeriaMejorada', { lng: lang })}:</strong> {t('descMensajeria', { lng: lang })}
                </li>
                <li>
                  🌙☀️ <strong>{t('modoOscuroClaro', { lng: lang })}:</strong> {t('descModoVisual', { lng: lang })}
                </li>
                <li>
                  ✅ <strong>{t('certificacionObras', { lng: lang })}:</strong> {t('descCertificacion', { lng: lang })}
                </li>
              </ul>

              <p className="fw-semibold text-center mt-4">
                {t('compromiso', { lng: lang })}
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Actualizaciones;