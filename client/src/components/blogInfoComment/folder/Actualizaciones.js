import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const Actualizaciones = () => {
  return (
    <div className="my-4">
      <Row className="justify-content-center">
        <Col md={12}>
          <Card className="shadow-lg border-0 rounded-4">
            <div className="p-4">
              <h2 className="fw-bold text-center mb-4">
                🚀 Próximas Actualizaciones
              </h2>
              <p className="text-muted text-center fs-5 mb-4">
                Seguimos mejorando para ofrecerte la mejor experiencia en el
                mundo del arte digital. Estas son algunas de las funciones que
                pronto estarán disponibles:
              </p>

              <ul className="fs-6">
                <li>
                  🔔 <strong>Notificaciones en tiempo real:</strong> recibe alertas cuando alguien comenta, da like o compra una obra.
                </li>
                <li>
                  💾 <strong>Favoritos y colecciones:</strong> guarda y organiza tus obras preferidas en tu propia galería privada.
                </li>
                <li>
                  🔍 <strong>Buscador avanzado:</strong> explora el arte por técnica, estilo, precio, artista y mucho más.
                </li>
                <li>
                  🎨 <strong>Panel para artistas:</strong> estadísticas y métricas para conocer el impacto de tus obras.
                </li>
                <li>
                  💬 <strong>Mensajería mejorada:</strong> conecta en privado con artistas y compradores en tiempo real.
                </li>
                <li>
                  🌙☀️ <strong>Modo oscuro/claro:</strong> elige el estilo visual que prefieras para navegar cómodamente.
                </li>
                <li>
                  ✅ <strong>Certificación de obras:</strong> más confianza con la verificación manual de piezas únicas.
                </li>
              </ul>

              <p className="fw-semibold text-center mt-4">
                Nuestro compromiso es hacer crecer la comunidad artística digital con herramientas seguras, modernas y útiles.
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Actualizaciones;
