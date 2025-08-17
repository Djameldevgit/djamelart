import { Card, Container } from "react-bootstrap";
import { FaShieldAlt, FaExternalLinkAlt } from "react-icons/fa";

const SeguridadInfo = () => {
  const handleVerImagenes = () => {
    // Aquí podrías mostrar capturas de ejemplo del flujo de verificación
    console.log("Ver imágenes de seguridad");
  };

  return (
    <Container className="my-3">
      <h3 className="text-left mb-2">
        <FaShieldAlt className="me-2" style={{ color: "#6f42c1" }} />
        <span style={{ color: "#6f42c1" }}>Seguridad en la aplicación</span>
      </h3>

      <Card className="shadow-sm border-0 bg-light">
        <Card.Body className="p-1">
          <p className="fs-5">
            La seguridad es una prioridad. Nuestro sistema protege tanto a los 
            usuarios como a la plataforma para garantizar una experiencia confiable.
          </p>

          <div>
            <dl className="row">
              <dt className="col-sm-3">Encriptación de datos</dt>
              <dd className="col-sm-9">
                Toda la información enviada al registrarse se transmite de forma 
                <strong> encriptada hacia el backend</strong>, asegurando que 
                los datos personales permanezcan protegidos.
              </dd>

              <dt className="col-sm-3">Registro manual con token</dt>
              <dd className="col-sm-9">
                Cuando un usuario se registra manualmente, el sistema genera un 
                <strong> token de validación</strong>. Una vez comprobados los datos, 
                se le envía directamente al <em>home</em> sin necesidad de volver a iniciar sesión.
              </dd>

              <dt className="col-sm-3">Verificación por correo</dt>
              <dd className="col-sm-9">
                Para confirmar la identidad, el usuario debe verificar su cuenta 
                mediante un <strong>botón de verificación</strong>.  
                Si intenta realizar cualquier acción sin estar verificado, se abre un 
                <strong> modal</strong> con un botón que envía automáticamente un 
                correo de verificación.
              </dd>

              <dt className="col-sm-3">Prevención de perfiles falsos</dt>
              <dd className="col-sm-9">
                Los perfiles creados con correos falsos nunca podrán ser verificados, 
                y por lo tanto no podrán publicar, comentar, dar like ni realizar acciones.  
                Además, el sistema revisa la base de datos cada <strong>24 horas</strong> 
                y elimina automáticamente los correos no verificados.
              </dd>

              <dd className="col-sm-9">
                <dl className="row">
                  <p className="mb-0 flex-grow-1">
                    <span
                      className="text-info d-inline-flex align-items-center cursor-pointer"
                      onClick={handleVerImagenes}
                    >
                      <FaExternalLinkAlt className="me-1" />
                      <span className="ms-1">ver imágenes</span>
                    </span>
                  </p>
                </dl>
              </dd>
            </dl>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SeguridadInfo;
