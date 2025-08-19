import { Card, Container } from "react-bootstrap";
import { FaGlobeAmericas } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Language = () => {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('info');
  const lang = languageReducer.language || 'es';

  return (
    <Container className="my-3">
      <h3 className="text-left mb-2">
        <FaGlobeAmericas className="me-2" style={{ color: "#198754" }} />
        <span style={{ color: "#198754" }}>{t('tituloPrincipal', { lng: lang })}</span>
      </h3>

      <Card className="shadow-sm border-0 bg-light">
        <Card.Body className="p-3">
          <p className="fs-5">
            {t('descripcionSistemaPart1', { lng: lang })}{" "}
            <strong className="text-success">{t('abrirseMundo', { lng: lang })}</strong>.{" "}
            {t('descripcionSistemaPart2', { lng: lang })}
          </p>

          <p>
            {t('componenteLanguagePart1', { lng: lang })} <strong className="text-success">{t('languageComponent', { lng: lang })}</strong>{" "}
            {t('componenteLanguagePart2', { lng: lang })}{" "}
            <code>i18n</code>, {t('componenteLanguagePart3', { lng: lang })}
          </p>

          <p>
            {t('significadoPart1', { lng: lang })}{" "}
            {t('significadoPart2', { lng: lang })}
          </p>

          <dl className="row">
            <dt className="col-sm-3">{t('idiomasActuales', { lng: lang })}</dt>
            <dd className="col-sm-9">
              <ul className="mb-1">
                <li>{t('ingles', { lng: lang })}</li>
                <li>{t('arabe', { lng: lang })}</li>
              </ul>
            </dd>

            <dt className="col-sm-3">{t('visionFutura', { lng: lang })}</dt>
            <dd className="col-sm-9">
              {t('metaAmpliar', { lng: lang })}
              <ul className="mb-1">
                <li>{t('francia', { lng: lang })}</li>
                <li>{t('rusia', { lng: lang })}</li>
                <li>{t('china', { lng: lang })}</li>
                <li>{t('espana', { lng: lang })}</li>
                <li>{t('kabile', { lng: lang })}</li>
              </ul>
            </dd>
          </dl>

          <p className="mt-2">
            {t('lenguajeArtePart1', { lng: lang })} <span className="text-success fw-bold">{t('lenguaje', { lng: lang })}</span>{" "}
            {t('lenguajeArtePart2', { lng: lang })}
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Language;