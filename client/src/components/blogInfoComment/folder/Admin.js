import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Admin = () => {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('info');
  const lang = languageReducer.language || 'es';

  return (
    <div>
      <Row className="justify-content-center">
        <Col>
          <Card className="shadow-lg border-0 rounded-4">
            <div className="p-4 text-center">
              <h2 className="fw-bold mb-3">{t('tituloPrincipal0', { lng: lang })}</h2>

              <p className="text-muted fs-5">
                🔒 {t('descripcionPlataformaa', { lng: lang })}
              </p>

              <p className="fs-6">
                {t('equipoAdmin.parte1', { lng: lang })} <strong>{t('evaluarPosts', { lng: lang })}</strong>,{" "}
                <strong>{t('moderarComentarios', { lng: lang })}</strong> {t('y', { lng: lang })} <strong>{t('supervisarUsuarios', { lng: lang })}</strong>,{" "}
                {t('equipoAdmin.parte2', { lng: lang })}
              </p>

              <p className="fs-6">
                {t('sistemaSeguridad.parte1', { lng: lang })} <strong>{t('correosReportes', { lng: lang })}</strong>.{" "}
                {t('sistemaSeguridad.parte2', { lng: lang })}
              </p>

              <p className="fs-6">
                {t('funcionalidadApp.parte1', { lng: lang })} <strong>{t('adminUnClic', { lng: lang })}</strong>.{" "}
                {t('funcionalidadApp.parte2', { lng: lang })}
              </p>

              <p className="fw-semibold mt-3">
                🛡️ {t('garantiaFinal', { lng: lang })}
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Admin;