import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDataAPI } from '../../utils/fetchData';
import { USER_TYPES } from '../../redux/actions/userAction';
import { 
  Button, 
  Modal, 
  Form, 
  Container, 
  Table, 
  Badge,
  Spinner,
  Image,
  Row,
  Col
} from 'react-bootstrap';
import ModalEmail from './ModalEmail';

const SendEmailsAdmin = () => {
  const { auth, homeUsers } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [load, setLoad] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoad(true);
        const res = await getDataAPI(`users?limit=9`, auth.token);
        dispatch({
          type: USER_TYPES.GET_USERS,
          payload: { ...res.data, page: 1 },
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoad(false);
        setInitialLoad(false);
      }
    };

    if (initialLoad && auth.token) fetchUsers();
  }, [auth.token, dispatch, initialLoad]);

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <Container fluid="md" className="mt-4 px-3"> {/* Añadido px-4 para padding horizontal */}
      <Row className="mb-4">
        <Col>
          <h4>Usuarios</h4>
        </Col>
      </Row>
  
      {/* Botón global para enviar email */}
      <Row className="mb-4">
        <Col>
          <Button
            variant="primary"
            disabled={selectedUsers.length === 0}
            onClick={() => setShowEmailModal(true)}
          >
            Enviar correo a {selectedUsers.length} usuario(s)
          </Button>
        </Col>
      </Row>
  
      {load ? (
        <Row className="justify-content-center">
          <Col xs="auto">
            <Spinner animation="border" variant="primary" />
          </Col>
        </Row>
      ) : (
        <Table striped bordered hover responsive className="mb-4">
          <thead>
            <tr>
              <th style={{ paddingLeft: '1rem' }}></th> {/* Añadido padding izquierdo */}
              <th>Avatar</th>
              <th>Email</th>
              <th>Registro</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {homeUsers.users.map((user) => (
              <tr key={user._id}>
                <td style={{ paddingLeft: '1.5rem' }}> {/* Añadido padding izquierdo */}
                  <Form.Check 
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleCheckboxChange(user._id)}
                  />
                </td>
                <td>
                  <Image 
                    src={user.avatar} 
                    roundedCircle 
                    style={{ width: '35px', height: '35px' }} 
                  />
                </td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  {user.emailSent ? (
                    <Badge bg="success">Enviado</Badge>
                  ) : (
                    <Badge bg="secondary">No enviado</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
  
      {showEmailModal && (
        <ModalEmail
          show={showEmailModal}
          handleClose={() => setShowEmailModal(false)}
          recipients={selectedUsers}
        />
      )}
    </Container>
  );
};

export default SendEmailsAdmin;