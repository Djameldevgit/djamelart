import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReports } from "../../redux/actions/reportUserAction";
import {
  Container,
  Table,
  Dropdown,
 
  Spinner,
} from "react-bootstrap";
import {
  PencilFill,
  TrashFill,
  LockFill,
  UnlockFill,
  ThreeDotsVertical,
} from "react-bootstrap-icons";

const ReportedUsers = () => {
  const dispatch = useDispatch();
  const { reports, loading } = useSelector((state) => state.reportReducer);
  const { auth } = useSelector((state) => state);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        await dispatch(getReports(auth.token));
      } catch (err) {
        setError("Error al obtener los reportes.");
      }
    };
    fetchReports();
  }, [dispatch, auth.token]);

  if (!Array.isArray(reports)) {
    return <p className="text-danger">Error: los datos de los reportes no son válidos.</p>;
  }
         
  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Usuarios Reportados</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : reports.length === 0 ? (
        <p>No hay usuarios reportados.</p>
      ) : (
        <div className="table-responsive" style={{overflow: 'visible'}}>
          <Table striped bordered hover className="align-middle">
            <thead className="table-dark">
              <tr>
                <th>Usuario que Reporta</th>
                <th>Usuario Reportado</th>
                <th>Título del Post</th>
                <th>Motivo</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td><UserInfo user={report.reportedBy} /></td>
                  <td><UserInfo user={report.userId} /></td>
                  <td>{report.postId?.title || "N/A"}</td>
                  <td>{report.reason || "No especificado"}</td>
                  <td>{new Date(report.createdAt).toLocaleString()}</td>
                  <td>
                    <Dropdown drop="start">
                      <Dropdown.Toggle 
                        variant="outline-secondary" 
                        size="sm" 
                        id={`dropdown-${report._id}`}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          padding: '0.25rem'
                        }}
                      >
                        <ThreeDotsVertical />
                      </Dropdown.Toggle>
                      <Dropdown.Menu style={{position: 'absolute'}}>
                     
                        <Dropdown.Item disabled>
                          <PencilFill className="me-2" /> Editar
                        </Dropdown.Item>
                  
                        <Dropdown.Item className="text-warning">
                          <UnlockFill className="me-2" /> desactivar
                        </Dropdown.Item>
                        <Dropdown.Item className="text-warning">
                          <LockFill className="me-2" /> Bloquear
                        </Dropdown.Item>
                             <Dropdown.Item className="text-danger">
                          <TrashFill className="me-2" /> Eliminar
                        </Dropdown.Item> 
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

// Componente de información del usuario
const UserInfo = ({ user }) => {
  return user ? (
    <div className="d-flex align-items-center">
      <img
        src={user.avatar}
        alt={user.username}
        className="rounded-circle me-2"
        width="30"
        height="30"
      />
      <span>{user.username}</span>
    </div>
  ) : (
    <span>Usuario desconocido</span>
  );
};

export default ReportedUsers;
