import { Card, Container } from "react-bootstrap";
import { FaEnvelope, FaComments } from "react-icons/fa";

const ContactoComunicacion = () => {
  return (
    <Container className="my-3">
      <h3 className="text-left mb-2">
        <FaEnvelope className="me-2" style={{ color: "#6f42c1" }} />
        <span style={{ color: "#6f42c1" }}>Contacto y Comunicación</span>
      </h3>

      <Card className="shadow-sm border-0 bg-light">
        <Card.Body className="p-1">
          <p className="fs-5">
            Nuestra plataforma ofrece diferentes formas de comunicación para que los usuarios 
            puedan resolver dudas o recibir asistencia de forma rápida y sencilla.
          </p>

          <div>
            <dl className="row">
              <dt className="col-sm-3">Formulario de contacto</dt>
              <dd className="col-sm-9">
                Cualquier usuario <strong>autenticado y verificado</strong> puede 
                enviarnos un mensaje a través del <strong>formulario de contacto</strong>.  
                Solo debe escribir un <em>título</em> y la <em>descripción del asunto</em>, 
                y al hacer clic en <strong>Enviar</strong> nos llegará un correo.  
                Respondemos cuando es oportuno para dar la mejor atención.
              </dd>

              <dt className="col-sm-3">Chat privado con administradores</dt>
              <dd className="col-sm-9">
                Además del correo, el usuario puede abrir un 
                <strong> chat privado en tiempo real</strong> con los administradores.  
                Allí podrá escribir directamente con nuestro equipo para resolver 
                cualquier inquietud de manera inmediata.
              </dd>

              <dt className="col-sm-3">Atención personalizada</dt>
              <dd className="col-sm-9">
                Nuestro objetivo es mantener una <strong>comunicación cercana</strong> con los artistas 
                y compradores, asegurando un entorno confiable y transparente.
              </dd>
            </dl>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ContactoComunicacion;
