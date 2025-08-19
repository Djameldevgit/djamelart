import { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Card, Container, Modal, Carousel, Button } from "react-bootstrap";
import {
  FaUserEdit,
  FaExternalLinkAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

const IMAGENES_POR_METODO = {
  google: ["/images/a.jpg", "/images/djamel1.jpg"],
  facebook: ["/images/djamel0.jpg", "/images/djamel1.jpg"],
  manual: ["/images/djamel0.jpg", "/images/djamel1.jpg"]
};

// 👇 forwardRef para poder recibir el ref desde el padre
const Registro = forwardRef((props, ref) => {
  const { languageReducer } = useSelector(state => state);
  const lang = languageReducer.language || "es";
  const { t } = useTranslation("info");

  const [showModal, setShowModal] = useState(false);
  const [imagenesModal, setImagenesModal] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleVerImagenes = metodo => {
    setImagenesModal(IMAGENES_POR_METODO[metodo]);
    setShowModal(true);
    setActiveIndex(0);
  };

  const handleSelect = selectedIndex => {
    setActiveIndex(selectedIndex);
  };

  return (
    // 👇 ref aplicado en el contenedor raíz
    <div
      ref={ref}
      style={{
        direction: lang === "ar" ? "rtl" : "ltr",
        textAlign: lang === "ar" ? "right" : "left"
      }}
    >
      <Container className="my-3">
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
          centered
          backdrop="static"
          className="mobile-optimized-modal"
        >
          <Modal.Header className="border-0 d-flex justify-content-between align-items-center p-2">
            <Modal.Title className="small m-0">
              {t("imagenesDeRegistro", { lng: lang })}
            </Modal.Title>
            <Button
              variant="link"
              onClick={() => setShowModal(false)}
              className="p-0"
              aria-label={t("cerrar", { lng: lang })}
            >
              <FaTimes className="text-dark" />
            </Button>
          </Modal.Header>

          <Modal.Body className="p-0 position-relative">
            <Carousel
              activeIndex={activeIndex}
              onSelect={handleSelect}
              prevIcon={
                <div className="carousel-control-prev-custom">
                  <FaChevronLeft size={20} />
                </div>
              }
              nextIcon={
                <div className="carousel-control-next-custom">
                  <FaChevronRight size={20} />
                </div>
              }
              indicators={imagenesModal.length > 1}
            >
              {imagenesModal.map((img, index) => (
                <Carousel.Item key={index}>
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      height: "60vh",
                      minHeight: "300px",
                      maxHeight: "500px"
                    }}
                  >
                    <img
                      className="d-block img-fluid"
                      src={img}
                      alt={t("pasoNumero", { paso: index + 1, lng: lang })}
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain"
                      }}
                    />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>

            {imagenesModal.length > 1 && (
              <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2">
                <span className="badge bg-dark bg-opacity-75">
                  {t("contadorImagenes", {
                    actual: activeIndex + 1,
                    total: imagenesModal.length,
                    lng: lang
                  })}
                </span>
              </div>
            )}
          </Modal.Body>
        </Modal>

        {/* Contenido principal */}
        <h3 className="text-left mb-2">
          <FaUserEdit className="me-2" style={{ color: "#6f42c1" }} />
          <span
            style={{
              direction: lang === "ar" ? "rtl" : "ltr",
              textAlign: lang === "ar" ? "right" : "left",
              color: "#6f42c1"
            }}
          >
            {t("comoRegistrarme", { lng: lang })}
          </span>
        </h3>

        <Card className="shadow-sm border-0 bg-light">
          <Card.Body className="p-1">
            <p className="fs-5">
              {t("descripcionIntro", { lng: lang })}{" "}
              <strong className="text-primary">
                {t("tresFormasDiferentes", { lng: lang })}
              </strong>
            </p>

            <div>
              <dl className="row">
                <dt className="col-sm-3">
                  {t("crearCuentaManual", { lng: lang })}
                </dt>
                <dd className="col-sm-9">
                  {t("descripcionManual", { lng: lang })}
                  <p className="mb-0 mt-2">
                    <span
                      className="text-info d-inline-flex align-items-center cursor-pointer"
                      onClick={() => handleVerImagenes("manual")}
                      style={{ cursor: "pointer" }}
                    >
                      <FaExternalLinkAlt className="me-1" />
                      <span className="ms-1">{t("verImagenes", { lng: lang })}</span>
                    </span>
                  </p>
                </dd>

                <dt className="col-sm-3">
                  {t("usandoGoogle", { lng: lang })}
                </dt>
                <dd className="col-sm-9">
                  <p>{t("descripcionGoogle", { lng: lang })}</p>
                  <p className="mb-0">
                    <span
                      className="text-info d-inline-flex align-items-center cursor-pointer"
                      onClick={() => handleVerImagenes("google")}
                      style={{ cursor: "pointer" }}
                    >
                      <FaExternalLinkAlt className="me-1" />
                      <span className="ms-1">{t("verImagenes", { lng: lang })}</span>
                    </span>
                  </p>
                </dd>

                <dt className="col-sm-3">
                  {t("usandoFacebook", { lng: lang })}
                </dt>
                <dd className="col-sm-9">
                  <p>{t("descripcionFacebook", { lng: lang })}</p>
                  <p className="mb-0">
                    <span
                      className="text-info d-inline-flex align-items-center cursor-pointer"
                      onClick={() => handleVerImagenes("facebook")}
                      style={{ cursor: "pointer" }}
                    >
                      <FaExternalLinkAlt className="me-1" />
                      <span className="ms-1">{t("verImagenes", { lng: lang })}</span>
                    </span>
                  </p>
                </dd>
              </dl>
            </div>

            <div>
              <h3 className="text-left mb-2">
                <span
                  style={{
                    direction: lang === "ar" ? "rtl" : "ltr",
                    textAlign: lang === "ar" ? "right" : "left",
                    color: "#6f42c1"
                  }}
                >
                  {t("olvidasteContrasena", { lng: lang })}
                </span>
              </h3>
              <dl className="row">
                <dt className="col-sm-3">
                  {t("recuperacionContrasena", { lng: lang })}
                </dt>
                <dd className="col-sm-9">
                  {t("descripcionRecuperacion", { lng: lang })}
                </dd>
              </dl>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
});

export default Registro;
