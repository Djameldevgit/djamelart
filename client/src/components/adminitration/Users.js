import React, { useState, useEffect, useCallback } from "react";
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
  Row,
  Col,
  Card,
  Accordion,
  Form
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
import { debounce } from 'lodash';

import { getDataAPI } from "../../utils/fetchData";
import {
  deleteUser,
  toggleActiveStatus,
  USER_TYPES,
  toggleVerification,
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
  const { t, i18n } = useTranslation('users');
  const lang = languageReducer.language || 'es';
  if (i18n.language !== lang) i18n.changeLanguage(lang);
  const [load, setLoad] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [, forceRender] = useState(0);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [userForPermission, setUserForPermission] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  // 🔹 Estados para búsqueda en servidor
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [hasMoreSearch, setHasMoreSearch] = useState(false);

  // 🔹 Función para buscar usuarios en el servidor
  const searchUsers = useCallback(
    debounce(async (searchTerm, page = 1) => {
      if (!auth.token) return;
      
      try {
        setIsSearching(true);
        const query = `users/search?username=${encodeURIComponent(searchTerm)}&page=${page}&limit=9`;
        const res = await getDataAPI(query, auth.token);
        
        if (page === 1) {
          setSearchResults(res.data.users || []);
        } else {
          setSearchResults(prev => [...prev, ...(res.data.users || [])]);
        }
        
        setSearchPage(page);
        setHasMoreSearch(res.data.users && res.data.users.length === 9);
      } catch (err) {
        console.error("Error searching users:", err);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [auth.token]
  );

  // 🔹 Efecto para realizar búsqueda cuando el término cambia
  useEffect(() => {
    if (search.trim() !== "") {
      searchUsers(search, 1);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [search, searchUsers]);

  // 🔹 Handler para cargar más resultados de búsqueda
  const handleLoadMoreSearch = async () => {
    if (!auth.token || search.trim() === "") return;
    
    try {
      setLoad(true);
      await searchUsers(search, searchPage + 1);
    } catch (err) {
      console.error("Error loading more search results:", err);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    moment.locale(lang === 'ar' ? 'ar' : 'es');
  }, [lang]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        `users?limit=9&page=${homeUsers.page + 1}`,
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
      
      // Actualizar resultados de búsqueda si estamos en modo búsqueda
      if (search.trim() !== "") {
        setSearchResults(prev => prev.filter(user => user._id !== userToDelete));
      }
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
      
      // Actualizar resultados de búsqueda si estamos en modo búsqueda
      if (search.trim() !== "") {
        setSearchResults(prev => 
          prev.map(u => u._id === selectedUser._id ? {...u, esBloqueado: true} : u)
        );
      }
      
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
      
      // Actualizar resultados de búsqueda si estamos en modo búsqueda
      if (search.trim() !== "") {
        setSearchResults(prev => 
          prev.map(u => u._id === user._id ? {...u, esBloqueado: false} : u)
        );
      }
      
      forceRender(n => n + 1);
    } catch (err) {
      console.error(t('errors.unblockUser'), err);
    }
  };

  // Función para manejar cambio de estado de activación
  const handleToggleActiveStatus = async (userId) => {
    try {
      await dispatch(toggleActiveStatus(userId, auth.token));
      
      // Actualizar resultados de búsqueda si estamos en modo búsqueda
      if (search.trim() !== "") {
        setSearchResults(prev => 
          prev.map(u => u._id === userId ? {...u, isActive: !u.isActive} : u)
        );
      }
    } catch (err) {
      console.error(t('errors.toggleStatus'), err);
    }
  };

  // Función para manejar cambio de verificación
  const handleToggleVerification = async (userId) => {
    try {
      await dispatch(toggleVerification(userId, auth.token));
      
      // Actualizar resultados de búsqueda si estamos en modo búsqueda
      if (search.trim() !== "") {
        setSearchResults(prev => 
          prev.map(u => u._id === userId ? {...u, isVerified: !u.isVerified} : u)
        );
      }
    } catch (err) {
      console.error(t('errors.toggleVerification'), err);
    }
  };

  // Determinar qué usuarios mostrar
  const usersToShow = search.trim() !== "" ? searchResults : homeUsers.users;
  const hasMore = search.trim() !== "" ? hasMoreSearch : homeUsers.result >= 9;

  if (initialLoad) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid>
      <Row className="justify-content-between align-items-center mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <Form.Group>
            <Form.Control
              type="text"
              placeholder={t("searchUsers")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-pill"
            />
          </Form.Group>
        </Col>
        {search.trim() !== "" && (
          <Col md="auto">
            <Button 
              variant="outline-secondary" 
              onClick={() => setSearch("")}
              size="sm"
            >
              {t('clearSearch')}
            </Button>
          </Col>
        )}
      </Row>

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

      {isSearching && search.trim() !== "" && (
        <div className="text-center my-3">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">{t('searching')}</p>
        </div>
      )}

      {isMobile ? (
        <Row>
          <Col>
            {usersToShow.length === 0 ? (
              <Card className="text-center p-4">
                <Card.Body>
                  <p className="mb-0 text-muted">
                    {search ? t('noUsersFoundSearch') : t('noUsersFound')}
                  </p>
                </Card.Body>
              </Card>
            ) : (
              <Accordion flush>
                {usersToShow.map((user, index) => (
                  <Accordion.Item key={user._id} eventKey={user._id} className="mb-3 shadow-sm">
                    <Accordion.Header>
                      <div className="d-flex align-items-center w-100">
                        <span className="text-muted">#{index + 1}</span>
                        <UserCard user={user} />
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row className="g-3 mb-3">
                        <Col xs={6}>
                          <strong>{t('tableHeader.status')}:</strong>
                          <br />
                          {online.some((u) => u._id === user._id) ? (
                            <Badge bg="success">{t('status.online')}</Badge>
                          ) : user.lastDisconnectedAt ? (
                            <Badge bg="secondary">
                              {t('status.offlineSince', { time: moment(user.lastDisconnectedAt).fromNow() })}
                            </Badge>
                          ) : (
                            <Badge bg="secondary">{t('status.offline')}</Badge>
                          )}
                        </Col>
                        <Col xs={6}>
                          <strong>{t('tableHeaderssss.lastDisconnect')}:</strong>
                          <br />
                          {user.lastDisconnectedAt ? (
                            <small className="text-muted">
                              {moment(user.lastDisconnectedAt).fromNow()}
                            </small>
                          ) : (
                            <span className="text-muted">--</span>
                          )}
                        </Col>
                        <Col xs={6}>
                          <strong>{t('tableHeaderssss.registration')}:</strong>
                          <br />
                          <span className="text-muted">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </Col>
                        <Col xs={6}>
                          <strong>{t('tableHeader.verification')}:</strong>
                          <br />
                          {user.isVerified ? (
                            <Badge bg="success"><CheckCircleFill className="me-1" /> {t('status.verified')}</Badge>
                          ) : (
                            <Badge bg="danger"><XCircleFill className="me-1" /> {t('status.notVerified')}</Badge>
                          )}
                        </Col>
                        <Col xs={6}>
                          <strong>{t('tableHeaders.accountStatus')}:</strong>
                          <br />
                          {user.isActive ? (
                            <Badge bg="success">{t('status.active')}</Badge>
                          ) : (
                            <Badge bg="warning" text="dark">{t('status.inactive')}</Badge>
                          )}
                        </Col>
                        <Col xs={6}>
                          <strong>{t('tableHeaders.blockStatus')}:</strong>
                          <br />
                          {user.esBloqueado ? (
                            <Badge bg="danger">{t('status.blocked')}</Badge>
                          ) : (
                            <Badge bg="success">{t('status.notBlocked')}</Badge>
                          )}
                        </Col>
                      </Row>

                      <Dropdown>
                        <Dropdown.Toggle variant="outline-primary" size="sm" className="w-100 mb-2">
                          <ThreeDotsVertical className="me-2" />
                          {t('tableHeaders.actions')}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="w-100">
                          <Dropdown.Item disabled>
                            <PencilFill className="me-2" /> {t('action.edit')}
                          </Dropdown.Item>

                          <Dropdown.Item className="text-danger" onClick={() => confirmDelete(user._id)}>
                            <TrashFill className="me-2" /> {t('action.delete')}
                          </Dropdown.Item>

                          <Dropdown.Item onClick={() => handleOpenPermissionModal(user)}>
                            🛡️ {t('action.managePermissions')}
                          </Dropdown.Item>

                          <Dropdown.Item
                            className={user.isActive ? "text-warning" : "text-success"}
                            onClick={() => handleToggleActiveStatus(user._id)}
                          >
                            {user.isActive ? (
                              <LockFill className="me-2" />
                            ) : (
                              <UnlockFill className="me-2" />
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
                              <UnlockFill className="me-2" />
                            ) : (
                              <LockFill className="me-2" />
                            )}
                            {user.esBloqueado ? t('action.unblock') : t('action.block')}
                          </Dropdown.Item>

                          <Dropdown.Item
                            className={user.isVerified ? "text-danger" : "text-success"}
                            onClick={() => handleToggleVerification(user._id)}
                          >
                            {user.isVerified ? (
                              <XCircleFill className="me-2" />
                            ) : (
                              <CheckCircleFill className="me-2" />
                            )}
                            {user.isVerified ? t('action.unverify') : t('action.verify')}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            )}
          </Col>
        </Row>
      ) : (
        <Card className="shadow-sm">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table striped bordered hover className="align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>{t('tableHeaders.user')}</th>
                    <th>{t('tableHeaders.status')}</th>
                    <th>{t('tableHeaders.lastDisconnect')}</th>
                    <th>{t('tableHeaders.registration')}</th>
                    <th>{t('tableHeaders.verification')}</th>
                    <th>{t('tableHeaders.accountStatus')}</th>
                    <th>{t('tableHeaders.blockStatus')}</th>
                    <th>{t('tableHeaders.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {usersToShow.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        <span className="text-muted">
                          {search ? t('noUsersFoundSearch') : t('noUsersFound')}
                        </span>
                      </td>
                    </tr>
                  ) : (
                    usersToShow.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td><UserCard user={user} /></td>
                        <td>
                          {online.some((u) => u._id === user._id) ? (
                            <Badge bg="success">{t('status.online')}</Badge>
                          ) : user.lastDisconnectedAt ? (
                            <Badge bg="secondary">
                              {t('status.offlineSince', { time: moment(user.lastDisconnectedAt).fromNow() })}
                            </Badge>
                          ) : (
                            <Badge bg="secondary">{t('status.offline')}</Badge>
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
                            <Badge bg="success"><CheckCircleFill className={`me-1 ${lang === 'ar' ? 'ms-1' : ''}`} /> {t('status.verified')}</Badge>
                          ) : (
                            <Badge bg="danger"><XCircleFill className={`me-1 ${lang === 'ar' ? 'ms-1' : ''}`} /> {t('status.notVerified')}</Badge>
                          )}
                        </td>
                        <td>
                          {user.isActive ? (
                            <Badge bg="success">{t('status.active')}</Badge>
                          ) : (
                            <Badge bg="warning" text="dark">{t('status.inactive')}</Badge>
                          )}
                        </td>
                        <td>
                          {user.esBloqueado ? (
                            <Badge bg="danger">{t('status.blocked')}</Badge>
                          ) : (
                            <Badge bg="success">{t('status.notBlocked')}</Badge>
                          )}
                        </td>
                        <td>
                          <Dropdown drop={lang === 'ar' ? 'start' : 'end'}>
                            <Dropdown.Toggle variant="outline-secondary" size="sm" id="dropdown-actions">
                              <ThreeDotsVertical />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item className="text-danger" onClick={() => confirmDelete(user._id)}>
                                <TrashFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} /> {t('action.delete')}
                              </Dropdown.Item>

                              <Dropdown.Item
                                className={user.isActive ? "text-warning" : "text-success"}
                                onClick={() => handleToggleActiveStatus(user._id)}
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

                              <Dropdown.Item
                                className={user.isVerified ? "text-danger" : "text-success"}
                                onClick={() => handleToggleVerification(user._id)}
                              >
                                {user.isVerified ? (
                                  <XCircleFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} />
                                ) : (
                                  <CheckCircleFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} />
                                )}
                                {user.isVerified ? t('action.unverify') : t('action.verify')}
                              </Dropdown.Item>

                              <Dropdown.Item disabled>
                                <PencilFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} /> {t('action.edit')}
                              </Dropdown.Item>

                              <Dropdown.Item onClick={() => handleOpenPermissionModal(user)}>
                                🛡️ {t('action.managePermissions')}
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {load && (
        <div className="text-center my-3">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {hasMore && usersToShow.length > 0 && (
        <div className="d-flex justify-content-center my-3">
          <LoadMoreBtn
            result={9} // Siempre mostramos el botón si hay más resultados
            page={search.trim() !== "" ? searchPage : homeUsers.page}
            load={load}
            handleLoadMore={search.trim() !== "" ? handleLoadMoreSearch : handleLoadMore}
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