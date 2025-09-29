import { useSelector, useDispatch } from 'react-redux'; 
import { useTranslation } from 'react-i18next';
import UserCard from '../UserCard';
import { roleuserautenticado, rolemoderador, rolesuperuser, roleadmin } from '../../redux/actions/roleAction';
import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Table,
  Form,
  Card,
  Badge,
  Spinner,
  Alert,
  Row,
  Col,
  Button,
  InputGroup
} from 'react-bootstrap';
import { Shield, Search, XCircle } from 'react-bootstrap-icons';

import { getDataAPI } from '../../utils/fetchData';
import { USER_TYPES } from '../../redux/actions/userAction';
import LoadMoreBtn from "../LoadMoreBtn";
import { debounce } from 'lodash';

const Roless = () => {
  const { homeUsers, auth, alert, languageReducer } = useSelector(state => state);
  const dispatch = useDispatch();
  const { t } = useTranslation('roles');
  const lang = languageReducer.language || 'es';

  const [selectedRoles, setSelectedRoles] = useState({});
  const [loading, setLoading] = useState(false);

  // Estados para paginación y búsqueda
  const [load, setLoad] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [hasMoreSearch, setHasMoreSearch] = useState(false);

  // Función para buscar usuarios en el servidor
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

  // Efecto para realizar búsqueda cuando el término cambia
  useEffect(() => {
    if (search.trim() !== "") {
      searchUsers(search, 1);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [search, searchUsers]);

  // Handler para cargar más resultados de búsqueda
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

  // Fetch inicial de usuarios con paginación
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
        console.error("Error fetching users for roles:", err);
      } finally {
        setLoad(false);
        setInitialLoad(false);
      }
    };

    if (initialLoad && auth.token) {
      fetchUsers();
    }
  }, [auth.token, dispatch, initialLoad]);

  // Handler para cargar más usuarios (cuando no hay búsqueda)
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
      console.error("Error loading more users:", err);
    } finally {
      setLoad(false);
    }
  };

  const handleChangeRole = async (user, selectedRole) => {
    setLoading(true);
    try {
      switch (selectedRole) {
        case 'user':
          await dispatch(roleuserautenticado(user, auth));
          break;
        case 'Super-utilisateur':
          await dispatch(rolesuperuser(user, auth));
          break;
        case 'Moderateur':
          await dispatch(rolemoderador(user, auth));
          break;
        case 'admin':
          await dispatch(roleadmin(user, auth));
          break;
        default:
          break;
      }
      
      // Actualizar resultados de búsqueda si estamos en modo búsqueda
      if (search.trim() !== "") {
        setSearchResults(prev => 
          prev.map(u => u._id === user._id ? {...u, role: selectedRole} : u)
        );
      }
    } catch (error) {
      console.error("Error changing role:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (user, selectedRole) => {
    setSelectedRoles(prev => ({ ...prev, [user._id]: selectedRole }));
    await handleChangeRole(user, selectedRole);

    // Si el usuario editado es el autenticado => actualiza Redux auth
    if (auth.user && auth.user._id === user._id) {
      dispatch({
        type: "AUTH_UPDATE_ROLE",
        payload: selectedRole
      });
    }
  };

  const getRoleBadge = (role) => {
    const variants = {
      'admin': { bg: 'danger', icon: '👑' },
      'Moderateur': { bg: 'warning', icon: '🛡️' },
      'Super-utilisateur': { bg: 'info', icon: '⭐' },
      'user': { bg: 'secondary', icon: '👤' }
    };

    const config = variants[role] || { bg: 'light', icon: '👤' };

    return (
      <Badge 
        bg={config.bg} 
        className="text-capitalize px-3 py-2"
        style={{ fontSize: '0.9rem' }}
      >
        {config.icon} {t(`roles.${role}`, { lng: lang })}
      </Badge>
    );
  };

  // Determinar qué usuarios mostrar
  const usersToShow = search.trim() !== "" ? searchResults : homeUsers.users;
  const hasMore = search.trim() !== "" ? hasMoreSearch : homeUsers.result >= 9;

  if (initialLoad) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
          <p className="mt-3 text-muted fw-semibold">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <Container fluid className="py-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header con título y buscador */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm" style={{ 
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" 
          }}>
            <Card.Body className="py-4">
              <h2 className="text-white mb-3 fw-bold">
                <Shield size={32} className="me-2" />
                {t('headers.title')}
              </h2>
              <Row className="align-items-center g-3">
                <Col lg={8} md={7}>
                  <InputGroup size="lg">
                    <InputGroup.Text className="bg-white border-0">
                      <Search className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder={t("searchUsers")}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="border-0 shadow-sm"
                      style={{ fontSize: "1rem" }}
                    />
                    {search.trim() !== "" && (
                      <Button 
                        variant="light" 
                        onClick={() => setSearch("")}
                        className="border-0"
                      >
                        <XCircle />
                      </Button>
                    )}
                  </InputGroup>
                </Col>
                <Col lg={4} md={5} className="text-md-end">
                  <Badge bg="light" text="dark" className="py-2 px-3 fs-6">
                    <Shield className="me-2" />
                    {search.trim() !== "" 
                      ? `${searchResults.length} resultados`
                      : `${homeUsers.users.length} usuarios`
                    }
                  </Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Alertas */}
      {alert.error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" dismissible className="shadow-sm">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {alert.error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Indicador de búsqueda */}
      {isSearching && search.trim() !== "" && (
        <Row className="mb-3">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-4">
                <Spinner animation="border" variant="primary" className="mb-2" />
                <p className="mb-0 text-muted">{t('searching')}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Tabla de roles */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead style={{ 
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              }}>
                <tr>
                  <th className="text-white border-0 py-3" style={{ width: '40%' }}>
                    {t('tableHeadersss.user')}
                  </th>
                  <th className="text-white border-0 py-3 text-center" style={{ width: '25%' }}>
                    {t('tableHeadersss.currentRole')}
                  </th>
                  <th className="text-white border-0 py-3" style={{ width: '35%' }}>
                    {t('tableHeadersss.changeRole')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {usersToShow.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-5">
                      <Shield size={48} className="text-muted mb-3" style={{ opacity: 0.3 }} />
                      <p className="mb-0 text-muted fs-5">
                        {search ? t('noUsersFoundSearch') : t('noUsersAvailable')}
                      </p>
                    </td>
                  </tr>
                ) : (
                  usersToShow.map((user, index) => (
                    <tr key={user._id || index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td className="py-3">
                        <UserCard user={user} />
                      </td>
                      <td className="py-3 text-center">
                        {getRoleBadge(selectedRoles[user._id] || user.role)}
                      </td>
                      <td className="py-3">
                        <div className="d-flex align-items-center gap-2">
                          {loading && selectedRoles[user._id] ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <i className="fas fa-user-cog text-primary"></i>
                          )}
                          <Form.Select
                            size="sm"
                            onChange={(e) => handleRoleChange(user, e.target.value)}
                            value={selectedRoles[user._id] || user.role}
                            disabled={loading}
                            style={{
                              maxWidth: '250px',
                              borderRadius: '10px',
                              border: '2px solid #e0e0e0',
                              fontWeight: '500'
                            }}
                          >
                            <option value="user">👤 {t('roles.user')}</option>
                            <option value="Super-utilisateur">⭐ {t('roles.Super-utilisateur')}</option>
                            <option value="Moderateur">🛡️ {t('roles.Moderateur')}</option>
                            <option value="admin">👑 {t('roles.admin')}</option>
                          </Form.Select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Spinner mientras carga más */}
      {load && (
        <Row className="my-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-3">
                <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                <span className="text-muted">Cargando más usuarios...</span>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Botón para cargar más */}
      {hasMore && usersToShow.length > 0 && (
        <Row className="my-4">
          <Col className="d-flex justify-content-center">
            <LoadMoreBtn
              result={9}
              page={search.trim() !== "" ? searchPage : homeUsers.page}
              load={load}
              handleLoadMore={search.trim() !== "" ? handleLoadMoreSearch : handleLoadMore}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Roless;