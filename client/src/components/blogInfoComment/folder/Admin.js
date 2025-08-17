import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const Admin = () => {
  return (
    <div>
      <Row className="justify-content-center">
        <Col>
          <Card className="shadow-lg border-0 rounded-4">
            <div className="p-4 text-center">
              <h2 className="fw-bold mb-3">Administración y Seguridad</h2>

              <p className="text-muted fs-5">
                🔒 Nuestra plataforma no solo conecta artistas y coleccionistas, 
                también garantiza un entorno seguro y confiable.
              </p>

              <p className="fs-6">
                El equipo de administración se encarga de <strong>evaluar los posts</strong>, 
                <strong>moderar comentarios inapropiados</strong> y <strong>supervisar a usuarios malintencionados</strong>, 
                para proteger el valor del arte y la integridad de la comunidad.
              </p>

              <p className="fs-6">
                Aunque contamos con un sistema avanzado de seguridad, la administración 
                permanece siempre atenta a <strong>correos de los usuarios, reportes, quejas y denuncias</strong>. 
                Cada situación es revisada con seriedad para asegurar transparencia y confianza.
              </p>

              <p className="fs-6">
                Además, nuestra aplicación permite que cualquier usuario evaluado como 
                apto pueda convertirse en <strong>administrador con un solo clic</strong>. 
                Al cambiar su rol, la interfaz se transforma y podrá colaborar 
                atendiendo a artistas y amantes del arte en tiempo real.
              </p>

              <p className="fw-semibold mt-3">
                🛡️ Con esta combinación de tecnología y supervisión humana, 
                garantizamos una experiencia justa, segura y de calidad para todos.
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Admin ;
