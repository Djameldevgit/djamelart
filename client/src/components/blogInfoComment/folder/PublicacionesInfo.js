import { Card, Container } from "react-bootstrap";
import { FaPlusCircle, FaCheckCircle, FaComments } from "react-icons/fa";

const PublicacionesInfo = () => {
  return (
    <Container className="my-3">
      <h3 className="text-left mb-2">
        <FaPlusCircle className="me-2" style={{ color: "#6f42c1" }} />
        <span style={{ color: "#6f42c1" }}>Publicaciones de artistas</span>
      </h3>

      <Card className="shadow-sm border-0 bg-light">
        <Card.Body className="p-1">
          <p className="fs-5">
            Los artistas <strong>autenticados y verificados</strong> pueden crear 
            publicaciones de forma sencilla y segura dentro de la plataforma.
          </p>

          <div>
            <dl className="row">
              <dt className="col-sm-3">Cómo publicar</dt>
              <dd className="col-sm-9">
                Se puede crear un post desde el <strong>icono plus</strong> en la barra 
                de navegación o desde el <strong>menú bajo el avatar</strong>.  
                Al publicar, el sistema notifica el <em>éxito o fracaso</em> del envío.
              </dd>

              <dt className="col-sm-3">Revisión de contenido</dt>
              <dd className="col-sm-9">
                Para garantizar la calidad artística, cada publicación pasa por una 
                <strong> revisión de administradores</strong>.  
                Se revisan imágenes, títulos y descripciones antes de ser visibles.
              </dd>

              <dt className="col-sm-3">Aprobación y visibilidad</dt>
              <dd className="col-sm-9">
                Una vez aprobada, la publicación aparece en el <strong>Home</strong>, 
                en los resultados de búsqueda y en la sección <em>“Mis publicaciones”</em> 
                del perfil del artista.
              </dd>

              <dt className="col-sm-3">Gestión del post</dt>
              <dd className="col-sm-9">
                En la página de <strong>detalle del post</strong> se muestran la fecha 
                de creación, descripciones e imágenes.  
                El artista puede <strong>editar</strong> o <strong>eliminar</strong> 
                su publicación en cualquier momento.
              </dd>

              <dt className="col-sm-3">Interacción en tiempo real</dt>
              <dd className="col-sm-9">
                Los usuarios pueden <strong>comentar</strong>, dar <strong>like</strong> 
                y el artista recibe notificaciones instantáneas.  
                Además, un posible cliente puede iniciar un 
                <strong> chat privado directamente</strong> desde el post.
              </dd>
            </dl>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PublicacionesInfo;
