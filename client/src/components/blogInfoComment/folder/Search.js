import { Card, Container } from "react-bootstrap";
import { FaSearch, FaExternalLinkAlt } from "react-icons/fa";

 

const Search = () => {
  const handleVerImagenes = () => {
    // Aquí puedes abrir un modal o mostrar ejemplos visuales del buscador
    console.log("Ver imágenes de búsqueda");
  };

  return (
    <Container className="my-3">
      <h3 className="text-left mb-2">
        <FaSearch className="me-2" style={{ color: "#6f42c1" }} />
        <span style={{ color: "#6f42c1" }}>¿Cómo funciona la búsqueda?</span>
      </h3>

      <Card className="shadow-sm border-0 bg-light">
        <Card.Body className="p-1">
          <p className="fs-5">
            El sistema de <strong className="text-primary">búsqueda inteligente</strong> 
            permite a los usuarios explorar las obras de arte de forma rápida y precisa.
          </p>

          <div>
            <dl className="row">
              <dt className="col-sm-3">Usuarios sin autenticación</dt>
              <dd className="col-sm-9">
                Pueden usar un <strong>input de búsqueda simple</strong> que, aunque limitado, 
                es muy potente: encuentra resultados por <em>categoría</em>, <em>tema</em> o <em>estilo</em>.  
                También admite combinaciones como <em>categoría + tema</em> o 
                <em>categoría + tema + estilo</em>.
              </dd>

              <dt className="col-sm-3">Usuarios autenticados</dt>
              <dd className="col-sm-9">
                Tienen acceso a un <strong>buscador avanzado</strong> en tiempo real.  
                Aquí se pueden aplicar filtros específicos por:
                <ul className="mb-1">
                  <li>Categoría</li>
                  <li>Tema</li>
                  <li>Estilo</li>
                  <li>Título</li>
                  <li>Fecha de publicación</li>
                </ul>
                Esto facilita encontrar exactamente lo que se busca en segundos.
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
export default Search
