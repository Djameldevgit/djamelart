import { Card, Container } from "react-bootstrap";
import { FaGlobeAmericas } from "react-icons/fa";

const Language = () => {
  return (
    <Container className="my-3">
      <h3 className="text-left mb-2">
        <FaGlobeAmericas className="me-2" style={{ color: "#198754" }} />
        <span style={{ color: "#198754" }}>Un mundo, muchos idiomas</span>
      </h3>

      <Card className="shadow-sm border-0 bg-light">
        <Card.Body className="p-3">
          <p className="fs-5">
            Este sistema no fue creado para limitarse a un solo lugar o un solo idioma, 
            sino para <strong className="text-success">abrirse al mundo entero</strong>.  
            El arte no entiende de fronteras, y por ello era imprescindible que mi aplicación 
            pudiera hablar con todos.
          </p>

          <p>
            El componente <strong className="text-success">Language</strong> nace de esa visión global:  
            cualquier artista o amante del arte puede interactuar en el idioma que le sea más cercano.  
            He dedicado semanas y meses al estudio del sistema <code>i18n</code>, integrando traducciones 
            tanto en el cliente como en el servidor, de modo que el idioma elegido quede guardado y 
            sincronizado automáticamente.
          </p>

          <p>
            Esto significa que no es necesario volver a configurar el idioma en cada conexión:  
            la aplicación lo recordará y se adaptará a la preferencia de cada persona.
          </p>

          <dl className="row">
            <dt className="col-sm-3">Idiomas actuales</dt>
            <dd className="col-sm-9">
              <ul className="mb-1">
                <li>Inglés</li>
                <li>Árabe</li>
              </ul>
            </dd>

            <dt className="col-sm-3">Visión futura</dt>
            <dd className="col-sm-9">
              Mi meta es ampliar las traducciones para recibir a usuarios de:
              <ul className="mb-1">
                <li>Francia</li>
                <li>Rusia</li>
                <li>China</li>
                <li>España</li>
                <li>Mi tierra natal en lengua Kabile</li>
              </ul>
            </dd>
          </dl>

          <p className="mt-2">
            El <span className="text-success fw-bold">lenguaje</span> es la primera llave 
            que abre la puerta al arte.  
            Este componente asegura que la plataforma sea inclusiva, accesible y abierta a todo el mundo, 
            respetando la diversidad cultural y lingüística.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Language;
