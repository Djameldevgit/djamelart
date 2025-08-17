import { Card, Container } from "react-bootstrap";
import { FaUser, FaCode, FaPaintBrush, FaHeart, FaComments } from "react-icons/fa";

const BlogPortafolio = () => {
  return (
    <Container className="my-3">
      <h3 className="text-left mb-2">
        <FaUser className="me-2" style={{ color: "#6f42c1" }} />
        <span style={{ color: "#6f42c1" }}>Blog & Portafolio</span>
      </h3>

      <Card className="shadow-sm border-0 bg-light">
        <Card.Body className="p-3">
          <h4 className="fw-bold mb-3">Djamel Baouali</h4>
          <p className="fs-5">
            Este espacio ha sido creado especialmente para mostrar mi camino como 
            <FaPaintBrush className="mx-1" /> <strong>artista pintor</strong> y como 
            <FaCode className="mx-1" /> <strong>desarrollador MERN</strong>.  
            Dos pasiones profundas que me han acompañado durante muchos años 
            y que no cambiaría por todo el tesoro del mundo.
          </p>

          <h5 className="mt-4">Mini biografía</h5>
          <p>
            Ya he pasado años publicando mis obras en redes sociales, pero comprendí 
            que estas plataformas no están pensadas para la <em>venta y compra de arte</em>.  
            Están diseñadas para entretenimiento constante con juegos, streaming y chats, 
            no para enfocarse en la difusión artística.
          </p>
          <p>
            Por eso decidí estudiar e investigar código en profundidad, apoyándome en la 
            inteligencia artificial, especialmente con ChatGPT, trabajando días y noches 
            entre <strong>pintura y programación</strong>.  
            Dividí mi tiempo entre perfeccionar mi talento artístico y aprender sobre 
            servidores Express, sockets, autenticación, APIs de Google, y todo lo necesario 
            para crear una aplicación donde no solo pueda publicar mis obras, sino también 
            brindar la oportunidad a otros artistas de diferentes categorías.
          </p>
          <p>
            Esta aplicación no busca competir con nadie; es un <strong>reto personal</strong> 
            y un proyecto en constante evolución. Cada día pinto para mejorar mi arte y 
            programo para mejorar la experiencia de los usuarios.  
            Incluso estoy abierto a que otros desarrolladores MERN se unan para escalar 
            este proyecto más y más, porque nunca se sabe qué futuro puede tener.
          </p>

          <h5 className="mt-4">Enlaces</h5>
          <p>
            Aquí puedes encontrar también links a mis otras aplicaciones y proyectos.  
            (👉 Aquí podrías insertar botones o links externos con React-Bootstrap).
          </p>

          <h5 className="mt-4">Comentarios</h5>
          <p>
            Debajo de esta sección cualquier usuario <strong>autenticado y verificado</strong> 
            podrá dejar un <FaComments className="mx-1" /> comentario o un 
            <FaHeart className="mx-1 text-danger" /> like permanente en mi blog-portafolio, 
            como muestra de apoyo a mi trabajo como artista y desarrollador.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BlogPortafolio;
