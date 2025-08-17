import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const IntroMarketplace = () => {
  return (
    <div className="my-2">
      <Row className="justify-content-center">
        <Col md={12}>
          <Card className="shadow-lg border-0 rounded-4">
            <div className="p-1 text-center">
              {/* Título destacado */}
              <h1 className="fw-bold display-5 mb-3 text-gradient">
                🎨 Bienvenido a nuestro <span className="text-primary">Marketplace de Arte</span>
              </h1>

              {/* Subtítulo breve */}
              <p className="text-muted fs-5 mb-4">
                Una comunidad global donde artistas y amantes del arte se conectan, comparten y coleccionan obras únicas.
              </p>

              {/* Descripción por secciones */}
              <p className="fs-6">
                Construida con tecnologías modernas <strong>(MERN, Redux, i18n, sockets en tiempo real)</strong>, 
                integra funciones sociales como likes, comentarios y chat privado, junto a un sistema 
                multilingüe que rompe las fronteras culturales y lingüísticas.
              </p>

              <p className="fs-6">
                Disponible en <strong>7 idiomas</strong> y con <strong>8 categorías artísticas</strong>, 
                los artistas publican sus obras en pocos clics, mientras los compradores exploran con 
                búsquedas avanzadas, interactúan directamente y adquieren arte de forma segura.
              </p>

              <p className="fs-6">
                Nuestra aplicación <strong>PWA</strong> funciona en móviles, tablets y ordenadores, 
                con autenticación segura, notificaciones instantáneas y un sistema de confianza 
                que protege tanto a creadores como a compradores.
              </p>

              {/* Cierre inspirador */}
              <p className="fw-semibold fs-5 mt-4 text-dark">
                🌍 El arte no entiende de límites. Descubre, conecta y colecciona desde cualquier lugar del mundo.
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
