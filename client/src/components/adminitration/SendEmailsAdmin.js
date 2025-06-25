import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDataAPI } from '../../utils/fetchData';
import { USER_TYPES } from '../../redux/actions/userAction';
import { Button, Modal, Form } from 'react-bootstrap';
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
        const res = await getDataAPI(`users?limit=50`, auth.token);
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
    <div className="container">
    <h4 className="my-3">Usuarios</h4>
  
    {/* Botón global para enviar email */}
    <div className="mb-3">
      <Button
        variant="primary"
        disabled={selectedUsers.length === 0}
        onClick={() => setShowEmailModal(true)}
      >
        Enviar correo a {selectedUsers.length} usuario(s)
      </Button>
    </div>
  
    <table className="table table-bordered table-hover">
      <thead className="table-light">
        <tr>
          <th></th>
          <th>Avatar</th>
          <th>Email</th>
          <th>Registro</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {homeUsers.users.map((user) => (
          <tr key={user._id}>
            <td>
              <Form.Check
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleCheckboxChange(user._id)}
              />
            </td>
            <td>
              <img
                src={user.avatar}
                alt="avatar"
                style={{ width: '35px', height: '35px', borderRadius: '50%' }}
              />
            </td>
            <td>{user.email}</td>
            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
              {user.emailSent ? (
                <span className="text-success">✅ Enviado</span>
              ) : (
                <span className="text-muted">✉️ No enviado</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  
    {showEmailModal && (
      <ModalEmail
        show={showEmailModal}
        handleClose={() => setShowEmailModal(false)}
        recipients={selectedUsers}
      />
    )}
  </div>
  
  );
};

export default SendEmailsAdmin;
