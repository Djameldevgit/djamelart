import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const IntroMarketplace = () => {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('info');
  const lang = languageReducer.language || 'es';

  return (
    <div className="my-2">
      <Row className="justify-content-center">
        <Col md={12}>
          <Card className="shadow-lg border-0 rounded-4">
            <div className="p-1 text-center">
              {/* Título destacado */}
              <h1 className="fw-bold display-5 mb-3 text-gradient">
                🎨 {t('tituloPrincipall.parte1')} <span className="text-primary">{t('tituloPrincipal.parte2')}</span>
              </h1>

              {/* Subtítulo breve */}
              <p className="text-muted fs-5 mb-4">
                {t('subtitulo')}
              </p>

              {/* Descripción por secciones */}
              <p className="fs-6">
                {t('tecnologias.parte1')} <strong>{t('tecnologias.parte2')}</strong>,{" "}
                {t('tecnologias.parte3')}
              </p>

              <p className="fs-6">
                {t('disponibilidad.parte1')} <strong>{t('disponibilidad.parte2')}</strong>{" "}
                {t('disponibilidad.parte3')} <strong>{t('disponibilidad.parte4')}</strong>,{" "}
                {t('disponibilidad.parte5')}
              </p>

              <p className="fs-6">
                {t('pwa.parte1')} <strong>{t('pwa.parte2')}</strong>{" "}
                {t('pwa.parte3')}
              </p>

              {/* Cierre inspirador */}
              <p className="fw-semibold fs-5 mt-4 text-dark">
                🌍 {t('cierreInspirador')}
              </p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Estilo adicional con CSS inline o en archivo */}
      <style>
        {`
          .text-gradient {
            background: linear-gradient(90deg, #6a11cb, #2575fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}
      </style>
    </div>
  );
};

export default IntroMarketplace;