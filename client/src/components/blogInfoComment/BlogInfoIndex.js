import React from 'react';
import { useHistory } from 'react-router-dom';
import { PersonCircle, ShieldShaded, CodeSlash, JournalText } from 'react-bootstrap-icons';
 
const BlogInfoIndex = () => {
  const history = useHistory();
  const go = (section) => history.push("/infoAplicacion", { scrollTo: section });

  // Datos estructurados para mapear las secciones (¡Más mantenible!)
  const sections = [
    {
      id: "usoApp",
      title: "Info y uso de la aplicación",
      icon: <PersonCircle className="me-2" />,
      items: [
        { label: "Info", path: "info" },
        { label: "Registro", path: "registro" },
        { label: "Iniciar sesión", path: "login" },
        { label: "Contraseña olvidada", path: "recuperar-contrasena" }
      ]
    },
    {
      id: "seguridadApp",
      title: "Seguridad en la aplicación",
      icon: <ShieldShaded className="me-2" />,
      items: [
        { label: "Verificación de cuenta", path: "seguridad/verificacion" },
        { label: "Activación de la cuenta", path: "seguridad/activacion" },
        { label: "Suspensión de cuenta", path: "seguridad/suspension" },
        { label: "Bloqueo de cuenta", path: "seguridad/bloqueo" },
        { label: "Eliminación de cuenta", path: "seguridad/eliminacion" },
        { label: "Falsos perfiles", path: "seguridad/falsos-perfiles" }
      ]
    },
    {
      id: "desarrolloApp",
      title: "Desarrollo de la aplicación",
      icon: <CodeSlash className="me-2" />,
      items: [
        { label: "Tecnologías usadas", path: "desarrollo/tecnologias" },
        { label: "Novedades y actualizaciones", path: "desarrollo/novedades" }
      ]
    },
    {
      id: "blogArtista",
      title: "Portafolio y Blog",
      icon: <JournalText className="me-2" />,
      items: [
        { label: "Descripción del desarrollador", path: "blog/sobre-mi" },
        { label: "Proyectos en desarrollo", path: "blog/proyectos" },
        { label: "Hacer un comentario", path: "blog/comentarios" }
      ]
    }
  ];

  return (
    <div>
 
  
    <div className="accordion accordion-flush" id="accordionFlushExample">
  <h2 className="text-center mb-4">Centro de Ayuda</h2>
 
 <p className="text-center text-muted mb-4">
   Encuentra guías, soluciones y detalles sobre el uso de la aplicación.
 </p>


 <div className="accordion accordion-flush" id="accordionFlushExample">
    {sections.map((section) => (
        <div key={section.id} className="accordion-item">
          <h2 className="accordion-header">
            <button 
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target={`#${section.id}`}
              aria-expanded="false" 
              aria-controls={section.id}
            >
              {section.icon} {section.title}
            </button>
          </h2>
          <div 
            id={section.id} 
            className="accordion-collapse collapse" 
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              <ul className="list-unstyled mb-0">
                {section.items.map((item, index) => (
                  <li key={index}>
                    <button 
                      className="btn btn-link text-start p-0 text-decoration-none"
                      onClick={() => go(item.path)}
                      aria-label={`Ir a ${item.label}`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
 </div>
  </div>

    
  );
};

export default BlogInfoIndex;