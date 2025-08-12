import React, { useState, useEffect } from "react";
import ModalPrivilegios from "./ModalPrivilegios";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Container,
  Table,
  Dropdown,
  Badge,
  Spinner,
  Button,
  Modal,
} from "react-bootstrap";
import {
  PencilFill,
  TrashFill,
  LockFill,
  UnlockFill,
  CheckCircleFill,
  XCircleFill,
  ThreeDotsVertical,
} from "react-bootstrap-icons";
import moment from "moment";
import "moment/locale/ar";
import "moment/locale/es";

import { getDataAPI } from "../../utils/fetchData";
import {
  deleteUser,
  toggleActiveStatus,
  USER_TYPES,
} from "../../redux/actions/userAction";
import {
  bloquearUsuario,
  unBlockUser,
} from "../../redux/actions/userAction";
import {
  getBlockedUsers,
} from "../../redux/actions/userBlockAction";
import { MESS_TYPES } from "../../redux/actions/messageAction";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";

import LoadMoreBtn from "../LoadMoreBtn";
import UserCard from "../UserCard";
import BloqueModalUser from "./BloqueModalUser";

const Users = () => {
  const { homeUsers, auth, socket, online, languageReducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { t } = useTranslation('aplicacion');
  const lang = languageReducer.language || 'es';
  console.log("Usuario activado:", auth.user.isVerified)
  const [load, setLoad] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [, forceRender] = useState(0);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [userForPermission, setUserForPermission] = useState(null);

  // Configurar moment.js según el idioma
  useEffect(() => {
    moment.locale(lang === 'ar' ? 'ar' : 'es');
  }, [lang]);

  const handleOpenPermissionModal = (user) => {
    setUserForPermission(user);
    setShowPermissionModal(true);
  };

  const handleClosePermissionModal = () => {
    setUserForPermission(null);
    setShowPermissionModal(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      forceRender((n) => n + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (auth.token) {
      dispatch(getBlockedUsers(auth.token));
    }
  }, [auth.token, dispatch]);

  useEffect(() => {
    if (!socket || !auth.user) return;

    socket.emit("checkUserOnline", auth.user);

    socket.on("checkUserOnlineToClient", (data) => {
      dispatch({ type: GLOBALTYPES.ONLINE, payload: data });
    });

    socket.on("CheckUserOffline", (data) => {
      dispatch({ type: MESS_TYPES.UPDATE_USER_STATUS, payload: data });
    });

    return () => {
      socket.off("checkUserOnlineToClient");
      socket.off("CheckUserOffline");
    };
  }, [socket, auth.user, dispatch]);

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
        console.error(t('errorr.fetchUsers'), err);
      } finally {
        setLoad(false);
        setInitialLoad(false);
      }
    };

    if (initialLoad && auth.token) {
      fetchUsers();
    }
  }, [auth.token, dispatch, initialLoad, t]);

  const handleLoadMore = async () => {
    setLoad(true);
    try {
      const res = await getDataAPI(
        `users?limit=${homeUsers.page * 9}`,
        auth.token
      );
      dispatch({
        type: USER_TYPES.GET_USERS,
        payload: { ...res.data, page: homeUsers.page + 1 },
      });
    } catch (err) {
      console.error(t('errors.loadMore'), err);
    } finally {
      setLoad(false);
    }
  };

  const confirmDelete = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      await dispatch(deleteUser({ id: userToDelete, auth }));
      setShowDeleteModal(false);
    } catch (err) {
      console.error(t('errors.deleteUser'), err);
    }
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setShowBlockModal(true);
  };

  const handleCloseModal = () => {
    setShowBlockModal(false);
    setSelectedUser(null);
  };

  const handleBlockUser = async (datosBloqueo) => {
    try {
      await dispatch(
        bloquearUsuario({ auth, datosBloqueo, user: selectedUser })
      );
      dispatch({
        type: USER_TYPES.UPDATE_USER_BLOCK_STATUS,
        payload: {
          userId: selectedUser._id,
          esBloqueado: true,
        },
      });
      dispatch(getBlockedUsers(auth.token));
      handleCloseModal();
    } catch (err) {
      console.error(t('errors.blockUser'), err);
    }
  };

  const handleUnblockUser = async (user) => {
    try {
      await dispatch(unBlockUser({ user, auth }));
      dispatch({
        type: USER_TYPES.UPDATE_USER_BLOCK_STATUS,
        payload: {
          userId: user._id,
          esBloqueado: false,
        },
      });
      dispatch(getBlockedUsers(auth.token));
    } catch (err) {
      console.error(t('errors.unblockUser'), err);
    }
  };

  if (initialLoad) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid className="py-4"  >
      {/* Modal Confirmación Eliminar */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('deleteModal.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t('deleteModal.message')}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            {t('deleteModal.cancel')}
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            {t('deleteModal.confirm')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Tabla de Usuarios */}
      <div className="table-responsive">
        <Table striped bordered hover className="align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>{t('tableHeaderssss.user')}</th>
              <th>{t('tableHeaderssss.status')}</th>
              <th>{t('tableHeaderssss.lastDisconnect')}</th>
              <th>{t('tableHeaderssss.registration')}</th>
              <th>{t('tableHeaderssss.verification')}</th>
              <th>{t('tableHeaderssss.accountStatus')}</th>
              <th>{t('tableHeaderssss.blockStatus')}</th>
              <th>{t('tableHeaderssss.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {homeUsers.users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td><UserCard user={user} /></td>
                <td>
                  {online.some((u) => u._id === user._id) ? (
                    <Badge bg="success">{t('statu.online')}</Badge>
                  ) : user.lastDisconnectedAt ? (
                    <Badge bg="secondary">
                      {t('statu.offlineSince', { time: moment(user.lastDisconnectedAt).fromNow() })}
                    </Badge>
                  ) : (
                    <Badge bg="secondary">{t('statu.offline')}</Badge>
                  )}
                </td>
                <td>
                  {user.lastDisconnectedAt ? (
                    <small className="text-muted" title={new Date(user.lastDisconnectedAt).toLocaleString()}>
                      {moment(user.lastDisconnectedAt).fromNow()}
                    </small>
                  ) : (
                    <span className="text-muted">--</span>
                  )}
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  {user.isVerified ? (
                    <Badge bg="success"><CheckCircleFill className={`me-1 ${lang === 'ar' ? 'ms-1' : ''}`} /> {t('statu.verified')}</Badge>
                  ) : (
                    <Badge bg="danger"><XCircleFill className={`me-1 ${lang === 'ar' ? 'ms-1' : ''}`} /> {t('statu.notVerified')}</Badge>
                  )}
                </td>
                <td>
                  {user.isActive ? (
                    <Badge bg="success">{t('statu.active')}</Badge>
                  ) : (
                    <Badge bg="warning" text="dark">{t('statu.inactive')}</Badge>
                  )}
                </td>
                <td>
                  {user.esBloqueado ? (
                    <Badge bg="danger">{t('statu.blocked')}</Badge>
                  ) : (
                    <Badge bg="success">{t('statu.notBlocked')}</Badge>
                  )}
                </td>
                <td>
                  <Dropdown drop={lang === 'ar' ? 'start' : 'end'}>
                    <Dropdown.Toggle variant="outline-secondary" size="sm" id="dropdown-actions">
                      <ThreeDotsVertical />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item disabled>
                        <PencilFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} /> {t('action.edit')}
                      </Dropdown.Item>
                      <Dropdown.Item className="text-danger" onClick={() => confirmDelete(user._id)}>
                        <TrashFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} /> {t('action.delete')}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleOpenPermissionModal(user)}>
                        🛡️ {t('action.managePermissions')}
                      </Dropdown.Item>

                      <Dropdown.Item
                        className={user.isActive ? "text-warning" : "text-success"}
                        onClick={() => dispatch(toggleActiveStatus(user._id, auth.token))}
                      >
                        {user.isActive ? (
                          <LockFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} />
                        ) : (
                          <UnlockFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} />
                        )}
                        {user.isActive ? t('action.deactivate') : t('action.activate')}
                      </Dropdown.Item>
                      <Dropdown.Item
                        className={user.esBloqueado ? "text-success" : "text-danger"}
                        onClick={() =>
                          user.esBloqueado ? handleUnblockUser(user) : handleOpenModal(user)
                        }
                      >
                        {user.esBloqueado ? (
                          <UnlockFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} />
                        ) : (
                          <LockFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} />
                        )}
                        {user.esBloqueado ? t('action.unblock') : t('action.block')}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Botón Cargar más */}
      {load && (
        <div className="text-center my-3">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {homeUsers.users.length > 0 && (
        <div className="d-flex justify-content-center my-3">
          <LoadMoreBtn
            result={homeUsers.result}
            page={homeUsers.page}
            load={load}
            handleLoadMore={handleLoadMore}
          />
        </div>
      )}

      {showPermissionModal && userForPermission && (
        <ModalPrivilegios
          user={userForPermission}
          setShowModal={setShowPermissionModal}
          token={auth.token}
        />
      )}

      {showBlockModal && selectedUser && (
        <BloqueModalUser
          show={showBlockModal}
          handleClose={handleCloseModal}
          handleBlock={handleBlockUser}
          user={selectedUser}
        />
      )}
    </Container>
  );
};

export default Users;