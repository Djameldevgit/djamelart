import { Card, Container } from "react-bootstrap";
import { FaUser, FaCode, FaPaintBrush, FaHeart, FaComments } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const BlogPortafolio = () => {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('info');
  const lang = languageReducer.language || 'es';

  return (
    <Container className="my-3">
      <h3 className="text-left mb-2">
        <FaUser className="me-2" style={{ color: "#6f42c1" }} />
        <span style={{ color: "#6f42c1" }}>{t('tituloPrincipa', { lng: lang })}</span>
      </h3>

      <Card className="shadow-sm border-0 bg-light">
        <Card.Body className="p-3">
          <h4 className="fw-bold mb-3">{t('nombreAutor', { lng: lang })}</h4>
          <p className="fs-5">
            {t('descripcionEspacio.parte1', { lng: lang })}
            <FaPaintBrush className="mx-1" /> <strong>{t('artistaPintor', { lng: lang })}</strong>{" "}
            {t('y', { lng: lang })} <FaCode className="mx-1" /> <strong>{t('desarrolladorMERN', { lng: lang })}</strong>.{" "}
            {t('descripcionEspacio.parte2', { lng: lang })}
          </p>

          <h5 className="mt-4">{t('miniBiografia', { lng: lang })}</h5>
          <p>
            {t('biografia.parte1', { lng: lang })} <em>{t('ventaArte', { lng: lang })}</em>.{" "}
            {t('biografia.parte2', { lng: lang })}
          </p>
          <p>
            {t('decision.parte1', { lng: lang })} <strong>{t('pinturaProgramacion', { lng: lang })}</strong>.{" "}
            {t('decision.parte2', { lng: lang })}
          </p>
          <p>
            {t('vision.parte1', { lng: lang })} <strong>{t('retoPersonal', { lng: lang })}</strong>{" "}
            {t('vision.parte2', { lng: lang })}
          </p>

          <h5 className="mt-4">{t('enlaces', { lng: lang })}</h5>
          <p>
            {t('descripcionEnlaces', { lng: lang })}
          </p>

          <h5 className="mt-4">{t('comentarios', { lng: lang })}</h5>
          <p>
            {t('interaccion.parte1', { lng: lang })} <strong>{t('autenticadoVerificadoo', { lng: lang })}</strong>{" "}
            {t('interaccion.parte2', { lng: lang })} <FaComments className="mx-1" />{" "}
            {t('interaccion.parte3', { lng: lang })} <FaHeart className="mx-1 text-danger" />{" "}
            {t('interaccion.parte4', { lng: lang })}
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BlogPortafolio;
